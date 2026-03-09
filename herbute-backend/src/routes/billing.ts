/**
 * routes/billing.ts
 * Stripe billing integration.
 *
 * GET  /api/billing/plans             → Available subscription plans
 * POST /api/billing/webhook           → Stripe webhook (signature verified, no fallback)
 * POST /api/billing/create-checkout   → Create Stripe checkout session
 * GET  /api/billing/subscription      → Get current org subscription
 * POST /api/billing/cancel            → Cancel subscription (at period end)
 * POST /api/billing/mock-checkout     → Dev mode upgrade without Stripe
 */
import { Router, Request, Response, raw } from 'express';
import Stripe from 'stripe';
import { subscriptionService } from '../services/subscriptionService.js';
import { authenticate } from '../middleware/security.js';
import { globalLimiter } from '../middleware/rateLimiters.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { Organization } from '../models/Organization.js';
import { AppError } from '../utils/AppError.js';
import { Subscription, PLAN_FEATURES, PLAN_MAX_USERS } from '../models/Subscription.js';
import logger from '../utils/logger.js';

const router = Router();

const stripeApiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2023-10-16' as any,
});

// ─── Helper: get orgId from request user ─────────────────────────────────────
function getOrgId(req: Request): string | undefined {
  const user = (req as any).user;
  return user?.organizationId || user?.orgId || user?.org;
}

/* ── GET /api/billing/plans ─────────────────────────────────────────────────── */
// Returns the plan catalogue – used by the frontend pricing page (no auth required)
router.get('/plans', asyncHandler(async (_req: Request, res: Response) => {
  const plans = [
    {
      id: 'starter',
      name: 'Essentiel',
      priceMonthly: 290,
      priceYearly: 232,   // ~20% discount
      currency: 'MAD',
      maxUsers: PLAN_MAX_USERS.starter,
      features: PLAN_FEATURES.starter,
    },
    {
      id: 'pro',
      name: 'Professionnel',
      priceMonthly: 990,
      priceYearly: 792,
      currency: 'MAD',
      maxUsers: PLAN_MAX_USERS.pro,
      features: PLAN_FEATURES.pro,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Sur Mesure',
      priceMonthly: null, // Contact sales
      priceYearly: null,
      currency: 'MAD',
      maxUsers: PLAN_MAX_USERS.enterprise,
      features: PLAN_FEATURES.enterprise,
    },
  ];
  return sendSuccess(res, plans, 200);
}));

/* ══════════════════════════════════════════════════════════════════════════════
   POST /api/billing/webhook
   MUST use raw body – express.json() breaks Stripe signature
══════════════════════════════════════════════════════════════════════════════ */
router.post(
  '/webhook',
  globalLimiter as any,
  raw({ type: 'application/json' }),
  asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      logger.warn('[billing] Webhook received without stripe-signature header', { requestId: req.id });
      return sendError(res, 'Missing stripe-signature header', 'WEBHOOK_INVALID', 400, req.id);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      logger.warn('[billing] Webhook signature verification failed', {
        requestId: req.id,
        error: err instanceof Error ? err.message : 'Unknown',
      });
      return sendError(res, 'Webhook signature invalid', 'WEBHOOK_SIGNATURE_INVALID', 400, req.id);
    }

    logger.info('[billing] Webhook received', { requestId: req.id, type: event.type, id: event.id });

    // Handle checkout session completed – provision subscription
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      const plan = (session.metadata?.plan as 'starter' | 'pro' | 'enterprise') ?? 'starter';

      if (orgId && session.subscription && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

        await Subscription.findOneAndUpdate(
          { orgId },
          {
            orgId,
            plan,
            status: subscription.status as any,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price?.id ?? '',
            stripeCustomerId: session.customer as string,
            maxUsers: PLAN_MAX_USERS[plan],
            features: PLAN_FEATURES[plan],
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          { upsert: true, new: true },
        );

        // Update the owner's plan field on User model
        const org = await Organization.findById(orgId);
        if (org?.ownerId) {
          await User.findByIdAndUpdate(org.ownerId, { plan });
        }

        logger.info('[billing] Subscription provisioned', { orgId, plan, requestId: req.id });
      }
    } else {
      await subscriptionService.updateFromStripeWebhook(event as any);
    }

    // Always return 200 to Stripe (they retry on non-2xx)
    return sendSuccess(res, { received: true }, 200, req.id);
  }),
);

/* ── POST /api/billing/create-checkout ──────────────────────────────────────── */
router.post(
  '/create-checkout',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    // Accept both { plan } and legacy { planId } from stripeStore
    const planRaw = (req.body.plan || req.body.planId || 'starter') as string;
    const interval: 'month' | 'year' = req.body.interval === 'year' ? 'year' : 'month';
    const { successUrl, cancelUrl } = req.body;

    // Normalize legacy name 'professional' → 'pro'
    const plan = planRaw === 'professional' ? 'pro' : planRaw;

    if (!['starter', 'pro', 'enterprise'].includes(plan)) {
      throw new AppError('Plan invalide', 400, 'BILLING_INVALID_PLAN');
    }

    const orgId = getOrgId(req);
    if (!orgId) {
      throw new AppError('Organisation introuvable pour cet utilisateur', 400, 'NO_ORG');
    }

    // Fetch price from Stripe dynamically by plan metadata – no hardcoded price IDs
    const prices = await stripe.prices.list({ active: true, expand: ['data.product'] });

    const price = prices.data.find(p => {
      const product = p.product as Stripe.Product;
      return (
        product.metadata?.plan === plan &&
        p.recurring?.interval === interval
      );
    });

    if (!price) {
      throw new AppError(
        `Aucun tarif actif pour le plan "${plan}" (${interval})`,
        404,
        'BILLING_PRICE_NOT_FOUND',
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price.id as string, quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
      metadata: { orgId, plan },
    } as any);

    return sendSuccess(res, { url: session.url }, 200, req.id);
  }),
);

/* ── GET /api/billing/subscription ─────────────────────────────────────────── */
router.get(
  '/subscription',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const orgId = getOrgId(req);
    if (!orgId) {
      return sendSuccess(res, { plan: 'starter', status: 'none', features: PLAN_FEATURES.starter }, 200, req.id);
    }
    const subscription = await subscriptionService.getSubscription(orgId);
    if (!subscription) {
      return sendSuccess(
        res,
        { plan: 'starter', status: 'none', features: PLAN_FEATURES.starter },
        200,
        req.id,
      );
    }
    return sendSuccess(res, subscription, 200, req.id);
  }),
);

/* ── POST /api/billing/cancel ───────────────────────────────────────────────── */
// Cancels at period end (not immediately)
router.post(
  '/cancel',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const orgId = getOrgId(req);
    if (!orgId) throw new AppError('Organisation introuvable', 400, 'NO_ORG');

    const sub = await subscriptionService.getSubscription(orgId);
    if (!sub?.stripeSubscriptionId) {
      throw new AppError('Aucun abonnement Stripe actif trouvé', 404, 'NO_SUBSCRIPTION');
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return sendSuccess(res, { message: 'Abonnement annulé à la fin de la période en cours.' }, 200, req.id);
  }),
);

export default router;

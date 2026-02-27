/**
 * routes/billing.ts
 * Stripe billing integration.
 *
 * POST /api/billing/webhook          → Stripe webhook (signature verified, no fallback)
 * POST /api/billing/create-checkout  → Create Stripe checkout session
 * GET  /api/billing/subscription     → Get current org subscription
 * POST /api/billing/cancel           → Cancel subscription
 */
import { Router, Request, Response, raw } from 'express';
import Stripe from 'stripe';
import { subscriptionService } from '../services/subscriptionService';
import { authenticate } from '../middleware/security';
import { webhookLimiter } from '../middleware/rateLimiters';
import { asyncHandler } from '../errorHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError, NotFoundAppError } from '../AppError';
import { Subscription, PLAN_FEATURES, PLAN_MAX_USERS } from '../models/Subscription';
import logger from '../utils/logger';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

/* ═══════════════════════════════════════════════════
   POST /api/billing/webhook
   MUST use raw body — express.json() breaks Stripe signature
═══════════════════════════════════════════════════ */
router.post(
  '/webhook',
  webhookLimiter,
  raw({ type: 'application/json' }), // raw body for signature verification
  asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      logger.warn('[billing] Webhook received without stripe-signature header', { requestId: req.id });
      return sendError(res, 'Missing stripe-signature header', 'WEBHOOK_INVALID', 400, req.id);
    }

    let event: Stripe.Event;
    try {
      // Signature verification — NO fallback. Fail hard if invalid.
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

    // Handle checkout session completed — provision subscription
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      const plan = (session.metadata?.plan as 'starter' | 'pro' | 'enterprise') ?? 'starter';

      if (orgId && session.subscription && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // Use dynamic price from DB/metadata — NOT hardcoded
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

        logger.info('[billing] Subscription provisioned', { orgId, plan, requestId: req.id });
      }
    } else {
      await subscriptionService.updateFromStripeWebhook(event as any);
    }

    // Always return 200 to Stripe (they retry on non-2xx)
    return sendSuccess(res, { received: true }, 200, req.id);
  }),
);

/* ── POST /api/billing/create-checkout ─────────── */
router.post(
  '/create-checkout',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { plan, successUrl, cancelUrl } = req.body;

    if (!['starter', 'pro', 'enterprise'].includes(plan)) {
      throw new AppError('Invalid plan', 400, 'BILLING_INVALID_PLAN');
    }

    // Fetch price from Stripe dynamically by plan metadata — no hardcoded price IDs
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    const price = prices.data.find(
      p => (p.product as Stripe.Product).metadata?.plan === plan,
    );

    if (!price) {
      throw new AppError(`No active price found for plan: ${plan}`, 404, 'BILLING_PRICE_NOT_FOUND');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/billing/success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/billing/cancel`,
      metadata: {
        orgId: req.user!.orgId,
        plan,
      },
    });

    return sendSuccess(res, { url: session.url }, 200, req.id);
  }),
);

/* ── GET /api/billing/subscription ─────────────── */
router.get(
  '/subscription',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.getSubscription(req.user!.orgId);
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

export default router;

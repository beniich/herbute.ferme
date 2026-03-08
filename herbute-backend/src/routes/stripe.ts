import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { User } from '../models/user.model.js';
import { authenticate } from '../middleware/auth.js';
import { Organization } from '../models/Organization.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

// Mapping des plans vers leurs prix virtuels (simulés) ou réels (Stripe Price IDs)
const PLAN_PRICES: Record<string, string> = {
  essentiel: 'price_essentiel_mock', // Remplacer par de vrais Price IDs Stripe
  professionnel: 'price_pro_mock',
  entreprise: 'price_entreprise_mock',
};

// ============================================================================
// POST /api/stripe/create-checkout-session
// Crée une session de paiement Stripe pour l'utilisateur connecté
// ============================================================================
router.post('/create-checkout-session', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const { planId } = req.body; // 'essentiel', 'professionnel', 'entreprise'
    
    if (!planId || !['essentiel', 'professionnel', 'entreprise'].includes(planId)) {
      return res.status(400).json({ error: 'Plan invalide.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    // En mode test / mock (Puisque vous n'avez pas encore fourni de vraie clé Stripe + Price IDs)
    // On simule une URL de succès directe si les clés sont factices (commence par sk_test_51Mock)
    if ((process.env.STRIPE_SECRET_KEY || '').includes('MockStripeKey')) {
      console.log(`[Stripe Mock] Simulation de paiement pour le plan ${planId}`);
      
      // Simulation: on met à jour direct en base de données pour le confort du développement
      user.plan = planId as any;
      await user.save();
      
      if (user.organizationId) {
        await Organization.findByIdAndUpdate(user.organizationId, {
          'subscription.plan': planId.toUpperCase(),
          'subscription.status': 'ACTIVE',
        });
      }

      return res.json({ 
        url: `${process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/settings/subscription?success=true'}&mock_plan=${planId}` 
      });
    }

    // --- VRAIE LOGIQUE STRIPE ---
    // 1. Récupérer ou créer le Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 2. Créer la session Checkout
    const sessionUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/settings/subscription?success=true';
    const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/settings/subscription?canceled=true';
    
    // Note: this assumes PLAN_PRICES matches actual Stripe product/price IDs in your dashboard
    const priceId = PLAN_PRICES[planId] || 'price_12345'; 
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${sessionUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: user._id.toString(),
        planId: planId
      }
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Stripe Create Checkout:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe.' });
  }
});

// ============================================================================
// POST /api/stripe/webhook
// Reçoit les événements de Stripe (paiements réussis, annulations...)
// /!\ Doit être appelé avec express.raw({ type: 'application/json' }) dans server.ts
// ============================================================================
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    // Si req.body est un Buffer (raw), on peut vérifier la signature
    if (Buffer.isBuffer(req.body) && webhookSecret && !webhookSecret.includes('MockWebhookSecret')) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
        // Fallback / Dev local: on parse l'event directement sans vérif stricte.
        // Ce cas arrive si body-parser JSON a pris le dessus, ce qui est déconseillé pour Stripe.
        event = req.body;
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Gestion des événements
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          const user = await User.findById(userId);
          if (user) {
            user.plan = planId as any;
            await user.save();
            
            if (user.organizationId) {
              await Organization.findByIdAndUpdate(user.organizationId, {
                'subscription.plan': planId.toUpperCase(),
                'subscription.status': 'ACTIVE',
                'subscription.stripeSubscriptionId': session.subscription as string,
              });
            }
            console.log(`[Stripe Webhook] Plan updaté pour le User ${userId} -> ${planId}`);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Retrouver l'org via stripeSubscriptionId et passer en 'ESSAI'
        await Organization.findOneAndUpdate(
            { 'subscription.stripeSubscriptionId': subscription.id },
            { 
               'subscription.status': 'CANCELED',
               'subscription.plan': 'ESSAI'
            }
        );
        // Note: il faudrait aussi retrouver le User associé pour update user.plan = 'essai'
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur Serveur Webhook', error);
    res.status(500).json({ error: 'Erreur Serveur Webhook' });
  }
});

export default router;

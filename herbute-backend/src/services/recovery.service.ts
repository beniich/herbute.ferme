import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { Subscription } from '../models/subscription.model.js';
import User from '../models/user.model.js'; // Assuming User model tracks the customer info

export class RecoveryService {
  constructor() {
    // Exécution à 10h00, tous les Lundis(1), Mercredis(3) et Vendredis(5)
    // Syntaxe cron: '0 10 * * 1,3,5'
    cron.schedule('0 10 * * 1,3,5', async () => {
      console.log('⏳ Début de la procédure de recouvrement automatique...');
      await this.processUnpaidInvoices();
    });
  }

  public async processUnpaidInvoices() {
    try {
      // On recherche par exemple tous les abonnements expirés ou en attente de paiement
      const unpaidSubscriptions = await Subscription.find({
        status: { $in: ['expired', 'pending'] }
      }).populate('userId');

      if (unpaidSubscriptions.length === 0) {
        console.log('✅ Aucun impayé détecté aujourd\'hui.');
        return;
      }

      console.log(`⚠️ ${unpaidSubscriptions.length} impayés trouvés. Préparation des relances.`);

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      for (const sub of unpaidSubscriptions) {
        const user: any = sub.userId; 
        if (!user || !user.email) continue;

        // Générer le lien de paiement direct (Stripe ou Interface Dashboard)
        const paymentLink = `${process.env.FRONTEND_URL}/dashboard/billing/pay?subId=${sub._id}`;

        const emailTemplate = `
        <div style="font-family:'Helvetica Neue', Arial, sans-serif; padding:30px; line-height: 1.6; color: #333;">
          <h2 style="color:#d9534f;">Avis de facture en attente de règlement - Herbute</h2>
          <p>Bonjour ${user.firstName || 'Client'},</p>
          <p>Sauf erreur ou omission de notre part, nous n'avons pas encore reçu le règlement concernant votre abonnement <strong>Plan ${sub.plan.toUpperCase()}</strong>.</p>
          <p>Afin d'éviter toute interruption de vos services et de l'accès à votre ERP, nous vous prions de bien vouloir régulariser votre situation dans les plus brefs délais.</p>
          
          <div style="margin: 30px 0;">
            <a href="${paymentLink}" style="background-color:#d9534f; color:white; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">
              Régulariser ma facture en ligne
            </a>
          </div>

          <p>Si vous avez déjà effectué ce paiement, veuillez ne pas tenir compte de cet e-mail.</p>
          <p>Cordialement,<br><strong>Le Service Comptabilité Herbute</strong></p>
        </div>`;

        await transporter.sendMail({
          from: `"Service Finance Herbute" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: `Action requise : Votre paiement Herbute est en attente`,
          html: emailTemplate,
        });

        console.log(`📧 Relance envoyée à ${user.email} (Abonnement expiré)`);
      }

    } catch (err) {
      console.error('❌ Erreur dans le service de recouvrement :', err);
    }
  }
}

export const recoveryService = new RecoveryService();

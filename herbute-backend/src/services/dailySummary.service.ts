import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Attendance from '../models/Attendance.js';
import Task from '../models/Task.js';
import InventoryItem from '../models/InventoryItem.js';
import ITTicket from '../models/ITTicket.js';
import { AIService } from './ai.service.js';

// Instance locale du service IA que l'on vient de développer
const aiAgent = new AIService();

export class DailySummaryService {
  constructor() {
    // S'exécute tous les jours à 18h00 (Syntaxe Cron: 0 18 * * *)
    cron.schedule('0 18 * * *', async () => {
      console.log('⏳ Début du traitement du résumé quotidien...');
      await this.generateAndSendReport();
    });
  }

  public async generateAndSendReport() {
    try {
      console.log('1. Récupération des données métiers du jour...');
      
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Récupération des présences du jour depuis la BDD
      const attendances = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      });
      const presents = attendances.filter(a => a.status === 'present').length;
      const absents = attendances.filter(a => a.status === 'absent').length;

      // Récupération des Tâches clôturées et en cours aujourd'hui
      const tasksCompleted = await Task.countDocuments({
        status: 'completed',
        updatedAt: { $gte: startOfDay, $lte: endOfDay }
      });
      const tasksInProgress = await Task.countDocuments({ status: { $in: ['in_progress', 'todo'] } });

      // Inventaire matériel : Nombre d'articles en stock critique
      const lowStockItems = await InventoryItem.countDocuments({
        quantity: { $lt: 10 } // alerte si sous 10 unités
      });

      // Pannes / Réclamations IT : Nouveaux signalements
      const newTickets = await ITTicket.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      // String brute (Data Warehouse) pour l'IA
      const rawData = `Données du jour : 
      - RH: ${presents} présences et ${absents} absences/retards. 
      - Opérations: ${tasksCompleted} chantiers/tâches terminés aujourd'hui, ${tasksInProgress} autres sont encore ouverts. 
      - Logistique/Inventaire: ${lowStockItems} références nécessitent un réapprovisionnement urgent (stock critique). 
      - Maintenance: ${newTickets} nouveaux problèmes matériels signalés aujourd'hui.`;

      console.log('2. Analyse et rédaction par le modèle Ollama Llama3.1...');
      let synthesisHtml = "";
      try {
        // On demande à notre "Agent IA" d'écrire un compte-rendu pro
        const fakeUserId = "cron-system";
        const systemOrgId = "000000000000000000000000"; // Dummy ID pour le système
        const promptAgent = `Je suis le superviseur automatisé. Voici les statistiques brutes du jour : "${rawData}". Rédige-moi une brève synthèse professionnelle de 3 lignes en HTML (sans les balises \`\`\`html) adressée au Directeur de Herbute. Termine par une petite recommandation bienveillante de direction.`;
        
        const conversation = await aiAgent.generateChatResponse(fakeUserId, systemOrgId, promptAgent);
        synthesisHtml = conversation.messages[conversation.messages.length - 1].content;
      } catch (e) {
        console.warn("L'IA n'a pas pu générer la synthèse :", e);
        synthesisHtml = `<p><strong>Statistiques brutes de secours :</strong> ${rawData}</p>`;
      }

      console.log('3. Envoi de l\'email vers la boîte système (Gmail)...');
      
      // Configuration de Nodemailer (GMAIL SMTP)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email cible (celui du DG)
      const directorEmail = process.env.ADMIN_EMAIL || 'direction@herbute.ma';

      const emailTemplate = `
      <div style="font-family:'Segoe UI', sans-serif; padding:30px; background-color:#1a1209; color:#f5e6c8; max-width: 600px; margin: auto; border-radius:10px;">
        <h2 style="color:#c49a2e; border-bottom: 1px solid #c49a2e; padding-bottom: 10px;">🌿 Herbute - Résumé Quotidien des Opérations</h2>
        
        <div style="margin-top: 20px;">
          <h3 style="color:#fff;">📈 Synthèse du jour</h3>
          <div style="background-color:rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; font-size:15px; line-height: 1.6;">
            ${synthesisHtml}
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color:#c49a2e; color:#1a1209; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">
            Ouvrir le Dashboard Herbute
          </a>
        </div>
        
        <p style="margin-top:40px; font-size:12px; color:#6b5a3e; text-align:center;">
          Ce message a été généré localement et automatiquement par l'Agent IA de votre ERP Herbute.
        </p>
      </div>`;

      await transporter.sendMail({
        from: `"Herbute IA" <${process.env.SMTP_USER}>`,
        to: directorEmail,
        subject: `📊 Bilan Opérationnel Herbute - ${new Date().toLocaleDateString('fr-FR')}`,
        html: emailTemplate,
      });

      console.log('✅ Résumé bien envoyé au directeur !');
      
    } catch (err) {
      console.error('❌ Échec du processus quotidien :', err);
    }
  }
}

// Exportation instanciée pour lancer le cron dès le démarrage du serveur
export const dailySummaryService = new DailySummaryService();

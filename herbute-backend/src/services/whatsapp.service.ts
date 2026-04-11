import axios from 'axios';
import { logger } from '../utils/logger.js';

export class WhatsAppService {
  private static API_URL = process.env.WHATSAPP_API_URL || 'https://api.ultramsg.com/v1';
  private static INSTANCE_ID = process.env.WHATSAPP_INSTANCE_ID;
  private static TOKEN = process.env.WHATSAPP_TOKEN;

  /**
   * Sends a message via WhatsApp Business
   */
  static async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.INSTANCE_ID || !this.TOKEN) {
      logger.warn('🚫 WhatsApp Service not configured. Simulated message sent to ' + to);
      console.log('📱 [WhatsApp Fake] To: ' + to + ' | Msg: ' + message);
      return true;
    }

    try {
      const response = await axios.post(`${this.API_URL}/${this.INSTANCE_ID}/messages/chat`, {
        token: this.TOKEN,
        to: to.startsWith('+') ? to : `+${to}`,
        body: message,
        priority: 10
      });

      if (response.data.sent === 'true') {
        logger.info(`✅ WhatsApp message sent to ${to}`);
        return true;
      }
      return false;
    } catch (error: any) {
      logger.error('❌ Failed to send WhatsApp message:', error.message);
      return false;
    }
  }

  /**
   * Sends an automated PDF invoice link via WhatsApp
   */
  static async sendInvoiceAlert(to: string, invoiceNumber: string, amount: number, pdfUrl: string) {
    const message = `*🤖 HERBUTE AI Alert*\n\nBonjour,\nVotre facture *${invoiceNumber}* d'un montant de *${amount} MAD* a été générée.\n\n📄 Vous pouvez la consulter ici : ${pdfUrl}\n\nMerci de votre confiance !`;
    return this.sendMessage(to, message);
  }
}

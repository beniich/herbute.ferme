import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../models/Invoice.js';
import { PDFService } from '../services/pdf.service.js';
import { WhatsAppService } from '../services/whatsapp.service.js';
import { sendError } from '../utils/apiResponse.js';

import { logger } from '../utils/logger.js';

export class InvoiceController {
  /**
   * Create a new invoice
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = (req as any).organizationId;
      const data = { ...req.body, organizationId };
      
      const invoice = await Invoice.create(data);
      res.status(201).json({ success: true, data: invoice });
    } catch (err) { next(err); }
  }

  /**
   * Get all invoices for organization
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = (req as any).organizationId;
      const invoices = await Invoice.find({ organizationId }).sort({ createdAt: -1 });
      res.json({ success: true, data: invoices });
    } catch (err) { next(err); }
  }

  /**
   * Generate and stream PDF
   */
  async downloadPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const organizationId = (req as any).organizationId;

      const invoice = await Invoice.findOne({ _id: id, organizationId });
      if (!invoice) return sendError(res, 'Facture introuvable', 'NOT_FOUND', 404);

      const pdfBuffer = await PDFService.generateInvoicePDF(invoice);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Facture_${invoice.invoiceNumber}.pdf`);
      res.send(pdfBuffer);
      
      // OPTIONAL: Auto-notify client on WhatsApp if phone is available
      if (invoice.clientPhone) {
        await WhatsAppService.sendInvoiceAlert(
          invoice.clientPhone, 
          invoice.invoiceNumber, 
          invoice.total, 
          `${process.env.FRONTEND_URL}/public/invoice/${invoice._id}`
        );
      }
      
      logger.info(`📄 PDF Generated for invoice ${invoice.invoiceNumber}`);

    } catch (err) { next(err); }
  }
}

export const invoiceController = new InvoiceController();

import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../models/Invoice.js';
import { PDFService } from '../services/pdf.service.js';
import { WhatsAppService } from '../services/whatsapp.service.js';
import { sendError } from '../utils/apiResponse.js';

import { logger } from '../utils/logger.js';
import { AuditService } from '../services/auditService.js';

export class InvoiceController {
  /**
   * Create a new invoice with server-side validation/calculation
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = (req as any).organizationId;
      const { items, taxRate = 0, currency = 'XOF', ...rest } = req.body;
      
      // Server-side calculation to ensure totals are correct
      const subtotal = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;
      
      const invoice = await Invoice.create({
        ...rest,
        items,
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency,
        organizationId
      });

      logger.info(`✅ Invoice ${invoice.invoiceNumber} created for Org ${organizationId}`);
      
      // AUDIT
      AuditService.logFromRequest(req, 'INVOICE_GENERATED', 'Invoice', {
        resourceId: invoice._id.toString(),
        description: `Nouvelle facture créée : ${invoice.invoiceNumber} (${invoice.total} ${invoice.currency})`,
        metadata: { invoiceNumber: invoice.invoiceNumber, amount: invoice.total }
      });

      res.status(201).json({ success: true, data: invoice });
    } catch (err) { next(err); }
  }

  /**
   * Find invoice by linked transaction
   */
  async findByTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      const organizationId = (req as any).organizationId;
      
      const invoice = await Invoice.findOne({ transactionId, organizationId });
      if (!invoice) return res.json({ success: false, message: 'Aucune facture liée' });
      
      res.json({ success: true, data: invoice });
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
          `${process.env.FRONTEND_URL}/public/invoice/${invoice._id}`,
          invoice.currency
        );

        // AUDIT WHATSAPP
        AuditService.logFromRequest(req, 'WHATSAPP_SENT', 'Invoice', {
          resourceId: invoice._id.toString(),
          description: `Notification facture envoyée par WhatsApp à ${invoice.clientPhone}`,
          metadata: { phone: invoice.clientPhone, invoiceId: invoice._id }
        });
      }

      
      logger.info(`📄 PDF Generated for invoice ${invoice.invoiceNumber}`);

    } catch (err) { next(err); }
  }
}

export const invoiceController = new InvoiceController();

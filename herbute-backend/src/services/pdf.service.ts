import PDFDocument from 'pdfkit';
import { IInvoice } from '../models/Invoice.js';
import fs from 'fs';
import path from 'path';

export class PDFService {
  /**
   * Generates a premium PDF invoice
   */
  static async generateInvoicePDF(invoice: IInvoice): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // --- Header ---
      doc
        .fillColor('#1a1209')
        .fontSize(20)
        .text('HERBUTE', 50, 50, { align: 'left' })
        .fontSize(10)
        .text('Exploitation Agricole Intelligente', 50, 75);

      doc
        .fontSize(25)
        .fillColor('#primary') // We'll use a standard color if primary is not defined in PDFKit
        .text('FACTURE', 400, 50, { align: 'right' });

      doc.moveDown();

      // --- Info ---
      const top = 120;
      doc
        .fontSize(10)
        .fillColor('#333')
        .text(`Facture N°: ${invoice.invoiceNumber}`, 50, top)
        .text(`Date: ${invoice.date.toLocaleDateString()}`, 50, top + 15)
        .text(`Échéance: ${invoice.dueDate.toLocaleDateString()}`, 50, top + 30);

      doc
        .text('Destinataire:', 350, top)
        .font('Helvetica-Bold')
        .text(invoice.clientName, 350, top + 15)
        .font('Helvetica')
        .text(invoice.clientEmail, 350, top + 30)
        .text(invoice.clientAddress || '', 350, top + 45);

      doc.moveDown(4);

      // --- Table Header ---
      const tableTop = 230;
      doc.font('Helvetica-Bold');
      this.generateTableRow(doc, tableTop, 'Description', 'Qté', 'Prix Unitaire', 'Total');
      this.generateHr(doc, tableTop + 20);
      doc.font('Helvetica');

      // --- Items ---
      let i = 0;
      for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = tableTop + (i + 1) * 30;
        this.generateTableRow(
          doc,
          position,
          item.description,
          item.quantity.toString(),
          `${item.unitPrice.toFixed(2)} MAD`,
          `${item.total.toFixed(2)} MAD`
        );
        this.generateHr(doc, position + 20);
      }

      // --- Totals ---
      const subtotalPosition = tableTop + (i + 1) * 30 + 30;
      this.generateTableRow(doc, subtotalPosition, '', '', 'Sous-total', `${invoice.subtotal.toFixed(2)} MAD`);

      const taxPosition = subtotalPosition + 20;
      this.generateTableRow(doc, taxPosition, '', '', 'TVA (20%)', `${invoice.tax.toFixed(2)} MAD`);

      const totalPosition = taxPosition + 25;
      doc.font('Helvetica-Bold').fontSize(12);
      this.generateTableRow(doc, totalPosition, '', '', 'TOTAL', `${invoice.total.toFixed(2)} MAD`);

      // --- Footer ---
      doc
        .fontSize(10)
        .fillColor('#777')
        .text('Merci de votre confiance. Herbute ERP - La technologie au service de la terre.', 50, 750, { align: 'center', width: 500 });

      doc.end();
    });
  }

  private static generateTableRow(doc: any, y: number, desc: string, qty: string, unit: string, total: string) {
    doc
      .fontSize(10)
      .text(desc, 50, y)
      .text(qty, 280, y, { width: 40, align: 'right' })
      .text(unit, 340, y, { width: 90, align: 'right' })
      .text(total, 450, y, { align: 'right' });
  }

  private static generateHr(doc: any, y: number) {
    doc.strokeColor('#eeeeee').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
  }
}

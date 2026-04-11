import ExcelJS from 'exceljs';
import { logger } from '../utils/logger.js';

export class ExcelService {
  /**
   * Universal export to Excel
   * @param data - Array of objects to export
   * @param sheetName - Name of the worksheet
   */
  static async exportToExcel(data: any[], sheetName: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length === 0) {
      const emptyBuffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(emptyBuffer as ArrayBuffer);
    }

    // Smart Column detection
    const firstRow = data[0];
    const columns = Object.keys(firstRow).map(key => {
      // Basic formatting for headers
      const header = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      // Auto-formatting based on data type
      let numFmt: string | undefined = undefined;
      if (typeof firstRow[key] === 'number') {
        if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('total') || key.toLowerCase().includes('debit') || key.toLowerCase().includes('credit')) {
          numFmt = '#,##0.00';
        }
      }

      return {
        header,
        key: key,
        width: 25,
        style: { numFmt }
      };
    });

    worksheet.columns = columns as any;

    // Add rows with date handling
    data.forEach(item => {
      const row: any = {};
      Object.keys(item).forEach(k => {
        // If it's an ISO date string, convert to Date object for Excel
        if (typeof item[k] === 'string' && item[k].match(/^\d{4}-\d{2}-\d{2}T/)) {
          row[k] = new Date(item[k]);
        } else {
          row[k] = item[k];
        }
      });
      worksheet.addRow(row);
    });

    // Style header (Emerald theme)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10B981' } // Emerald-500
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Enable auto-filters
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length }
    };

    const resultBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(resultBuffer as ArrayBuffer);
  }


  /**
   * Universal import from Excel buffer
   */
  static async parseExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    // Use any cast to avoid type conflicts with different Buffer versions in NodeNext
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) return [];

    const results: any[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const val = cell.value;
      headers[colNumber] = val ? val.toString().toLowerCase() : `column${colNumber}`;
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber]] = cell.value;
      });
      results.push(rowData);
    });

    return results;
  }
}

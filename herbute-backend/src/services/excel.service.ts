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
      return Buffer.from(await workbook.xlsx.writeBuffer());
    }

    // Define columns based on first object keys
    const columns = Object.keys(data[0]).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20
    }));

    worksheet.columns = columns;

    // Add rows
    worksheet.addRows(data);

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Universal import from Excel buffer
   */
  static async parseExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) return [];

    const results: any[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value?.toString().toLowerCase() || `column${colNumber}`;
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

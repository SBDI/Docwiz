import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

export interface ParsedDocument {
  content: string;
  pageCount?: number;
  title: string;
  type: string;
}

export class DocumentParser {
  static async parsePDF(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Extract text from each page
      let content = '';
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const text = await page.getText();
        content += text + '\n';
      }

      return {
        content,
        pageCount,
        title: file.name,
        type: 'pdf'
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF document');
    }
  }

  static async parseDOCX(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      return {
        content: result.value,
        title: file.name,
        type: 'docx'
      };
    } catch (error) {
      console.error('Error parsing DOCX:', error);
      throw new Error('Failed to parse DOCX document');
    }
  }

  static async parseDocument(file: File): Promise<ParsedDocument> {
    const fileType = file.type;
    
    switch (fileType) {
      case 'application/pdf':
        return this.parsePDF(file);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.parseDOCX(file);
      default:
        throw new Error('Unsupported file type');
    }
  }
} 
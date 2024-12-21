import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

export interface ParsedDocument {
  content: string;
  pageCount?: number;
  title: string;
  type: string;
  language?: string;
  textDirection?: 'ltr' | 'rtl';
  metadata?: Record<string, string>;
  error?: string;
}

export class DocumentParser {
  private static readonly SUPPORTED_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt',
    'text/markdown': 'md',
    'text/html': 'html'
  };

  private static detectLanguage(text: string): string {
    // Detect Arabic text
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    if (arabicPattern.test(text)) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  }

  private static detectTextDirection(text: string): 'ltr' | 'rtl' {
    const language = this.detectLanguage(text);
    return language === 'ar' ? 'rtl' : 'ltr';
  }

  private static async extractMetadata(file: File): Promise<Record<string, string>> {
    const metadata: Record<string, string> = {
      size: `${(file.size / 1024).toFixed(2)} KB`,
      lastModified: new Date(file.lastModified).toISOString(),
      type: file.type
    };
    return metadata;
  }

  static async parsePDF(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Extract text from each page with better formatting
      const pages = [];
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const text = await page.getText();
        pages.push(text.trim());
      }

      const content = pages.join('\n\n');
      const language = this.detectLanguage(content);
      const textDirection = this.detectTextDirection(content);
      const metadata = await this.extractMetadata(file);

      return {
        content,
        pageCount,
        title: file.name,
        type: 'pdf',
        language,
        textDirection,
        metadata
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return {
        content: '',
        title: file.name,
        type: 'pdf',
        error: error instanceof Error ? error.message : 'Failed to parse PDF document'
      };
    }
  }

  static async parseDOCX(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const content = result.value.trim();
      const language = this.detectLanguage(content);
      const textDirection = this.detectTextDirection(content);
      const metadata = await this.extractMetadata(file);

      return {
        content,
        title: file.name,
        type: 'docx',
        language,
        textDirection,
        metadata
      };
    } catch (error) {
      console.error('Error parsing DOCX:', error);
      return {
        content: '',
        title: file.name,
        type: 'docx',
        error: error instanceof Error ? error.message : 'Failed to parse DOCX document'
      };
    }
  }

  static async parsePlainText(file: File): Promise<ParsedDocument> {
    try {
      const content = await file.text();
      const language = this.detectLanguage(content);
      const textDirection = this.detectTextDirection(content);
      const metadata = await this.extractMetadata(file);

      return {
        content: content.trim(),
        title: file.name,
        type: file.type.split('/')[1],
        language,
        textDirection,
        metadata
      };
    } catch (error) {
      console.error('Error parsing text file:', error);
      return {
        content: '',
        title: file.name,
        type: file.type.split('/')[1],
        error: error instanceof Error ? error.message : 'Failed to parse text file'
      };
    }
  }

  static async parseDocument(file: File): Promise<ParsedDocument> {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const fileType = file.type.toLowerCase();
      
      // Handle text-based files
      if (fileType.startsWith('text/')) {
        return this.parsePlainText(file);
      }

      // Handle specific file types
      switch (fileType) {
        case 'application/pdf':
          return this.parsePDF(file);
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return this.parseDOCX(file);
        default:
          if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            return this.parsePlainText(file);
          }
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Document parsing error:', error);
      return {
        content: '',
        title: file.name,
        type: 'unknown',
        error: error instanceof Error ? error.message : 'Failed to parse document'
      };
    }
  }

  static isSupported(file: File): boolean {
    const fileType = file.type.toLowerCase();
    return fileType in this.SUPPORTED_TYPES || 
           fileType.startsWith('text/') ||
           file.name.endsWith('.txt') ||
           file.name.endsWith('.md');
  }
}
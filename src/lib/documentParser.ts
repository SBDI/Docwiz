import mammoth from 'mammoth';
import pdf2md from '@opendocsg/pdf2md';
import { Buffer } from './node-polyfills';

export interface ParsedDocument {
  content: string;
  pageCount?: number;
  title: string;
  type: string;
  language?: string;
  textDirection?: 'ltr' | 'rtl';
  metadata?: Record<string, string>;
  error?: string;
  markdown?: string; // Added for markdown conversion
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

  /**
   * Parses a PDF file and extracts its content as text
   * @param file The PDF file to parse
   * @returns A ParsedDocument object with the extracted content
   */
  static async parsePDF(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Use pdf2md to extract text and convert to markdown
      const markdown = await pdf2md(buffer);

      // Use the markdown content as the text content as well
      // This gives us better text extraction than trying to parse it ourselves
      const content = markdown.replace(/[#*_`\[\]]/g, ''); // Remove markdown formatting for plain text

      // Estimate page count (rough estimate)
      const pageCount = Math.ceil(content.length / 3000); // Assume ~3000 chars per page

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
        metadata,
        markdown
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      let errorMessage = 'Failed to parse PDF document';

      if (error instanceof Error) {
        errorMessage = `PDF parsing error: ${error.message}`;
        // Add more context for specific errors
        if (error.message.includes('password')) {
          errorMessage += '. The PDF may be password protected.';
        } else if (error.message.includes('corrupt')) {
          errorMessage += '. The PDF file may be corrupted.';
        }
      }

      return {
        content: '',
        title: file.name,
        type: 'pdf',
        error: errorMessage
      };
    }
  }

  /**
   * Converts a PDF file to Markdown format
   * @param arrayBuffer The PDF file as an ArrayBuffer
   * @returns A promise that resolves to the Markdown string
   */
  static async convertPdfToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      // Convert ArrayBuffer to Buffer for pdf2md
      const buffer = Buffer.from(arrayBuffer);

      // Use pdf2md to convert the PDF to Markdown
      return await pdf2md(buffer);
    } catch (error) {
      console.error('Error converting PDF to Markdown:', error);
      throw new Error(`Failed to convert PDF to Markdown: ${error instanceof Error ? error.message : String(error)}`);
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
           file.name.endsWith('.md') ||
           file.name.endsWith('.pdf');
  }
}
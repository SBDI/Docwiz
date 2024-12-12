declare module 'mammoth' {
  interface MammothOptions {
    arrayBuffer: ArrayBuffer;
  }

  interface MammothResult {
    value: string;
    messages: any[];
  }

  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
} 
declare module 'mammoth' {
  interface MammothOptions {
    arrayBuffer: ArrayBuffer;
  }

  interface MammothResult {
    value: string;
    messages: string[];
  }

  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
}
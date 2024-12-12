export interface StoredDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  pages?: number;
  createdAt: number;
  content?: string;
  selectedPages?: number[];
}

export const documentStorage = {
  saveDocument: (doc: StoredDocument) => {
    try {
      const docs = documentStorage.getDocuments();
      docs.push(doc);
      localStorage.setItem('docwiz_documents', JSON.stringify(docs));
      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  },

  getDocuments: (): StoredDocument[] => {
    try {
      const docs = localStorage.getItem('docwiz_documents');
      return docs ? JSON.parse(docs) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  },

  getDocument: (id: string): StoredDocument | null => {
    try {
      const docs = documentStorage.getDocuments();
      return docs.find(doc => doc.id === id) || null;
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  },

  removeDocument: (id: string): boolean => {
    try {
      const docs = documentStorage.getDocuments();
      const filtered = docs.filter(doc => doc.id !== id);
      localStorage.setItem('docwiz_documents', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing document:', error);
      return false;
    }
  }
}; 
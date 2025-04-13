import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { StoredDocument } from '@/lib/documentStorage';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X, FileDown } from 'lucide-react';
import { DocumentParser } from '@/lib/documentParser';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  savedDocuments?: StoredDocument[];
  onDocumentSelect?: (document: StoredDocument) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, savedDocuments, onDocumentSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.docx') || file.name.endsWith('.pdf'))) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.docx') || file.name.endsWith('.pdf'))) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const simulateUpload = async (file: File) => {
    setUploadProgress(0);
    const duration = 1000; // 1 second upload simulation
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(timer);

        // If it's a PDF file, automatically convert to markdown
        if (file.name.endsWith('.pdf')) {
          handleConvertToMarkdown(file);
        }

        onFileSelect(file);
      }
    }, interval);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setMarkdown(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConvertToMarkdown = async (fileToConvert: File = null) => {
    const fileToUse = fileToConvert || selectedFile;
    if (!fileToUse || !fileToUse.name.endsWith('.pdf')) {
      return;
    }

    try {
      setIsConverting(true);
      const arrayBuffer = await fileToUse.arrayBuffer();
      const markdown = await DocumentParser.convertPdfToMarkdown(arrayBuffer);
      setMarkdown(markdown);
    } catch (error) {
      console.error('Error converting to Markdown:', error);
      // Don't show alert for automatic conversion
      if (!fileToConvert) {
        alert('Failed to convert PDF to Markdown. Please try again.');
      }
    } finally {
      setIsConverting(false);
    }
  };

  const downloadMarkdown = () => {
    if (!markdown || !selectedFile) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.replace('.pdf', '.md');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={!selectedFile ? handleClick : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 ${isDragging ? 'border-primary' : 'border-gray-300'} ${
        !selectedFile ? 'border-dashed' : 'border-solid'
      } rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".docx,.pdf"
      />

      {!selectedFile ? (
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-gray-50">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-gray-600">
            <p className="font-medium">Drop your document here or click to browse</p>
            <p className="text-sm text-gray-400">PDF and DOCX files are supported</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-1" />
          <p className="text-xs text-gray-500">
            {uploadProgress < 100 ? 'Uploading...' : 'Upload complete'}
          </p>

          {/* PDF to Markdown download option */}
          {selectedFile && selectedFile.name.endsWith('.pdf') && uploadProgress === 100 && (
            <div className="mt-2 space-y-2">
              {isConverting && (
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Converting to Markdown...
                </div>
              )}
              {markdown && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={downloadMarkdown}
                >
                  <span className="flex items-center gap-1">
                    <FileDown className="h-3 w-3" />
                    Download Markdown
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

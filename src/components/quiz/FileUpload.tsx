import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { StoredDocument } from '@/lib/documentStorage';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X } from 'lucide-react';

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.docx')) {
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

  const simulateUpload = (file: File) => {
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
        onFileSelect(file);
      }
    }, interval);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        accept=".docx"
      />
      
      {!selectedFile ? (
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-gray-50">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-gray-600">
            <p className="font-medium">Drop your document here or click to browse</p>
            <p className="text-sm text-gray-400">Only DOCX files are supported</p>
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
        </div>
      )}
    </div>
  );
};

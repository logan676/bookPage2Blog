import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, ZoomIn, ZoomOut, ScanText, Loader2 } from 'lucide-react';
import { UploadedFile } from '../types';
import { fileToBase64, getMimeType } from '../utils';

interface FileUploadProps {
  onFileSelect: (file: UploadedFile) => void;
  onExtract: () => void;
  isExtracting: boolean;
  currentFile: UploadedFile | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onExtract, isExtracting, currentFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);
      const previewUrl = URL.createObjectURL(file);
      onFileSelect({ file, previewUrl, base64, mimeType });
    } catch (e) {
      console.error("Error processing file", e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 px-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          1. Upload Your Book Page
        </h2>
        
        {!currentFile ? (
           <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors duration-200 ease-in-out ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-primary dark:bg-blue-900/20">
              <UploadCloud size={32} />
            </div>
            <p className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
              Drag and Drop Your Book Page Here
            </p>
            <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
              For best results, use a clear, well-lit photo. PNG, JPG, or WEBP.
            </p>
            <button
              onClick={triggerFileSelect}
              className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Browse File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        ) : (
           <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{currentFile.file.name}</span>
                <button 
                  onClick={() => onFileSelect(null as any)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>
             
             <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img 
                  src={currentFile.previewUrl} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                    <ZoomIn size={20} />
                  </button>
                   <button className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                    <ZoomOut size={20} />
                  </button>
                </div>
             </div>
           </div>
        )}
      </section>

      {currentFile && (
        <div className="flex justify-center px-1 py-2">
          <button
            onClick={onExtract}
            disabled={isExtracting}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white shadow-md transition-all ${
              isExtracting
                ? "cursor-not-allowed bg-primary/70"
                : "bg-primary hover:bg-primary-hover active:scale-95"
            }`}
          >
            {isExtracting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Extracting Text...</span>
              </>
            ) : (
              <>
                <ScanText size={20} />
                <span>Extract Text</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzeBookPage } from '../services/geminiService';
import { CreatePostData } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // Extract base64 data (remove "data:image/jpeg;base64," prefix)
        const base64 = result.split(',')[1];
        setBase64Data(base64);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!base64Data) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeBookPage(base64Data, mimeType);
      setTitle(result.title);
      setDescription(result.description);
    } catch (error) {
      console.error("Failed to analyze", error);
      alert("Could not analyze image. Please try again or fill details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (imagePreview && title && description) {
      onSubmit({ title, description, imageUrl: imagePreview });
      handleClose();
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setBase64Data(null);
    setTitle('');
    setDescription('');
    setIsAnalyzing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border border-border-light dark:border-border-dark animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">Create New Post</h2>
          <button onClick={handleClose} className="text-text-light-secondary hover:text-text-light-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Image Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
              Book Page Image
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center w-full h-64 rounded-lg border-2 border-dashed 
                cursor-pointer transition-colors overflow-hidden
                ${imagePreview 
                  ? 'border-primary bg-background-light dark:bg-background-dark' 
                  : 'border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark'}
              `}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-light-secondary">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-sm">Click to upload or drag and drop</p>
                  <p className="text-xs opacity-60">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            {imagePreview && !title && !isAnalyzing && (
              <button 
                onClick={handleAnalyze}
                className="flex items-center justify-center gap-2 mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto self-end"
              >
                <Sparkles className="w-4 h-4" />
                Auto-Fill with Gemini
              </button>
            )}
            
            {isAnalyzing && (
               <div className="flex items-center justify-center gap-2 mt-2 py-2 text-purple-600 dark:text-purple-400 text-sm font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing page content...
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-1">
                Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter 1: The Beginning..."
                className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-1">
                Description / Summary
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary of what this page contains..."
                className="w-full h-32 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!imagePreview || !title || !description}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};
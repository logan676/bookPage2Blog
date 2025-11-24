import React, { useState, useEffect } from 'react';
import { Paragraph } from '../types';

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetParagraph: Paragraph | null;
  onSave: (quote: string, note: string) => void;
}

const AddIdeaModal: React.FC<AddIdeaModalProps> = ({ isOpen, onClose, targetParagraph, onSave }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [quote, setQuote] = useState('');
  const [note, setNote] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && targetParagraph) {
      setStep(1);
      setQuote(targetParagraph.text); // Default to full text, user can trim
      setNote('');
    }
  }, [isOpen, targetParagraph]);

  if (!isOpen || !targetParagraph) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md flex flex-col overflow-hidden rounded-xl bg-white dark:bg-background-dark shadow-2xl animate-scale-in border border-gray-100 dark:border-gray-700">
        
        {/* Step 1: Confirmation */}
        {step === 1 && (
          <div className="p-8 text-center animate-fade-in">
            <span className="material-symbols-outlined text-5xl text-primary mx-auto mb-4 bg-primary/10 p-4 rounded-full">lightbulb</span>
            <h3 className="mt-2 text-xl font-bold text-[#111418] dark:text-white">Add your thoughts?</h3>
            <p className="mt-2 text-base text-[#617589] dark:text-gray-400">
              Would you like to highlight part of this text and attach your idea to it?
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              >
                No, thanks
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none transition-colors"
              >
                Yes, add idea
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Input */}
        {step === 2 && (
          <div className="p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#111418] dark:text-white">Your Idea</h3>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Step 2 of 2</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="quote-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selected Text <span className="text-xs font-normal text-gray-500">(Edit to select specific phrase)</span>
                </label>
                <textarea
                  id="quote-input"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-3 text-gray-600 dark:text-gray-300"
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="note-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Thought
                </label>
                <textarea
                  id="note-input"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white sm:text-sm p-3"
                  placeholder="What does this paragraph mean to you?"
                  rows={4}
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSave(quote, note)}
                  disabled={!quote.trim() || !note.trim()}
                  className={`inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none transition-colors ${(!quote.trim() || !note.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Save Idea
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddIdeaModal;
import React, { useState, useEffect } from 'react';
import { Underline } from '../types';

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUnderline: Underline | null;
  onSave: (quote: string, note: string) => void;
}

const AddIdeaModal: React.FC<AddIdeaModalProps> = ({ isOpen, onClose, targetUnderline, onSave }) => {
  const [quote, setQuote] = useState('');
  const [note, setNote] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && targetUnderline) {
      setQuote(targetUnderline.text);
      setNote('');
    }
  }, [isOpen, targetUnderline]);

  if (!isOpen || !targetUnderline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md flex flex-col overflow-hidden rounded-xl bg-white dark:bg-background-dark shadow-2xl animate-scale-in border border-gray-100 dark:border-gray-700">
        <div className="p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#111418] dark:text-white">Add Your Idea</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="quote-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Underlined Text
              </label>
              <div className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-3 text-gray-600 dark:text-gray-300 text-sm">
                {quote}
              </div>
            </div>

            <div>
              <label htmlFor="note-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Thought
              </label>
              <textarea
                id="note-input"
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white sm:text-sm p-3"
                placeholder="What does this text mean to you?"
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
                disabled={!note.trim()}
                className={`inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none transition-colors ${!note.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIdeaModal;
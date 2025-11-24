import React from 'react';

interface BubbleProps {
  x: number;
  y: number;
  onYes: () => void;
  onNo: () => void;
  question: string;
}

const Bubble: React.FC<BubbleProps> = ({ x, y, onYes, onNo, question }) => {
  return (
    <div
      className="fixed z-50 animate-fade-in-up"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-3 mb-2">
        <p className="mb-3 whitespace-nowrap font-medium">{question}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onNo}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            No
          </button>
          <button
            onClick={onYes}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
      {/* Triangle pointer */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800"></div>
    </div>
  );
};

export default Bubble;

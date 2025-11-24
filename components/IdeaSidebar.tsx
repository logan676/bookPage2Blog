import React from 'react';
import { Idea } from '../types';

interface IdeaSidebarProps {
  ideas: Idea[];
  onIdeaClick: (paragraphId: number) => void;
}

const IdeaSidebar: React.FC<IdeaSidebarProps> = ({ ideas, onIdeaClick }) => {
  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <span>Underlined Ideas</span>
        </h3>
        
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">touch_app</span>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Hover over a paragraph and click the tool to add a new idea.
              </p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div 
                key={idea.id}
                onClick={() => onIdeaClick(idea.paragraphId)}
                className="group p-3 rounded-lg border border-transparent hover:bg-background-light dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 block ring-1 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-600"
              >
                <p className="font-body text-base text-[#212529] dark:text-gray-300 italic border-l-2 border-primary/30 pl-3 mb-2 group-hover:border-primary transition-colors">
                  "{idea.quote}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 pl-3.5">
                  {idea.note}
                </p>
              </div>
            ))
          )}
          
          {ideas.length > 0 && (
             <div className="text-center py-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">Click an idea to scroll to context</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaSidebar;
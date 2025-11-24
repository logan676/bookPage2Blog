import React from 'react';
import { Bold, Italic, Underline, Type, Save } from 'lucide-react';

interface PostEditorProps {
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  tags: string;
  setTags: (val: string) => void;
  isProcessing: boolean;
}

const PostEditor: React.FC<PostEditorProps> = ({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  isProcessing
}) => {
  return (
    <div className="flex flex-col gap-6 sticky top-24">
      <h2 className="px-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        2. Refine Your Post
      </h2>

      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="post-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Post Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Reflections on Chapter 3"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Content Editor */}
        <div className="flex flex-col gap-2">
          <label htmlFor="post-content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Content
          </label>
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-gray-700 dark:bg-gray-800">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/80">
              <button className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                <Bold size={18} />
              </button>
              <button className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                <Italic size={18} />
              </button>
               <button className="rounded bg-primary/10 p-1.5 text-primary hover:bg-primary/20">
                <Underline size={18} />
              </button>
              <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
               <button className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
                <Type size={18} />
              </button>
            </div>
            
            <textarea
              id="post-content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isProcessing ? "Extracting text..." : "Extracted text will appear here..."}
              className={`w-full resize-y border-0 bg-transparent p-4 text-base leading-relaxed text-gray-900 placeholder-gray-400 focus:ring-0 dark:text-gray-100 ${isProcessing ? 'animate-pulse opacity-50' : ''}`}
            ></textarea>
          </div>
        </div>

        {/* Tags Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="post-tags" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tags (Optional)
          </label>
          <input
            id="post-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags separated by commas"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
          <button className="flex w-full min-w-[100px] items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-95 sm:w-auto">
            Publish
          </button>
          <button className="flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto">
            <Save size={16} />
            Save as Draft
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostEditor;

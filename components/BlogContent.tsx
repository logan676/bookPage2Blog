import React from 'react';
import { BlogPost, Paragraph, Idea } from '../types';

interface BlogContentProps {
  post: BlogPost;
  ideas: Idea[];
  onAddIdeaRequest: (paragraph: Paragraph) => void;
}

const BlogContent: React.FC<BlogContentProps> = ({ post, ideas, onAddIdeaRequest }) => {
  
  // Helper to render text with highlighting
  const renderParagraphText = (paragraph: Paragraph) => {
    // Find all ideas related to this paragraph
    const paragraphIdeas = ideas.filter(idea => idea.paragraphId === paragraph.id);
    
    if (paragraphIdeas.length === 0) {
      return paragraph.text;
    }

    // Sort ideas by position in text (simple approximation using indexOf)
    // Note: A real production app would need a more robust offset-based system
    // to handle overlapping highlights, but this works for this demo.
    const sortedIdeas = [...paragraphIdeas].sort((a, b) => {
        return paragraph.text.indexOf(a.quote) - paragraph.text.indexOf(b.quote);
    });

    // Build the rendered nodes
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedIdeas.forEach((idea, index) => {
        const startIndex = paragraph.text.indexOf(idea.quote, lastIndex);
        
        // If exact quote match not found (e.g. text changed), fallback to skipping
        if (startIndex === -1) return;

        // Add text before the highlight
        if (startIndex > lastIndex) {
            nodes.push(<span key={`text-${paragraph.id}-${index}`}>{paragraph.text.substring(lastIndex, startIndex)}</span>);
        }

        // Add the highlighted text
        nodes.push(
            <a 
                key={`highlight-${idea.id}`}
                href={`#idea-${idea.id}`} // purely for semantics in this React version
                onClick={(e) => { e.preventDefault(); /* Scroll logic could go here */ }}
                className="decoration-primary/50 decoration-2 underline-offset-2 underline hover:bg-primary/10 hover:decoration-primary transition-colors cursor-pointer rounded-sm px-0.5 -mx-0.5"
                title={idea.note}
            >
                {idea.quote}
            </a>
        );

        lastIndex = startIndex + idea.quote.length;
    });

    // Add remaining text
    if (lastIndex < paragraph.text.length) {
        nodes.push(<span key={`text-end-${paragraph.id}`}>{paragraph.text.substring(lastIndex)}</span>);
    }

    return nodes;
  };

  return (
    <article className="lg:col-span-5 xl:col-span-6">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors">
        <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight pb-3">
          {post.title}
        </h1>
        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal pb-6 border-b border-[#dee2e6] dark:border-gray-700">
          By {post.author}, Published on {post.publishDate}
        </p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mt-8 font-body text-lg leading-relaxed text-[#212529] dark:text-gray-300 space-y-6">
          {post.content.map((paragraph) => (
            <div 
                key={paragraph.id} 
                id={`paragraph-${paragraph.id}`} 
                className="group relative prose-paragraph rounded-lg transition-colors hover:bg-background-light dark:hover:bg-gray-800/50 -mx-4 px-4 py-2"
            >
              <p className="m-0">
                {renderParagraphText(paragraph)}
              </p>
              
              {/* Floating Tool - Only visible on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex z-10 animate-fade-in-up">
                 <button
                    onClick={() => onAddIdeaRequest(paragraph)}
                    className="inline-flex items-center gap-2 bg-gray-900 dark:bg-black text-white text-sm font-medium px-4 py-2 rounded-full shadow-xl hover:bg-gray-800 dark:hover:bg-gray-800 transform hover:scale-105 transition-all"
                 >
                    <span className="material-symbols-outlined text-base">border_color</span>
                    <span>Add Idea</span>
                 </button>
                 {/* Little triangle pointer */}
                 <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-black"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogContent;
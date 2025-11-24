import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, Paragraph, Idea, Underline } from '../types';
import Bubble from './Bubble';

interface BlogContentProps {
  post: BlogPost;
  ideas: Idea[];
  underlines: Underline[];
  onAddUnderline: (underline: Underline) => void;
  onAddIdeaRequest: (underline: Underline) => void;
}

interface BubbleState {
  show: boolean;
  x: number;
  y: number;
  question: string;
  type: 'underline' | 'idea';
  data?: any;
}

const BlogContent: React.FC<BlogContentProps> = ({
  post,
  ideas,
  underlines,
  onAddUnderline,
  onAddIdeaRequest
}) => {
  const [bubble, setBubble] = useState<BubbleState>({
    show: false,
    x: 0,
    y: 0,
    question: '',
    type: 'underline'
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Debug: Log props
  useEffect(() => {
    console.log('BlogContent received underlines prop:', underlines);
  }, [underlines]);

  // Handle text selection
  const handleMouseUp = (paragraph: Paragraph, event: React.MouseEvent) => {
    console.log('[DEBUG handleMouseUp] Mouse up on paragraph', paragraph.id);
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.log('[DEBUG handleMouseUp] No selection or collapsed');
      return;
    }

    const selectedText = selection.toString().trim();
    console.log('[DEBUG handleMouseUp] Selected text:', selectedText);
    if (!selectedText) return;

    // Get selection position
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Calculate actual offsets within the paragraph text
    const paragraphElement = event.currentTarget as HTMLDivElement;
    const paragraphTextNode = paragraphElement.querySelector('p');

    if (!paragraphTextNode) return;

    try {
      // Get all text content before the selection
      const tempRange = document.createRange();
      tempRange.selectNodeContents(paragraphTextNode);
      tempRange.setEnd(range.startContainer, range.startOffset);

      const textBefore = tempRange.toString();
      const startOffset = textBefore.length;
      const endOffset = startOffset + selectedText.length;

      // Validate offsets against the actual paragraph text
      const actualSelectedText = paragraph.text.substring(startOffset, endOffset);

      // If the text doesn't match, try to find it
      let finalStartOffset = startOffset;
      let finalEndOffset = endOffset;

      if (actualSelectedText !== selectedText) {
        // Find the correct occurrence
        const allOccurrences: number[] = [];
        let pos = paragraph.text.indexOf(selectedText);
        while (pos !== -1) {
          allOccurrences.push(pos);
          pos = paragraph.text.indexOf(selectedText, pos + 1);
        }

        // If we found occurrences, use the first one that isn't already underlined
        if (allOccurrences.length > 0) {
          const existingUnderlines = underlines.filter(u => u.paragraphId === paragraph.id);
          const availableOccurrence = allOccurrences.find(offset => {
            return !existingUnderlines.some(u =>
              (offset >= u.startOffset && offset < u.endOffset) ||
              (offset + selectedText.length > u.startOffset && offset < u.endOffset)
            );
          });

          if (availableOccurrence !== undefined) {
            finalStartOffset = availableOccurrence;
            finalEndOffset = availableOccurrence + selectedText.length;
          } else {
            // Use the first occurrence if all are taken
            finalStartOffset = allOccurrences[0];
            finalEndOffset = allOccurrences[0] + selectedText.length;
          }
        } else {
          console.warn('Could not find selected text in paragraph');
          return;
        }
      }

      console.log('[DEBUG handleMouseUp] Adding underline:', { selectedText, startOffset: finalStartOffset, endOffset: finalEndOffset });

      // Show bubble asking to underline
      const bubbleState = {
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
        question: 'Underline this text?',
        type: 'underline' as const,
        data: {
          paragraph,
          text: selectedText,
          startOffset: finalStartOffset,
          endOffset: finalEndOffset
        }
      };
      console.log('[DEBUG handleMouseUp] Setting bubble:', bubbleState);
      setBubble(bubbleState);
    } catch (error) {
      console.error('Error calculating text offsets:', error);
    }
  };

  // Handle clicking underlined text
  const handleUnderlineClick = (e: React.MouseEvent, underline: Underline) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.target as HTMLElement).getBoundingClientRect();

    setBubble({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
      question: 'Add idea or thinking?',
      type: 'idea',
      data: underline
    });
  };

  // Handle bubble Yes/No
  const handleBubbleYes = () => {
    console.log('[DEBUG handleBubbleYes] ===== FUNCTION CALLED =====');
    console.log('[DEBUG handleBubbleYes] bubble type:', bubble.type);
    console.log('[DEBUG handleBubbleYes] bubble data:', bubble.data);

    if (bubble.type === 'underline') {
      const { paragraph, text, startOffset, endOffset } = bubble.data;

      console.log('[DEBUG handleBubbleYes] paragraph:', paragraph);
      console.log('[DEBUG handleBubbleYes] paragraph.id:', paragraph?.id, 'type:', typeof paragraph?.id);

      const newUnderline: Underline = {
        id: `underline-${Date.now()}`,
        paragraphId: Number(paragraph.id),
        text,
        startOffset,
        endOffset
      };

      console.log('[DEBUG handleBubbleYes] newUnderline created:', newUnderline);
      console.log('[DEBUG handleBubbleYes] Calling onAddUnderline...');

      onAddUnderline(newUnderline);
    } else if (bubble.type === 'idea') {
      onAddIdeaRequest(bubble.data);
    }
    setBubble({ ...bubble, show: false });

    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  const handleBubbleNo = () => {
    setBubble({ ...bubble, show: false });
    window.getSelection()?.removeAllRanges();
  };

  // Close bubble on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bubble.show) {
        // Check if click is on a button inside the bubble
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          // Don't close if clicking a button - let the button's onClick handler run first
          return;
        }
        setBubble({ ...bubble, show: false });
      }
    };

    if (bubble.show) {
      // Use 'mousedown' with a slight delay to let button clicks register first
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [bubble.show]);

  // Render paragraph with underlines and ideas
  const renderParagraphText = (paragraph: Paragraph) => {
    console.log(`[DEBUG renderParagraphText] paragraph.id: ${paragraph.id} (type: ${typeof paragraph.id})`);
    console.log(`[DEBUG renderParagraphText] All underlines:`, underlines);
    console.log(`[DEBUG renderParagraphText] Underline paragraphIds:`, underlines.map(u => ({ id: u.paragraphId, type: typeof u.paragraphId })));

    const paragraphUnderlines = underlines.filter(u => {
      const match = Number(u.paragraphId) === Number(paragraph.id);
      console.log(`[DEBUG filter] Comparing u.paragraphId=${u.paragraphId} (${typeof u.paragraphId}) with paragraph.id=${paragraph.id} (${typeof paragraph.id}) => ${match}`);
      return match;
    });

    const paragraphIdeas = ideas.filter(i => Number(i.paragraphId) === Number(paragraph.id));

    console.log(`[DEBUG renderParagraphText] Paragraph ${paragraph.id}: found ${paragraphUnderlines.length} underlines`, paragraphUnderlines);

    // Combine underlines and ideas with their positions
    const highlights: Array<{ start: number; end: number; type: 'underline' | 'idea'; data: Underline | Idea }> = [];

    paragraphUnderlines.forEach(underline => {
      console.log(`[DEBUG] Adding underline to highlights:`, {
        start: underline.startOffset,
        end: underline.endOffset,
        text: underline.text,
        paragraphTextLength: paragraph.text.length
      });
      highlights.push({
        start: underline.startOffset,
        end: underline.endOffset,
        type: 'underline',
        data: underline
      });
    });

    paragraphIdeas.forEach(idea => {
      const start = paragraph.text.indexOf(idea.quote);
      if (start !== -1) {
        highlights.push({
          start,
          end: start + idea.quote.length,
          type: 'idea',
          data: idea
        });
      }
    });

    // Sort by start position
    highlights.sort((a, b) => a.start - b.start);

    console.log(`[DEBUG] Total highlights after sort:`, highlights.length, highlights);

    if (highlights.length === 0) {
      console.log(`[DEBUG] No highlights, returning plain text`);
      return paragraph.text;
    }

    // Build the rendered nodes
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    console.log(`[DEBUG] Building nodes for paragraph ${paragraph.id}`);

    highlights.forEach((highlight, index) => {
      console.log(`[DEBUG] Processing highlight ${index}:`, {
        type: highlight.type,
        start: highlight.start,
        end: highlight.end,
        lastIndex,
        text: paragraph.text.substring(highlight.start, highlight.end)
      });

      // Add text before the highlight
      if (highlight.start > lastIndex) {
        console.log(`[DEBUG] Adding text before highlight: "${paragraph.text.substring(lastIndex, highlight.start)}"`);
        nodes.push(
          <span key={`text-${paragraph.id}-${index}`}>
            {paragraph.text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add the highlighted text
      if (highlight.type === 'underline') {
        const underline = highlight.data as Underline;
        console.log(`[DEBUG] Adding underline span with classes`);
        nodes.push(
          <span
            key={`underline-${underline.id}`}
            onClick={(e) => handleUnderlineClick(e, underline)}
            style={{
              textDecoration: 'underline',
              textDecorationColor: '#3b82f6',
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
              cursor: 'pointer'
            }}
            className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-sm px-0.5 -mx-0.5"
          >
            {paragraph.text.substring(highlight.start, highlight.end)}
          </span>
        );
      } else {
        const idea = highlight.data as Idea;
        nodes.push(
          <span
            key={`idea-${idea.id}`}
            className="decoration-primary/50 decoration-2 underline-offset-2 underline bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer rounded-sm px-0.5 -mx-0.5"
            title={idea.note}
          >
            {idea.quote}
          </span>
        );
      }

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < paragraph.text.length) {
      console.log(`[DEBUG] Adding remaining text: "${paragraph.text.substring(lastIndex)}"`);
      nodes.push(
        <span key={`text-end-${paragraph.id}`}>
          {paragraph.text.substring(lastIndex)}
        </span>
      );
    }

    console.log(`[DEBUG] Total nodes created:`, nodes.length);

    return nodes;
  };

  return (
    <>
      <article className="lg:col-span-5 xl:col-span-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors">
          <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight pb-3">
            {post.title}
          </h1>
          <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal pb-6 border-b border-[#dee2e6] dark:border-gray-700">
            By {post.author}, Published on {post.publishDate}
          </p>

          <div
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none mt-8 font-body text-lg leading-relaxed text-[#212529] dark:text-gray-300 space-y-6"
          >
            {post.content.map((paragraph) => (
              <div
                key={paragraph.id}
                id={`paragraph-${paragraph.id}`}
                className="prose-paragraph rounded-lg transition-colors -mx-4 px-4 py-2 select-text"
                onMouseUp={(e) => handleMouseUp(paragraph, e)}
              >
                <p className="m-0">
                  {renderParagraphText(paragraph)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Bubble popup */}
      {bubble.show && (
        <Bubble
          x={bubble.x}
          y={bubble.y}
          question={bubble.question}
          onYes={handleBubbleYes}
          onNo={handleBubbleNo}
        />
      )}
    </>
  );
};

export default BlogContent;

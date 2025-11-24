import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlogContent from './components/BlogContent';
import IdeaSidebar from './components/IdeaSidebar';
import AddIdeaModal from './components/AddIdeaModal';
import { MOCK_POST, INITIAL_IDEAS } from './constants';
import { Idea, Paragraph } from './types';

const App: React.FC = () => {
  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or logic
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(false); // Default to light to match screenshot initially, but allow toggle
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Data State
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetParagraph, setTargetParagraph] = useState<Paragraph | null>(null);

  const handleAddIdeaRequest = (paragraph: Paragraph) => {
    setTargetParagraph(paragraph);
    setIsModalOpen(true);
  };

  const handleSaveIdea = (quote: string, note: string) => {
    if (!targetParagraph) return;

    const newIdea: Idea = {
      id: `new-idea-${Date.now()}`,
      paragraphId: targetParagraph.id,
      quote: quote.trim(),
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    setIdeas([...ideas, newIdea]);
    setIsModalOpen(false);
    setTargetParagraph(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTargetParagraph(null);
  };

  const scrollToParagraph = (paragraphId: number) => {
    const element = document.getElementById(`paragraph-${paragraphId}`);
    if (element) {
      // Smooth scroll with offset for sticky header
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Optional: Add a temporary highlight flash
      element.classList.add('bg-primary/5');
      setTimeout(() => element.classList.remove('bg-primary/5'), 2000);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            
            {/* Left Column: Original Page Preview (Static as per design) */}
            <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0 order-2 lg:order-1 hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Original Page</h3>
                <div 
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl shadow-md aspect-[3/4] ring-1 ring-gray-200 dark:ring-gray-700"
                  style={{ backgroundImage: `url("${MOCK_POST.imageUrl}")` }}
                  aria-label="Book page preview"
                ></div>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Tip:</strong> Hover over any paragraph in the article to add a new note or highlight.
                    </p>
                </div>
              </div>
            </aside>

            {/* Center Column: Blog Content */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-6">
                <BlogContent 
                    post={MOCK_POST} 
                    ideas={ideas} 
                    onAddIdeaRequest={handleAddIdeaRequest} 
                />
            </div>

            {/* Right Column: Ideas Sidebar */}
            <aside className="lg:col-span-3 xl:col-span-3 mt-8 lg:mt-0 order-3">
              <IdeaSidebar ideas={ideas} onIdeaClick={scrollToParagraph} />
            </aside>

          </div>
        </main>
      </div>

      <AddIdeaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        targetParagraph={targetParagraph}
        onSave={handleSaveIdea}
      />
    </div>
  );
};

export default App;
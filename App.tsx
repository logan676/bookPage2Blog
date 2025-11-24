import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlogContent from './components/BlogContent';
import IdeaSidebar from './components/IdeaSidebar';
import AddIdeaModal from './components/AddIdeaModal';
import { MOCK_POST, INITIAL_IDEAS } from './constants';
import { Idea, Underline } from './types';
import { fetchIdeas, createIdea } from './services/apiService';

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
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [underlines, setUnderlines] = useState<Underline[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);

  // Debug: Log underlines changes
  useEffect(() => {
    console.log('Underlines state changed:', underlines);
  }, [underlines]);

  // Debug: Add test underline on mount
  useEffect(() => {
    setTimeout(() => {
      console.log('Adding test underline...');
      const testUnderline: Underline = {
        id: 'test-1',
        paragraphId: 1,
        text: 'ethereal shadows',
        startOffset: 50,
        endOffset: 67
      };
      setUnderlines([testUnderline]);
    }, 2000);
  }, []);

  // Load ideas from backend on mount
  useEffect(() => {
    const loadIdeas = async () => {
      if (MOCK_POST.id) {
        setIsLoadingIdeas(true);
        const fetchedIdeas = await fetchIdeas(MOCK_POST.id);
        setIdeas(fetchedIdeas.length > 0 ? fetchedIdeas : INITIAL_IDEAS);
        setIsLoadingIdeas(false);
      }
    };
    loadIdeas();
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUnderline, setTargetUnderline] = useState<Underline | null>(null);

  const handleAddUnderline = (underline: Underline) => {
    console.log('Adding underline to state:', underline);
    setUnderlines([...underlines, underline]);
    console.log('Total underlines after add:', underlines.length + 1);
  };

  const handleAddIdeaRequest = (underline: Underline) => {
    setTargetUnderline(underline);
    setIsModalOpen(true);
  };

  const handleSaveIdea = async (quote: string, note: string) => {
    if (!targetUnderline || !MOCK_POST.id) return;

    // Save to backend
    const savedIdea = await createIdea(
      MOCK_POST.id,
      targetUnderline.paragraphId,
      targetUnderline.text,
      note.trim()
    );

    if (savedIdea) {
      // Add to local state
      setIdeas([...ideas, savedIdea]);

      // Remove the underline since it's now an idea
      setUnderlines(underlines.filter(u => u.id !== targetUnderline.id));
    } else {
      // Fallback: add to local state even if backend save failed
      const newIdea: Idea = {
        id: `local-idea-${Date.now()}`,
        paragraphId: targetUnderline.paragraphId,
        quote: targetUnderline.text,
        note: note.trim(),
        timestamp: new Date().toISOString(),
      };
      setIdeas([...ideas, newIdea]);
      setUnderlines(underlines.filter(u => u.id !== targetUnderline.id));
      console.warn('Failed to save idea to backend, saved locally only');
    }

    setIsModalOpen(false);
    setTargetUnderline(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTargetUnderline(null);
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
                        <strong>Tip:</strong> Select text to underline it, then click underlined text to add your ideas.
                    </p>
                </div>
              </div>
            </aside>

            {/* Center Column: Blog Content */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-6">
                <BlogContent
                    post={MOCK_POST}
                    ideas={ideas}
                    underlines={underlines}
                    onAddUnderline={handleAddUnderline}
                    onAddIdeaRequest={handleAddIdeaRequest}
                />
                {/* Debug info */}
                {underlines.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
                    <strong>Debug:</strong> {underlines.length} underlines in state
                  </div>
                )}
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
        targetUnderline={targetUnderline}
        onSave={handleSaveIdea}
      />
    </div>
  );
};

export default App;
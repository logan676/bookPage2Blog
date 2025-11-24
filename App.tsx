import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlogContent from './components/BlogContent';
import IdeaSidebar from './components/IdeaSidebar';
import AddIdeaModal from './components/AddIdeaModal';
import { MOCK_POST, INITIAL_IDEAS } from './constants';
import { Idea, Underline } from './types';
import { fetchIdeas, createIdea, fetchUnderlines, createUnderline } from './services/apiService';

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
  const [isLoadingUnderlines, setIsLoadingUnderlines] = useState(true);

  // Load ideas and underlines from backend on mount
  useEffect(() => {
    const loadData = async () => {
      if (MOCK_POST.id) {
        setIsLoadingIdeas(true);
        setIsLoadingUnderlines(true);

        const [fetchedIdeas, fetchedUnderlines] = await Promise.all([
          fetchIdeas(MOCK_POST.id),
          fetchUnderlines(MOCK_POST.id)
        ]);

        console.log('[DEBUG App loadData] Fetched ideas:', fetchedIdeas);
        console.log('[DEBUG App loadData] Fetched underlines:', fetchedUnderlines);

        setIdeas(fetchedIdeas);
        setUnderlines(fetchedUnderlines);
        setIsLoadingIdeas(false);
        setIsLoadingUnderlines(false);
      }
    };
    loadData();
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUnderline, setTargetUnderline] = useState<Underline | null>(null);

  const handleAddUnderline = async (underline: Underline) => {
    console.log('[DEBUG App handleAddUnderline] Received underline:', underline);
    console.log('[DEBUG App handleAddUnderline] Current underlines:', underlines);

    if (!MOCK_POST.id) return;

    // Save to backend
    const savedUnderline = await createUnderline(
      MOCK_POST.id,
      underline.paragraphId,
      underline.text,
      underline.startOffset,
      underline.endOffset
    );

    if (savedUnderline) {
      // Add to local state with backend ID
      const newUnderlines = [...underlines, savedUnderline];
      setUnderlines(newUnderlines);
      console.log('[DEBUG App handleAddUnderline] Underline saved to backend:', savedUnderline);
    } else {
      // Fallback: add to local state even if backend save failed
      const newUnderlines = [...underlines, underline];
      setUnderlines(newUnderlines);
      console.warn('Failed to save underline to backend, saved locally only');
    }

    console.log('[DEBUG App handleAddUnderline] Total underlines after add:', underlines.length + 1);
  };

  const handleAddIdeaRequest = (underline: Underline) => {
    setTargetUnderline(underline);
    setIsModalOpen(true);
  };

  const handleSaveIdea = async (quote: string, note: string) => {
    if (!targetUnderline || !MOCK_POST.id) return;

    // Save idea to backend
    const savedIdea = await createIdea(
      MOCK_POST.id,
      targetUnderline.paragraphId,
      targetUnderline.text,
      note.trim()
    );

    if (savedIdea) {
      // Add idea to local state
      setIdeas([...ideas, savedIdea]);
      // Keep the underline - don't delete it
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
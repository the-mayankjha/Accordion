import { useState, useEffect } from 'react'
import AccordionRenderer from './components/AccordionRenderer'
import type { AccordionData } from './types'
import FloatingAddMenu from './components/FloatingAddMenu'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import ShareMenu from './components/ShareMenu'
import { useTopics, usePages, useCreateTopic, useCreatePage, useUpdatePage } from './hooks/useData'

function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data Hooks
  const { data: topics = [] } = useTopics();
  const { data: pages = [] } = usePages(); 
  
  // Mutations
  const createTopicMutation = useCreateTopic();
  const createPageMutation = useCreatePage();
  const updatePageMutation = useUpdatePage();

  // Derived State
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageId = params.get('page');
    if (pageId) {
      setActivePageId(pageId);
    }
  }, []);

  useEffect(() => {
    if (!activePageId && pages.length > 0) {
      setActivePageId(pages[0].id);
    }
  }, [pages, activePageId]);

  useEffect(() => {
    if (activePageId) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', activePageId);
      window.history.pushState({}, '', url);
    }
  }, [activePageId]);

  const activePage = pages.find(p => p.id === activePageId);

  // --- Content Handlers (For the Active Page) ---

  const updateActivePageContent = (newContent: AccordionData[]) => {
    if (!activePage) return;
    updatePageMutation.mutate({ 
      id: activePage.id, 
      updates: { content: newContent } 
    });
  };

  const handleCreate = () => {
    if (!activePage) return;
    const newId = String(Date.now());
    const newContent: AccordionData = { id: newId, type: 'accordion', question: '', answer: '' };
    updateActivePageContent([...(activePage.content || []), newContent]);
  };

  const handleAddDiagram = () => {
    if (!activePage) return;
    const newId = String(Date.now());
    const template = "```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```";
    const newContent: AccordionData = { id: newId, type: 'diagram', question: '', answer: template };
    updateActivePageContent([...(activePage.content || []), newContent]);
  };

  const handleAddMarkdown = () => {
     if (!activePage) return;
     const newId = String(Date.now());
     const newContent: AccordionData = { id: newId, type: 'markdown', question: '', answer: '' };
     updateActivePageContent([...(activePage.content || []), newContent]);
  };

  const handleUpdate = (id: string, data: Partial<AccordionData>) => {
    if (!activePage) return;
    const newContent = (activePage.content || []).map(acc => acc.id === id ? { ...acc, ...data } : acc);
    updateActivePageContent(newContent);
  }

  const handleDelete = (id: string) => {
    if (!activePage) return;
    const newContent = (activePage.content || []).filter(acc => acc.id !== id);
    updateActivePageContent(newContent);
  }



  // --- Topic & Page Handlers ---

  const handleAddTopic = () => {
    createTopicMutation.mutate({ title: "New Topic" });
  };

  const handleAddPage = () => {
    const currentTopicId = activePage?.topic_id;

    createPageMutation.mutate(
      { title: "Untitled", topicId: currentTopicId },
      {
        onSuccess: (newPage) => {
          setActivePageId(newPage.id);
        }
      }
    );
  };

  // --- Shortcuts ---

  useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (!shortcutsEnabled) return;
       
       const target = e.target as HTMLElement;
       if (
         target.tagName === "INPUT" ||
         target.tagName === "TEXTAREA" ||
         target.isContentEditable
       ) {
         return;
       }
 
       switch (e.key) {
         case "1": handleCreate(); break;
         case "2": handleAddDiagram(); break;
         case "3": handleAddMarkdown(); break;
         case "4": handleAddTopic(); break;
         case "5": handleAddPage(); break;
       }
     };
 
     window.addEventListener("keydown", handleKeyDown);
     return () => window.removeEventListener("keydown", handleKeyDown);
   }, [shortcutsEnabled, activePageId, activePage?.topic_id]); // Dependencies are important here because closures capture state

  return (
    <div className="min-h-screen bg-notion-bg text-notion-text-DEFAULT transition-colors duration-300 flex">
      
      {/* Sidebar */}
      <Sidebar 
        topics={topics}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={setActivePageId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onCreatePage={handleAddPage}
        onCreateTopic={handleAddTopic}
      />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0"> {/* min-w-0 prevents flex items from overflowing */}
        <Navbar 
            shortcutsEnabled={shortcutsEnabled} 
            setShortcutsEnabled={setShortcutsEnabled}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
        />
        
          <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 space-y-xl flex-grow w-full">
             {/* Page Title */}
             {activePage ? (
               <>
                 <div className="mb-8 border-b border-notion-border pb-4">
                   <div className="flex items-start justify-between">
                     <div className="flex-1">
                       <input
                         type="text"
                         value={activePage.title}
                         onChange={(e) => updatePageMutation.mutate({ id: activePage.id, updates: { title: e.target.value } })}
                         className="text-3xl font-bold bg-transparent outline-none text-notion-text-DEFAULT w-full placeholder-gray-400"
                         placeholder="Untitled"
                       />
                       <p className="text-sm text-notion-text-secondary mt-1">
                          {topics.find(t => t.id === activePage.topic_id)?.title || "Uncategorized"}
                       </p>
                     </div>
                     <ShareMenu page={activePage} />
                   </div>
                 </div>
      
                 <AccordionRenderer
                   accordions={activePage.content || []}
                   canEdit={true}
                   onUpdate={handleUpdate}
                   onDelete={handleDelete}
                 />
               </>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-500">
                 <p>Select a page or create one to get started.</p>
               </div>
             )}
          </div>

        <Footer />
        
        <FloatingAddMenu
          onAddQuestion={handleCreate}
          onAddMarkdown={handleAddMarkdown}
          onAddDiagram={handleAddDiagram}
          onAddTopic={handleAddTopic}
          onAddPage={handleAddPage}
        />
      </div>
    </div>
  )
}

export default App

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import { LogOut, Plus, Search, Home, Inbox, ChevronRight, ChevronDown, FileText, PanelLeftClose } from "lucide-react";
import type { Topic, Page } from '../types';
import { useState } from 'react';

interface SidebarProps {
  topics: Topic[];
  pages: Page[];
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onCreatePage: () => void;
  onCreateTopic: () => void;
}

export default function Sidebar({
  topics,
  pages,
  activePageId,
  onSelectPage,
  isOpen,
  onToggle,
  onCreatePage,
  onCreateTopic
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Group pages by topic
  const pagesByTopic = topics.reduce((acc, topic) => {
    acc[topic.id] = pages.filter((page) => page.topic_id === topic.id);
    return acc;
  }, {} as Record<string, Page[]>);

  // Pages without a topic
  const orphanPages = pages.filter((page) => !page.topic_id);

  const handlePageClick = (pageId: string) => {
    onSelectPage(pageId);
    if (window.innerWidth < 768) onToggle();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#F7F7F5] dark:bg-[#1F1F1F] text-[#5F5E5B] dark:text-[#9B9B9B] border-r border-[#E9E9E7] dark:border-[#2F2F2F] z-[60] flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0 md:w-64 md:translate-x-0' 
            : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        <div className="w-64 h-full flex flex-col font-sans text-sm">
          {/* Header */}
          {/* Header */}
          <div className="relative h-11 flex items-center justify-between px-3 border-b border-[#E9E9E7] dark:border-[#2F2F2F] shrink-0">
             <div className="flex items-center justify-start w-8">
                 <img src="/logo.png" alt="Logo" className="w-5 h-5" />
             </div>

             <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-[#37352F] dark:text-[#D4D4D4] pointer-events-none">
                 <span>Accordion</span>
             </div>

             <div className="flex items-center justify-end w-8">
                <button 
                  onClick={onToggle} 
                  className="p-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded text-[#5F5E5B] dark:text-[#9B9B9B]"
                >
                    <PanelLeftClose size={18} />
                </button>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 scrollbar-hide">
            
            {/* User Workspace */}
            <div className="flex items-center justify-between px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer group">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                   {user?.email?.charAt(0).toUpperCase() || 'M'}
                 </div>
                 <span className="font-medium text-[#37352F] dark:text-[#D4D4D4] truncate max-w-[140px]">
                   {user?.user_metadata?.full_name || 'My Workspace'}
                 </span>
               </div>
            </div>

            {/* Navigation */}
            <div className="space-y-0.5">
                <NavItem icon={<Search size={18}/>} label="Search" />
                <NavItem icon={<Home size={18}/>} label="Home" />
                <NavItem icon={<Inbox size={18}/>} label="Inbox" />
            </div>

            {/* Topics */}
            <div className="space-y-0.5">
               <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#666] dark:text-[#686868] group">
                  <span>Topics</span>
                  <button onClick={onCreateTopic} className="opacity-0 group-hover:opacity-100 hover:text-[#37352F] dark:hover:text-[#D4D4D4]">
                    <Plus size={14} />
                  </button>
               </div>
               
               {topics.map((topic) => (
                 <div key={topic.id}>
                    <div 
                      className="flex items-center gap-1 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4] group"
                      onClick={() => toggleTopic(topic.id)}
                    >
                       <button className="p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">
                         {expandedTopics[topic.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                       </button>
                       <span className="mr-2">{topic.emoji || '📁'}</span>
                       <span className="font-medium flex-1 truncate">{topic.title}</span>
                       <button 
                         onClick={(e) => { e.stopPropagation(); onCreatePage(); /* Pass topicId later */ }}
                         className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                       >
                         <Plus size={14} />
                       </button>
                    </div>
                    {expandedTopics[topic.id] && (
                       <div className="ml-6 border-l border-[#E9E9E7] dark:border-[#2F2F2F] pl-1">
                          {pagesByTopic[topic.id]?.length === 0 && <div className="px-2 py-1 text-xs text-gray-400">No pages</div>}
                          {pagesByTopic[topic.id]?.map(page => (
                             <PageItem 
                               key={page.id} 
                               page={page} 
                               isActive={activePageId === page.id} 
                               onClick={() => handlePageClick(page.id)} 
                             />
                          ))}
                       </div>
                    )}
                 </div>
               ))}
            </div>

            {/* Private (Orphan) Pages */}
            <div className="space-y-0.5">
               <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#666] dark:text-[#686868] group">
                  <span>Private</span>
                  <button onClick={onCreatePage} className="opacity-0 group-hover:opacity-100 hover:text-[#37352F] dark:hover:text-[#D4D4D4]">
                      <Plus size={14} />
                  </button>
               </div>
               {orphanPages.map((page) => (
                  <PageItem 
                     key={page.id} 
                     page={page} 
                     isActive={activePageId === page.id} 
                     onClick={() => handlePageClick(page.id)} 
                  />
               ))}
               {orphanPages.length === 0 && <div className="px-2 text-xs text-[#9B9B9B] dark:text-[#525252]">No private pages</div>}
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-[#E9E9E7] dark:border-[#2F2F2F]">
             <div 
               onClick={onCreatePage}
               className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]"
             >
                 <Plus size={16} />
                 <span>New Page</span>
             </div>
             {user && (
                 <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4] group mt-1">
                     <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white overflow-hidden">
                        {user.user_metadata.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover"/>
                        ) : (
                            <span>{user.email?.charAt(0).toUpperCase()}</span>
                        )}
                     </div>
                     <span className="truncate flex-1 text-xs">{user.email}</span>
                     <button onClick={() => logout()} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><LogOut size={14}/></button>
                 </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]">
            <span className="text-[#9B9B9B]">{icon}</span>
            <span>{label}</span>
        </div>
    )
}

function PageItem({ page, isActive, onClick }: { page: Page, isActive: boolean, onClick: () => void }) {
    return (
        <div 
          onClick={onClick}
          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors ${
            isActive 
              ? 'bg-[#E3E2E0] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#D4D4D4]' 
              : 'text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4]'
          }`}
        >
          <FileText size={16} className="opacity-70" />
          <span className="truncate flex-1">{page.title || "Untitled"}</span>
        </div>
    )
}

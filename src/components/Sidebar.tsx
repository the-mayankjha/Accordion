import { motion, AnimatePresence } from 'framer-motion';
import type { Topic, Page } from '../types';
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

interface SidebarProps {
  topics: Topic[];
  pages: Page[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onToggleFavorite: (pageId: string) => void;
}

export default function Sidebar({
  topics,
  pages,
  activePageId,
  onSelectPage,
  isOpen,
  onToggle,
  onToggleFavorite
}: SidebarProps) {
  const { user, logout } = useAuth();

  // Group pages by topic
  const pagesByTopic = topics.reduce((acc, topic) => {
    acc[topic.id] = pages.filter((page) => page.topicId === topic.id);
    return acc;
  }, {} as Record<string, Page[]>);

  // Pages without a topic (if any)
  const orphanPages = pages.filter((page) => !topics.find(t => t.id === page.topicId));

  // Favorites
  const favoritePages = pages.filter(p => p.isFavorite);

  // Helper for mobile toggle
  const handlePageClick = (pageId: string) => {
    onSelectPage(pageId);
    if (window.innerWidth < 768) onToggle();
  };

  return (
    <>
      {/* Mobile Overlay */}
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

      {/* Sidebar Container */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#F7F7F5] dark:bg-[#1F1F1F] text-[#5F5E5B] dark:text-[#9B9B9B] border-r border-[#E9E9E7] dark:border-[#2F2F2F] z-[60] flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0 md:w-64 md:translate-x-0' 
            : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        <div className="w-64 h-full flex flex-col font-sans text-sm">
          {/* Sidebar Header (Fixed) */}
          <div className="relative h-11 flex items-center justify-center px-3 border-b border-[#E9E9E7] dark:border-[#2F2F2F] shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className={`absolute left-3 w-8 h-8 object-contain transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            />
            
            <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-sm font-bold text-[#37352F] dark:text-[#D4D4D4] whitespace-nowrap">
                Accordion
              </h2>
            </div>
            
            <button 
              onClick={onToggle} 
              className="absolute right-3 text-[#5F5E5B] dark:text-[#9B9B9B] hover:text-[#37352F] dark:hover:text-[#D4D4D4] p-1 rounded-md hover:bg-[#E3E2E0] dark:hover:bg-[#373737] transition-colors"
            >
               <svg 
                 width="18" 
                 height="18" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="1.5" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 className={`transform transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
               >
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="9" y1="3" x2="9" y2="21"></line>
               </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6 scrollbar-hide">
            
            {/* Workspace Switcher */}
             <div className="flex items-center justify-between px-2 py-1 mb-2 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] cursor-pointer transition-colors rounded-md group mt-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <h2 className="text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] whitespace-nowrap truncate max-w-[140px]">
                    Mayank Jha's Accordion
                  </h2>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#9B9B9B] opacity-0 group-hover:opacity-100 transition-opacity"><path d="m6 9 6 6 6-6"/></svg>
             </div>

             {/* Quick Links */}
             <div className="space-y-0.5 mb-6">
                 <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                     <span>Search</span>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                     <span>Home</span>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                     <span>Inbox</span>
                 </div>
             </div>
            
            {/* Favorites Section */}
            {favoritePages.length > 0 && (
                <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold text-[#666] dark:text-[#686868] px-2 py-1 mb-1">Favorites</h3>
                    {favoritePages.map(page => (
                        <PageItem 
                          key={page.id} 
                          page={page} 
                          isActive={activePageId === page.id} 
                          onClick={() => handlePageClick(page.id)}
                          onToggleFavorite={() => onToggleFavorite(page.id)}
                        />
                    ))}
                </div>
            )}

            {/* Teamspaces (Topics) */}
            <div className="space-y-0.5">
               <h3 className="text-xs font-semibold text-[#666] dark:text-[#686868] px-2 py-1 mb-1">Teamspaces</h3>
                {topics.map((topic) => (
                  <div key={topic.id} className="mb-2">
                     <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md text-[#37352F] dark:text-[#D4D4D4] group">
                        <div className="w-4 h-4 bg-yellow-600 rounded-sm flex items-center justify-center text-[10px] text-white">T</div>
                        <span className="font-medium flex-1">{topic.title}</span>
                     </div>
                     <div className="pl-2 mt-0.5 border-l border-[#E9E9E7] dark:border-[#2F2F2F] ml-4">
                        {pagesByTopic[topic.id]?.map((page) => (
                          <PageItem 
                            key={page.id} 
                            page={page} 
                            isActive={activePageId === page.id} 
                            onClick={() => handlePageClick(page.id)}
                            onToggleFavorite={() => onToggleFavorite(page.id)}
                          />
                        ))}
                     </div>
                  </div>
                ))}
            </div>

            {/* Private (Orphan Pages) */}
             <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-[#666] dark:text-[#686868] px-2 py-1 mb-1">Private</h3>
                {orphanPages.map((page) => (
                   <PageItem 
                      key={page.id} 
                      page={page} 
                      isActive={activePageId === page.id} 
                      onClick={() => handlePageClick(page.id)}
                      onToggleFavorite={() => onToggleFavorite(page.id)}
                    />
                ))}
                {orphanPages.length === 0 && <div className="px-2 text-xs text-[#9B9B9B] dark:text-[#525252]">No private pages</div>}
             </div>
          </div>
          
           {/* Sidebar Footer */}
           <div className="p-2 border-t border-[#E9E9E7] dark:border-[#2F2F2F] space-y-1 mt-auto">
             <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4]">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                 <span>New Page</span>
             </div>
             
             {user ? (
               <div className="group relative">
                 <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] rounded-md cursor-pointer text-[#37352F] dark:text-[#D4D4D4] mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white overflow-hidden">
                      {user.user_metadata.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover"/>
                      ) : (
                        <span>{user.email?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="truncate flex-1">{user.user_metadata.full_name || user.email}</span>
                    <button 
                      onClick={() => logout()}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                      title="Log Out"
                    >
                      <LogOut size={14}/>
                    </button>
                 </div>
               </div>
             ) : (
               <div className="px-2 py-1 text-xs text-gray-400">Not signed in</div>
             )}
           </div>

        </div>
      </div>
    </>
  );
}

function PageItem({ page, isActive, onClick, onToggleFavorite }: { page: Page, isActive: boolean, onClick: () => void, onToggleFavorite: () => void }) {
    return (
        <div 
          onClick={onClick}
          className={`group flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors relative ${
            isActive 
              ? 'bg-[#E3E2E0] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#D4D4D4]' 
              : 'text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#E3E2E0] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span className="truncate flex-1">{page.title}</span>
          
           {/* Hover Actions */}
           <div className="hidden group-hover:flex items-center absolute right-2 bg-[#E3E2E0] dark:bg-[#2C2C2C]">
              <button 
                 onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                 className="p-0.5 hover:text-orange-500 dark:hover:text-white"
                 title="Toggle Favorite"
              >
                 <svg width="14" height="14" viewBox="0 0 24 24" fill={page.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={page.isFavorite ? "text-orange-500" : ""}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
           </div>
        </div>
    )
}

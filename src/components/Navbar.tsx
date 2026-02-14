import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { Settings } from "lucide-react";

interface NavbarProps {
  shortcutsEnabled: boolean;
  setShortcutsEnabled: (enabled: boolean) => void;
  onToggleSidebar: () => void;
}

export default function Navbar({
  shortcutsEnabled,
  setShortcutsEnabled,
  onToggleSidebar,
}: NavbarProps) {
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       const saved = localStorage.getItem('theme');
       if (saved) return saved === 'dark';
       return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <>
    <nav className="fixed top-0 left-0 w-full h-11 flex items-center justify-between px-3 bg-notion-bg border-b border-notion-border z-50 transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-2 text-sm text-notion-text-DEFAULT overflow-hidden">
        <button 
          onClick={onToggleSidebar}
          className="p-1 hover:bg-notion-bg-hover rounded-full transition-colors focus:outline-none active:outline-none shrink-0"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>

        <div className="flex items-center gap-2 px-1 py-0.5 hover:bg-notion-bg-hover rounded cursor-pointer transition-colors shrink-0">
          {/* Space Icon (Lightning) */}
          <div className="bg-yellow-500/20 text-yellow-600 p-0.5 rounded">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span className="font-medium hidden sm:inline">nFKs</span>
        </div>

        <span className="text-notion-text-secondary hidden sm:inline">/</span>

        <div className="flex items-center gap-2 px-1 py-0.5 hover:bg-notion-bg-hover rounded cursor-pointer transition-colors min-w-0">
          <span className="font-medium truncate">Accordion</span>
          <span className="text-xs text-notion-text-secondary flex items-center gap-1 shrink-0">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="hidden sm:inline">Private</span>
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 shrink-0">
        {!user ? (
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="text-sm px-3 py-1 bg-notion-text text-notion-bg hover:opacity-90 rounded-md transition-all font-medium"
          >
            Login
          </button>
        ) : (
          <button className="text-sm px-2 py-0.5 hover:bg-notion-bg-hover rounded transition-colors text-notion-text-DEFAULT focus:outline-none active:outline-none">
            <span className="hidden sm:inline">Share</span>
            <span className="sm:hidden">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </span>
          </button>
        )}
        
        <div className="relative">
          <motion.button  
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-notion-bg-hover rounded-full transition-colors text-notion-text-DEFAULT focus:outline-none active:outline-none"
            whileHover={{ rotate: 90 }}
            animate={{ rotate: showSettings ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-notion-bg border border-notion-border rounded-lg shadow-xl overflow-hidden z-50"
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-notion-text-secondary px-2 py-1 mb-1">
                    Settings
                  </div>
                  <label className="flex items-center justify-between px-2 py-1.5 hover:bg-notion-bg-hover rounded cursor-pointer">
                    <span className="text-sm text-notion-text-DEFAULT">Shortcuts (1-3)</span>
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={shortcutsEnabled}
                        onChange={(e) => setShortcutsEnabled(e.target.checked)}
                        className="sr-only"
                      />
                      <div 
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          shortcutsEnabled 
                            ? "bg-notion-text border-notion-text" 
                            : "bg-transparent border-notion-text-secondary"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 text-notion-bg transition-opacity ${
                            shortcutsEnabled ? "opacity-100" : "opacity-0"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between px-2 py-1.5 hover:bg-notion-bg-hover rounded cursor-pointer mt-1">
                    <span className="text-sm text-notion-text-DEFAULT">Dark Mode</span>
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className="sr-only"
                      />
                      <div 
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isDarkMode 
                            ? "bg-notion-text border-notion-text" 
                            : "bg-transparent border-notion-text-secondary"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 text-notion-bg transition-opacity ${
                            isDarkMode ? "opacity-100" : "opacity-0"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user && (
           <div className="w-6 h-6 rounded-full ml-2 shadow-sm border border-white/10 overflow-hidden bg-gray-200">
             {user.user_metadata.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500 text-[10px] text-white font-bold">
                  {user.email?.charAt(0).toUpperCase()}
               </div>
             )}
           </div>
        )}
      </div>
    </nav>
    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

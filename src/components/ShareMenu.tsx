import { useState } from 'react';
import { Share2, Globe, Lock, Copy, Check } from 'lucide-react';
import type { Page } from '../types';
import { useUpdatePage } from '../hooks/useData';

interface ShareMenuProps {
  page: Page;
}

export default function ShareMenu({ page }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const updatePage = useUpdatePage();

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublic = () => {
    updatePage.mutate({
      id: page.id,
      updates: { is_public: !page.is_public }
    });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded transition-colors"
      >
        <Share2 size={14} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Share Page</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Public Access Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {page.is_public ? <Globe size={16} className="text-blue-500" /> : <Lock size={16} className="text-gray-500" />}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Public Access</span>
                  <span className="text-xs text-gray-500">
                    {page.is_public ? 'Anyone with the link can view' : 'Only you can view'}
                  </span>
                </div>
              </div>
              <button 
                onClick={togglePublic}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ${
                  page.is_public ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    page.is_public ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Link Copy */}
            {page.is_public && (
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href} 
                  className="bg-transparent text-xs flex-grow outline-none text-gray-600 dark:text-gray-300 w-full truncate"
                />
                <button 
                  onClick={handleCopyLink}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

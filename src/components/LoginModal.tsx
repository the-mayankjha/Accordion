
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Github } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithGithub, loginWithNFKs } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
      <div 
        className="bg-notion-bg w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-notion-border transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-notion-border">
          <h2 className="text-lg font-semibold text-notion-text-DEFAULT">Sign In</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-notion-bg-hover text-notion-text-secondary hover:text-notion-text-DEFAULT transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-notion-text-secondary mb-6 text-center">
            Log in to sync your accordion across devices and collaborate in real-time.
          </p>

          <button
            onClick={() => { loginWithGoogle(); onClose(); }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-notion-bg hover:bg-notion-bg-hover text-notion-text-DEFAULT border border-notion-border rounded-lg transition-all font-medium text-sm group"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => { loginWithGithub(); onClose(); }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg transition-all font-medium text-sm group"
          >
            <Github className="w-5 h-5 group-hover:scale-105 transition-transform" />
            Continue with GitHub
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-notion-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-notion-bg text-notion-text-secondary">Or</span>
            </div>
          </div>

          <button
            onClick={() => { loginWithNFKs(); onClose(); }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-medium text-sm shadow-md shadow-indigo-500/20 group"
          >
            <img src="/nfks_logo.svg" alt="nFKs Logo" className="w-5 h-5 group-hover:scale-105 transition-transform" />
            Log in with nFKs ID
          </button>
        </div>
        
        {/* Footer info (Optional visual touch) */}
        <div className="px-6 py-4 bg-notion-bg-hover/30 border-t border-notion-border text-center">
             <p className="text-xs text-notion-text-secondary">
               By continuing, you agree to our Terms of Service and Privacy Policy.
             </p>
        </div>
      </div>
    </div>
  );
};

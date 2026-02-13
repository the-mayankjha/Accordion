
export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-notion-border text-xs text-notion-text-secondary">
      <div className="w-full px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left min-w-[200px]">
          &copy; Copyright Accordion 2026. All rights reserved.
        </div>
        
        <div className="text-center font-medium text-notion-text-DEFAULT flex-grow">
          Designed and Developed by Mayank Jha
        </div>

        <div className="text-center sm:text-right flex items-center justify-center sm:justify-end gap-2 min-w-[200px]">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          nFKs Affiliate
        </div>
      </div>
    </footer>
  );
}

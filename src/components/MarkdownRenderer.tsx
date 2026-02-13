import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Mermaid from "./Mermaid";
import { preprocessContent } from "../utils/latex";

interface Props {
  children: string; // The markdown content
  className?: string;
}

export default function MarkdownRenderer({ children, className = "" }: Props) {
  const processedContent = preprocessContent(children);

  return (
    <div className={`markdown-renderer text-notion-text-DEFAULT ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { trust: true, strict: false }]]}
        components={{
          // Headings
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-notion-border" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-medium mt-3 mb-2" {...props} />,
          
          // Paragraphs and Lists
          p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside mb-4 pl-6 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside mb-4 pl-6 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-notion-text-DEFAULT/30 pl-4 py-1 my-4 italic text-notion-text-secondary bg-notion-bg-secondary/50 rounded-r" {...props} />
          ),

          // Code
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const isMermaid = !inline && match && match[1] === "mermaid";

            if (isMermaid) {
              return <Mermaid chart={String(children).replace(/\n$/, "")} />;
            }
            
            if (inline) {
              return (
                <code className="bg-notion-bg-secondary text-notion-accent-gold px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-notion-border/50" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <pre className="block bg-notion-bg-secondary p-4 rounded-lg overflow-x-auto my-4 border border-notion-border text-sm font-mono shadow-sm">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 border border-notion-border rounded-lg shadow-sm">
              <table className="w-full border-collapse text-left" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-notion-bg-secondary/80 border-b border-notion-border" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-notion-border" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-notion-bg-hover/50 transition-colors" {...props} />,
          th: ({ node, ...props }) => <th className="p-3 font-semibold text-sm tracking-wide text-notion-text-secondary uppercase" {...props} />,
          td: ({ node, ...props }) => <td className="p-3 text-sm align-top" {...props} />,

          // Links and Media
          a: ({ node, ...props }) => <a className="text-blue-500 hover:underline decoration-blue-500/30 underline-offset-2 transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
          img: ({ node, ...props }) => <img className="rounded-lg border border-notion-border shadow-sm my-4 max-w-full h-auto" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-8 border-notion-border" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

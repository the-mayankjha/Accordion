import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
}

// Notion Light Theme (Neutral)
const NOTION_LIGHT = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  primaryColor: '#FFFFFF', // White Node
  primaryTextColor: '#37352F', // Notion Text
  primaryBorderColor: '#E9E9E7', // Light Grey Border
  lineColor: '#787774', // Grey Line
  secondaryColor: '#F7F7F5', // Off-white
  tertiaryColor: '#FFFFFF',
  nodeBorder: '#E9E9E7', 
  clusterBkg: '#F7F7F5', 
  clusterBorder: '#E9E9E7', 
  defaultLinkColor: '#787774',
  edgeLabelBackground: '#FBFBFA', 
  actorBorder: '#E9E9E7',
  actorBkg: '#FFFFFF',
  actorTextColor: '#37352F',
  signalColor: '#37352F',
  signalTextColor: '#37352F',
  labelBoxBkgColor: '#FFFFFF',
  labelBoxBorderColor: '#E9E9E7',
  labelTextColor: '#37352F',
  loopTextColor: '#37352F',
  noteBorderColor: '#E9E9E7',
  noteBkgColor: '#FFFFFF',
  noteTextColor: '#37352F',
  activationBorderColor: '#37352F',
  activationBkgColor: '#F7F7F5',
  sequenceNumberColor: '#37352F',
  mainBkg: '#FBFBFA', // Notion Secondary BG
};

// Notion Dark Theme (Neutral)
const NOTION_DARK = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  primaryColor: '#2f2f2f', // Greyish Node
  primaryTextColor: '#FFFFFF', // White Text
  primaryBorderColor: '#5A5A5A', // Neutral Grey Border
  lineColor: '#9B9B9B', // Lighter Grey Line
  secondaryColor: '#252525', 
  tertiaryColor: '#2f2f2f',
  nodeBorder: '#5A5A5A', // Neutral Grey
  clusterBkg: '#252525', 
  clusterBorder: '#5A5A5A', 
  defaultLinkColor: '#9B9B9B',
  edgeLabelBackground: '#202020', 
  actorBorder: '#5A5A5A',
  actorBkg: '#2f2f2f',
  actorTextColor: '#FFFFFF',
  signalColor: '#FFFFFF',
  signalTextColor: '#FFFFFF',
  labelBoxBkgColor: '#2f2f2f',
  labelBoxBorderColor: '#5A5A5A',
  labelTextColor: '#FFFFFF',
  loopTextColor: '#FFFFFF',
  noteBorderColor: '#5A5A5A',
  noteBkgColor: '#2f2f2f',
  noteTextColor: '#FFFFFF',
  activationBorderColor: '#5A5A5A',
  activationBkgColor: '#2f2f2f',
  sequenceNumberColor: '#FFFFFF',
  mainBkg: '#202020', // Notion Secondary BG
};

const DARK_THEME_CSS = `
  /* Force black text for bright colored nodes in dark mode using :has() for robustness */
  
  /* Selectors for bright backgrounds (Yellow, White, Orange) on ANY shape */
  .node:has([style*="fill: #ffff" i]) .nodeLabel,
  .node:has([style*="fill: #fff" i]) .nodeLabel,
  .node:has([style*="fill: white" i]) .nodeLabel,
  .node:has([style*="fill: yellow" i]) .nodeLabel,
  .node:has([style*="fill: orange" i]) .nodeLabel,
  .node:has([style*="rgb(255, 255" i]) .nodeLabel,
  .node:has([style*="rgb(255, 165" i]) .nodeLabel,

  /* Same for HTML Labels */
  .node:has([style*="fill: #ffff" i]) .label,
  .node:has([style*="fill: #fff" i]) .label,
  .node:has([style*="fill: white" i]) .label,
  .node:has([style*="fill: yellow" i]) .label,
  .node:has([style*="fill: orange" i]) .label,
  .node:has([style*="rgb(255, 255" i]) .label,
  .node:has([style*="rgb(255, 165" i]) .label {
    fill: #000000 !important;
    color: #000000 !important;
  }

  /* Deep select for inner text elements */
  .node:has([style*="fill: #ffff" i]) .label div,
  .node:has([style*="fill: #fff" i]) .label div,
  .node:has([style*="fill: white" i]) .label div,
  .node:has([style*="fill: yellow" i]) .label div,
  .node:has([style*="fill: orange" i]) .label div,
  .node:has([style*="rgb(255, 255" i]) .label div,
  .node:has([style*="rgb(255, 165" i]) .label div {
    color: #000000 !important;
  }
`;

export default function Mermaid({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [caption, setCaption] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Sync state immediately in case it changed before observer was ready
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark ? NOTION_DARK : NOTION_LIGHT,
      themeCSS: isDark ? DARK_THEME_CSS : undefined,
      securityLevel: 'loose',
    });

    if (ref.current && chart) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      let processingChart = chart;
      // ... rest of the logic remains same
      let extractedCaption = null;

      // Extract caption
      const captionMatch = /%%caption:\s*(.*)/.exec(processingChart);
      if (captionMatch) {
        extractedCaption = captionMatch[1];
        processingChart = processingChart.replace(captionMatch[0], "");
      }
      setCaption(extractedCaption);

      // Sanitize chart input
      let cleanedChart = processingChart;
      // Robust regex to extract content inside ```mermaid ... ``` or ``` ... ```
      const codeBlockMatch = /^\s*```(?:mermaid)?\n?([\s\S]*?)```/.exec(processingChart);
      if (codeBlockMatch) {
        cleanedChart = codeBlockMatch[1];
      } else {
        cleanedChart = processingChart
          .replace(/^```mermaid\s*/, "")
          .replace(/^```\s*/, "")
          .replace(/```[\s\S]*$/, "") 
          .trim();
      }

      try {
        mermaid.render(id, cleanedChart).then(({ svg }) => {
          setSvg(svg);
        }).catch((error) => {
          console.error("Mermaid rendering failed:", error);
          setSvg(`<div class="text-red-400 font-mono text-xs p-4 border border-red-500/20 rounded-lg bg-red-500/5 whitespace-pre-wrap">
  <div class="font-bold mb-1">Diagram Syntax Error</div>
  ${error.message?.split('\n')[0] || 'Unknown error'}
</div>`);
        });
      } catch (e: any) {
         console.error("Mermaid synchronous error:", e);
         setSvg(`<div class="text-red-400 font-mono text-xs p-4 border border-red-500/20 rounded-lg bg-red-500/5">
  <div class="font-bold mb-1">Diagram Error</div>
  ${e.message || 'Failed to render diagram'}
</div>`);
      }
    }
  }, [chart, isDark]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="mermaid-container flex justify-center py-4 w-full transition-colors duration-300"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <div className="text-center text-sm text-notion-text-secondary italic mt-2">
          {caption}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
}

// Notion + Pastel (Light)
const NOTION_PASTEL_LIGHT = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  primaryColor: '#FFFFFF', // Notion White Node
  primaryTextColor: '#37352F', // Notion Text
  primaryBorderColor: '#b4befe', // Pastel Lavender Border
  lineColor: '#9ca0b0', // Pastel Grey-Blue Line
  secondaryColor: '#F7F7F5', // Notion Off-white
  tertiaryColor: '#FFFFFF',
  nodeBorder: '#b4befe', // Pastel Lavender
  clusterBkg: '#F7F7F5', // Notion Off-white
  clusterBorder: '#b4befe', // Pastel Lavender
  defaultLinkColor: '#9ca0b0',
  edgeLabelBackground: '#FFFFFF', 
  actorBorder: '#b4befe',
  actorBkg: '#FFFFFF',
  actorTextColor: '#37352F',
  signalColor: '#37352F',
  signalTextColor: '#37352F',
  labelBoxBkgColor: '#FFFFFF',
  labelBoxBorderColor: '#b4befe',
  labelTextColor: '#37352F',
  loopTextColor: '#37352F',
  noteBorderColor: '#b4befe',
  noteBkgColor: '#FFFFFF',
  noteTextColor: '#37352F',
  activationBorderColor: '#b4befe',
  activationBkgColor: '#F7F7F5',
  sequenceNumberColor: '#37352F',
  mainBkg: '#FFFFFF',
};

// Notion + Pastel (Dark)
const NOTION_PASTEL_DARK = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  primaryColor: '#FFFFFF', // White Node
  primaryTextColor: '#37352F', // Dark Text
  primaryBorderColor: '#cba6f7', // Pastel Mauve Border
  lineColor: '#b4befe', // Pastel Lavender Line
  secondaryColor: '#252525', // Dark Cluster
  tertiaryColor: '#FFFFFF',
  nodeBorder: '#cba6f7', // Pastel Mauve
  clusterBkg: '#252525', 
  clusterBorder: '#cba6f7', 
  defaultLinkColor: '#b4befe', // Pastel Lavender
  edgeLabelBackground: '#252525', 
  actorBorder: '#cba6f7',
  actorBkg: '#FFFFFF',
  actorTextColor: '#37352F',
  signalColor: '#37352F',
  signalTextColor: '#37352F',
  labelBoxBkgColor: '#FFFFFF',
  labelBoxBorderColor: '#cba6f7',
  labelTextColor: '#37352F',
  loopTextColor: '#37352F',
  noteBorderColor: '#cba6f7',
  noteBkgColor: '#FFFFFF',
  noteTextColor: '#37352F',
  activationBorderColor: '#cba6f7',
  activationBkgColor: '#FFFFFF',
  sequenceNumberColor: '#37352F',
  mainBkg: '#191919', // Dark Canvas
};

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
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark ? NOTION_PASTEL_DARK : NOTION_PASTEL_LIGHT,
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

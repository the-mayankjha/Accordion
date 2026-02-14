import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
}

export default function Mermaid({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [caption, setCaption] = useState<string | null>(null);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
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
  }, [chart]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="mermaid-container flex justify-center py-4 w-full"
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

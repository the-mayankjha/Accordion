import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

interface Props {
  chart: string;
}

export default function Mermaid({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [caption, setCaption] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current && chart) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      let processingChart = chart;
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
      // Matches start of string, optional whitespace, optional fences, content, optional fences, end of string (ignoring trailing content if it looks like a block)
      const codeBlockMatch = /^\s*```(?:mermaid)?\n?([\s\S]*?)```/.exec(processingChart);
      if (codeBlockMatch) {
        cleanedChart = codeBlockMatch[1];
      } else {
        // Fallback cleanup if regex doesn't match (e.g. user didn't use fences properly or at all)
        cleanedChart = processingChart
          .replace(/^```mermaid\s*/, "")
          .replace(/^```\s*/, "")
          .replace(/```[\s\S]*$/, "") // Aggressively remove ending backticks and anything after them (newlines, captions, etc.)
          .trim();
      }

      mermaid.render(id, cleanedChart).then(({ svg }) => {
        setSvg(svg);
      }).catch((error) => {
        console.error("Mermaid rendering failed:", error);
        console.log("Failed chart content:", cleanedChart);
        setSvg(`<div class="text-red-500 font-mono text-sm p-2 border border-red-500/20 rounded bg-red-500/10">Failed to render diagram: ${error.message}</div>`);
      });
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

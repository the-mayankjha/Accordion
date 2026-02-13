// Preprocess text to handle specific formatting requirements
export const preprocessContent = (content: string): string => {
  if (!content) return "";

  let processed = content;

  // 1. Handle Mermaid Captions
  // Pattern: ```mermaid ... ``` $<"caption"> OR ```mermaid ... ``` $"caption"$
  const mermaidCaptionRegex = /(```mermaid[\s\S]*?```)\s*(?:\$<"(.*?)">|\$"(.*?)"\$)/g;
  processed = processed.replace(mermaidCaptionRegex, (_, codeBlock, cap1, cap2) => {
    const caption = cap1 || cap2;
    // Inject the caption into the code block using a custom marker
    // We replace the ending ``` with the caption marker + ```
    return codeBlock.replace(/```$/, `\n%%caption: ${caption}\n\`\`\``);
  });

  // 2. Handle LaTeX (existing logic)
  const blockRegex = /\$\$([\s\S]*?)\$\$/g;
  const inlineRegex = /\$([^$]+)\$/g;

  return processed
    .replace(blockRegex, (_, tex) => `\n$$\n${tex.trim()}\n$$\n`)
    .replace(inlineRegex, (_, tex) => `$${tex.trim()}$`);
};

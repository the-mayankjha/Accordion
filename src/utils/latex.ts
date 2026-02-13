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

  // 3. Auto-wrap common LaTeX environments in $$ if not already wrapped
  // This matches \begin{env}...\end{env} that might be missing $$ wrappers
  const envRegex = /(\$\$)?\s*(\\begin\{(align|equation|gather|alignat)\}[\s\S]*?\\end\{\3\})\s*(\$\$)?/g;
  
  processed = processed.replace(envRegex, (_match, _prefix, env, type, _suffix) => {
    // Map environments to their 'ed' counterparts which are valid inside $$ ... $$
    // e.g., align -> aligned, gather -> gathered
    const typeMapping: Record<string, string> = {
      align: 'aligned',
      equation: 'aligned', // equation implies display mode, aligned is a safe fallback inside $$
      gather: 'gathered',
      alignat: 'aligned' 
    };

    const newType = typeMapping[type] || type;
    
    // Replace the environment names in the string
    // We strictly replace the first \begin{type} and last \end{type}
    const innerContent = env
      .replace(new RegExp(`^\\\\begin\\{${type}\\}`), '')
      .replace(new RegExp(`\\\\end\\{${type}\\}$`), '');

    const replacement = `\n\n$$\n\\begin{${newType}}${innerContent}\\end{${newType}}\n$$\n\n`;
    console.log('[LaTeX Debug] Replacing:', env, 'with:', replacement);
    return replacement;
  });

  return processed
    .replace(blockRegex, (_, tex) => `\n$$\n${tex.trim()}\n$$\n`)
    .replace(inlineRegex, (_, tex) => `$${tex.trim()}$`);
};

// Preprocess text to handle specific formatting requirements
// Preprocess text to handle specific formatting requirements
// Preprocess text to handle specific formatting requirements
export const preprocessContent = (content: string): string => {
   if (!content) return "";
   
   let processed = content;

   // 1. Handle Mermaid Captions (Global because caption is matched AFTER the block)
   const mermaidCaptionRegex = /(```mermaid[\s\S]*?```)\s*(?:\$<"(.*?)">|\$"(.*?)"\$)/g;
   processed = processed.replace(mermaidCaptionRegex, (_, codeBlock, cap1, cap2) => {
    const caption = cap1 || cap2;
    return codeBlock.replace(/```$/, `\n%%caption: ${caption}\n\`\`\``);
   });

   // 2. Split and Process LaTeX
   const parts = processed.split(/(`{1,3}[\s\S]*?`{1,3})/g);
   
   return parts.map(part => {
     if (part.startsWith('`')) return part;
     
     let text = part;
     // Standardize LaTeX delimiters
     text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => `\n$$\n${tex.trim()}\n$$\n`);
     text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => `$${tex.trim()}$`);
     
     // Auto-wrap environments
     const envRegex = /(\$\$)?\s*(\\begin\{(align|equation|gather|alignat)\}[\s\S]*?\\end\{\3\})\s*(\$\$)?/g;
     text = text.replace(envRegex, (_match, _prefix, env, type, _suffix) => {
        const typeMapping: Record<string, string> = {
          align: 'aligned', equation: 'aligned', gather: 'gathered', alignat: 'aligned' 
        };
        const newType = typeMapping[type] || type;
        const innerContent = env
          .replace(new RegExp(`^\\\\begin\\{${type}\\}`), '')
          .replace(new RegExp(`\\\\end\\{${type}\\}$`), '');
        return `\n\n$$\n\\begin{${newType}}${innerContent}\\end{${newType}}\n$$\n\n`;
     });
     
     // Normalize existing $$ (Add newlines for safety)
     text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => `\n$$\n${tex.trim()}\n$$\n`);
     // Normalize existing $ (inline)
     text = text.replace(/([^\\])\$([^$]+?)\$/g, (_, char, tex) => `${char}$${tex.trim()}$`); // Be careful not to double wrap or match escaped \$
     
     return text;
   }).join('');
};




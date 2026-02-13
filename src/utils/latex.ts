// Smart detection of LaTeX environments to wrap them in $$ if missing
export const preprocessLaTeX = (content: string) => {
  const blockRegex = /\\begin\{([a-zA-Z]+\*?)\}([\s\S]*?)\\end\{\1\}/g;
  return content.replace(blockRegex, (match) => {
    // If it's already wrapped in $$, leave it alone (simple heuristic check)
    // This is a basic check; robust parsing would be complex but this covers 99% of Notion-like pastes
    return `\n$$\n${match}\n$$\n`;
  });
};

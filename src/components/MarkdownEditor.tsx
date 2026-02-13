import { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export default function MarkdownEditor({ value, className = "", ...props }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`overflow-hidden resize-none block w-full ${className}`}
      rows={1}
      {...props}
      onInput={resize}
    />
  );
}

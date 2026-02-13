import { useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownRenderer from "./MarkdownRenderer";
import { preprocessContent } from "../utils/latex";
import type { AccordionData } from "./Accordion/AccordionContainer";
import Mermaid from "./Mermaid";

interface Props {
  data: AccordionData;
  canEdit: boolean;
  onUpdate: (id: string, data: Partial<AccordionData>) => void;
  onDelete: (id: string) => void;
}

export default function ContentBlock({
  data,
  canEdit,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(data.answer === "");
  const [content, setContent] = useState(data.answer);

  const handleSave = () => {
    onUpdate(data.id, { answer: content });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="group relative p-sm rounded-xl hover:bg-notion-bg-hover transition-colors">
        <MarkdownEditor
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          autoFocus
          className="w-full p-sm border border-notion-border rounded-xl min-h-[120px] bg-notion-bg text-notion-text-DEFAULT focus:border-notion-text-DEFAULT outline-none"
        />
        <div className="flex gap-sm mt-sm">
          <button
            onClick={handleSave}
            className="px-lg py-xs bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity shadow-sm"
          >
            Save
          </button>
          <button
            onClick={() => {
              if (data.answer === "") onDelete(data.id); // Delete if cancelling on empty new item
              else {
                setContent(data.answer);
                setEditing(false);
              }
            }}
            className="px-lg py-xs bg-transparent text-notion-text-DEFAULT rounded-full border border-notion-border hover:bg-notion-bg-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Diagram specific view
  if (data.type === 'diagram') {
    return (
      <div className="group relative p-sm rounded-xl hover:bg-notion-bg-hover transition-colors">
        <Mermaid chart={preprocessContent(data.answer || "graph TD; A[Empty]")} />
        
        {canEdit && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-2 py-1 rounded bg-notion-bg border border-notion-border text-notion-text-secondary hover:text-notion-text-DEFAULT"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(data.id)}
              className="text-xs px-2 py-1 rounded bg-notion-bg border border-notion-border text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  // Markdown View (Text)
  return (
    <div className="group relative p-sm rounded-xl hover:bg-notion-bg-hover transition-colors">
      <div className="text-notion-text-DEFAULT">
        <MarkdownRenderer>{data.answer || 'Empty Note'}</MarkdownRenderer>
      </div>

      {canEdit && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-xs px-2 py-1 rounded bg-notion-bg border border-notion-border text-notion-text-secondary hover:text-notion-text-DEFAULT"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="text-xs px-2 py-1 rounded bg-notion-bg border border-notion-border text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

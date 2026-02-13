import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "../MarkdownRenderer";
import { useState } from "react";

interface Props {
  index: number;
  data: {
    id: string;
    question: string;
    answer: string;
  };
  expanded: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export default function AccordionItem({
  index,
  data,
  expanded,
  onToggle,
  canEdit,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(data.question === "" && data.answer === "");
  const [question, setQuestion] = useState(data.question);
  const [answer, setAnswer] = useState(data.answer);

  const formattedIndex = String(index + 1).padStart(2, "0");

  const handleSave = () => {
    onUpdate(data.id, { question, answer });
    setEditing(false);
  };

  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        expanded
          ? "border-notion-text-secondary bg-notion-bg-secondary"
          : "border-notion-border bg-notion-bg hover:bg-notion-bg-hover"
      }`}
    >
      <div
        className="flex items-center justify-between px-lg py-md cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-md">
          <span className="text-xl font-semibold text-notion-text-disabled">
            {formattedIndex}
          </span>
          <h3 className="text-lg font-medium text-notion-text-DEFAULT">
            {question}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-notion-text-secondary"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-lg pb-lg">
              {editing ? (
                <div className="space-y-sm">
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Question"
                    autoFocus
                    className="w-full p-sm border border-notion-border rounded-xl bg-notion-bg text-notion-text-DEFAULT focus:border-notion-text-DEFAULT outline-none"
                  />
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Answer (Markdown & LaTeX supported)"
                    className="w-full p-sm border border-notion-border rounded-xl min-h-[120px] bg-notion-bg text-notion-text-DEFAULT focus:border-notion-text-DEFAULT outline-none"
                  />
                  <div className="flex gap-sm">
                    <button
                      onClick={handleSave}
                      className="px-lg py-xs bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-lg py-xs bg-transparent text-notion-text-DEFAULT rounded-full border border-notion-border hover:bg-notion-bg-hover transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-notion-text-DEFAULT">
                  <MarkdownRenderer>{answer}</MarkdownRenderer>
                </div>
              )}

              {canEdit && !editing && (
                <div className="mt-md flex gap-md">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-notion-text-secondary hover:text-notion-text-DEFAULT"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(data.id)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

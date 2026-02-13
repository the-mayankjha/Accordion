import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AccordionItem from "./AccordionItem";
import ContentBlock from "../ContentBlock";

export type ItemType = 'accordion' | 'markdown' | 'diagram';

export interface AccordionData {
  id: string;
  type?: ItemType;
  question: string;
  answer: string;
}

interface Props {
  accordions: AccordionData[];
  canEdit: boolean;
  onUpdate: (id: string, data: Partial<AccordionData>) => void;
  onDelete: (id: string) => void;
}

export default function AccordionContainer({
  accordions,
  canEdit,
  onUpdate,
  onDelete,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-lg">
      <AnimatePresence>
        {accordions.map((item, index) => {
           if (item.type === 'markdown' || item.type === 'diagram') {
             return (
               <ContentBlock
                 key={item.id}
                 data={item}
                 canEdit={canEdit}
                 onUpdate={onUpdate}
                 onDelete={onDelete}
               />
             );
           }
           
           return (
            <AccordionItem
              key={item.id}
              index={index}
              data={item}
              expanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
              canEdit={canEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

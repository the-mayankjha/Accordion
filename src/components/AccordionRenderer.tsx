import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AccordionItem from "./Accordion/AccordionItem";
import ContentBlock from "./ContentBlock";
import type { AccordionData } from "../types";

interface Props {
  accordions: AccordionData[];
  canEdit: boolean;
  onUpdate: (id: string, data: Partial<AccordionData>) => void;
  onDelete: (id: string) => void;
}

export default function AccordionRenderer({
  accordions,
  canEdit,
  onUpdate,
  onDelete,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              expanded={expandedIds.has(item.id)}
              onToggle={() => toggleItem(item.id)}
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

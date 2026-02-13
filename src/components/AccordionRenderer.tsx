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

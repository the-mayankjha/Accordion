export type ItemType = 'accordion' | 'markdown' | 'diagram';

export interface AccordionData {
  id: string;
  type?: ItemType;
  question: string;
  answer: string;
}

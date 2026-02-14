export type ItemType = 'accordion' | 'markdown' | 'diagram';

export interface AccordionData {
  id: string;
  type?: ItemType;
  question: string;
  answer: string;
}
export interface Topic {
  id: string;
  title: string;
}

export interface Page {
  id: string;
  topicId: string;
  title: string;
  isFavorite?: boolean;
  lastVisited?: number;
  content: AccordionData[];
}

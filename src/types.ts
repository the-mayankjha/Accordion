export type ItemType = 'accordion' | 'markdown' | 'diagram';

export interface AccordionData {
  id: string;
  type?: ItemType;
  question: string;
  answer: string;
}

export interface Topic {
  id: string;
  user_id: string;
  title: string;
  emoji?: string;
  is_public: boolean;
  created_at: string;
}

export interface Page {
  id: string;
  topic_id?: string;
  user_id: string;
  title: string;
  content: AccordionData[];
  is_public: boolean;
  is_encrypted: boolean;
  isFavorite?: boolean; 
  created_at: string;
  updated_at: string;
}

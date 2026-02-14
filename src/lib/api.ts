import { supabase } from './supabase';
import type { Topic, Page, AccordionData } from '../types';

// Topics API

export const fetchTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createTopic = async (title: string, emoji?: string): Promise<Topic> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('topics')
    .insert([{ title, emoji, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTopic = async (id: string): Promise<void> => {
  const { error } = await supabase.from('topics').delete().eq('id', id);
  if (error) throw error;
};

// Pages API

export const fetchPages = async (topicId?: string): Promise<Page[]> => {
  let query = supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false });

  if (topicId) {
    query = query.eq('topic_id', topicId);
  } else {
    // If no topicId, maybe fetch orphans or all? 
    // For now, let's say fetch all and filter client side if needed, 
    // OR we can explicitly fetch pages without topics if topicId is null?
    // Let's assume we want ALL pages if topicId is undefined.
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const fetchPage = async (id: string): Promise<Page | null> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createPage = async (title: string, topicId?: string, content: AccordionData[] = []): Promise<Page> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('pages')
    .insert([{ 
      title, 
      topic_id: topicId, 
      user_id: user.id, 
      content 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePage = async (id: string, updates: Partial<Page>): Promise<Page> => {
  const { data, error } = await supabase
    .from('pages')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw error;
};

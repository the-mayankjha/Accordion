import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api';

// Topics Hooks

export const useTopics = () => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: api.fetchTopics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, emoji }: { title: string; emoji?: string }) => 
      api.createTopic(title, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};

// Pages Hooks

export const usePages = (topicId?: string) => {
  // If topicId is provided, we filter by it. 
  // Ideally, queryKey should include topicId if we are fetching specific lists.
  // However, for offline sync, fetching ALL pages and filtering client side might be better 
  // if the dataset is small. For now, let's treat queryKey as ['pages', topicId].
  return useQuery({
    queryKey: ['pages', topicId],
    queryFn: () => api.fetchPages(topicId),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePage = (id: string | null) => {
  return useQuery({
    queryKey: ['page', id],
    queryFn: () => (id ? api.fetchPage(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, topicId, content }: { title: string; topicId?: string; content?: any[] }) => 
      api.createPage(title, topicId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      // Also invalidate specific page query if we pre-set it?
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      api.updatePage(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.setQueryData(['page', data.id], data);
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

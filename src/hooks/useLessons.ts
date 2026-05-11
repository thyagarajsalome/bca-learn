import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Lesson } from '../types';

export function useLessons(moduleId?: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      let query = supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !moduleId || !!moduleId, // Always enabled, but can filter by moduleId
  });
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!lessonId,
  });
}
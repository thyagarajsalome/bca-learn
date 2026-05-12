import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Module, Lesson } from '../types';

export function useModules(options: { includeUnpublished?: boolean } = {}) {
  return useQuery({
    queryKey: ['modules', options.includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      // If not an admin/including unpublished, filter to published only
      if (!options.includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Module[];
    },
  });
}

export function useModuleWithLessons(moduleId: string) {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (moduleError) throw moduleError;

      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      return {
        module: module as Module,
        lessons: lessons as Lesson[],
      };
    },
    enabled: !!moduleId,
  });
}
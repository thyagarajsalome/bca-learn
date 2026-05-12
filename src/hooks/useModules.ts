import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Module, Lesson } from '../types';

// 1. Add searchQuery to your options interface
export function useModules(options: { includeUnpublished?: boolean; searchQuery?: string } = {}) {
  return useQuery({
    // 2. Add searchQuery to the queryKey so React Query knows to refetch when the search changes
    queryKey: ['modules', options.includeUnpublished, options.searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (!options.includeUnpublished) {
        query = query.eq('is_published', true);
      }

      // 3. Add the Supabase search filter (ilike is case-insensitive)
      if (options.searchQuery) {
        query = query.ilike('title', `%${options.searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Module[];
    },
  });
}

// ... keep useModuleWithLessons exactly as it is

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
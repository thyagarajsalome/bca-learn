import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Module, Lesson } from '../types';

export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

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
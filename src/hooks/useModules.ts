import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Module, Lesson } from '../types';

// 1. Define an interface for the hook options to include pagination parameters
interface UseModulesOptions {
  includeUnpublished?: boolean;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export function useModules(options: UseModulesOptions = {}) {
  // 2. Set default pagination values (page 1, 10 items per page)
  const { page = 1, pageSize = 10 } = options;

  return useQuery({
    // 3. Add page and pageSize to the queryKey so React Query refetches when they change
    queryKey: ['modules', options.includeUnpublished, options.searchQuery, page, pageSize],
    queryFn: async () => {
      // 4. Calculate the start and end indices for Supabase's range function
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('modules')
        .select('*', { count: 'exact' }) // 5. Request the exact count for pagination UI
        .order('order_index', { ascending: true })
        .range(from, to); // 6. Apply the limits at the database level

      if (!options.includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (options.searchQuery) {
        query = query.ilike('title', `%${options.searchQuery}%`);
      }

      // 7. Extract count alongside data and error
      const { data, error, count } = await query;
      if (error) throw error;
      
      // 8. Return a comprehensive pagination object instead of just the array
      return {
        data: data as Module[],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: count ? Math.ceil(count / pageSize) : 0,
      };
    },
    // Keep data fresh in cache for 5 minutes (300,000 ms)
    staleTime: 1000 * 60 * 5,
  });
}

// useModuleWithLessons remains untouched as requested
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
    // Keep data fresh in cache for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
}
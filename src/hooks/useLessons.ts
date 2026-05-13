import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Lesson } from '../types';

// 1. Define an interface for the hook options to include pagination parameters
interface UseLessonsOptions {
  moduleId?: string;
  page?: number;
  pageSize?: number;
}

export function useLessons(options: UseLessonsOptions = {}) {
  // 2. Extract options and set default pagination values (page 1, 10 items per page)
  const { moduleId, page = 1, pageSize = 10 } = options;

  return useQuery({
    // 3. Add page and pageSize to the queryKey so React Query refetches when they change
    queryKey: ['lessons', moduleId, page, pageSize],
    queryFn: async () => {
      // 4. Calculate the start and end indices for Supabase's range function
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('lessons')
        .select('*', { count: 'exact' }) // 5. Request the exact count for pagination UI
        .eq('is_published', true)
        .order('order_index', { ascending: true })
        .range(from, to); // 6. Apply the limits at the database level

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      // 7. Extract count alongside data and error
      const { data, error, count } = await query;

      if (error) throw error;
      
      // 8. Return a comprehensive pagination object instead of just the array
      return {
        data: data as Lesson[],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: count ? Math.ceil(count / pageSize) : 0,
      };
    },
    enabled: !moduleId || !!moduleId, // Always enabled, but can filter by moduleId
    // Keep data fresh in cache for 5 minutes (300,000 ms)
    staleTime: 1000 * 60 * 5,
  });
}

// useLesson remains untouched because fetching a single lesson doesn't need pagination
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
    // Keep data fresh in cache for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
}
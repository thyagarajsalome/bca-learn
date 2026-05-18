import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';

interface CourseState {
  courses: Course[];
  futureTopics: Course[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  futureTopics: [],
  loading: true,
  
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const bca = [];
        const future = [];

        data.forEach(c => {
          if (c.type === 'bca') bca.push(c);
          else if (c.type === 'future') future.push(c);
        });

        set({
          courses: bca,
          futureTopics: future,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ loading: false });
    }
  }
}));
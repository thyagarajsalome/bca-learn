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
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true }); // Structured order based on creation

    if (error) {
      console.error('Error fetching courses:', error);
      set({ loading: false });
      return;
    }

    if (data) {
      set({ 
        courses: data.filter(c => c.type === 'bca'),
        futureTopics: data.filter(c => c.type === 'future'),
        loading: false 
      });
    }
  }
}));
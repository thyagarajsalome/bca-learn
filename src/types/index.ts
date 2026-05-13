// src/types/index.ts

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  semester: number;
  order_index: number;
  is_published: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: 'markdown';
  content: string;
  order_index: number;
  duration_minutes: number;
  is_published: boolean;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  last_accessed: string;
  completed_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  semester: number;
  role?: 'student' | 'admin' | 'instructor';
}
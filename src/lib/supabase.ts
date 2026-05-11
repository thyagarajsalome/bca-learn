import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          semester: number | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          semester?: number | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          semester?: number | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };


   lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          type: 'markdown';
          content: string;
          order_index: number;
          duration_minutes: number | null;
          is_published: boolean;
          created_at: string;
        };


      Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          type?: 'markdown';
          content: string;
          order_index?: number;
          duration_minutes?: number | null;
          is_published?: boolean;
          created_at?: string;
        };

       Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          type?: 'markdown';
          content?: string;
          order_index?: number;
          duration_minutes?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
      };


      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: 'not_started' | 'in_progress' | 'completed';
          last_accessed: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: 'not_started' | 'in_progress' | 'completed';
          last_accessed?: string;
          completed_at?: string | null;
        };


        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          status?: 'not_started' | 'in_progress' | 'completed';
          last_accessed?: string;
          completed_at?: string | null;
        };
      };




      profiles: {
        Row: {
          id: string;
          name: string | null;
          avatar_url: string | null;
          semester: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          avatar_url?: string | null;
          semester?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          avatar_url?: string | null;
          semester?: number;
          created_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
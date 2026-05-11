import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
}

export const useAuth = create<AuthState>((set, get) => {
  // 1. Initialize the session once
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ user: session?.user ?? null });
    if (session?.user) {
      fetchProfile(session.user.id);
    } else {
      set({ loading: false });
    }
  });

  // 2. Set up ONE global auth listener
  supabase.auth.onAuthStateChange(async (_event, session) => {
    set({ user: session?.user ?? null });
    if (session?.user) {
      await fetchProfile(session.user.id);
    } else {
      set({ profile: null, loading: false });
    }
  });

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await createProfile(userId);
        } else {
          console.error('Error fetching profile:', error);
          set({ loading: false });
        }
        return;
      }
      set({ profile: data as Profile, loading: false });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false });
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({ id: userId, semester: 1 })
        .select()
        .single();

      if (error) throw error;
      set({ profile: data as Profile, loading: false });
    } catch (error) {
      console.error('Error creating profile:', error);
      set({ loading: false });
    }
  };

  return {
    user: null,
    profile: null,
    loading: true,

    signInWithEmail: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    signUpWithEmail: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { name } }
      });
      if (error) throw error;
      return data;
    },

    signInWithGoogle: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
      if (error) throw error;
      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    },

    updateProfile: async (updates) => {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data as Profile });
      return data;
    }
  };
});
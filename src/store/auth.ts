import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Subscription } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
  _authListener: Subscription | null;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  loading: true,
  _authListener: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),

  checkUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      let role = null;

      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        role = data?.role || 'student';
      }

      set({ user, role, loading: false });

      if (!get()._authListener) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const currentUser = session?.user ?? null;
          let currentRole = null;
          if (currentUser) {
            const { data } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single();
            currentRole = data?.role || 'student';
          }
          set({ user: currentUser, role: currentRole });
        });
        set({ _authListener: subscription });
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  }
}));

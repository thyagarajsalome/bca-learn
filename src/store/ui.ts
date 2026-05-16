import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UIState {
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  theme: 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    set({ theme: newTheme });
  },
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const theme = savedTheme || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  }
}));

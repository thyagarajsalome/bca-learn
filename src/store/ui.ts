import { create } from 'zustand';

interface UIState {
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open })
}));

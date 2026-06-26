import { create } from 'zustand';

type CursorMode = 'default' | 'view' | 'drag';

interface CursorState {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  mode: 'default',
  setMode: (mode) => set({ mode }),
}));

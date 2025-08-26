import { create } from 'zustand';

export type ColorScheme = 'light' | 'dark';
export type ThemeMode = ColorScheme | 'system';

/**
 * Theme override store
 *
 * - mode: 'system' uses the OS preference; otherwise force 'light' or 'dark'
 * - toggle(): cycles between forced light/dark (keeps 'system' -> 'dark' as a quick entry)
 */
type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
  toggle: () => {
    const { mode } = get();
    if (mode === 'system') return set({ mode: 'dark' });
    set({ mode: mode === 'light' ? 'dark' : 'light' });
  },
}));


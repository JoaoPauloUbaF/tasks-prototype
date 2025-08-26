import { useColorScheme as useRnColorScheme } from 'react-native';
import { useThemeStore } from '@/features/ui/themeStore';

export function useColorScheme() {
  const mode = useThemeStore((s) => s.mode);
  const rn = useRnColorScheme();
  if (mode === 'system') return rn as 'light' | 'dark' | null;
  return mode;
}

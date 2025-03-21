import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { 
  toggleTheme, 
  setThemeMode, 
  useSystemTheme as systemThemeAction,
  selectThemeMode,
  selectIsUserPreference,
} from '@store/slices';

import type { PaletteMode } from '@mui/material';

export const useThemeRedux = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);
  const isUserPreference = useAppSelector(selectIsUserPreference);

  // Toggle theme
  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // Set theme mode
  const handleSetThemeMode = useCallback(
    (newMode: PaletteMode) => {
      dispatch(setThemeMode(newMode));
    },
    [dispatch],
  );

  // Reset to system theme preference
  const handleUseSystemTheme = useCallback(() => {
    dispatch(systemThemeAction());
  }, [dispatch]);

  return {
    mode,
    isUserPreference,
    toggleTheme: handleToggleTheme,
    setThemeMode: handleSetThemeMode,
    useSystemTheme: handleUseSystemTheme,
  };
};

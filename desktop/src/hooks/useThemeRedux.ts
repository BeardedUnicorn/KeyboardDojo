import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme, setThemeMode, selectThemeMode } from '@store/slices';

import type { PaletteMode } from '@mui/material';

export const useThemeRedux = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);

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

  return {
    mode,
    toggleTheme: handleToggleTheme,
    setThemeMode: handleSetThemeMode,
  };
};

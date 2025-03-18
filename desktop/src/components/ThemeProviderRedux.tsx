import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo } from 'react';

import { useThemeRedux } from '../hooks/useThemeRedux';
import { createAppTheme } from '../theme';

import type { FC, ReactNode } from 'react';

interface ThemeProviderReduxProps {
  children: ReactNode;
}

export const ThemeProviderRedux: FC<ThemeProviderReduxProps> = ({ children }) => {
  const { mode, setThemeMode } = useThemeRedux();

  // Sync theme with system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setThemeMode(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setThemeMode]);

  // Create theme based on current mode
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

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

  // Sync theme with system preferences only if no user preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update theme based on system preference if user hasn't set a preference
      const userPreference = localStorage.getItem('theme-mode');
      if (!userPreference) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    // Set initial theme only if not already set
    // This avoids overriding user preference on component mount
    const userPreference = localStorage.getItem('theme-mode');
    if (!userPreference) {
      setThemeMode(mediaQuery.matches ? 'dark' : 'light');
    }

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

import { createTheme } from '@mui/material/styles';

import type { ThemeOptions, PaletteMode } from '@mui/material/styles';

// Define spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Define elevation constants
const ELEVATION = {
  low: '0 2px 4px rgba(0,0,0,0.1)',
  medium: '0 4px 8px rgba(0,0,0,0.15)',
  high: '0 8px 16px rgba(0,0,0,0.2)',
  focused: '0 0 0 3px rgba(25, 118, 210, 0.2)',
  hover: '0 6px 12px rgba(0,0,0,0.17)',
};

// Define animation constants
const TRANSITIONS = {
  quick: 'all 0.2s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease',
};

// Common theme settings
export const getThemeOptions = (mode: PaletteMode): ThemeOptions => {
  const isDark = mode === 'dark';
  
  return {
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#ffffff',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#ffffff',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#121212' : '#f5f5f5',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
        secondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
      },
    },
    spacing: SPACING.sm,
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        letterSpacing: '0.02em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            transition: TRANSITIONS.medium,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: `${SPACING.sm}px ${SPACING.md}px`,
            transition: TRANSITIONS.quick,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: ELEVATION.hover,
            },
          },
          contained: {
            boxShadow: ELEVATION.low,
            '&:hover': {
              boxShadow: ELEVATION.hover,
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: TRANSITIONS.medium,
            borderRadius: 12,
          },
          elevation1: {
            boxShadow: ELEVATION.low,
          },
          elevation2: {
            boxShadow: ELEVATION.medium,
          },
          elevation3: {
            boxShadow: ELEVATION.high,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: ELEVATION.low,
            transition: TRANSITIONS.quick,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: ELEVATION.hover,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            transition: TRANSITIONS.medium,
            borderRadius: 0,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: TRANSITIONS.quick,
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: isDark 
                ? 'rgba(25, 118, 210, 0.16)'
                : 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: isDark 
                  ? 'rgba(25, 118, 210, 0.24)'
                  : 'rgba(25, 118, 210, 0.12)',
              },
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: TRANSITIONS.quick,
              '&:hover': {
                boxShadow: ELEVATION.low,
              },
              '&.Mui-focused': {
                boxShadow: ELEVATION.focused,
              },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#424242' : '#616161',
            color: '#ffffff',
            fontSize: '0.75rem',
            padding: `${SPACING.xs}px ${SPACING.sm}px`,
            borderRadius: 4,
          },
          arrow: {
            color: isDark ? '#424242' : '#616161',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: TRANSITIONS.quick,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: ELEVATION.low,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: ELEVATION.low,
          },
          standardSuccess: {
            backgroundColor: isDark ? 'rgba(46, 125, 50, 0.15)' : 'rgba(76, 175, 80, 0.1)',
          },
          standardError: {
            backgroundColor: isDark ? 'rgba(211, 47, 47, 0.15)' : 'rgba(239, 83, 80, 0.1)',
          },
          standardWarning: {
            backgroundColor: isDark ? 'rgba(237, 108, 2, 0.15)' : 'rgba(255, 152, 0, 0.1)',
          },
          standardInfo: {
            backgroundColor: isDark ? 'rgba(2, 136, 209, 0.15)' : 'rgba(3, 169, 244, 0.1)',
          },
        },
      },
    },
  };
};

// Create and export the theme
export const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));

// Export spacing and elevation constants for use in components
export { SPACING, ELEVATION, TRANSITIONS };

// Export pre-configured themes
export const darkTheme = createAppTheme('dark');
export const lightTheme = createAppTheme('light'); 

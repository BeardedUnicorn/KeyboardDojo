import { createTheme } from '@mui/material/styles';

// Define color palette
const palette = {
  primary: {
    main: '#4169E1', // Royal Blue
    light: '#738FE5',
    dark: '#2A4CB9',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#8A2BE2', // Purple
    light: '#A555E9',
    dark: '#6A1CB0',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FF3D57', // Bright Red
    light: '#FF7A8A',
    dark: '#D32F2F',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FF9800', // Orange
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#ffffff',
  },
  info: {
    main: '#03A9F4', // Light Blue
    light: '#4FC3F7',
    dark: '#0288D1',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4CAF50', // Green
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#ffffff',
  },
  background: {
    default: '#F8F9FC', // Lighter background for tech theme
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Define shape
const shape = {
  borderRadius: 8,
};

// Define spacing
const spacing = 8;

// Define transitions with updated animation durations
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
    celebration: 800, // Added for celebration animations
    mascotTransition: 400, // Added for mascot animations
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Added for bouncy animations
  },
};

// Tech theme variations for different lesson tracks
export const techThemeVariations = {
  vscode: {
    primary: '#007ACC', // VS Code blue
    background: '#1E1E1E',
    text: '#FFFFFF',
  },
  intellij: {
    primary: '#FC801D', // IntelliJ orange
    background: '#2B2B2B',
    text: '#FFFFFF',
  },
  terminal: {
    primary: '#4CAF50', // Terminal green
    background: '#000000',
    text: '#FFFFFF',
  },
  web: {
    primary: '#FF5722', // Web orange
    background: '#FFFFFF',
    text: '#212121',
  },
};

// Create and export the theme
const AppTheme = createTheme({
  palette,
  shape,
  spacing,
  transitions,
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700, // Increased weight for headings
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
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600, // Increased weight for buttons
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          padding: `${spacing * 0.75}px ${spacing * 2}px`,
          transition: 'all 0.2s ease-in-out',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(63, 81, 181, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(63, 81, 181, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: shape.borderRadius,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: `${spacing * 2}px 0`,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          transition: 'background-color 0.2s ease-in-out',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 24,
            height: 24,
          },
          '& .MuiSwitch-track': {
            borderRadius: 13,
            opacity: 1,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: palette.grey[400],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: palette.grey[500],
          },
        },
      },
    },
  },
});

export default AppTheme; 
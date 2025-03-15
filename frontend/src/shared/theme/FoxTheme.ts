import { createTheme } from '@mui/material/styles';

// Define color palette
const palette = {
  primary: {
    main: '#3f51b5', // Indigo
    light: '#757de8',
    dark: '#002984',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f50057', // Pink
    light: '#ff5983',
    dark: '#bb002f',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f44336', // Red
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9800', // Orange
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#ffffff',
  },
  info: {
    main: '#2196f3', // Blue
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4caf50', // Green
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// Define typography
const typography = {
  fontFamily: [
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
  },
  body2: {
    fontSize: '0.875rem',
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};

// Define shape
const shape = {
  borderRadius: 8,
};

// Define spacing
const spacing = 8;

// Create and export the theme
const FoxTheme = createTheme({
  palette,
  typography,
  shape,
  spacing,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          padding: `${spacing * 0.75}px ${spacing * 2}px`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default FoxTheme; 
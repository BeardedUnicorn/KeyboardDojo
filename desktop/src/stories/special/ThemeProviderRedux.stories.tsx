import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, Button, Card, CardContent, CardActions, Divider } from '@mui/material';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Provider } from 'react-redux'; 
import { configureStore } from '@reduxjs/toolkit';

import { ThemeProviderRedux } from '../../components/ThemeProviderRedux';

// Define a local type for the ThemeProviderRedux props to avoid importing from the external module
type ThemeProviderReduxStoryProps = {
  children: React.ReactNode;
};

// Extend Window interface for our global property
declare global {
  interface Window {
    useThemeRedux: () => {
      theme: string;
      isDarkMode: boolean;
      toggleTheme: () => void;
      setTheme: (theme: string) => void;
    }
  }
}

// Create a simple mock reducer for the theme
const themeReducer = (state = { mode: 'light' }, action: { type: string; payload?: any }) => {
  if (action.type === 'theme/toggleTheme') {
    return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' };
  } else if (action.type === 'theme/setThemeMode') {
    return { ...state, mode: action.payload };
  }
  return state;
};

// Create a mock store that includes our theme reducer
const createMockStore = (initialTheme = 'light') => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      // Add other reducers as needed
      ui: (state = {}) => state,
      settings: (state = {}) => state,
    },
    preloadedState: {
      theme: { mode: initialTheme }
    }
  });
};

// Mock useThemeRedux hook to match the actual hook interface
const mockUseThemeReduxModule = {
  useThemeRedux: () => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    
    return {
      mode,
      toggleTheme: () => setMode(prevMode => prevMode === 'light' ? 'dark' : 'light'),
      setThemeMode: (newMode: 'light' | 'dark') => setMode(newMode)
    };
  }
};

// Replace the real hook with our mock in the component
jest.mock('../../hooks/useThemeRedux', () => mockUseThemeReduxModule);

// Make sure the mock is available when required
// @ts-ignore - Intentionally overriding module
window.require = (path: string) => {
  if (path === '@hooks/useThemeRedux') {
    return mockUseThemeReduxModule;
  }
  return {};
};

// Theme Demo Component to showcase theme features
const ThemeDemo = () => {
  // Use our hook directly from the mockUseThemeReduxModule to avoid require issues
  const { mode, toggleTheme } = mockUseThemeReduxModule.useThemeRedux();
  
  // Re-render on theme change event
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const handleThemeChange = () => forceUpdate();
    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);
  
  return (
    <Box sx={{ p: 3 }}>
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h4">
          Current Theme: {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={toggleTheme}
          startIcon={mode === 'light' ? <Brightness4Icon /> : <BrightnessHighIcon />}
        >
          Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Typography</Typography>
        <Typography variant="h1">h1. Heading</Typography>
        <Typography variant="h2">h2. Heading</Typography>
        <Typography variant="h3">h3. Heading</Typography>
        <Typography variant="h4">h4. Heading</Typography>
        <Typography variant="h5">h5. Heading</Typography>
        <Typography variant="h6">h6. Heading</Typography>
        <Typography variant="subtitle1">subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
        <Typography variant="subtitle2">subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
        <Typography variant="body1">body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
        <Typography variant="body2">body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Buttons</Typography>
        <Box sx={{ '& > button': { m: 1 } }}>
          <Button variant="text">Text</Button>
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="error">Error</Button>
          <Button color="info">Info</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button disabled>Disabled</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Cards</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Card sx={{ maxWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Light/Dark Card
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Automatically adapts to theme
              </Typography>
              <Typography variant="body2">
                This card will adapt its colors based on whether the theme is in light or dark mode.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
          
          <Paper elevation={3} sx={{ p: 3, maxWidth: 275 }}>
            <Typography variant="h5" component="div">
              Paper Component
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Surface component
            </Typography>
            <Typography variant="body2">
              Paper provides a surface for displaying content, with elevation and shadow.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

// Redux Provider Wrapper
const ReduxWrapper: React.FC<{ children: React.ReactNode; initialTheme?: 'light' | 'dark' }> = ({ 
  children, 
  initialTheme = 'light' 
}) => {
  const store = React.useMemo(() => createMockStore(initialTheme), [initialTheme]);
  
  return (
    <Provider store={store}>
      <ThemeProviderRedux>{children}</ThemeProviderRedux>
    </Provider>
  );
};

// Using a more generic type for the meta to avoid type issues
const meta = {
  title: 'Special/ThemeProviderRedux',
  component: ReduxWrapper,
  parameters: {
    layout: 'fullscreen',
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        component: 'A component that provides theme functionality and synchronizes with Redux state.'
      }
    }
  },
  tags: ['autodocs'],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  parameters: {
    theme: 'light',
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        story: 'The application with the light theme applied.'
      }
    }
  },
  args: {
    initialTheme: 'light',
    children: <ThemeDemo />
  }
};

export const DarkMode: Story = {
  parameters: {
    theme: 'dark',
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        story: 'The application with the dark theme applied.'
      }
    }
  },
  args: {
    initialTheme: 'dark',
    children: <ThemeDemo />
  }
};

export const ThemeSwitcher: Story = {
  args: {
    children: <ThemeDemo />
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        story: 'Interactive theme switcher that allows toggling between light and dark mode.'
      }
    }
  }
};

export const UsageDocumentation: Story = {
  render: () => {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Theme Provider Documentation
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Overview
        </Typography>
        <Typography variant="body1" paragraph>
          The ThemeProviderRedux component creates and manages the application theme based on the current mode stored in Redux state.
          It handles initialization, theme switching, and syncing with system preferences.
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Features
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            Redux integration for theme state management
          </Typography>
          <Typography component="li" variant="body1">
            Automatic syncing with system preferences
          </Typography>
          <Typography component="li" variant="body1">
            Support for light and dark mode
          </Typography>
          <Typography component="li" variant="body1">
            Proper context propagation to all child components
          </Typography>
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Usage
        </Typography>
        <Box component="pre" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, overflowX: 'auto' }}>
          {`
### Using the ThemeProviderRedux Component

The \`ThemeProviderRedux\` component manages the application's theme, synchronizing with Redux state and providing theme-aware styling to all child components.

#### Basic Usage

Wrap your application with the ThemeProviderRedux to enable theme functionality:

\`\`\`jsx
import { ThemeProviderRedux } from './components/ThemeProviderRedux';

function App() {
  return (
    <ThemeProviderRedux>
      <YourApp />
    </ThemeProviderRedux>
  );
}
\`\`\`

#### Changing the Theme

To change the theme programmatically, use the useThemeRedux hook:

\`\`\`jsx
import { useThemeRedux } from './hooks/useThemeRedux';

function ThemeSwitcher() {
  const { mode, toggleTheme, setThemeMode } = useThemeRedux();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setThemeMode('light')}>Light Mode</button>
      <button onClick={() => setThemeMode('dark')}>Dark Mode</button>
    </div>
  );
}
\`\`\`
          `}
        </Box>
      </Box>
    );
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        story: 'Documentation and usage examples for the ThemeProviderRedux component.'
      }
    }
  }
}; 
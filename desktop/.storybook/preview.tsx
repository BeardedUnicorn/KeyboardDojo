import React from 'react';
import type { Preview } from '@storybook/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { createAppTheme } from '../src/theme';
import { StorybookMocksWrapper } from './preview-mocks';
// Import the centralized mock store configuration
import createMockStore, { createBeginnerStore, createIntermediateStore, createAdvancedStore, createLoadingStore, createErrorStore } from './store';
import '../src/index.css';

// Extend Window interface to add custom properties
declare global {
  interface Window {
    services?: any;
    jest?: any;
    useGamificationRedux?: () => any;
    useXP?: () => any;
    useCurrency?: () => any;
    useThemeContext?: () => any;
    useSubscriptionRedux?: () => any;
    useUserProgressRedux?: () => any;
    useAchievementsRedux?: () => any;
    useStoreRedux?: () => any;
    MOCKED_SERVICES?: any;
  }
}

// Create theme for stories
const theme = createAppTheme('light');

// Create the default store once to avoid recreating it on each render
const defaultStore = createMockStore();

// Simple wrapper component to reduce nesting and potential performance issues
const CombinedProviders = ({ children, storeName = 'default' }) => {
  // Get the correct store based on the storeName parameter
  const getStore = () => {
    switch (storeName) {
      case 'beginner':
        return createBeginnerStore();
      case 'intermediate':
        return createIntermediateStore();
      case 'advanced':
        return createAdvancedStore();
      case 'loading':
        return createLoadingStore();
      case 'error':
        return createErrorStore();
      default:
        return defaultStore;
    }
  };

  const store = getStore();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <StorybookMocksWrapper>
            {children}
          </StorybookMocksWrapper>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

// Memoize the combined provider to prevent unnecessary re-renders
const MemoizedProviders = React.memo(CombinedProviders);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#fafafa' },
        { name: 'dark', value: '#121212' },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobile2: {
          name: 'Large Mobile',
          styles: {
            width: '414px',
            height: '896px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        laptop: {
          name: 'Laptop',
          styles: {
            width: '1366px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },
  // Global decorators to wrap all stories
  decorators: [
    (Story, context) => {
      // Get the storeName from story parameters, default to 'default'
      const storeName = context.parameters.storeName || 'default';
      
      return (
        <MemoizedProviders storeName={storeName}>
          <Story />
        </MemoizedProviders>
      );
    },
  ],
};

// Mock any components that might be missing in tests
if (typeof window !== 'undefined') {
  // Mock LoadingIcon if not available
  window.MOCK_LOADING_ICON = ({ size = 24 }) => {
    return React.createElement('div', { 
      style: { 
        width: size, 
        height: size, 
        borderRadius: '50%',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        animation: 'spin 1s linear infinite',
      } 
    });
  };
}

export default preview; 
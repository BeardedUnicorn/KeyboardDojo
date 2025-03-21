import type { Preview } from '@storybook/react'
import './preview-mocks' // Import the mocks to ensure they are set up

/**
 * Set up all required hooks and context for stories
 */
const setupGlobalMocks = () => {
  // If window is defined, make sure our hooks are attached
  if (typeof window !== 'undefined') {
    // Ensure UI theme data is always available
    if (!window.ui) {
      (window as any).ui = { 
        mode: 'light', 
        theme: 'light', 
        sidebar: { open: true } 
      };
    }
    
    // Make sure theme context is available (this fixes MainLayout & AppTopBar)
    if (!window.useThemeContext) {
      (window as any).useThemeContext = () => ({
        isDarkMode: false,
        toggleTheme: () => {},
        mode: 'light',
        theme: {
          palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: { default: '#fff', paper: '#fff' },
            text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' }
          }
        }
      });
    }
    
    // Set up gamification data with currentStreak for XP and other components
    if (!window.gamification) {
      (window as any).gamification = {
        level: 5,
        xp: 1250,
        totalXp: 2500,
        nextLevelXP: 2500,
        xpForNextLevel: 1000,
        currency: 500,
        balance: 500,
        achievements: [
          {
            id: 'first_lesson',
            title: 'First Lesson',
            description: 'Complete your first lesson',
            completed: true,
            progress: 1,
            totalRequired: 1
          }
        ],
        currentStreak: 7,
        maxStreak: 10,
        hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
        streakDays: [true, true, true, true, true, false, false],
        streakFreeze: true,
        currentTier: 'SILVER',
        isLoading: false
      };
    }
    
    // Ensure gamification redux always has currentStreak
    if (!window.useGamificationRedux) {
      (window as any).useGamificationRedux = () => ({
        gamification: (window as any).gamification || {
          level: 5,
          xp: 1250,
          totalXp: 2500,
          currency: 500,
          balance: 500, 
          currentStreak: 7,
          maxStreak: 10,
          isLoading: false
        },
        actions: {
          fetchGamificationData: () => {},
          purchaseItem: () => Promise.resolve(true),
          useItem: () => Promise.resolve(true)
        }
      });
    }
    
    // Make router context available (this fixes 'basename' errors)
    (window as any).__inRouterContext = true;
    (window as any).__hasRouterContext = true;
    
    // Add a complete React Router location
    (window as any).__STORYBOOK_ROUTER_LOCATION = {
      pathname: '/',
      search: '',
      hash: '',
      state: null
    };
    
    // Create full React Router context data
    (window as any).__REACT_ROUTER_CONTEXT = {
      basename: '',
      navigator: {
        createHref: (to: any) => typeof to === 'string' ? to : to.pathname || '/',
        push: () => {},
        replace: () => {},
        go: () => {},
        listen: () => () => {},
        block: () => () => {}
      },
      static: false,
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default'
      }
    };
    
    console.log('Storybook global mocks initialized in preview.');
  }
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  loaders: [
    // Ensure mocks are set up before each story loads
    async () => {
      // Initialize our mocks
      setupGlobalMocks();
      
      try {
        // Try to load original mocks
        const { setupStoryMocks } = await import('./preview-mocks');
        if (typeof setupStoryMocks === 'function') {
          setupStoryMocks();
          console.log('Storybook preview-mocks initialized in loader.');
        }
      } catch (e) {
        console.warn('Could not load preview-mocks:', e);
      }
      
      return {};
    },
  ],
}

export default preview
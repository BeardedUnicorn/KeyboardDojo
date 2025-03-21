/**
 * Common test setup for Storybook stories
 *
 * This file provides comprehensive wrappers and mock data for all stories
 * to ensure that they render correctly with all required contexts.
 */
import React from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createAppTheme } from '../theme';

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    services: any;
    MOCKED_SERVICES: any;
    __hookMocks: any;
    ui?: {
      theme: string;
      mode: string;
      sidebar: { open: boolean };
    };
    gamification?: any;
    achievements?: any[];
    useGamificationRedux: () => any;
    useXP: () => any;
    useCurrency: () => any;
    useThemeContext: () => any;
    useSubscriptionRedux: () => any;
    useUserProgressRedux: () => any;
    useAchievementsRedux: () => any;
    useStoreRedux: () => any;
    useStreak: () => any;
    useLocation?: () => any;
    useNavigate?: () => any;
    setupGlobalMocks?: () => void;
    require?: (path: string) => any;
    __inRouterContext?: boolean;
    __hasRouterContext?: boolean;
    __STORYBOOK_ROUTER_LOCATION?: {
      pathname: string;
      search: string;
      hash: string;
      state: null;
    };
    __FIXED_REACT_ROUTER_ISSUES?: boolean;
    __REACT_ROUTER_CONTEXT?: any;
  }
}

// Create a theme instance for tests
const theme = createAppTheme('light');

// Mock achievements for consistent data
const mockAchievements = [
  {
    id: 'first_lesson',
    title: 'First Lesson',
    name: 'First Lesson',
    description: 'Complete your first lesson',
    completed: true,
    progress: 1,
    totalRequired: 1,
    total: 1,
    type: 'achievement',
    rarity: 'common',
    category: 'lessons',
    icon: 'school',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'shortcut_master',
    title: 'Shortcut Master',
    name: 'Shortcut Master',
    description: 'Learn 50 shortcuts',
    completed: false,
    progress: 25,
    totalRequired: 50,
    total: 50,
    type: 'achievement',
    rarity: 'rare',
    category: 'shortcuts',
    icon: 'keyboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'streak_3',
    name: 'Streaker',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    rarity: 'common',
    icon: 'streak',
    progress: 100,
    total: 100,
    completed: true,
    unlockedAt: '2023-12-05',
  },
  {
    id: 'exercise_20',
    name: 'Exercise Enthusiast',
    description: 'Complete 20 exercises',
    category: 'exercises',
    rarity: 'rare',
    icon: 'exercise',
    progress: 12,
    total: 20,
    completed: false,
  },
];

// Complete mock user data with all required fields
const mockUserData = {
  isAuthenticated: true,
  username: 'Test User',
  email: 'test@example.com',
  avatar: 'https://mui.com/static/images/avatar/1.jpg',
  currentStreak: 7,
  maxStreak: 10,
  lastActiveDate: new Date().toISOString(),
  level: 5,
  xp: 1250,
  totalLessonsCompleted: 48,
  streak: 7,
};

// Mock user gamification data
const mockGamificationData = {
  level: 5,
  xp: 1250,
  totalXp: 2500,
  nextLevelXP: 2500,
  xpForNextLevel: 1000,
  currency: 500,
  hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
  streakDays: [true, true, true, true, true, false, false],
  streakFreeze: true,
  currentTier: 'SILVER',
  isLoading: false,
  achievements: mockAchievements,
  items: [
    { id: 'streak_freeze', name: 'Streak Freeze', quantity: 2, type: 'boost' },
    { id: 'double_xp', name: 'Double XP', quantity: 1, type: 'boost' },
  ],
  balance: 500,
  currentStreak: 7,
  maxStreak: 10,
  progress: 0.75,
  getXP: () => 1250,
  getLevelProgress: () => 0.75,
  // Methods to prevent undefined errors
  addCurrency: () => {},
  spendCurrency: () => true,
  hasItem: () => true,
  getItemQuantity: () => 2,
};

// Create a mock Redux store with all necessary state - only once
const defaultState = {
  user: {
    data: mockUserData,
    loading: false,
    error: null,
  },
  userProgress: {
    level: 5,
    xp: 1250,
    totalLessonsCompleted: 48,
    streak: 7,
    lastActive: new Date().toISOString(),
  },
  gamification: mockGamificationData,
  ui: {
    theme: 'light',
    sidebar: { open: true },
    mode: 'light',
  },
  settings: {
    theme: 'light',
    mode: 'light',
  },
  subscription: {
    hasPremium: true,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    currentTier: 'SILVER',
  },
};

// Create the store just once for efficiency
const createMockStore = () => {
  return configureStore({
    reducer: (state = defaultState) => state,
    // Include middleware to avoid the state mutation warning
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
  });
};

// Create a default store to reuse
const defaultStore = createMockStore();

// Create a full theme context value
const themeContextValue = {
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
};

// Create a full router context for use with useContext
const routerContextValue = {
  basename: '',
  navigator: {
    createHref: (to: any) => typeof to === 'string' ? to : (to?.pathname || '/'),
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

// Ensure global hooks and services are setup
const setupGlobalMocks = () => {
  if (typeof window !== 'undefined') {
    // Set up ui object first to avoid theme errors
    window.ui = { 
      theme: 'light', 
      mode: 'light', 
      sidebar: { open: true } 
    };

    // Basic services
    window.services = {
      // User services
      getUserData: () => mockUserData,
      getStreakData: () => ({ current: 7, max: 10, lastActiveDate: new Date().toISOString() }),
      getCurrentStreak: () => 7,
      getMaxStreak: () => 10,

      // Gamification services
      getHeartsData: () => ({ current: 5, max: 5, refillTime: Date.now() + 3600000 }),
      getCurrencyData: () => ({
        balance: 500,
        inventory: {
          streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
          heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
          xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
        },
        activeBoosts: {},
      }),
      getBalance: () => 500,
      getXPData: () => ({ level: 5, xp: 1250, nextLevelXP: 2500, progress: 0.5 }),
      hasItem: () => true,
      getItemQuantity: () => 2,
      getAchievements: () => mockAchievements,
      getAchievementsData: () => mockAchievements,
      getTheme: () => 'light',
      getThemeData: () => ({ mode: 'light', isDarkMode: false }),
    };

    // Make mocked services accessible globally
    window.MOCKED_SERVICES = window.services;

    // IMPORTANT: Store achievements globally
    window.achievements = mockAchievements;

    // IMPORTANT: Set up hook mocks directly on window for immediate access
    // 1. Gamification hook - most critical
    window.useGamificationRedux = () => ({
      gamification: {
        ...mockGamificationData,
        currentStreak: 7,
        achievements: mockAchievements,
        progress: 0.75,
      },
      actions: {
        fetchGamificationData: () => {},
        purchaseItem: () => Promise.resolve(true),
        useItem: () => Promise.resolve(true),
      }
    });

    // 2. Theme hook - critical for MainLayout and AppTopBar
    window.useThemeContext = () => themeContextValue;

    // 3. Specific gamification hooks
    window.useXP = () => ({
      level: 5,
      xp: 1250,
      nextLevelXP: 2500,
      progress: 0.5,
      isLoading: false,
    });

    window.useCurrency = () => ({
      balance: 500,
      addCurrency: () => {},
      spendCurrency: () => true,
      isLoading: false,
    });

    window.useStreak = () => ({
      currentStreak: 7,
      maxStreak: 10,
      lastActiveDate: new Date().toISOString(),
      isLoading: false,
    });

    // 4. Other utility hooks
    window.useSubscriptionRedux = () => ({
      hasPremium: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentTier: 'SILVER',
      isLoading: false,
    });

    window.useUserProgressRedux = () => ({
      level: 5,
      xp: 1250,
      totalLessonsCompleted: 48,
      streak: 7,
      lastActive: new Date().toISOString(),
      isLoading: false,
    });

    window.useAchievementsRedux = () => ({
      achievements: mockAchievements,
      isLoading: false,
      filteredAchievements: mockAchievements,
      filterByCategory: () => mockAchievements,
      filterByRarity: () => mockAchievements,
      showHidden: true,
    });

    window.useStoreRedux = () => ({
      items: [
        { id: 'streak_freeze', name: 'Streak Freeze', price: 100, description: 'Preserves your streak for one day of inactivity', type: 'boost', icon: 'freeze' },
        { id: 'heart_refill', name: 'Heart Refill', price: 50, description: 'Refill all your hearts immediately', type: 'boost', icon: 'heart' },
        { id: 'xp_boost', name: 'XP Boost', price: 75, description: 'Double XP for the next lesson', type: 'boost', icon: 'xp' },
      ],
      ownedItems: mockGamificationData.items,
      inventory: {
        streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
        heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
        xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
      },
      activeBoosts: {},
      isLoading: false,
    });

    // 5. Navigation hooks
    window.useLocation = () => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' });
    window.useNavigate = () => () => {};

    // Set up __hookMocks for components that use this pattern
    window.__hookMocks = {
      useGamificationRedux: window.useGamificationRedux,
      useXP: window.useXP,
      useCurrency: window.useCurrency,
      useThemeContext: window.useThemeContext,
      useSubscriptionRedux: window.useSubscriptionRedux,
      useUserProgressRedux: window.useUserProgressRedux,
      useAchievementsRedux: window.useAchievementsRedux,
      useStoreRedux: window.useStoreRedux,
      useStreak: window.useStreak,
      useLocation: window.useLocation,
      useNavigate: window.useNavigate,
    };
    
    // Set up gamification object with all needed properties
    window.gamification = {
      ...mockGamificationData,
      currentStreak: 7,
      achievements: mockAchievements,
      progress: 0.75,
    };
    
    // Set up React Router flags
    window.__inRouterContext = true;
    window.__hasRouterContext = true;
    window.__STORYBOOK_ROUTER_LOCATION = {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    };
    
    // Create the router context
    window.__REACT_ROUTER_CONTEXT = routerContextValue;
  }
};

// Run setup once
setupGlobalMocks();

// Component to set up global mocks and patch React.useContext for all components
const GlobalMockSetup = () => {
  React.useEffect(() => {
    // Ensure mocks are set up when component mounts
    setupGlobalMocks();
    
    // Patch React's useContext to handle all types of contexts
    if (typeof React !== 'undefined' && !window.__FIXED_REACT_ROUTER_ISSUES) {
      try {
        // Store original useContext
        const originalUseContext = React.useContext;
        
        // Set up context mapping
        const contextObjects: Record<string, any> = {
          Router: window.__REACT_ROUTER_CONTEXT,
          LocationContext: window.__REACT_ROUTER_CONTEXT,
          NavigationContext: window.__REACT_ROUTER_CONTEXT,
          RouteContext: window.__REACT_ROUTER_CONTEXT,
          ThemeContext: themeContextValue,
        };
        
        // Patch React's useContext
        React.useContext = function patchedUseContext(context) {
          // Handle null/undefined context
          if (!context) {
            console.warn('useContext called with null/undefined context');
            return null;
          }
          
          // Check if this is a known context type
          if (context && typeof context === 'object') {
            const displayName = context.displayName || '';
            
            // Handle known contexts
            if (contextObjects[displayName]) {
              return contextObjects[displayName];
            }
          }
          
          // Fall back to original implementation
          try {
            return originalUseContext(context);
          } catch (error) {
            console.warn('Error in original useContext, returning fallback', error);
            return {}; // Safe fallback
          }
        };
        
        window.__FIXED_REACT_ROUTER_ISSUES = true;
        console.log('React.useContext patched by GlobalMockSetup');
      } catch (error) {
        console.error('Failed to patch React.useContext:', error);
      }
    }
    
    return () => {
      // Cleanup logic
    };
  }, []);
  
  return null;
};

// Detect if we're inside a router context already to avoid nesting errors
const RouterSafeWrapper = ({ children, initialRoute = '/' }: { children: ReactNode; initialRoute?: string }) => {
  // Check for global flags first 
  if (typeof window !== 'undefined' && window.__hasRouterContext) {
    console.log('[RouterSafeWrapper] Using existing router context (via __hasRouterContext)');
    
    // Create the memory router for more reliable routing
    const routes = [
      {
        path: '*',
        element: <>{children}</>,
      },
    ];
    
    const router = createMemoryRouter(routes, {
      initialEntries: [initialRoute],
      initialIndex: 0,
    });
    
    return (
      <>
        <GlobalMockSetup />
        {children}
      </>
    );
  }

  // Use a memory router with the specified initial route
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <GlobalMockSetup />
      {children}
    </MemoryRouter>
  );
};

interface TestWrapperProps {
  children: ReactNode;
  store?: any;
  initialRoute?: string;
  useRouter?: boolean;
}

// Comprehensive test wrapper with all necessary providers
export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  store = defaultStore,
  initialRoute = '/',
  useRouter = true,
}) => {
  // Create a theme context
  const themeContext = React.createContext(themeContextValue);
  themeContext.displayName = 'ThemeContext';
  
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalMockSetup />
        {useRouter ? (
          <RouterSafeWrapper initialRoute={initialRoute}>
            {children}
          </RouterSafeWrapper>
        ) : (
          children
        )}
      </ThemeProvider>
    </Provider>
  );
};

export const RouterWrapper: React.FC<{ children: ReactNode; initialRoute?: string }> = ({
  children,
  initialRoute = '/',
}) => (
  <RouterSafeWrapper initialRoute={initialRoute}>
    {children}
  </RouterSafeWrapper>
);

export const ReduxWrapper: React.FC<{ children: ReactNode; store?: any }> = ({
  children,
  store = defaultStore,
}) => (
  <Provider store={store}>
    {children}
  </Provider>
);

// Export mock data and functions for direct use in stories
export {
  mockUserData,
  mockGamificationData,
  mockAchievements,
  createMockStore,
  defaultStore,
  themeContextValue,
  routerContextValue,
};

// Export a function to create custom mock data
export function createMockGameData(overrides = {}) {
  return {
    ...mockGamificationData,
    ...overrides,
    achievements: mockAchievements,
  };
}

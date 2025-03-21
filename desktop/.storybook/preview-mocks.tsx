/**
 * Storybook mocks for hooks and services
 * This file provides mocks needed for component testing
 */
import React, { createContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Define types for our hooks
export type GamificationData = {
  balance: number;
  level: number;
  xp: number;
  totalXp: number;
  xpForNextLevel: number;
  achievements: any[];
  currency: number;
  getXP?: () => number;
  getLevelProgress?: () => number;
  currentTier: string;
  isLoading: boolean;
  hearts: {
    current: number;
    max: number;
    refillTime: number;
  };
  currentStreak: number;
  maxStreak: number;
  streakDays: number;
  streakFreeze: boolean;
};

type XPData = {
  level: number;
  xp: number;
  nextLevelXP: number;
  progress: number;
  isLoading: boolean;
};

type CurrencyData = {
  balance: number;
  addCurrency: (amount: number) => void;
  spendCurrency: (amount: number) => boolean;
  isLoading: boolean;
};

// Define the hook context type
type HookContextType = {
  useGamificationRedux: () => GamificationData;
  useXP: () => XPData;
  useCurrency: () => CurrencyData;
};

// Define window interface to add our custom properties
interface ExtendedWindow extends Window {
  useGamificationRedux?: () => any;
  useXP?: () => any;
  useCurrency?: () => any;
  useThemeContext?: () => any;
  useSubscriptionRedux?: () => any;
  useUserProgressRedux?: () => any;
  useAchievementsRedux?: () => any;
  useStoreRedux?: () => any;
  __mocks?: {
    hooks?: {
      useGamificationRedux?: () => any;
      useXP?: () => any;
      useCurrency?: () => any;
      useThemeContext?: () => any;
      useSubscriptionRedux?: () => any;
      useUserProgressRedux?: () => any;
      useAchievementsRedux?: () => any;
      useStoreRedux?: () => any;
      [key: string]: any;
    };
    services?: any;
  };
  services?: any;
  __hooksMocksInitialized?: boolean;
  __hookMocks?: any;
}

// Extend Window interface for our hook mocks
declare global {
  interface Window {
    __hookMocks?: any;
  }
}

// Create a mock Redux store
const createMockStore = (initialState = {}) => {
  // Mock reducer that returns the state
  const mockReducer = (state = initialState, action: any) => {
    // Handle some basic actions if needed
    if (action.type === 'UPDATE_STATE') {
      return { ...state, ...action.payload };
    }
    return state;
  };

  // Create a store with the mock reducer
  return configureStore({
    reducer: mockReducer,
    preloadedState: initialState,
  });
};

// Create mock achievements - declare only once and export it
export const mockAchievementsList = [
  {
    id: 'first_lesson',
    title: 'First Lesson',
    description: 'Complete your first lesson',
    completed: true,
    progress: 1,
    totalRequired: 1,
    type: 'achievement',
    rarity: 'common',
    category: 'lessons',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'shortcut_master',
    title: 'Shortcut Master',
    description: 'Learn 50 shortcuts',
    completed: false,
    progress: 25,
    totalRequired: 50,
    type: 'achievement',
    rarity: 'rare',
    category: 'shortcuts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Default mock state
const defaultState = {
  user: {
    isAuthenticated: true,
    username: 'TestUser',
    email: 'testuser@example.com',
    preferences: {
      theme: 'light',
      notifications: true,
    },
    currentStreak: 7,
    maxStreak: 10,
  },
  gamification: {
    level: 5,
    xp: 1250,
    totalXp: 2500,
    xpForNextLevel: 1000,
    achievements: mockAchievementsList,
    currency: 100,
    balance: 1250, // Adding for useGamificationRedux
    currentTier: 'SILVER',
    isLoading: false,
    hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
    currentStreak: 7,
    maxStreak: 10,
    streakDays: 7,
    streakFreeze: true,
  },
  app: {
    isMenuOpen: false,
    currentPath: '/',
    notifications: [],
  },
  ui: {
    theme: 'light',
    sidebar: {
      open: true,
    },
    mode: 'light'
  },
  achievements: {
    achievements: mockAchievementsList,
    isLoading: false
  },
  userProgress: {
    currentStreak: 7,
    maxStreak: 10,
    level: 5,
    xp: 1250
  }
};

// Redux Provider with mock store
export const ReduxProvider = ({ 
  children, 
  initialState = defaultState 
}: { 
  children: React.ReactNode;
  initialState?: Record<string, any>;
}) => {
  const store = createMockStore(initialState);
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

// Create default hook implementations
const defaultHooks: HookContextType = {
  useGamificationRedux: () => ({
    balance: 1250,
    level: 5,
    xp: 1250,
    totalXp: 2500,
    xpForNextLevel: 1000,
    achievements: mockAchievementsList,
    currency: 100,
    getXP: () => 1250,
    getLevelProgress: () => 75,
    currentTier: 'SILVER',
    isLoading: false,
    hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
    currentStreak: 7,
    maxStreak: 10,
    streakDays: 7,
    streakFreeze: true,
  }),
  useXP: () => ({
    level: 5,
    xp: 1250,
    nextLevelXP: 2500,
    progress: 0.5,
    isLoading: false,
  }),
  useCurrency: () => ({
    balance: 1250,
    addCurrency: () => {},
    spendCurrency: () => true,
    isLoading: false,
  }),
};

// Create a global mock context for hooks
export const HookContext = createContext<HookContextType>(defaultHooks);

// Hook Provider wrapper
export const HookProvider = ({ 
  children,
  hookOverrides = {},
}: { 
  children: React.ReactNode;
  hookOverrides?: Partial<HookContextType>;
}) => {
  // Merge default hooks with any overrides
  const hookValues = {
    ...defaultHooks,
    ...hookOverrides,
  };
  
  return (
    <HookContext.Provider value={hookValues}>
      {children}
    </HookContext.Provider>
  );
};

// Helper to set up global hook mocking
export const setupHookMocks = () => {
  if (typeof window !== 'undefined') {
    const win = window as ExtendedWindow;
    
    // Set up global hook mocks
    win.useGamificationRedux = defaultHooks.useGamificationRedux;
    win.useXP = defaultHooks.useXP;
    win.useCurrency = defaultHooks.useCurrency;
    
    // Set up additional hooks
    win.useThemeContext = () => ({
      isDarkMode: false,
      toggleTheme: () => {},
      mode: 'light',
    });
    
    win.useAchievementsRedux = () => ({
      achievements: mockAchievementsList,
      isLoading: false,
      filteredAchievements: mockAchievementsList,
      filterByCategory: () => mockAchievementsList,
      filterByRarity: () => mockAchievementsList,
      showHidden: true,
    });
    
    win.useUserProgressRedux = () => ({
      level: 5,
      xp: 1250,
      totalLessonsCompleted: 48,
      streak: 7,
      lastActive: new Date().toISOString(),
      isLoading: false,
    });
    
    win.useSubscriptionRedux = () => ({
      hasPremium: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentTier: 'SILVER',
      isLoading: false,
    });
    
    win.useStoreRedux = () => ({
      items: [
        { id: 'streak_freeze', name: 'Streak Freeze', price: 100, description: 'Preserves your streak for one day of inactivity', type: 'boost', icon: 'freeze' },
        { id: 'heart_refill', name: 'Heart Refill', price: 50, description: 'Refill all your hearts immediately', type: 'boost', icon: 'heart' },
        { id: 'xp_boost', name: 'XP Boost', price: 75, description: 'Double XP for the next lesson', type: 'boost', icon: 'xp' },
      ],
      ownedItems: [
        { id: 'streak_freeze', name: 'Streak Freeze', quantity: 2, type: 'boost' },
        { id: 'double_xp', name: 'Double XP', quantity: 1, type: 'boost' },
      ],
      inventory: {
        streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
        heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
        xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
      },
      activeBoosts: {},
      isLoading: false,
    });
    
    // Mark as initialized
    win.__hooksMocksInitialized = true;
  }
};

// Combined provider for using both Redux and Hooks
export const CombinedProviders = ({ 
  children,
  reduxState = defaultState,
  hookOverrides = {},
}: { 
  children: React.ReactNode;
  reduxState?: Record<string, any>;
  hookOverrides?: Partial<HookContextType>;
}) => {
  return (
    <ReduxProvider initialState={reduxState}>
      <HookProvider hookOverrides={hookOverrides}>
        {children}
      </HookProvider>
    </ReduxProvider>
  );
};

// Create a mock implementation of jest
export const setupJestMock = () => {
  if (typeof window !== 'undefined') {
    // Function factory for mock functions
    const createMockFunction = (impl?: any) => {
      const mockFn = impl || (() => {});
      
      mockFn.mockReturnValue = (val: any) => {
        const newFn = () => val;
        newFn.mockReturnValue = mockFn.mockReturnValue;
        newFn.mockImplementation = mockFn.mockImplementation;
        return newFn;
      };
      
      mockFn.mockImplementation = (fn: any) => {
        const newFn = fn || (() => {});
        newFn.mockReturnValue = mockFn.mockReturnValue;
        newFn.mockImplementation = mockFn.mockImplementation;
        return newFn;
      };
      
      return mockFn;
    };
    
    // Set up the jest object
    (window as any).jest = {
      mock: (moduleId: string, factory?: () => any) => {
        console.log(`[Browser] Mocking ${moduleId}`);
        return factory ? factory() : {};
      },
      fn: (implementation?: any) => createMockFunction(implementation),
      spyOn: (obj: any, method: string) => {
        console.log(`[Browser] Spying on ${method} of`, obj);
        return createMockFunction();
      },
      clearAllMocks: () => {},
      resetAllMocks: () => {},
      restoreAllMocks: () => {},
      mockClear: () => {},
      mockReset: () => {},
      mockRestore: () => {},
      mockImplementation: (fn: any) => createMockFunction(fn),
      mockReturnValue: (val: any) => {
        const fn = () => val;
        fn.mockReturnValue = (val: any) => {
          const newFn = () => val;
          return newFn;
        };
        return fn;
      },
      mockResolvedValue: (val: any) => createMockFunction(() => Promise.resolve(val)),
      mockRejectedValue: (val: any) => createMockFunction(() => Promise.reject(val)),
    };
  }
};

// Main setup function for preview.ts
export const setupStoryMocks = () => {
  // First, set up the Jest mock
  setupJestMock();
  
  // Then set up all the hook mocks
  setupHookMocks();
  
  // Define module mocks to avoid "require is not defined" errors
  if (typeof window !== 'undefined') {
    // Make sure UI settings are available for components that need them
    if (!(window as any).ui) {
      (window as any).ui = {
        theme: 'light',
        mode: 'light',
        sidebar: { open: true }
      };
    }
    
    // Ensure gamification data is comprehensive
    const win = window as ExtendedWindow;
    
    // Make sure useGamificationRedux always returns currentStreak
    if (win.useGamificationRedux) {
      const originalGamification = win.useGamificationRedux;
      win.useGamificationRedux = () => {
        const data = originalGamification();
        return {
          ...data,
          currentStreak: data.currentStreak || 7,
          maxStreak: data.maxStreak || 10,
          achievements: data.achievements || mockAchievementsList,
          balance: data.balance || 1250,
          mode: 'light'
        };
      };
    }
    
    // Make sure useThemeContext always returns mode
    if (win.useThemeContext) {
      const originalTheme = win.useThemeContext;
      win.useThemeContext = () => {
        const data = originalTheme();
        return {
          ...data,
          mode: data.mode || 'light',
          isDarkMode: false,
          toggleTheme: () => {}
        };
      };
    }
    
    // Make sure useAchievementsRedux always returns achievements
    if (win.useAchievementsRedux) {
      const originalAchievements = win.useAchievementsRedux;
      win.useAchievementsRedux = () => {
        const data = originalAchievements();
        return {
          ...data,
          achievements: data.achievements || mockAchievementsList,
          filteredAchievements: data.filteredAchievements || mockAchievementsList,
          filterByCategory: () => mockAchievementsList,
          filterByRarity: () => mockAchievementsList,
          showHidden: true,
          isLoading: false
        };
      };
    }
    
    (window as any).require = (path: string) => {
      console.log(`[Browser] Mocking ${path}`);
      
      // Mock specific modules based on the import path
      if (path === '@/services') {
        return {
          heartsService: {
            getHeartsData: () => ({ current: 5, max: 5, refillTime: Date.now() + 3600000 }),
            useHearts: () => ({ current: 5, max: 5, isLoading: false }),
            subscribe: () => {},
            unsubscribe: () => {},
          },
          achievementsService: {
            getAchievements: () => mockAchievementsList,
            useAchievements: () => ({ achievements: mockAchievementsList, isLoading: false }),
          },
          userService: {
            getUserData: () => ({ username: 'Test User', email: 'test@example.com' }),
          },
          currencyService: {
            getBalance: () => 500,
            getCurrencyData: () => ({ balance: 500 }),
          },
          xpService: {
            getXPData: () => ({ level: 5, xp: 1250, nextLevelXP: 2500, progress: 0.5 }),
          },
          storeService: {
            hasItem: () => true,
            getItemQuantity: () => 2,
          },
          themeService: {
            getThemeData: () => ({ mode: 'light', isDarkMode: false }),
            useTheme: () => ({ mode: 'light', isDarkMode: false, toggleTheme: () => {} })
          }
        };
      }
      
      if (path === '@/components/gamification/progress/HeartsDisplay') {
        return function MockHeartsDisplay(props: any) {
          return {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center' },
              children: [
                {
                  type: 'span',
                  props: { style: { color: 'red', fontSize: '16px', marginRight: '4px' }, children: '❤️' },
                },
                {
                  type: 'span',
                  props: { children: '3/5' },
                },
              ],
            },
          };
        };
      }
      
      // Return an empty object for any other imports
      return {};
    };
    
    // Set up a global __STORYBOOK_ROUTER_LOCATION object to help prevent router nesting issues
    (window as any).__STORYBOOK_ROUTER_LOCATION = {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    };
    
    // Set a flag to help components detect if they're in a router context
    (window as any).__inRouterContext = true;
  }
  
  console.log('[Storybook] Mock setup completed');
  return true;
};

// Wrapper component for storybook stories
export const StorybookMocksWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Set up mocks when the component mounts
    setupStoryMocks();
    
    // Reapply every 100ms to ensure they're available during async operations
    const interval = setInterval(() => {
      setupStoryMocks();
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return <>{children}</>;
}; 
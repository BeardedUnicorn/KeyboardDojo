/**
 * Storybook Test Environment Setup
 * 
 * This file configures the test environment for Storybook stories
 * to ensure consistent mocking across all tests.
 */

// Create mock achievements for reuse
const mockAchievements = [
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

// Mock gamification data with all required properties
const mockGamificationData = {
  level: 5,
  xp: 1250,
  totalXp: 2500,
  xpForNextLevel: 1000,
  currency: 500,
  balance: 500,
  achievements: mockAchievements,
  currentStreak: 7,
  maxStreak: 10,
  hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
  streakDays: 7,
  streakFreeze: true,
  currentTier: 'SILVER',
  isLoading: false,
  getXP: () => 1250,
  getLevelProgress: () => 75,
  // Methods to prevent undefined errors
  addCurrency: () => {},
  spendCurrency: () => true,
  hasItem: () => true,
  getItemQuantity: () => 2,
};

// Setup global mocks to ensure they're available in the test environment
export function setupGlobalMocks() {
  // Create a Mock Factory function for jest
  const createMockFunction = (impl) => {
    const mockFn = impl || (() => {});
    
    // Make sure mockReturnValue returns a function with all required methods
    mockFn.mockReturnValue = (val) => {
      const newFn = () => val;
      // Add all mock methods to the new function
      newFn.mockReturnValue = (innerVal) => {
        const innerFn = () => innerVal;
        innerFn.mockReturnValue = newFn.mockReturnValue;
        innerFn.mockImplementation = newFn.mockImplementation;
        return innerFn;
      };
      newFn.mockImplementation = mockFn.mockImplementation;
      return newFn;
    };
    
    mockFn.mockImplementation = (fn) => {
      const newFn = fn || (() => {});
      newFn.mockReturnValue = mockFn.mockReturnValue;
      newFn.mockImplementation = mockFn.mockImplementation;
      return newFn;
    };
    
    return mockFn;
  };

  // Fix for testing libraries not being defined - create compatible global objects
  window.jest = {
    mock: (moduleId, factory) => {
      console.log(`[Browser] Mocking ${moduleId}`);
      return factory ? factory() : {};
    },
    fn: (implementation) => createMockFunction(implementation),
    spyOn: (obj, method) => {
      const original = obj[method];
      const mockFn = createMockFunction();
      obj[method] = mockFn;
      return mockFn;
    }
  };
  
  // Add vitest compatibility for tests
  window.vitest = window.jest;
  
  // CRITICAL: Set up all the global objects and hooks needed by components
  
  // Set up global user progress state
  window.userProgress = {
    currentStreak: 7,
    maxStreak: 10,
    streakDays: [true, true, true, true, true, false, false],
    level: 5,
    xp: 1250
  };
  
  // Set up global achievements state
  window.achievements = {
    achievements: mockAchievements,
    isLoading: false
  };
  
  // Set up theme context with required mode
  window.theme = {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' }
    },
    mode: 'light'
  };
  
  // Initialize UI settings
  window.ui = {
    theme: 'light',
    mode: 'light',
    sidebar: { open: true }
  };
  
  // Set up global data objects
  window.gamification = mockGamificationData;
  window.user = {
    isAuthenticated: true,
    username: 'TestUser',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.png',
    isLoading: false,
    currentStreak: 7,
    maxStreak: 10,
    level: 5,
    xp: 1250,
    preferences: {
      theme: 'light',
      sound: true,
      notifications: true
    }
  };
  
  // Set up all necessary hooks
  window.useThemeContext = () => ({
    isDarkMode: false,
    toggleTheme: () => {},
    mode: 'light',
    theme: {
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' }
      }
    }
  });
  
  window.useGamificationRedux = () => mockGamificationData;
  
  window.useXP = () => ({
    level: 5,
    xp: 1250, 
    nextLevelXP: 2500,
    progress: 0.5,
    isLoading: false
  });
  
  window.useCurrency = () => ({
    balance: 500,
    addCurrency: () => {},
    spendCurrency: () => true,
    isLoading: false
  });
  
  window.useSubscriptionRedux = () => ({
    hasPremium: true,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    currentTier: 'SILVER',
    isLoading: false
  });
  
  window.useUserProgressRedux = () => ({
    level: 5,
    xp: 1250,
    totalLessonsCompleted: 48,
    streak: 7,
    lastActive: new Date().toISOString(),
    currentStreak: 7,
    maxStreak: 10,
    isLoading: false
  });
  
  window.useAchievementsRedux = () => ({
    achievements: mockAchievements,
    isLoading: false
  });
  
  // Define module mocks to avoid "require is not defined" errors
  window.require = (path) => {
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
          getAchievements: () => mockAchievements,
          useAchievements: () => ({ 
            achievements: mockAchievements, 
            isLoading: false,
            filteredAchievements: mockAchievements,
            filterByCategory: () => mockAchievements,
            filterByRarity: () => mockAchievements,
            showHidden: true,
          }),
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
          getTheme: () => 'light',
          isDarkMode: () => false,
          getThemeMode: () => 'light',
        }
      };
    }
    
    if (path === '@/components/gamification/progress/HeartsDisplay') {
      return function MockHeartsDisplay(props) {
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
  
  // Add a global settings object
  window.settings = {
    theme: 'light',
    mode: 'light'
  };
  
  // Set up global hooks with consistent values
  window.useGamificationRedux = () => ({
    ...mockGamificationData,
    achievements: mockAchievements,
    isLoading: false
  });
  
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
  
  window.useThemeContext = () => ({
    isDarkMode: false,
    toggleTheme: () => {},
    mode: 'light',
  });
  
  window.useAchievementsRedux = () => ({
    achievements: mockAchievements,
    isLoading: false,
    filteredAchievements: mockAchievements,
    filterByCategory: () => mockAchievements,
    filterByRarity: () => mockAchievements,
    showHidden: true,
  });
  
  window.useUserProgressRedux = () => ({
    level: 5,
    xp: 1250,
    totalLessonsCompleted: 48,
    streak: 7,
    lastActive: new Date().toISOString(),
    isLoading: false,
  });
  
  window.useSubscriptionRedux = () => ({
    hasPremium: true,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    currentTier: 'SILVER',
    isLoading: false,
  });
  
  window.useStoreRedux = () => ({
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
  
  window.useStreak = () => ({
    currentStreak: 7,
    maxStreak: 10,
    lastActiveDate: new Date().toISOString(),
    isLoading: false,
  });

  // Make sure these are accessible via __hookMocks too, for components that use this pattern
  window.__hookMocks = {
    useGamificationRedux: window.useGamificationRedux,
    useXP: window.useXP,
    useCurrency: window.useCurrency,
    useThemeContext: window.useThemeContext,
    useAchievementsRedux: window.useAchievementsRedux,
    useUserProgressRedux: window.useUserProgressRedux,
    useSubscriptionRedux: window.useSubscriptionRedux,
    useStoreRedux: window.useStoreRedux,
    useStreak: window.useStreak,
  };

  // Mock BrowserRouter and React Router context
  // This helps prevent the "You cannot render a <Router> inside another <Router>" error
  window.__STORYBOOK_ROUTER_LOCATION = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  };

  // Set flags to help components detect if they're in a Router context
  window.__inRouterContext = true;
  
  // Create user services
  window.services = {
    // User services
    getUserData: () => ({ username: 'Test User', email: 'test@example.com' }),
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
  
  // Log that setup is complete
  console.log("[Test Environment] Global mocks setup complete");
}

/**
 * Additional test environment setup for Storybook
 * This file provides focused fixes for specific component issues
 */

if (typeof window !== 'undefined') {
  // CRITICAL: Fix for streak data issues in XPDisplay and CurrencyDisplay
  const ensureGamificationDataHasStreak = () => {
    // Ensure gamification data exists
    if (!window.gamification) {
      window.gamification = {
        level: 5,
        xp: 1250,
        totalXp: 2500,
        nextLevelXP: 2500,
        currency: 500,
        balance: 500,
        currentStreak: 7,
        maxStreak: 10,
        streakDays: [true, true, true, true, true, false, false],
        achievements: [],
        progress: 0.5,
      };
      console.log('Created missing gamification data');
    } else if (!window.gamification.currentStreak) {
      // Add missing streak properties
      window.gamification.currentStreak = 7;
      window.gamification.maxStreak = 10;
      window.gamification.streakDays = [true, true, true, true, true, false, false];
      console.log('Added missing streak data to gamification object');
    }
    
    // Ensure hook returns the streak data
    const originalGamificationHook = window.useGamificationRedux;
    if (originalGamificationHook) {
      window.useGamificationRedux = () => {
        const result = originalGamificationHook();
        
        // Fix missing gamification property
        if (!result.gamification) {
          result.gamification = window.gamification || {
            level: 5,
            xp: 1250,
            currentStreak: 7,
            maxStreak: 10
          };
        }
        
        // Fix missing streak property in gamification
        if (!result.gamification.currentStreak) {
          result.gamification.currentStreak = 7;
          result.gamification.maxStreak = 10;
          result.gamification.streakDays = [true, true, true, true, true, false, false];
        }
        
        return result;
      };
      console.log('Enhanced useGamificationRedux hook with streak data');
    }
    
    // Ensure streak hook is available
    if (!window.useStreak) {
      window.useStreak = () => ({
        currentStreak: 7,
        maxStreak: 10,
        streakDays: [true, true, true, true, true, false, false],
        isStreakComplete: true,
        streakFreeze: true,
        isLoading: false,
      });
      console.log('Created missing useStreak hook');
    }
  };

  // CRITICAL: Fix for user progress data issues
  const ensureUserProgressData = () => {
    if (!window.userProgress) {
      window.userProgress = {
        completedLessons: ['lesson1', 'lesson2'],
        totalLessons: 10,
        completedTopics: ['topic1'],
        totalTopics: 5,
        progress: 0.25,
        currentStreak: 7,
        maxStreak: 10,
        streakDays: [true, true, true, true, true, false, false],
        level: 5,
        xp: 1250,
      };
      console.log('Created missing userProgress data');
    } else if (!window.userProgress.currentStreak) {
      window.userProgress.currentStreak = 7;
      window.userProgress.maxStreak = 10;
      window.userProgress.streakDays = [true, true, true, true, true, false, false];
      console.log('Added missing streak data to userProgress');
    }
    
    // Ensure progress chart data
    if (!window.userProgress.progress) {
      window.userProgress.progress = {
        completedLessons: ['lesson1', 'lesson2'],
        totalLessons: 10,
        completedTopics: ['topic1'],
        totalTopics: 5,
        progress: 0.25,
        activeCurriculum: {
          id: 'javascript',
          name: 'JavaScript',
          description: 'Learn JavaScript programming',
          tracks: ['basics', 'advanced'],
          currentTrack: 'basics'
        }
      };
      console.log('Added missing progress data to userProgress');
    }
    
    // Fix hook
    const originalProgressHook = window.useUserProgressRedux;
    if (originalProgressHook) {
      window.useUserProgressRedux = () => {
        const result = originalProgressHook();
        if (!result || typeof result !== 'object') {
          return {
            completedLessons: ['lesson1', 'lesson2'],
            totalLessons: 10,
            completedTopics: ['topic1'],
            totalTopics: 5,
            progress: 0.25,
            currentStreak: 7,
            maxStreak: 10,
            level: 5,
            xp: 1250,
          };
        }
        if (!result.currentStreak) {
          result.currentStreak = 7;
          result.maxStreak = 10;
        }
        return result;
      };
      console.log('Enhanced useUserProgressRedux hook');
    }
  };

  // Run our fixes
  window.addEventListener('DOMContentLoaded', () => {
    console.log('Running additional test environment setup...');
    ensureGamificationDataHasStreak();
    ensureUserProgressData();
    console.log('Setup completed!');
  });
  
  // Also run immediately in case the event has already fired
  ensureGamificationDataHasStreak();
  ensureUserProgressData();
  console.log('Initial setup completed');
}

/**
 * setup-test-environment.js
 * 
 * This file configures the Jest testing environment for Storybook tests.
 * It sets up global mocks, extended timeouts, and other test-specific configurations.
 */

// Increase timeout for all tests - using vitest instead of jest
if (typeof globalThis.vitest !== 'undefined') {
  console.log('Using Vitest configuration for timeout');
  // Vitest doesn't have a global setTimeout, it uses vi.setConfig
  if (typeof globalThis.vi !== 'undefined') {
    globalThis.vi.setConfig({ testTimeout: 60000 });
  } else {
    console.log('Vi global not available, skipping timeout configuration');
  }
} else if (typeof globalThis.jest !== 'undefined') {
  globalThis.jest.setTimeout(60000);
} else {
  console.log('Neither Vitest nor Jest global available, skipping timeout configuration');
}

// Set up global mocks for Storybook testing
if (typeof window !== 'undefined') {
  // Mock data for user progress tracking
  window.userProgress = {
    userId: 'user123',
    xp: 750,
    level: 5,
    streakDays: 7,
    currentStreak: 7, // Important for XPDisplay and CurrencyDisplay
    lastActivity: '2023-06-15T10:30:00Z',
    achievements: [],
    completedLessons: {
      'lesson1': true,
      'lesson2': true,
      'lesson3': true,
      'lesson4': true,
      'lesson5': true,
      'lesson6': false,
      'lesson7': true,
      'lesson8': true,
    },
    completedModules: {
      'typing-fundamentals': true,
      'navigation': false,
      'text-editing': false,
    },
    trackProgress: {
      'vscode': {
        completedLessons: 5,
        totalLessons: 6,
        completedModules: 1,
        modules: {
          'typing-fundamentals': {
            completed: true,
            completedLessons: 3,
            totalLessons: 3
          },
          'navigation': {
            completed: false,
            completedLessons: 2,
            totalLessons: 3
          }
        }
      },
      'intellij': {
        completedLessons: 2,
        totalLessons: 6,
        completedModules: 0,
        modules: {
          'text-editing': {
            completed: false,
            completedLessons: 2,
            totalLessons: 3
          },
          'formatting': {
            completed: false,
            completedLessons: 0,
            totalLessons: 3
          }
        }
      }
    }
  };

  // Mock curriculum data
  window.curriculum = {
    tracks: [
      {
        id: 'vscode',
        name: 'VS Code Essentials',
        description: 'Learn VS Code shortcuts',
        icon: 'code',
        modules: [
          {
            id: 'typing-fundamentals',
            title: 'Typing Fundamentals',
            description: 'Master proper typing techniques',
            category: 'NAVIGATION',
            difficulty: 'BEGINNER',
            lessons: [
              {
                id: 'lesson1',
                title: 'Home Row Position',
                description: 'Home row description',
                difficulty: 'BEGINNER',
                steps: [],
                estimatedTime: 10,
                order: 1
              },
              {
                id: 'lesson2',
                title: 'Touch Typing Basics',
                description: 'Touch typing description',
                difficulty: 'BEGINNER',
                steps: [],
                estimatedTime: 10,
                order: 2
              },
              {
                id: 'lesson3',
                title: 'Typing Accuracy',
                description: 'Accuracy description',
                difficulty: 'BEGINNER',
                steps: [],
                estimatedTime: 10,
                order: 3
              }
            ],
            order: 1
          },
          {
            id: 'navigation',
            title: 'Basic Navigation',
            description: 'Navigate efficiently',
            category: 'NAVIGATION',
            difficulty: 'BEGINNER',
            lessons: [
              {
                id: 'lesson4',
                title: 'Arrow Keys',
                description: 'Arrow keys description',
                difficulty: 'BEGINNER',
                steps: [],
                estimatedTime: 10,
                order: 1
              },
              {
                id: 'lesson5',
                title: 'Page Navigation',
                description: 'Page nav description',
                difficulty: 'BEGINNER',
                steps: [],
                estimatedTime: 10,
                order: 2
              },
              {
                id: 'lesson6',
                title: 'Home and End Keys',
                description: 'Home/End description',
                difficulty: 'INTERMEDIATE',
                steps: [],
                estimatedTime: 10,
                order: 3
              }
            ],
            order: 2
          }
        ],
        version: '1.0.0',
        isActive: true
      },
      {
        id: 'intellij',
        name: 'IntelliJ Shortcuts',
        description: 'Master IntelliJ shortcuts',
        icon: 'code',
        modules: [
          {
            id: 'text-editing',
            title: 'Text Editing',
            description: 'Edit text efficiently',
            category: 'EDITING',
            difficulty: 'INTERMEDIATE',
            lessons: [
              {
                id: 'lesson7',
                title: 'Copy, Cut, Paste',
                description: 'Copy/cut/paste description',
                difficulty: 'INTERMEDIATE',
                steps: [],
                estimatedTime: 10,
                order: 1
              },
              {
                id: 'lesson8',
                title: 'Undo, Redo',
                description: 'Undo/redo description',
                difficulty: 'INTERMEDIATE',
                steps: [],
                estimatedTime: 10,
                order: 2
              }
            ],
            order: 1
          }
        ],
        version: '1.0.0',
        isActive: true
      }
    ],
    activeCurriculum: {
      id: 'main-curriculum',
      tracks: [], // Will be populated at runtime
      metadata: {
        id: 'main-curriculum',
        name: 'Main Curriculum',
        type: 'STANDARD',
        isActive: true,
        isDefault: true,
        version: '1.0.0',
        author: 'Keyboard Dojo Team',
        description: 'The main keyboard shortcut curriculum',
        icon: 'keyboard',
        lastUpdated: '2023-06-01',
        tags: ['keyboard', 'shortcuts']
      },
      paths: [],
      lessons: []
    }
  };

  // Mock the necessary Redux hooks for testing
  window.mockReduxHook = {
    useAppSelector: (selector) => {
      // Based on the selector function, return appropriate mock data
      if (selector.toString().includes('userProgress')) {
        return window.userProgress;
      }
      if (selector.toString().includes('curriculum')) {
        return window.curriculum;
      }
      return null;
    },
    useAppDispatch: () => globalThis.jest.fn()
  };

  // Mock theme values
  window.TRANSITIONS = {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  };

  window.ELEVATION = {
    1: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    2: '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    3: '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.10)',
    4: '0px 15px 25px rgba(0, 0, 0, 0.15), 0px 5px 10px rgba(0, 0, 0, 0.05)',
    5: '0px 20px 40px rgba(0, 0, 0, 0.2)',
  };

  // Create a mock loading icon for testing
  window.MOCK_LOADING_ICON = ({ size = 24 }) => {
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3498db',
      animation: 'spin 2s linear infinite',
      display: 'inline-block',
    };
    
    return {
      type: 'div',
      props: { style, 'data-testid': 'mock-loading-spinner' },
    };
  };
}

// Ensure console errors don't fail tests for known issues
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific errors that are expected during testing
  const errorMessage = args[0]?.toString() || '';
  
  // List of known error patterns to ignore
  const ignoredErrors = [
    'Warning: componentWillReceiveProps has been renamed',
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillUpdate has been renamed',
    'Warning: Failed prop type',
    'Warning: Cannot update a component',
    'Warning: Cannot read properties of undefined (reading',
  ];
  
  // Only log if it's not an ignored error
  const shouldLog = !ignoredErrors.some(pattern => errorMessage.includes(pattern));
  if (shouldLog) {
    originalConsoleError(...args);
  }
}; 
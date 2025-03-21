/**
 * Centralized Redux store configuration for Storybook
 * 
 * This file provides a standardized way to create mock Redux stores
 * for Storybook stories, ensuring consistent state across components.
 */
import { configureStore } from '@reduxjs/toolkit';
import { ServicesType, GamificationDataType, UserDataType, AchievementType } from './storybook-types';

// Constants for static dates to ensure consistency
const STATIC_DATE = '2023-01-01T00:00:00.000Z';
const STATIC_FUTURE_DATE = '2023-02-01T00:00:00.000Z';

// Create mock achievements for reuse
const mockAchievements: AchievementType[] = [
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
    icon: 'school',
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
    icon: 'keyboard',
  },
  {
    id: 'secret_achievement',
    title: 'Secret Achievement',
    description: 'Find a secret feature',
    completed: false,
    progress: 0,
    totalRequired: 1,
    type: 'achievement',
    rarity: 'legendary',
    category: 'secret',
    icon: 'star',
    secret: true,
  }
];

// Create mock track progress data
const mockTrackProgress = [
  {
    trackId: 'fundamentals',
    trackName: 'Keyboard Fundamentals',
    progress: 1.0,
    modules: [
      { moduleId: 'basics', moduleName: 'Basics', progress: 1.0 },
      { moduleId: 'navigation', moduleName: 'Navigation', progress: 1.0 }
    ]
  },
  {
    trackId: 'ide',
    trackName: 'IDE Efficiency',
    progress: 0.75,
    modules: [
      { moduleId: 'editing', moduleName: 'Editing', progress: 1.0 },
      { moduleId: 'selection', moduleName: 'Selection', progress: 0.8 },
      { moduleId: 'refactoring', moduleName: 'Refactoring', progress: 0.6 },
      { moduleId: 'debugging', moduleName: 'Debugging', progress: 0.5 }
    ]
  },
  {
    trackId: 'advanced',
    trackName: 'Advanced Techniques',
    progress: 0.3,
    modules: [
      { moduleId: 'macros', moduleName: 'Macros', progress: 0.5 },
      { moduleId: 'automation', moduleName: 'Automation', progress: 0.3 },
      { moduleId: 'customization', moduleName: 'Customization', progress: 0.1 }
    ]
  }
];

// Default user state
const defaultUserState = {
  isAuthenticated: true,
  username: 'Keyboard Master',
  email: 'master@example.com',
  photoURL: 'https://mui.com/static/images/avatar/1.jpg',
  isLoading: false,
  error: null,
};

// Default user progress state
const defaultProgressState = {
  level: 7,
  xp: 3250,
  totalLessonsCompleted: 48,
  streakDays: 14,
  lastActive: STATIC_DATE,
  progress: mockTrackProgress,
  isLoading: false,
  error: null,
};

// Default gamification state
const defaultGamificationState: GamificationDataType = {
  level: 7,
  xp: 3250,
  totalXp: 3250,
  nextLevelXP: 4000,
  xpForNextLevel: 1000,
  currency: 750,
  balance: 750,
  achievements: mockAchievements,
  currentStreak: 14,
  maxStreak: 21,
  hearts: {
    current: 5,
    max: 5,
    refillTime: new Date().getTime() + 3600000,
  },
  streakDays: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  streakFreeze: true,
  currentTier: 'SILVER',
  isLoading: false,
  progress: 0.75,
};

// Default UI state
const defaultUIState = {
  theme: 'light',
  sidebar: { open: true },
  mode: 'light',
};

// Default settings state
const defaultSettingsState = {
  theme: 'light',
  mode: 'light',
  keyboardLayout: 'qwerty',
  fontSize: 'medium',
  notifications: {
    achievements: true,
    levelUp: true,
    streaks: true,
    updates: true
  }
};

// Default subscription state
const defaultSubscriptionState = {
  hasPremium: true,
  expiryDate: STATIC_FUTURE_DATE,
  currentTier: 'SILVER',
  isLoading: false,
};

// Default store state combining all slices
const defaultStoreState = {
  user: defaultUserState,
  userProgress: defaultProgressState,
  gamification: defaultGamificationState,
  ui: defaultUIState,
  settings: defaultSettingsState,
  subscription: defaultSubscriptionState,
};

/**
 * Create a configured Redux store with default state
 * @param overrides Optional state overrides for testing different scenarios
 * @returns Configured Redux store
 */
export function createMockStore(overrides = {}) {
  // Deep merge the default state with any overrides
  const mergedState = deepMerge(defaultStoreState, overrides);
  
  return configureStore({
    reducer: (state = mergedState) => state,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

/**
 * Create store with a beginner user profile
 */
export function createBeginnerStore() {
  return createMockStore({
    userProgress: {
      level: 2,
      xp: 450,
      totalLessonsCompleted: 8,
      streakDays: 3,
    },
    gamification: {
      level: 2,
      xp: 450,
      totalXp: 450,
      nextLevelXP: 1000,
      currentStreak: 3,
      maxStreak: 3,
      progress: 0.45,
    },
    subscription: {
      hasPremium: false,
    }
  });
}

/**
 * Create store with an intermediate user profile
 */
export function createIntermediateStore() {
  return createMockStore({
    userProgress: {
      level: 5,
      xp: 2100,
      totalLessonsCompleted: 32,
      streakDays: 10,
    },
    gamification: {
      level: 5,
      xp: 2100,
      totalXp: 2100,
      nextLevelXP: 3000,
      currentStreak: 10,
      maxStreak: 12,
      progress: 0.7,
    }
  });
}

/**
 * Create store with an advanced user profile
 */
export function createAdvancedStore() {
  return createMockStore({
    userProgress: {
      level: 12,
      xp: 8750,
      totalLessonsCompleted: 86,
      streakDays: 30,
    },
    gamification: {
      level: 12,
      xp: 8750,
      totalXp: 8750,
      nextLevelXP: 10000,
      currentStreak: 30,
      maxStreak: 45,
      progress: 0.875,
      currentTier: 'GOLD',
    },
    subscription: {
      hasPremium: true,
      currentTier: 'GOLD',
    }
  });
}

/**
 * Create store with loading states active
 */
export function createLoadingStore() {
  return createMockStore({
    user: {
      isLoading: true,
    },
    userProgress: {
      isLoading: true,
    },
    gamification: {
      isLoading: true,
    },
    subscription: {
      isLoading: true,
    }
  });
}

/**
 * Create store with error states
 */
export function createErrorStore() {
  return createMockStore({
    user: {
      error: 'Failed to load user data',
    },
    userProgress: {
      error: 'Failed to load progress data',
    },
    gamification: {
      error: 'Failed to load gamification data',
    },
    subscription: {
      error: 'Failed to load subscription data',
    }
  });
}

/**
 * Helper function to deep merge objects
 * @param target The target object
 * @param source The source object with overrides
 * @returns Merged object
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Helper function to check if a value is an object
 * @param item Value to check
 * @returns Boolean indicating if value is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Default export for importing in preview.tsx
export default createMockStore; 
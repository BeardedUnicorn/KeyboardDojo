/**
 * Centralized setup for Storybook stories and tests
 * 
 * This file provides a reliable way to initialize all necessary mocks and hooks
 * that stories might need, ensuring consistent behavior across tests.
 */
import './storybook-types';
import type { 
  AchievementType, 
  GamificationDataType,
  UserDataType,
  HooksType
} from './storybook-types';

// Create mock achievements for reuse
const mockAchievements: AchievementType[] = [
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
    id: 'secret_achievement',
    title: 'Secret Achievement',
    name: 'Secret Achievement', 
    description: 'Find a secret feature',
    completed: false,
    progress: 0,
    totalRequired: 1,
    total: 1,
    type: 'achievement',
    rarity: 'legendary',
    category: 'secret',
    icon: 'star',
    secret: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Mock gamification data with all required properties
const mockGamificationData: GamificationDataType = {
  level: 5,
  xp: 1250,
  totalXp: 2500,
  nextLevelXP: 2500,
  xpForNextLevel: 1000,
  currency: 500,
  balance: 500,
  achievements: mockAchievements,
  currentStreak: 7,
  maxStreak: 10,
  hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
  streakDays: [true, true, true, true, true, false, false],
  streakFreeze: true,
  currentTier: 'SILVER',
  isLoading: false,
  progress: 0.75,
  items: [
    { id: 'streak_freeze', name: 'Streak Freeze', quantity: 2, type: 'boost' },
    { id: 'double_xp', name: 'Double XP', quantity: 1, type: 'boost' },
  ],
  getXP: () => 1250,
  getLevelProgress: () => 0.75,
  addCurrency: () => {},
  spendCurrency: () => true,
  hasItem: () => true,
  getItemQuantity: () => 2,
};

// User data with all required fields
const mockUserData: UserDataType = {
  isAuthenticated: true,
  username: 'TestUser',
  email: 'test@example.com',
  avatar: 'https://mui.com/static/images/avatar/1.jpg',
  currentStreak: 7,
  maxStreak: 10,
  lastActiveDate: new Date().toISOString(),
  level: 5,
  xp: 1250,
  streak: 7,
  lastActive: new Date().toISOString(),
  totalLessonsCompleted: 48,
  isLoading: false
};

/**
 * Sets up all global hooks and mocks for consistent testing
 * This should be called before any story renders to ensure
 * all necessary global objects are available
 */
export function setupStorybook() {
  if (typeof window === 'undefined') {
    return; // No-op in SSR context
  }

  console.log('[Storybook] Setting up global mocks and hooks');
  
  // Create React Router context if needed
  setupRouterContext();
  
  // Set up UI theme
  window.ui = {
    theme: 'light',
    mode: 'light',
    sidebar: { open: true }
  };
  
  // Set up hooks
  const allHooks: HooksType = {
    useGamificationRedux: () => ({
      gamification: mockGamificationData,
      actions: {
        fetchGamificationData: () => {},
        purchaseItem: () => Promise.resolve(true),
        useItem: () => Promise.resolve(true),
      }
    }),
    useXP: () => ({
      level: 5,
      xp: 1250,
      nextLevelXP: 2500,
      progress: 0.5,
      isLoading: false,
    }),
    useCurrency: () => ({
      balance: 500,
      addCurrency: () => {},
      spendCurrency: () => true,
      isLoading: false,
    }),
    useThemeContext: () => ({
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
    }),
    useUserProgressRedux: () => mockUserData,
    useSubscriptionRedux: () => ({
      hasPremium: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentTier: 'SILVER',
      isLoading: false,
    }),
    useAchievementsRedux: () => ({
      achievements: mockAchievements,
      isLoading: false,
      filteredAchievements: mockAchievements,
      filterByCategory: () => mockAchievements,
      filterByRarity: () => mockAchievements,
      showHidden: true,
    }),
    useStoreRedux: () => ({
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
    }),
    useStreak: () => ({
      currentStreak: 7,
      maxStreak: 10,
      lastActiveDate: new Date().toISOString(),
      isLoading: false,
    }),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
    useNavigate: () => {
      const navigate = () => {};
      return navigate;
    },
    useParams: () => ({}),
  };
  
  // Assign all hooks to window
  Object.entries(allHooks).forEach(([key, value]) => {
    window[key as keyof typeof window] = value;
  });
  
  // Make hooks available via __hookMocks too for components that use this pattern
  window.__hookMocks = allHooks;
  
  // Set up services
  window.services = {
    getUserData: () => mockUserData,
    getStreakData: () => ({ current: 7, max: 10, lastActiveDate: new Date().toISOString() }),
    getCurrentStreak: () => 7,
    getMaxStreak: () => 10,
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
  
  // Provide mocked services for backwards compatibility
  window.MOCKED_SERVICES = window.services;
  
  // Set up global data objects
  window.gamification = mockGamificationData;
  
  // Set up require function to handle module imports
  if (!window.require) {
    // Simple mock implementation that returns empty objects
    window.require = (path: string) => {
      console.log(`[Storybook] Mocked require: ${path}`);
      return {};
    };
  }
  
  console.log('[Storybook] Global mocks and hooks set up complete');
  return true;
}

/**
 * Sets up a React Router context to be available globally
 * This helps avoid the "cannot destructure property 'basename' of 'React2.useContext(...)' as it is null" errors
 */
function setupRouterContext() {
  // Set up router flags
  window.__inRouterContext = true;
  window.__hasRouterContext = true;

  // Create router location if needed
  window.__STORYBOOK_ROUTER_LOCATION = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  };
  
  // Create router context
  window.__REACT_ROUTER_CONTEXT = {
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
  
  console.log('[Storybook] Router context set up complete');
}

// Auto-initialize if not in SSR environment
if (typeof window !== 'undefined') {
  setupStorybook(); 
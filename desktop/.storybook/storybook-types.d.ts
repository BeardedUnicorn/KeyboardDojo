/**
 * Global TypeScript declarations for Storybook testing
 * 
 * This file ensures consistent typing across all story files,
 * eliminating the need for each file to define its own Window interfaces.
 */

// Define all the hook types
export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  mode: 'light' | 'dark';
  theme?: {
    palette: {
      mode: 'light' | 'dark';
      primary: { main: string };
      secondary: { main: string };
      background?: { default: string; paper: string };
      text?: { primary: string; secondary: string };
    };
  };
};

export type XPDataType = {
  level: number;
  xp: number;
  nextLevelXP: number;
  progress: number;
  isLoading: boolean;
};

export type CurrencyDataType = {
  balance: number;
  addCurrency: (amount: number) => void;
  spendCurrency: (amount: number) => boolean;
  isLoading: boolean;
};

export type StreakDataType = {
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string;
  isLoading: boolean;
};

export type AchievementType = {
  id: string;
  title: string;
  name?: string;
  description: string;
  completed: boolean;
  progress: number;
  totalRequired?: number;
  total?: number;
  type?: string;
  rarity?: string;
  category?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
  secret?: boolean;
};

export type GamificationDataType = {
  level: number;
  xp: number;
  totalXp: number;
  nextLevelXP?: number;
  xpForNextLevel?: number;
  currency: number;
  balance: number;
  achievements: AchievementType[];
  currentStreak: number;
  maxStreak: number;
  hearts: { current: number; max: number; refillTime: number };
  streakDays: boolean[] | number;
  streakFreeze: boolean;
  currentTier: string;
  isLoading: boolean;
  progress?: number;
  items?: Array<{ id: string; name: string; quantity: number; type: string }>;
  getXP?: () => number;
  getLevelProgress?: () => number;
  addCurrency?: () => void;
  spendCurrency?: () => boolean;
  hasItem?: () => boolean;
  getItemQuantity?: () => number;
};

export type UserDataType = {
  isAuthenticated: boolean;
  username: string;
  email: string;
  avatar?: string;
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string;
  level?: number;
  xp?: number;
  streak?: number;
  lastActive?: string;
  totalLessonsCompleted?: number;
  isLoading?: boolean;
};

export type SubscriptionDataType = {
  hasPremium: boolean;
  expiryDate: string;
  currentTier: string;
  isLoading: boolean;
};

export type HooksType = {
  useGamificationRedux: () => { 
    gamification?: GamificationDataType;
    actions?: {
      fetchGamificationData: () => void;
      purchaseItem: () => Promise<boolean>;
      useItem: () => Promise<boolean>;
    }
  } | GamificationDataType;
  useXP: () => XPDataType;
  useCurrency: () => CurrencyDataType;
  useThemeContext: () => ThemeContextType;
  useUserProgressRedux: () => UserDataType;
  useSubscriptionRedux: () => SubscriptionDataType;
  useAchievementsRedux: () => {
    achievements: AchievementType[];
    isLoading: boolean;
    filteredAchievements?: AchievementType[];
    filterByCategory?: (category: string) => AchievementType[];
    filterByRarity?: (rarity: string) => AchievementType[];
    showHidden?: boolean;
  };
  useStoreRedux: () => {
    items: Array<{
      id: string;
      name: string;
      price: number;
      description: string;
      type: string;
      icon: string;
    }>;
    ownedItems: Array<{
      id: string;
      name: string;
      quantity: number;
      type: string;
    }>;
    inventory: Record<string, {
      quantity: number;
      purchaseDate: string;
    }>;
    activeBoosts: Record<string, any>;
    isLoading: boolean;
  };
  useStreak: () => StreakDataType;
  useLocation?: () => {
    pathname: string;
    search: string;
    hash: string;
    state: null;
    key: string;
  };
  useNavigate?: () => () => void;
  useParams?: () => Record<string, string>;
};

export type ServicesType = {
  getUserData: () => UserDataType;
  getStreakData: () => { current: number; max: number; lastActiveDate: string };
  getCurrentStreak: () => number;
  getMaxStreak: () => number;
  getHeartsData: () => { current: number; max: number; refillTime: number };
  getCurrencyData: () => {
    balance: number;
    inventory: Record<string, { quantity: number; purchaseDate: string }>;
    activeBoosts: Record<string, any>;
  };
  getBalance: () => number;
  getXPData: () => { level: number; xp: number; nextLevelXP: number; progress: number };
  hasItem: () => boolean;
  getItemQuantity: () => number;
  getAchievements: () => AchievementType[];
  getAchievementsData?: () => AchievementType[];
  getTheme?: () => string;
  getThemeData?: () => { mode: string; isDarkMode: boolean };
};

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    services: ServicesType;
    MOCKED_SERVICES: ServicesType;
    __hookMocks: HooksType;
    ui?: {
      theme: string;
      mode: string;
      sidebar: { open: boolean };
    };
    gamification?: GamificationDataType;
    useGamificationRedux: HooksType['useGamificationRedux'];
    useXP: HooksType['useXP'];
    useCurrency: HooksType['useCurrency'];
    useThemeContext: HooksType['useThemeContext'];
    useSubscriptionRedux: HooksType['useSubscriptionRedux'];
    useUserProgressRedux: HooksType['useUserProgressRedux'];
    useAchievementsRedux: HooksType['useAchievementsRedux'];
    useStoreRedux: HooksType['useStoreRedux'];
    useStreak: HooksType['useStreak'];
    useLocation?: HooksType['useLocation'];
    useNavigate?: HooksType['useNavigate'];
    useParams?: HooksType['useParams'];
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
    __REACT_ROUTER_CONTEXT?: any;
    jest?: any;
  }
} 
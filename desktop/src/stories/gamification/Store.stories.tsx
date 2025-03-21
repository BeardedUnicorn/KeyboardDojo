import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import component and dependencies
import Store from '../../components/gamification/currency/Store';

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      gamification: (state = initialState, action) => state,
    },
    preloadedState: {
      gamification: initialState,
    },
  });
};

// Mock store items
const mockStoreItems = {
  streak_freeze: {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protects your streak for one day of inactivity',
    price: 100,
    type: 'boost',
    icon: 'StreakIcon',
  },
  double_xp: {
    id: 'double_xp',
    name: 'Double XP',
    description: 'Double all XP earned for 30 minutes',
    price: 150,
    type: 'boost',
    icon: 'BoostIcon',
  },
  heart_refill: {
    id: 'heart_refill',
    name: 'Heart Refill',
    description: 'Instantly refill all your hearts',
    price: 200,
    type: 'hearts',
    icon: 'HeartIcon',
  },
  dark_theme: {
    id: 'dark_theme',
    name: 'Dark Theme',
    description: 'Unlock the dark theme for the app',
    price: 500,
    type: 'theme',
    icon: 'ThemeIcon',
  },
};

// Mock the services object on window
if (typeof window !== 'undefined') {
  window.services = window.services || {};
  window.services.currencyService = {
    getBalance: () => 1000,
    purchaseItem: () => true,
    hasItem: () => false,
    getItemQuantity: () => 0,
  };
}

// Create a wrapper component for the stories
const StoreWrapper = ({ 
  children, 
  balance = 1000, 
  ownedItems = [], 
  inventory = [], 
}: {
  children: React.ReactNode;
  balance?: number;
  ownedItems?: string[];
  inventory?: Array<{ id: string; quantity: number }>;
}) => {
  // Create mock Redux store with gamification state
  const store = createMockStore({
    isLoading: false,
    level: 5,
    xp: {
      totalXP: 1250,
      currentLevelXP: 250,
      nextLevelXP: 500,
    },
    hearts: {
      current: 5,
      max: 5,
      refillTime: Date.now() + 3600000,
    },
    currency: {
      balance: balance,
    },
    streak: {
      currentStreak: 7,
      longestStreak: 14,
      lastPracticeDate: new Date().toISOString().split('T')[0],
    },
    achievements: [],
  });

  // Mock window services
  React.useEffect(() => {
    const originalServices = window.services;
    const originalCurrencyService = originalServices?.currencyService;
    
    // Update the service mocks for this component
    if (window.services && window.services.currencyService) {
      window.services.currencyService.getBalance = () => balance;
      window.services.currencyService.hasItem = (itemId: string) => ownedItems.includes(itemId);
      window.services.currencyService.getItemQuantity = (itemId: string) => 
        inventory.find((item) => item.id === itemId)?.quantity || 0;
    }
    
    // Cleanup function to restore original values
    return () => {
      if (originalServices) {
        window.services = originalServices;
      }
    };
  }, [balance, ownedItems, inventory]);
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

const meta: Meta<typeof Store> = {
  title: 'Gamification/Store',
  component: Store,
  tags: ['autodocs', 'gamification'],
  decorators: [
    (Story, context) => {
      const { args } = context;
      return (
        <StoreWrapper 
          balance={args.balance} 
          ownedItems={args.ownedItems} 
          inventory={args.inventory}
        >
          <Story />
        </StoreWrapper>
      );
    },
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    balance: {
      control: { type: 'number' },
      description: 'Current balance of gems',
    },
    ownedItems: {
      control: { type: 'array' },
      description: 'Array of owned item IDs',
    },
    inventory: {
      control: { type: 'array' },
      description: 'Array of inventory items with id and quantity',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Store & {
  balance?: number;
  ownedItems?: string[];
  inventory?: Array<{ id: string; quantity: number }>;
}>;

export const Default: Story = {
  args: {
    balance: 1000,
    ownedItems: [],
    inventory: [],
  },
};

export const LowBalance: Story = {
  args: {
    balance: 50,
    ownedItems: [],
    inventory: [],
  },
};

export const WithOwnedItems: Story = {
  args: {
    balance: 1000,
    ownedItems: ['dark_theme'],
    inventory: [],
  },
};

export const WithInventoryItems: Story = {
  args: {
    balance: 1000,
    ownedItems: [],
    inventory: [
      { id: 'streak_freeze', quantity: 2 },
      { id: 'double_xp', quantity: 1 },
    ],
  },
};

export const FullInventory: Story = {
  args: {
    balance: 2000,
    ownedItems: ['dark_theme'],
    inventory: [
      { id: 'streak_freeze', quantity: 3 },
      { id: 'double_xp', quantity: 2 },
      { id: 'heart_refill', quantity: 1 },
    ],
  },
};

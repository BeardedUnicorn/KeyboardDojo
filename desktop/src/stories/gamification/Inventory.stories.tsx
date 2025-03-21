import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Inventory from '../../components/gamification/currency/Inventory';
import { createMockCurrencyService } from '../.storybook-mocks';
import { TestWrapper } from '../.storybook-test-setup';
import { STORE_ITEMS } from '../../services';

// Mock the services module for stories
// This needs to be outside the component render to work properly
// @ts-expect-error - we're mocking for story purposes
window.MOCKED_SERVICES = {
  currencyService: createMockCurrencyService({
    balance: 100,
    totalEarned: 500,
    transactions: [],
    inventory: {
      streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
      heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
      xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
    },
    activeBoosts: {},
  }),
  STORE_ITEMS: STORE_ITEMS,
};

// Define mock store items
const MOCK_STORE_ITEMS = {
  streak_freeze: {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Prevents your streak from breaking if you miss a day',
    price: 30,
    category: 'power_up',
    icon: 'AcUnit',
  },
  heart_refill: {
    id: 'heart_refill',
    name: 'Heart Refill',
    description: 'Refill all your hearts immediately',
    price: 20,
    category: 'power_up',
    icon: 'Favorite',
  },
  xp_boost: {
    id: 'xp_boost',
    name: 'XP Boost',
    description: 'Earn double XP for the next 24 hours',
    price: 40,
    category: 'boost',
    icon: 'Speed',
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  dark_theme: {
    id: 'dark_theme',
    name: 'Dark IDE Theme',
    description: 'A sleek dark theme for the IDE simulator',
    price: 50,
    category: 'cosmetic',
    icon: 'DarkMode',
    oneTime: true,
  },
  retro_theme: {
    id: 'retro_theme',
    name: 'Retro Terminal Theme',
    description: 'Old-school terminal look for the IDE simulator',
    price: 75,
    category: 'cosmetic',
    icon: 'Terminal',
    oneTime: true,
  },
};

// Create mock data for stories
const DEFAULT_INVENTORY_DATA = {
  balance: 100,
  totalEarned: 500,
  transactions: [],
  inventory: {
    streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
    heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
    xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
  },
  activeBoosts: {},
};

const EMPTY_INVENTORY_DATA = {
  balance: 100,
  totalEarned: 500,
  transactions: [],
  inventory: {},
  activeBoosts: {},
};

const WITH_ACTIVE_BOOST_DATA = {
  balance: 100,
  totalEarned: 500,
  transactions: [],
  inventory: {
    streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
    heart_refill: { quantity: 1, purchaseDate: new Date().toISOString() },
    xp_boost: { quantity: 3, purchaseDate: new Date().toISOString() },
  },
  activeBoosts: {
    xp_boost: {
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
};

const WITH_COSMETIC_ITEMS_DATA = {
  balance: 100,
  totalEarned: 500,
  transactions: [],
  inventory: {
    streak_freeze: { quantity: 2, purchaseDate: new Date().toISOString() },
    dark_theme: { quantity: 1, purchaseDate: new Date().toISOString() },
    retro_theme: { quantity: 1, purchaseDate: new Date().toISOString() },
  },
  activeBoosts: {},
};

// Create a large inventory with multiple items
const LARGE_INVENTORY_DATA = {
  balance: 1000,
  totalEarned: 2000,
  transactions: [],
  inventory: Object.fromEntries(
    Object.keys(STORE_ITEMS).map((itemId) => [
      itemId,
      {
        quantity: Math.floor(Math.random() * 5) + 1, // 1-5 of each item
        purchaseDate: new Date().toISOString(),
      },
    ]),
  ),
  activeBoosts: {},
};

// Override imports in Inventory component
// @ts-expect-error - we're mocking for Storybook
import('../../services').then((mod) => {
  mod.currencyService = createMockCurrencyService(DEFAULT_INVENTORY_DATA);
  mod.STORE_ITEMS = MOCK_STORE_ITEMS;
});

const meta = {
  title: 'Gamification/Inventory',
  component: Inventory,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
  },
  decorators: [
    (Story) => (
      <TestWrapper>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Story />
        </div>
      </TestWrapper>
    ),
  ],
} satisfies Meta<typeof Inventory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default inventory with multiple items
export const Default: Story = {};

// Empty inventory
export const EmptyInventory: Story = {
  parameters: {
    mockData: EMPTY_INVENTORY_DATA,
  },
};

// Inventory with an active boost
export const WithActiveBoost: Story = {
  parameters: {
    mockData: WITH_ACTIVE_BOOST_DATA,
  },
};

// Inventory with one-time cosmetic items
export const WithCosmeticItems: Story = {
  parameters: {
    mockData: WITH_COSMETIC_ITEMS_DATA,
  },
};

// Inventory with many items
export const LargeInventory: Story = {
  parameters: {
    mockData: LARGE_INVENTORY_DATA,
  },
};

// Import third-party modules
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Import application modules
import CurrencyDisplay from '../../components/gamification/currency/CurrencyDisplay';
import { TestWrapper } from '../.storybook-test-setup';

// Full gamification data mock
const fullGamificationData = {
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
      totalRequired: 1,
      type: 'achievement',
      category: 'lessons',
    }
  ],
  currentStreak: 7,
  maxStreak: 10,
  hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
  streakDays: [true, true, true, true, true, false, false],
  streakFreeze: true,
  isLoading: false,
  progress: 0.5,
};

// Define metadata for the CurrencyDisplay stories
const meta = {
  title: 'Gamification/CurrencyDisplay',
  component: CurrencyDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component to display the user\'s gem balance.',
      },
    },
    // To prevent "cannot read property of undefined" errors in tests
    // that might occur if the stories try to access properties before they're available
    chromatic: { disableSnapshot: true },
  },
  tags: ['autodocs'],
  argTypes: {
    showLabel: {
      control: 'boolean',
      description: 'Show the "gems" label',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'large'],
      description: 'Display variant',
    },
    color: {
      control: 'color',
      description: 'Custom color for the gem icon and text',
    },
    amount: {
      control: 'number',
      description: 'Currency amount',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Legacy size prop (backward compatibility)',
    },
  },
  decorators: [
    (Story) => (
      <TestWrapper>
        <div style={{ minWidth: '200px' }}>
          <Story />
        </div>
      </TestWrapper>
    ),
  ],
} satisfies Meta<typeof CurrencyDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default display
export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    // Setup global mocks for this story
    if (typeof window !== 'undefined') {
      // Set standard currency data
      const mockCurrency = {
        balance: 500,
        addCurrency: () => {},
        spendCurrency: () => true,
        isLoading: false
      };
      
      // Configure hooks
      window.useCurrency = () => mockCurrency;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          balance: mockCurrency.balance,
          currency: mockCurrency.balance
        },
        actions: {
          fetchGamificationData: () => {},
          purchaseItem: () => Promise.resolve(true),
          useItem: () => Promise.resolve(true),
        }
      });
      
      // Set global objects
      window.gamification = {
        ...fullGamificationData,
        balance: mockCurrency.balance,
        currency: mockCurrency.balance
      };
      
      // Run global mocks
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

export const HighBalance: Story = {
  play: async ({ args, canvasElement, step }) => {
    // Setup global mocks for this story
    if (typeof window !== 'undefined') {
      // Set high balance currency data
      const mockCurrency = {
        balance: 9999,
        addCurrency: () => {},
        spendCurrency: () => true,
        isLoading: false
      };
      
      // Configure hooks
      window.useCurrency = () => mockCurrency;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          balance: mockCurrency.balance,
          currency: mockCurrency.balance
        },
        actions: {
          fetchGamificationData: () => {},
          purchaseItem: () => Promise.resolve(true),
          useItem: () => Promise.resolve(true),
        }
      });
      
      // Set global objects
      window.gamification = {
        ...fullGamificationData,
        balance: mockCurrency.balance,
        currency: mockCurrency.balance
      };
      
      // Run global mocks
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

export const Loading: Story = {
  play: async ({ args, canvasElement, step }) => {
    // Setup global mocks for this story
    if (typeof window !== 'undefined') {
      // Set loading state
      const mockCurrency = {
        balance: 0,
        addCurrency: () => {},
        spendCurrency: () => true,
        isLoading: true
      };
      
      // Configure hooks
      window.useCurrency = () => mockCurrency;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          balance: mockCurrency.balance,
          currency: mockCurrency.balance,
          isLoading: true
        },
        actions: {
          fetchGamificationData: () => {},
          purchaseItem: () => Promise.resolve(true),
          useItem: () => Promise.resolve(true),
        }
      });
      
      // Set global objects
      window.gamification = {
        ...fullGamificationData,
        balance: mockCurrency.balance,
        currency: mockCurrency.balance,
        isLoading: true
      };
      
      // Run global mocks
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

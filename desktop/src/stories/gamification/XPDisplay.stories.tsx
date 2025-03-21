import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { XPDisplay } from '../../components/gamification/progress';
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

const meta = {
  title: 'Gamification/XPDisplay',
  component: XPDisplay,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TestWrapper>
        <div style={{ width: '300px' }}>
          <Story />
        </div>
      </TestWrapper>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof XPDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement, step }) => {
    // Setup global mocks for this story
    if (typeof window !== 'undefined') {
      // Set standard XP data
      const mockXP = {
        level: 5,
        xp: 1250,
        nextLevelXP: 2500,
        progress: 0.5,
        isLoading: false,
      };
      
      // Configure hooks
      window.useXP = () => mockXP;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          level: mockXP.level,
          xp: mockXP.xp,
          progress: mockXP.progress
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
        level: mockXP.level,
        xp: mockXP.xp,
        progress: mockXP.progress
      };
      
      // Run global mocks
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

export const LevelOne: Story = {
  play: async ({ args, canvasElement, step }) => {
    // Setup global mocks for this story
    if (typeof window !== 'undefined') {
      // Configure low level XP data
      const mockXP = {
        level: 1,
        xp: 50,
        nextLevelXP: 200,
        progress: 0.25,
        isLoading: false,
      };
      
      // Configure hooks
      window.useXP = () => mockXP;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          level: mockXP.level,
          xp: mockXP.xp,
          progress: mockXP.progress
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
        level: mockXP.level,
        xp: mockXP.xp,
        progress: mockXP.progress
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
      // Configure loading state
      const mockXP = {
        level: 0,
        xp: 0,
        nextLevelXP: 0,
        progress: 0,
        isLoading: true,
      };
      
      // Configure hooks
      window.useXP = () => mockXP;
      
      window.useGamificationRedux = () => ({
        gamification: {
          ...fullGamificationData,
          level: mockXP.level,
          xp: mockXP.xp,
          progress: mockXP.progress,
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
        level: mockXP.level,
        xp: mockXP.xp,
        progress: mockXP.progress,
        isLoading: true
      };
      
      // Run global mocks
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

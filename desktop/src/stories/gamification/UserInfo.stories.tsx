import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import UserInfo from '../../components/profile/UserInfo';
import { TestWrapper } from '../.storybook-test-setup';

// Interface for attaching hooks to window
interface WindowWithMocks extends Window {
  useUserProgressRedux?: () => any;
  useGamificationRedux?: () => any;
}

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

// Create a mock provider for the UserInfo component
const MockUserProvider: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
}> = ({ children, isLoading = false }) => {
  // Mock the hooks that UserInfo uses
  React.useEffect(() => {
    const windowWithMocks = window as WindowWithMocks;
    
    // Store original hooks to restore later
    const originalUseUserProgressRedux = windowWithMocks.useUserProgressRedux;
    const originalUseGamificationRedux = windowWithMocks.useGamificationRedux;
    
    // Override the useUserProgressRedux hook with our mocked version
    windowWithMocks.useUserProgressRedux = () => ({
      level: 5,
      xp: 1250,
      totalLessonsCompleted: 48,
      streak: 7,
      lastActive: new Date().toISOString(),
      isLoading: isLoading,
    });
    
    // Also override gamification redux for components that might use that
    windowWithMocks.useGamificationRedux = () => ({
      gamification: {
        ...fullGamificationData,
        isLoading: isLoading,
      },
      actions: {
        fetchGamificationData: () => {},
        purchaseItem: () => Promise.resolve(true),
        useItem: () => Promise.resolve(true),
      }
    });
    
    // Directly set up global objects that might be accessed
    // @ts-ignore
    window.gamification = {
      ...fullGamificationData,
      isLoading: isLoading,
    };
    
    // Create router flags
    // @ts-ignore
    window.__inRouterContext = true;
    // @ts-ignore
    window.__hasRouterContext = true;
    
    // Restore the original hooks when the component unmounts
    return () => {
      windowWithMocks.useUserProgressRedux = originalUseUserProgressRedux;
      windowWithMocks.useGamificationRedux = originalUseGamificationRedux;
    };
  }, [isLoading]);

  return <>{children}</>;
};

// Define metadata for the UserInfo stories
const meta = {
  title: 'Gamification/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
  },
  decorators: [
    (Story, context) => (
      <TestWrapper>
        <BrowserRouter>
          <MockUserProvider isLoading={context.args.loading}>
            <Story />
          </MockUserProvider>
        </BrowserRouter>
      </TestWrapper>
    ),
  ],
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

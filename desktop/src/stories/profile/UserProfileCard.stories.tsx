import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryFn } from '@storybook/react';

import UserProfileCard from '@/components/profile/UserProfileCard';

// Set up global mocks for the hooks used within child components
// This ensures that even if Redux fails, the components can fallback to these hook implementations
if (typeof window !== 'undefined') {
  // Mock useGamificationRedux hook with the data needed by components
  window.useGamificationRedux = () => ({
    level: 5,
    getXP: () => 1250,
    getLevelProgress: () => 65,
    getCurrentStreak: () => 7,
    currentStreak: 7,
    longestStreak: 14,
  });
  
  // Mock useXP hook
  window.useXP = () => ({
    level: 5,
    totalXP: 1250,
    currentLevelXP: 650,
    nextLevelXP: 1000,
    progress: 0.65,
    levelTitle: 'Keyboard Enthusiast',
    xpHistory: [{ date: new Date().toISOString().split('T')[0], amount: 50 }],
    levelHistory: [],
  });
}

// Create a comprehensive mock store for Redux
const mockStore = configureStore({
  reducer: (state = {
    user: {
      isAuthenticated: true,
      username: 'Test User',
      email: 'test@example.com',
    },
    gamification: {
      level: 5,
      xp: {
        totalXP: 1250,
        currentLevelXP: 650,
        nextLevelXP: 1000,
      },
      currency: {
        balance: 500,
      },
      hearts: {
        current: 5,
        max: 5,
        nextRegeneration: new Date().getTime() + 3600000,
      },
      streak: {
        currentStreak: 7,
        longestStreak: 14,
        lastPracticeDate: new Date().toISOString().split('T')[0],
        freezesAvailable: 2,
      },
      achievements: [],
      inventory: [],
      isLoading: false,
    },
  }) => state,
});

export default {
  title: 'Profile/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
  argTypes: {
    username: { control: 'text', description: 'Username to display' },
    email: { control: 'text', description: 'Email to display' },
    avatarUrl: { control: 'text', description: 'URL for the user avatar' },
    onEditProfile: { action: 'editProfileClicked' },
  },
} as Meta;

const Template: StoryFn = (args) => <UserProfileCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  username: 'Keyboard Enthusiast',
  email: 'user@example.com',
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  username: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
};

export const WithoutEditButton = Template.bind({});
WithoutEditButton.args = {
  username: 'John Doe',
  email: 'john.doe@example.com',
  onEditProfile: undefined,
};

export const LongText = Template.bind({});
LongText.args = {
  username: 'Verylongusernamewithnospaces Thatisverylong',
  email: 'veryverylongemailaddressthatwontfitononelinenormally@verylongdomainname.com',
};

export const CustomAvatar = Template.bind({});
CustomAvatar.args = {
  username: 'Alex Johnson',
  email: 'alex@example.com',
  avatarUrl: 'https://mui.com/static/images/avatar/3.jpg',
}; 

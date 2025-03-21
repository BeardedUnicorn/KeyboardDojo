import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import LevelUpNotification from '../../components/gamification/notifications/LevelUpNotification';

// Mock the xpService
jest.mock('../../../services', () => ({
  xpService: {
    getLevelTitle: (level: number) => {
      const titles = [
        'Keyboard Novice',
        'Keyboard Apprentice',
        'Keyboard Enthusiast',
        'Keyboard Adept',
        'Keyboard Expert',
        'Keyboard Master',
        'Keyboard Guru',
        'Keyboard Legend',
        'Keyboard Virtuoso',
        'Keyboard Demigod',
      ];
      return titles[Math.min(level - 1, titles.length - 1)];
    },
  },
}));

// Define metadata for the LevelUpNotification stories
const meta = {
  title: 'Gamification/LevelUpNotification',
  component: LevelUpNotification,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'The level achieved',
    },
    title: {
      control: 'text',
      description: 'Custom title for the level (overrides default)',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when notification is closed',
    },
    autoHideDuration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-hiding',
    },
  },
} satisfies Meta<typeof LevelUpNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock close handler
const handleClose = () => {
  console.log('Level up notification closed');
};

// Level 2 - Beginner
export const Level2: Story = {
  args: {
    level: 2,
    onClose: handleClose,
    autoHideDuration: 5000,
  },
};

// Level 5 - Intermediate
export const Level5: Story = {
  args: {
    level: 5,
    onClose: handleClose,
    autoHideDuration: 5000,
  },
};

// Level 10 - Advanced
export const Level10: Story = {
  args: {
    level: 10,
    onClose: handleClose,
    autoHideDuration: 5000,
  },
};

// Custom title
export const CustomTitle: Story = {
  args: {
    level: 7,
    title: 'Shortcut Maestro',
    onClose: handleClose,
    autoHideDuration: 5000,
  },
};

// Longer duration
export const LongerDuration: Story = {
  args: {
    level: 3,
    onClose: handleClose,
    autoHideDuration: 10000,
  },
};

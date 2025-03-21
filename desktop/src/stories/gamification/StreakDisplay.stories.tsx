import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import StreakDisplay from '@/components/gamification/progress/StreakDisplay';

const meta = {
  title: 'Gamification/Progress/StreakDisplay',
  component: StreakDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    days: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Number of days in the current streak',
    },
    compact: {
      control: 'boolean',
      description: 'Display in compact mode',
    },
    showFreeze: {
      control: 'boolean',
      description: 'Show available streak freezes',
    },
    showLongest: {
      control: 'boolean',
      description: 'Show the longest streak record',
    },
    onStreakClick: { action: 'streakClicked' },
  },
} satisfies Meta<typeof StreakDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default streak display
export const Default: Story = {
  args: {
    days: 7,
    showFreeze: true,
    showLongest: true,
  },
};

// Short streak
export const ShortStreak: Story = {
  args: {
    days: 2,
    showFreeze: true,
    showLongest: true,
  },
};

// Medium streak
export const MediumStreak: Story = {
  args: {
    days: 10,
    showFreeze: true,
    showLongest: true,
  },
};

// Long streak
export const LongStreak: Story = {
  args: {
    days: 21,
    showFreeze: true,
    showLongest: true,
  },
};

// Very long streak
export const VeryLongStreak: Story = {
  args: {
    days: 35,
    showFreeze: true,
    showLongest: true,
  },
};

// Compact mode
export const Compact: Story = {
  args: {
    days: 7,
    compact: true,
    showFreeze: true,
  },
};

// Without freezes
export const WithoutFreezes: Story = {
  args: {
    days: 7,
    showFreeze: false,
    showLongest: true,
  },
};

// Without longest streak
export const WithoutLongest: Story = {
  args: {
    days: 7,
    showFreeze: true,
    showLongest: false,
  },
};

// Minimal display
export const Minimal: Story = {
  args: {
    days: 7,
    showFreeze: false,
    showLongest: false,
  },
};

// Compact minimal
export const CompactMinimal: Story = {
  args: {
    days: 7,
    compact: true,
    showFreeze: false,
  },
};

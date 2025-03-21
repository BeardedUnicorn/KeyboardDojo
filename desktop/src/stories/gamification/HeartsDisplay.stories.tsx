import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import HeartsDisplay from '@/components/gamification/progress/HeartsDisplay';

// Mock the hearts service
jest.mock('@/services/heartsService', () => ({
  heartsService: {
    getHeartsData: () => ({
      current: 3,
      max: 5,
      lastUpdated: new Date().toISOString(),
    }),
    getMaxHearts: () => 5,
    getTimeUntilNextHeart: () => 8 * 60 * 1000, // 8 minutes
    subscribe: (callback: any) => {},
    unsubscribe: (callback: any) => {},
  },
}));

// Mock the HEARTS_CONFIG
jest.mock('@/services', () => ({
  HEARTS_CONFIG: {
    REGENERATION_TIME_MINUTES: 30,
    MAX_HEARTS: 5,
  },
}));

const meta = {
  title: 'Gamification/Progress/HeartsDisplay',
  component: HeartsDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showLabel: {
      control: 'boolean',
      description: 'Show hearts label',
    },
    variant: {
      control: { type: 'select', options: ['default', 'compact', 'large'] },
      description: 'Display variant',
    },
    showRefillTimer: {
      control: 'boolean',
      description: 'Show timer for next heart refill',
    },
    color: {
      control: 'color',
      description: 'Custom color for hearts',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Legacy size option (use variant instead)',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip with heart information',
    },
    showRefill: {
      control: 'boolean',
      description: 'Legacy showRefill option (use showRefillTimer instead)',
    },
    vertical: {
      control: 'boolean',
      description: 'Display hearts and timer in vertical layout',
    },
  },
} satisfies Meta<typeof HeartsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default hearts display (3/5 hearts)
export const Default: Story = {
  args: {
    showLabel: true,
    variant: 'default',
    showRefillTimer: true,
    showTooltip: true,
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    showLabel: false,
    variant: 'compact',
    showRefillTimer: true,
    showTooltip: true,
  },
};

// Large variant
export const Large: Story = {
  args: {
    showLabel: true,
    variant: 'large',
    showRefillTimer: true,
    showTooltip: true,
  },
};

// Without refill timer
export const WithoutRefillTimer: Story = {
  args: {
    showLabel: true,
    variant: 'default',
    showRefillTimer: false,
    showTooltip: true,
  },
};

// Without label
export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    variant: 'default',
    showRefillTimer: true,
    showTooltip: true,
  },
};

// Custom color
export const CustomColor: Story = {
  args: {
    showLabel: true,
    variant: 'default',
    showRefillTimer: true,
    showTooltip: true,
    color: '#8e44ad',
  },
};

// Vertical layout
export const VerticalLayout: Story = {
  args: {
    showLabel: true,
    variant: 'default',
    showRefillTimer: true,
    showTooltip: true,
    vertical: true,
  },
};

// Legacy size prop (small)
export const LegacySizeSmall: Story = {
  args: {
    showLabel: true,
    size: 'small',
    showRefillTimer: true,
    showTooltip: true,
  },
};

// Legacy size prop (large)
export const LegacySizeLarge: Story = {
  args: {
    showLabel: true,
    size: 'large',
    showRefillTimer: true,
    showTooltip: true,
  },
};

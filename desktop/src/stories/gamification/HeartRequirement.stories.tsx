import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import HeartRequirement from '@/components/gamification/progress/HeartRequirement';

// Mock the hearts service
jest.mock('@/services', () => ({
  heartsService: {
    getHeartsData: jest.fn(),
    useHearts: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  },
}));

// Mock HeartsDisplay component
jest.mock('@/components/gamification/progress/HeartsDisplay', () => {
  return function MockHeartsDisplay(props: any) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: 'red', fontSize: '16px', marginRight: '4px' }}>❤️</span>
        <span>3/5</span>
      </div>
    );
  };
});

const meta = {
  title: 'Gamification/Progress/HeartRequirement',
  component: HeartRequirement,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of hearts required',
    },
    onContinue: { action: 'continued' },
    onCancel: { action: 'canceled' },
    lessonTitle: {
      control: 'text',
      description: 'Optional lesson title',
    },
  },
} satisfies Meta<typeof HeartRequirement>;

export default meta;
type Story = StoryObj<typeof meta>;

// Enough hearts scenario
export const EnoughHearts: Story = {
  args: {
    required: 1,
    lessonTitle: 'Advanced Shortcuts',
  },
  decorators: [
    (Story) => {
      // Setup the mock to return enough hearts
      const getHeartsData = jest.fn().mockReturnValue({
        current: 3,
        max: 5,
        isPremium: false,
      });

      // @ts-expect-error: mock implementation
      require('@/services').heartsService.getHeartsData = getHeartsData;

      return <Story />;
    },
  ],
};

// Not enough hearts scenario
export const NotEnoughHearts: Story = {
  args: {
    required: 3,
    lessonTitle: 'Advanced Shortcuts',
  },
  decorators: [
    (Story) => {
      // Setup the mock to return not enough hearts
      const getHeartsData = jest.fn().mockReturnValue({
        current: 2,
        max: 5,
        isPremium: false,
      });

      // @ts-expect-error: mock implementation
      require('@/services').heartsService.getHeartsData = getHeartsData;

      return <Story />;
    },
  ],
};

// Premium user scenario (no hearts required)
export const PremiumUser: Story = {
  args: {
    required: 3,
    lessonTitle: 'Advanced Shortcuts',
  },
  decorators: [
    (Story) => {
      // Setup the mock to return premium user
      const getHeartsData = jest.fn().mockReturnValue({
        current: 1,
        max: 5,
        isPremium: true,
      });

      // @ts-expect-error: mock implementation
      require('@/services').heartsService.getHeartsData = getHeartsData;

      return <Story />;
    },
  ],
};

// Higher requirement
export const HighRequirement: Story = {
  args: {
    required: 5,
    lessonTitle: 'Expert Shortcuts',
  },
  decorators: [
    (Story) => {
      // Setup the mock to return some hearts
      const getHeartsData = jest.fn().mockReturnValue({
        current: 3,
        max: 5,
        isPremium: false,
      });

      // @ts-expect-error: mock implementation
      require('@/services').heartsService.getHeartsData = getHeartsData;

      return <Story />;
    },
  ],
};

// No lesson title
export const NoLessonTitle: Story = {
  args: {
    required: 2,
  },
  decorators: [
    (Story) => {
      // Setup the mock to return enough hearts
      const getHeartsData = jest.fn().mockReturnValue({
        current: 3,
        max: 5,
        isPremium: false,
      });

      // @ts-expect-error: mock implementation
      require('@/services').heartsService.getHeartsData = getHeartsData;

      return <Story />;
    },
  ],
};

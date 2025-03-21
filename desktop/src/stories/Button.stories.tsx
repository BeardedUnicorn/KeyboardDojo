import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/shared/Button';
import { TestWrapper } from './.storybook-test-setup';

// Define metadata for the Button stories
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // Add tags to ensure correct test configuration
    tags: ['autodocs'],
  },
  // Add a decorator to wrap all stories with our TestWrapper
  decorators: [
    (Story) => (
      <TestWrapper>
        <Story />
      </TestWrapper>
    ),
  ],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'The color of the button',
    },
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'The variant of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    success: {
      control: 'boolean',
      description: 'Whether the button is in a success state',
    },
    error: {
      control: 'boolean',
      description: 'Whether the button is in an error state',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define the primary story with default args
export const Primary: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'contained',
    size: 'medium',
  },
};

// Define a secondary story with different args
export const Secondary: Story = {
  args: {
    children: 'Button',
    color: 'secondary',
    variant: 'contained',
    size: 'medium',
  },
};

// Define an outlined button story
export const Outlined: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'outlined',
    size: 'medium',
  },
};

// Define a text button story
export const Text: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'text',
    size: 'medium',
  },
};

// Define a small button story
export const Small: Story = {
  args: {
    children: 'Small Button',
    color: 'primary',
    variant: 'contained',
    size: 'small',
  },
};

// Define a large button story
export const Large: Story = {
  args: {
    children: 'Large Button',
    color: 'primary',
    variant: 'contained',
    size: 'large',
  },
};

// Define a disabled button story
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    color: 'primary',
    variant: 'contained',
    size: 'medium',
    disabled: true,
    disabledTooltip: 'This button is disabled',
  },
};

// Define a loading button story
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    color: 'primary',
    variant: 'contained',
    size: 'medium',
    loading: true,
    loadingText: 'Loading...',
  },
};

// Define a success button story
export const Success: Story = {
  args: {
    children: 'Success Button',
    color: 'primary',
    variant: 'contained',
    size: 'medium',
    success: true,
  },
};

// Define an error button story
export const Error: Story = {
  args: {
    children: 'Error Button',
    color: 'primary',
    variant: 'contained',
    size: 'medium',
    error: true,
  },
}; 
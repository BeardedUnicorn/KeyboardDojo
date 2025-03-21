import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SettingsPanel from '@/components/settings/SettingsPanel';

// Mock the loggerService
jest.mock('@/services', () => ({
  loggerService: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock localStorage for settings
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
    getAll: () => store,
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const meta = {
  title: 'Profile/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the settings panel is open',
    },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default settings
export const Default: Story = {
  args: {
    open: true,
  },
  decorators: [
    (Story) => {
      // Clear localStorage before the story renders
      window.localStorage.clear();
      return <Story />;
    },
  ],
};

// With custom settings
export const WithCustomSettings: Story = {
  args: {
    open: true,
  },
  decorators: [
    (Story) => {
      // Set custom settings in localStorage
      window.localStorage.setItem('app-settings', JSON.stringify({
        startWithSystem: false,
        minimizeToTray: true,
        showNotifications: false,
        fontSize: 16,
        keyboardLayout: 'dvorak',
        autoSave: true,
        autoUpdate: false,
      }));
      return <Story />;
    },
  ],
};

// With larger font size
export const LargerFontSize: Story = {
  args: {
    open: true,
  },
  decorators: [
    (Story) => {
      // Set custom settings with larger font
      window.localStorage.setItem('app-settings', JSON.stringify({
        startWithSystem: true,
        minimizeToTray: true,
        showNotifications: true,
        fontSize: 18,
        keyboardLayout: 'qwerty',
        autoSave: true,
        autoUpdate: true,
      }));
      return <Story />;
    },
  ],
};

// With different keyboard layout
export const AlternativeKeyboardLayout: Story = {
  args: {
    open: true,
  },
  decorators: [
    (Story) => {
      // Set settings with alternative keyboard layout
      window.localStorage.setItem('app-settings', JSON.stringify({
        startWithSystem: true,
        minimizeToTray: true,
        showNotifications: true,
        fontSize: 14,
        keyboardLayout: 'colemak',
        autoSave: true,
        autoUpdate: true,
      }));
      return <Story />;
    },
  ],
};

// Closed panel
export const Closed: Story = {
  args: {
    open: false,
  },
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ShortcutChallenge from '../../components/exercises/ShortcutChallenge';

// Mock callback functions for stories
const onSuccessMock = () => {
  console.log('Shortcut challenge completed successfully');
};

const onSkipMock = () => {
  console.log('Shortcut challenge skipped');
};

const onHintMock = () => {
  console.log('Hint requested for shortcut challenge');
};

// Define metadata for the ShortcutChallenge stories
const meta = {
  title: 'Exercises/ShortcutChallenge',
  component: ShortcutChallenge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    shortcut: {
      control: 'text',
      description: 'The shortcut (Windows/Linux format)',
    },
    shortcutMac: {
      control: 'text',
      description: 'Mac-specific shortcut format',
    },
    shortcutLinux: {
      control: 'text',
      description: 'Linux-specific shortcut format',
    },
    description: {
      control: 'text',
      description: 'Description of what the shortcut does',
    },
    context: {
      control: 'text',
      description: 'Optional context where the shortcut is used',
    },
    application: {
      control: 'select',
      options: ['vscode', 'intellij', 'cursor'],
      description: 'The application context for styling',
    },
    showKeyboard: {
      control: 'boolean',
      description: 'Whether to show keyboard visualization',
    },
    onSuccess: { action: 'success' },
    onSkip: { action: 'skip' },
    onHint: { action: 'hint' },
  },
} satisfies Meta<typeof ShortcutChallenge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define the primary story with default args
export const Default: Story = {
  args: {
    shortcut: 'Ctrl+C',
    shortcutMac: '⌘+C',
    description: 'Copy selected text',
    application: 'vscode',
    showKeyboard: true,
    onSuccess: onSuccessMock,
    onSkip: onSkipMock,
    onHint: onHintMock,
  },
};

// VSCode specific shortcut
export const VSCodeShortcut: Story = {
  args: {
    shortcut: 'Ctrl+Shift+P',
    shortcutMac: '⌘+Shift+P',
    description: 'Show Command Palette',
    context: 'Command Palette allows you to search and execute commands in VSCode',
    application: 'vscode',
    showKeyboard: true,
    onSuccess: onSuccessMock,
    onSkip: onSkipMock,
    onHint: onHintMock,
  },
};

// IntelliJ specific shortcut
export const IntelliJShortcut: Story = {
  args: {
    shortcut: 'Alt+Insert',
    shortcutMac: '⌘+N',
    description: 'Generate Code',
    context: 'This shortcut opens the code generation menu in IntelliJ',
    application: 'intellij',
    showKeyboard: true,
    onSuccess: onSuccessMock,
    onSkip: onSkipMock,
    onHint: onHintMock,
  },
};

// Cursor specific shortcut
export const CursorShortcut: Story = {
  args: {
    shortcut: 'Ctrl+K Ctrl+S',
    shortcutMac: '⌘+K ⌘+S',
    description: 'Keyboard Shortcuts',
    context: 'This shortcut opens the keyboard shortcuts editor in Cursor',
    application: 'cursor',
    showKeyboard: true,
    onSuccess: onSuccessMock,
    onSkip: onSkipMock,
    onHint: onHintMock,
  },
};

// Without keyboard visualization
export const WithoutKeyboard: Story = {
  args: {
    shortcut: 'Ctrl+S',
    shortcutMac: '⌘+S',
    description: 'Save the current file',
    application: 'vscode',
    showKeyboard: false,
    onSuccess: onSuccessMock,
    onSkip: onSkipMock,
    onHint: onHintMock,
  },
};

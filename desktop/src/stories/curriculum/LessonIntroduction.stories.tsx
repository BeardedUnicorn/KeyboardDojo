import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import LessonIntroduction from '@/components/curriculum/LessonIntroduction';

const meta: Meta<typeof LessonIntroduction> = {
  title: 'Curriculum/LessonIntroduction',
  component: LessonIntroduction,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    onContinue: { action: 'continue clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof LessonIntroduction>;

// Basic lesson introduction
export const BasicLesson: Story = {
  args: {
    title: 'Navigation Shortcuts',
    description: 'Learn essential navigation shortcuts to move around efficiently in your editor without using the mouse.',
    shortcuts: [
      {
        name: 'Go to Line',
        description: 'Quickly navigate to a specific line number in your file',
        shortcutWindows: 'Ctrl+G',
        shortcutMac: 'Cmd+G',
      },
      {
        name: 'Find in File',
        description: 'Search for text within the current file',
        shortcutWindows: 'Ctrl+F',
        shortcutMac: 'Cmd+F',
      },
      {
        name: 'Go to Definition',
        description: 'Jump to the definition of a symbol',
        shortcutWindows: 'F12',
        shortcutMac: 'F12',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic lesson introduction with navigation shortcuts.',
      },
    },
  },
};

// Advanced lesson with complex shortcuts
export const AdvancedLesson: Story = {
  args: {
    title: 'Advanced Code Navigation',
    description: 'Master complex code navigation techniques that will significantly boost your productivity when working with large codebases.',
    shortcuts: [
      {
        name: 'Quick File Navigation',
        description: 'Quickly open any file in your project by name',
        shortcutWindows: 'Ctrl+P',
        shortcutMac: 'Cmd+P',
      },
      {
        name: 'Go to Symbol',
        description: 'Navigate directly to functions, classes, or methods',
        shortcutWindows: 'Ctrl+Shift+O',
        shortcutMac: 'Cmd+Shift+O',
      },
      {
        name: 'Find References',
        description: 'Find all references to a symbol throughout your codebase',
        shortcutWindows: 'Shift+F12',
        shortcutMac: 'Shift+F12',
      },
      {
        name: 'Toggle Terminal',
        description: 'Show or hide the integrated terminal',
        shortcutWindows: 'Ctrl+`',
        shortcutMac: 'Ctrl+`',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced lesson introduction with complex shortcuts.',
      },
    },
  },
};

// Lesson with animation
export const LessonWithAnimation: Story = {
  args: {
    title: 'Code Refactoring Shortcuts',
    description: 'Learn powerful shortcuts to help you refactor code quickly and safely.',
    animation: 'https://via.placeholder.com/500x200?text=Refactoring+Animation',
    shortcuts: [
      {
        name: 'Rename Symbol',
        description: 'Rename a variable, function, or class across your entire codebase',
        shortcutWindows: 'F2',
        shortcutMac: 'F2',
      },
      {
        name: 'Extract Method',
        description: 'Extract selected code into a new method',
        shortcutWindows: 'Ctrl+Shift+M',
        shortcutMac: 'Cmd+Shift+M',
      },
      {
        name: 'Format Document',
        description: 'Format the entire document according to code style rules',
        shortcutWindows: 'Shift+Alt+F',
        shortcutMac: 'Shift+Option+F',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Lesson introduction with animation showing the shortcuts in action.',
      },
    },
  },
};

// Beginner-friendly lesson with fewer shortcuts
export const BeginnerLesson: Story = {
  args: {
    title: 'Getting Started with Shortcuts',
    description: 'Begin your journey with these essential shortcuts that every developer should know.',
    shortcuts: [
      {
        name: 'Save File',
        description: 'Save your current work',
        shortcutWindows: 'Ctrl+S',
        shortcutMac: 'Cmd+S',
      },
      {
        name: 'Copy',
        description: 'Copy selected text to clipboard',
        shortcutWindows: 'Ctrl+C',
        shortcutMac: 'Cmd+C',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Beginner-friendly lesson with simple, fundamental shortcuts.',
      },
    },
  },
}; 
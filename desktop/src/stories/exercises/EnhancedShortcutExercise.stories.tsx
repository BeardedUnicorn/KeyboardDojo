import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EnhancedShortcutExercise from '../../components/exercises/EnhancedShortcutExercise';

// Mock callback functions for stories
const onSuccessMock = () => {
  console.log('Shortcut exercise completed successfully');
};

const onFailureMock = () => {
  console.log('Shortcut exercise attempt failed');
};

// Define metadata for the EnhancedShortcutExercise stories
const meta = {
  title: 'Exercises/EnhancedShortcutExercise',
  component: EnhancedShortcutExercise,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the shortcut exercise',
    },
    description: {
      control: 'text',
      description: 'Detailed description of what the user needs to do',
    },
    context: {
      control: 'text',
      description: 'The context in which the shortcut is used',
    },
    shortcut: {
      control: 'object',
      description: 'The shortcut definition object',
    },
    difficulty: {
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced', 'expert'],
      description: 'The difficulty level of the exercise',
    },
    codeContext: {
      control: 'object',
      description: 'Optional code context to display',
    },
    onSuccess: { action: 'success' },
    onFailure: { action: 'failure' },
  },
} satisfies Meta<typeof EnhancedShortcutExercise>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define the primary story with default args
export const Default: Story = {
  args: {
    title: 'Copy Text',
    description: 'Use the keyboard shortcut to copy selected text.',
    context: 'You\'re editing a document and need to copy a selection of text to paste elsewhere.',
    shortcut: {
      id: 'copy',
      name: 'Copy',
      shortcutWindows: 'Ctrl+C',
      shortcutMac: '⌘+C',
      shortcutLinux: 'Ctrl+C',
      category: 'editing',
      description: 'Copy selected text or items to clipboard',
    },
    difficulty: 'beginner',
    feedbackSuccess: {
      message: 'Great job! You copied the text.',
      mascotReaction: 'That\'s one of the most common shortcuts!',
    },
    feedbackFailure: {
      message: 'Not quite right. Try pressing the Copy shortcut.',
      mascotReaction: 'Don\'t worry, you\'ll get it next time!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// Shortcut exercise with code context
export const WithCodeContext: Story = {
  args: {
    ...Default.args,
    title: 'Comment Line',
    description: 'Use the keyboard shortcut to comment the current line.',
    context: 'You\'re writing code and need to quickly comment out a line.',
    shortcut: {
      id: 'comment-line',
      name: 'Comment Line',
      shortcutWindows: 'Ctrl+/',
      shortcutMac: '⌘+/',
      shortcutLinux: 'Ctrl+/',
      category: 'editing',
      description: 'Comment or uncomment the current line',
    },
    codeContext: {
      beforeCode: 'function calculateSum(a, b) {\n',
      afterCode: '  return a + b;\n}',
      highlightLines: [1],
    },
    feedbackSuccess: {
      message: 'Perfect! You commented the line.',
      mascotReaction: 'This is a very useful shortcut for programmers!',
    },
    feedbackFailure: {
      message: 'Not quite right. Try pressing the Comment shortcut.',
      mascotReaction: 'This shortcut will save you lots of time!',
    },
  },
};

// Advanced difficulty shortcut
export const AdvancedShortcut: Story = {
  args: {
    title: 'Multiple Cursors',
    description: 'Add multiple cursors to edit multiple lines simultaneously.',
    context: 'You need to make the same edit on multiple lines of code.',
    shortcut: {
      id: 'multi-cursor',
      name: 'Add Cursor Below',
      shortcutWindows: 'Ctrl+Alt+Down',
      shortcutMac: '⌥+⌘+Down',
      shortcutLinux: 'Ctrl+Alt+Down',
      category: 'advanced',
      description: 'Add another cursor below the current cursor',
    },
    difficulty: 'advanced',
    codeContext: {
      beforeCode: 'const item1 = "apple";\nconst item2 = "orange";\nconst item3 = "banana";\n',
      afterCode: 'const item4 = "grape";\nconst item5 = "melon";',
      highlightLines: [0, 1, 2],
    },
    feedbackSuccess: {
      message: 'Excellent! You\'ve mastered multiple cursors.',
      mascotReaction: 'That\'s a power-user feature!',
    },
    feedbackFailure: {
      message: 'Not quite right. This is a more advanced shortcut.',
      mascotReaction: 'Advanced shortcuts take practice!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

// IDE-specific shortcut
export const IDESpecificShortcut: Story = {
  args: {
    title: 'Quick Documentation',
    description: 'Show quick documentation for the symbol at cursor.',
    context: 'You\'re working with an unfamiliar API and need to quickly check the documentation.',
    shortcut: {
      id: 'quick-docs',
      name: 'Quick Documentation',
      shortcutWindows: 'Ctrl+Q',
      shortcutMac: 'F1',
      shortcutLinux: 'Ctrl+Q',
      category: 'navigation',
      description: 'Show quick documentation',
    },
    difficulty: 'intermediate',
    codeContext: {
      beforeCode: 'import { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = ',
      afterCode: '  return (\n    <div>{count}</div>\n  );\n}',
      highlightLines: [3],
    },
    feedbackSuccess: {
      message: 'Great! You accessed the documentation.',
      mascotReaction: 'Documentation is a developer\'s best friend!',
    },
    feedbackFailure: {
      message: 'Try again. This shortcut varies by IDE.',
      mascotReaction: 'Different IDEs might use different shortcuts for this!',
    },
    onSuccess: onSuccessMock,
    onFailure: onFailureMock,
  },
};

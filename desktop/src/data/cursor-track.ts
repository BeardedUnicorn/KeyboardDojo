/**
 * Cursor Track Data
 * 
 * This file contains sample data for the Cursor application track.
 */

import { ApplicationTrack, ShortcutCategory } from '../types/curriculum';

// Cursor shortcuts by category
const aiShortcuts = [
  {
    id: 'cursor-ai-1',
    name: 'Command Palette',
    description: 'Open the command palette to access AI features',
    shortcutWindows: 'Ctrl+K',
    shortcutMac: 'Cmd+K',
    category: 'ai' as ShortcutCategory,
    context: 'You want to access Cursor\'s AI commands quickly',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-ai-2',
    name: 'Generate Code',
    description: 'Generate code with AI',
    shortcutWindows: 'Ctrl+Shift+I',
    shortcutMac: 'Cmd+Shift+I',
    category: 'ai' as ShortcutCategory,
    context: 'You want to use AI to help you implement a function',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-ai-3',
    name: 'Explain Code',
    description: 'Explain selected code with AI',
    shortcutWindows: 'Ctrl+Shift+L',
    shortcutMac: 'Cmd+Shift+L',
    category: 'ai' as ShortcutCategory,
    context: 'You want to understand what a complex piece of code does',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-ai-4',
    name: 'Debug Code',
    description: 'Debug code with AI',
    shortcutWindows: 'Ctrl+Shift+D',
    shortcutMac: 'Cmd+Shift+D',
    category: 'ai' as ShortcutCategory,
    context: 'Your code has a bug and you want AI to help find it',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'cursor-ai-5',
    name: 'Refactor Code',
    description: 'Refactor code with AI',
    shortcutWindows: 'Ctrl+Shift+R',
    shortcutMac: 'Cmd+Shift+R',
    category: 'ai' as ShortcutCategory,
    context: 'You want to improve your code\'s structure and readability',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
];

const navigationShortcuts = [
  {
    id: 'cursor-nav-1',
    name: 'Go to File',
    description: 'Quickly open a file by name',
    shortcutWindows: 'Ctrl+P',
    shortcutMac: 'Cmd+P',
    category: 'navigation' as ShortcutCategory,
    context: 'You need to open a file but don\'t want to use the file explorer',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-nav-2',
    name: 'Go to Symbol',
    description: 'Navigate to a symbol in the current file',
    shortcutWindows: 'Ctrl+Shift+O',
    shortcutMac: 'Cmd+Shift+O',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to jump to a specific function or class in your file',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'cursor-nav-3',
    name: 'Go to Line',
    description: 'Navigate to a specific line number',
    shortcutWindows: 'Ctrl+G',
    shortcutMac: 'Cmd+G',
    category: 'navigation' as ShortcutCategory,
    context: 'You need to jump to a specific line number in your file',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-nav-4',
    name: 'Go Back',
    description: 'Navigate to the previous location',
    shortcutWindows: 'Alt+Left',
    shortcutMac: 'Ctrl+-',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to return to where you were before',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-nav-5',
    name: 'Go Forward',
    description: 'Navigate to the next location',
    shortcutWindows: 'Alt+Right',
    shortcutMac: 'Ctrl+Shift+-',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to go forward in your navigation history',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
];

const editingShortcuts = [
  {
    id: 'cursor-edit-1',
    name: 'Cut Line',
    description: 'Cut the current line',
    shortcutWindows: 'Ctrl+X',
    shortcutMac: 'Cmd+X',
    category: 'editing' as ShortcutCategory,
    context: 'You want to cut the current line without selecting it first',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-edit-2',
    name: 'Copy Line',
    description: 'Copy the current line',
    shortcutWindows: 'Ctrl+C',
    shortcutMac: 'Cmd+C',
    category: 'editing' as ShortcutCategory,
    context: 'You want to copy the current line without selecting it first',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'cursor-edit-3',
    name: 'Move Line Up',
    description: 'Move the current line up',
    shortcutWindows: 'Alt+Up',
    shortcutMac: 'Option+Up',
    category: 'editing' as ShortcutCategory,
    context: 'You want to move the current line above the previous line',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'cursor-edit-4',
    name: 'Move Line Down',
    description: 'Move the current line down',
    shortcutWindows: 'Alt+Down',
    shortcutMac: 'Option+Down',
    category: 'editing' as ShortcutCategory,
    context: 'You want to move the current line below the next line',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'cursor-edit-5',
    name: 'Toggle Comment',
    description: 'Comment or uncomment the current line',
    shortcutWindows: 'Ctrl+/',
    shortcutMac: 'Cmd+/',
    category: 'editing' as ShortcutCategory,
    context: 'You want to comment out or uncomment the current line',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
];

// Cursor modules
export const cursorTrack: ApplicationTrack = {
  id: 'cursor',
  name: 'Cursor',
  description: 'Learn keyboard shortcuts for Cursor, a code editor with built-in AI capabilities.',
  icon: '🟣',
  version: '1.0.0',
  isActive: true,
  modules: [
    {
      id: 'cursor-basics',
      title: 'Cursor Basics',
      description: 'Learn the essential shortcuts for navigating and editing in Cursor.',
      category: 'navigation' as ShortcutCategory,
      difficulty: 'beginner' as const,
      order: 0,
      lessons: [
        {
          id: 'cursor-basics-1',
          title: 'Navigation Fundamentals',
          description: 'Learn how to navigate efficiently in Cursor.',
          shortcuts: navigationShortcuts.slice(0, 3),
          difficulty: 'beginner' as const,
          category: 'navigation' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 0,
        },
        {
          id: 'cursor-basics-2',
          title: 'Basic Editing',
          description: 'Learn the essential editing shortcuts in Cursor.',
          shortcuts: editingShortcuts.slice(0, 3),
          difficulty: 'beginner' as const,
          category: 'editing' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 1,
          unlockRequirements: {
            previousLessons: ['cursor-basics-1'],
          },
        },
        {
          id: 'cursor-basics-3',
          title: 'AI Fundamentals',
          description: 'Learn the basic AI shortcuts in Cursor.',
          shortcuts: aiShortcuts.slice(0, 3),
          difficulty: 'beginner' as const,
          category: 'ai' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 2,
          unlockRequirements: {
            previousLessons: ['cursor-basics-2'],
          },
        },
      ],
    },
    {
      id: 'cursor-intermediate',
      title: 'Cursor Intermediate',
      description: 'Take your Cursor skills to the next level with these intermediate shortcuts.',
      category: 'ai' as ShortcutCategory,
      difficulty: 'intermediate' as const,
      order: 1,
      unlockRequirements: {
        previousModules: ['cursor-basics'],
        xpRequired: 100,
      },
      lessons: [
        {
          id: 'cursor-intermediate-1',
          title: 'Advanced Navigation',
          description: 'Learn advanced navigation techniques in Cursor.',
          shortcuts: navigationShortcuts.slice(3, 5),
          difficulty: 'intermediate' as const,
          category: 'navigation' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 0,
        },
        {
          id: 'cursor-intermediate-2',
          title: 'Advanced Editing',
          description: 'Learn advanced editing shortcuts in Cursor.',
          shortcuts: editingShortcuts.slice(3, 5),
          difficulty: 'intermediate' as const,
          category: 'editing' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 1,
          unlockRequirements: {
            previousLessons: ['cursor-intermediate-1'],
          },
        },
        {
          id: 'cursor-intermediate-3',
          title: 'Advanced AI Features',
          description: 'Learn advanced AI shortcuts in Cursor.',
          shortcuts: aiShortcuts.slice(3, 5),
          difficulty: 'intermediate' as const,
          category: 'ai' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 2,
          unlockRequirements: {
            previousLessons: ['cursor-intermediate-2'],
          },
        },
      ],
    },
  ],
}; 
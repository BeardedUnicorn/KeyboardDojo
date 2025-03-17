/**
 * IntelliJ Track Data
 * 
 * This file contains sample data for the IntelliJ IDEA application track.
 */

import { ApplicationTrack, ShortcutCategory } from '../types/curriculum';

// IntelliJ shortcuts by category
const navigationShortcuts = [
  {
    id: 'intellij-nav-1',
    name: 'Navigate to Class',
    description: 'Quickly open a class by name',
    shortcutWindows: 'Ctrl+N',
    shortcutMac: 'Cmd+N',
    category: 'navigation' as ShortcutCategory,
    context: 'You need to open a class but don\'t want to use the project explorer',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'intellij-nav-2',
    name: 'Navigate to File',
    description: 'Quickly open a file by name',
    shortcutWindows: 'Ctrl+Shift+N',
    shortcutMac: 'Cmd+Shift+N',
    category: 'navigation' as ShortcutCategory,
    context: 'You need to open a file but don\'t want to use the project explorer',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'intellij-nav-3',
    name: 'Navigate to Symbol',
    description: 'Navigate to a symbol in the project',
    shortcutWindows: 'Ctrl+Alt+Shift+N',
    shortcutMac: 'Cmd+Option+Shift+N',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to jump to a specific function or class in your project',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'intellij-nav-4',
    name: 'Recent Files',
    description: 'Show recently opened files',
    shortcutWindows: 'Ctrl+E',
    shortcutMac: 'Cmd+E',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to quickly switch between recently opened files',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'intellij-nav-5',
    name: 'Navigate Back',
    description: 'Navigate to the previous location',
    shortcutWindows: 'Ctrl+Alt+Left',
    shortcutMac: 'Cmd+Option+Left',
    category: 'navigation' as ShortcutCategory,
    context: 'You want to return to where you were before',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
];

const editingShortcuts = [
  {
    id: 'intellij-edit-1',
    name: 'Duplicate Line',
    description: 'Duplicate the current line',
    shortcutWindows: 'Ctrl+D',
    shortcutMac: 'Cmd+D',
    category: 'editing' as ShortcutCategory,
    context: 'You want to duplicate the current line or selection',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'intellij-edit-2',
    name: 'Delete Line',
    description: 'Delete the current line',
    shortcutWindows: 'Ctrl+Y',
    shortcutMac: 'Cmd+Delete',
    category: 'editing' as ShortcutCategory,
    context: 'You want to delete the current line without selecting it first',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
  {
    id: 'intellij-edit-3',
    name: 'Move Line Up',
    description: 'Move the current line up',
    shortcutWindows: 'Alt+Shift+Up',
    shortcutMac: 'Option+Shift+Up',
    category: 'editing' as ShortcutCategory,
    context: 'You want to move the current line above the previous line',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'intellij-edit-4',
    name: 'Move Line Down',
    description: 'Move the current line down',
    shortcutWindows: 'Alt+Shift+Down',
    shortcutMac: 'Option+Shift+Down',
    category: 'editing' as ShortcutCategory,
    context: 'You want to move the current line below the next line',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'intellij-edit-5',
    name: 'Comment Line',
    description: 'Comment or uncomment the current line',
    shortcutWindows: 'Ctrl+/',
    shortcutMac: 'Cmd+/',
    category: 'editing' as ShortcutCategory,
    context: 'You want to comment out or uncomment the current line',
    difficulty: 'beginner' as const,
    xpValue: 10,
  },
];

const refactoringShortcuts = [
  {
    id: 'intellij-refactor-1',
    name: 'Rename',
    description: 'Rename a symbol',
    shortcutWindows: 'Shift+F6',
    shortcutMac: 'Shift+F6',
    category: 'refactoring' as ShortcutCategory,
    context: 'You want to rename a variable, method, or class',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'intellij-refactor-2',
    name: 'Extract Method',
    description: 'Extract selected code into a method',
    shortcutWindows: 'Ctrl+Alt+M',
    shortcutMac: 'Cmd+Option+M',
    category: 'refactoring' as ShortcutCategory,
    context: 'You want to extract a block of code into a separate method',
    difficulty: 'advanced' as const,
    xpValue: 20,
  },
  {
    id: 'intellij-refactor-3',
    name: 'Extract Variable',
    description: 'Extract selected expression into a variable',
    shortcutWindows: 'Ctrl+Alt+V',
    shortcutMac: 'Cmd+Option+V',
    category: 'refactoring' as ShortcutCategory,
    context: 'You want to extract an expression into a variable',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
  {
    id: 'intellij-refactor-4',
    name: 'Inline',
    description: 'Inline a variable, method, or parameter',
    shortcutWindows: 'Ctrl+Alt+N',
    shortcutMac: 'Cmd+Option+N',
    category: 'refactoring' as ShortcutCategory,
    context: 'You want to inline a variable, method, or parameter',
    difficulty: 'advanced' as const,
    xpValue: 20,
  },
  {
    id: 'intellij-refactor-5',
    name: 'Refactor This',
    description: 'Show refactoring options for the current context',
    shortcutWindows: 'Ctrl+Alt+Shift+T',
    shortcutMac: 'Cmd+Option+Shift+T',
    category: 'refactoring' as ShortcutCategory,
    context: 'You want to see all available refactoring options',
    difficulty: 'intermediate' as const,
    xpValue: 15,
  },
];

// IntelliJ modules
export const intellijTrack: ApplicationTrack = {
  id: 'intellij',
  name: 'IntelliJ IDEA',
  description: 'Learn keyboard shortcuts for IntelliJ IDEA, a powerful IDE for Java and other languages.',
  icon: '🟠',
  version: '1.0.0',
  isActive: true,
  modules: [
    {
      id: 'intellij-basics',
      title: 'IntelliJ Basics',
      description: 'Learn the essential shortcuts for navigating and editing in IntelliJ IDEA.',
      category: 'navigation' as ShortcutCategory,
      difficulty: 'beginner' as const,
      order: 0,
      lessons: [
        {
          id: 'intellij-basics-1',
          title: 'Navigation Fundamentals',
          description: 'Learn how to navigate efficiently in IntelliJ.',
          shortcuts: navigationShortcuts.slice(0, 3),
          difficulty: 'beginner' as const,
          category: 'navigation' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 0,
          steps: [],
        },
        {
          id: 'intellij-basics-2',
          title: 'Basic Editing',
          description: 'Learn the essential editing shortcuts in IntelliJ IDEA.',
          shortcuts: editingShortcuts.slice(0, 3),
          difficulty: 'beginner' as const,
          category: 'editing' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 1,
          unlockRequirements: {
            previousLessons: ['intellij-basics-1'],
          },
          steps: [],
        },
        {
          id: 'intellij-basics-3',
          title: 'Basic Refactoring',
          description: 'Learn the basic refactoring shortcuts in IntelliJ IDEA.',
          shortcuts: refactoringShortcuts.slice(0, 2),
          difficulty: 'beginner' as const,
          category: 'refactoring' as ShortcutCategory,
          xpReward: 50,
          estimatedTime: 10,
          order: 2,
          unlockRequirements: {
            previousLessons: ['intellij-basics-2'],
          },
          steps: [],
        },
      ],
    },
    {
      id: 'intellij-intermediate',
      title: 'IntelliJ Intermediate',
      description: 'Take your IntelliJ IDEA skills to the next level with these intermediate shortcuts.',
      category: 'refactoring' as ShortcutCategory,
      difficulty: 'intermediate' as const,
      order: 1,
      unlockRequirements: {
        previousModules: ['intellij-basics'],
        xpRequired: 100,
      },
      lessons: [
        {
          id: 'intellij-intermediate-1',
          title: 'Advanced Navigation',
          description: 'Learn advanced navigation techniques in IntelliJ IDEA.',
          shortcuts: navigationShortcuts.slice(3, 5),
          difficulty: 'intermediate' as const,
          category: 'navigation' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 0,
          steps: [],
        },
        {
          id: 'intellij-intermediate-2',
          title: 'Advanced Editing',
          description: 'Learn advanced editing shortcuts in IntelliJ IDEA.',
          shortcuts: editingShortcuts.slice(3, 5),
          difficulty: 'intermediate' as const,
          category: 'editing' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 1,
          unlockRequirements: {
            previousLessons: ['intellij-intermediate-1'],
          },
          steps: [],
        },
        {
          id: 'intellij-intermediate-3',
          title: 'Advanced Refactoring',
          description: 'Learn advanced refactoring techniques in IntelliJ IDEA.',
          shortcuts: refactoringShortcuts.slice(2, 5),
          difficulty: 'intermediate' as const,
          category: 'refactoring' as ShortcutCategory,
          xpReward: 75,
          estimatedTime: 15,
          order: 2,
          unlockRequirements: {
            previousLessons: ['intellij-intermediate-2'],
          },
          steps: [],
        },
      ],
    },
  ],
}; 
/**
 * VS Code Track Data
 *
 * This file contains sample data for the VS Code application track.
 */

import { ApplicationType } from '@/types/progress/ICurriculum';
import { vscodePath } from '@data/paths';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { IApplicationTrack } from '@/types/progress/ICurriculum';

// Helper function to create a complete lesson object
const createCompleteLesson = (lesson: Partial<ILesson>): ILesson => {
  return {
    id: lesson.id || '',
    title: lesson.title || '',
    description: lesson.description || '',
    shortcuts: lesson.shortcuts || [],
    difficulty: lesson.difficulty || 'beginner',
    category: lesson.category || 'other',
    xpReward: lesson.xpReward || 50,
    currencyReward: lesson.currencyReward || 10,
    estimatedTime: lesson.estimatedTime || 10,
    heartsRequired: lesson.heartsRequired || 1,
    maxStars: lesson.maxStars || 3,
    order: lesson.order || 0,
    introduction: lesson.introduction || {
      title: `Introduction to ${lesson.title || 'Lesson'}`,
      description: 'Learn essential shortcuts to boost your productivity.',
    },
    exercises: lesson.exercises || [],
    steps: lesson.steps || [],
    summary: lesson.summary || {
      title: 'Lesson Complete',
      description: 'You have successfully completed this lesson.',
    },
  };
};

// Navigation shortcuts
const navigationShortcuts = [
  {
    id: 'vscode-shortcut-1',
    name: 'Quick Open',
    description: 'Quickly open files by name',
    shortcutWindows: 'Ctrl+P',
    shortcutMac: 'Cmd+P',
    category: 'navigation' as ShortcutCategory,
    context: 'When you need to open a file quickly without using the file explorer',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'vscode-shortcut-2',
    name: 'Go to Symbol',
    description: 'Navigate to a specific symbol in the file',
    shortcutWindows: 'Ctrl+Shift+O',
    shortcutMac: 'Cmd+Shift+O',
    category: 'navigation' as ShortcutCategory,
    context: 'When you want to jump to a specific function, class, or variable in the current file',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 15,
  },
  {
    id: 'vscode-shortcut-3',
    name: 'Go to Line',
    description: 'Navigate to a specific line number',
    shortcutWindows: 'Ctrl+G',
    shortcutMac: 'Cmd+G',
    category: 'navigation' as ShortcutCategory,
    context: 'When you need to jump to a specific line number in the file',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
];

// Editing shortcuts
const editingShortcuts = [
  {
    id: 'vscode-shortcut-4',
    name: 'Copy Line',
    description: 'Copy the current line',
    shortcutWindows: 'Ctrl+C (with no selection)',
    shortcutMac: 'Cmd+C (with no selection)',
    category: 'editing' as ShortcutCategory,
    context: 'When you want to duplicate a line without selecting it first',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'vscode-shortcut-5',
    name: 'Move Line Up/Down',
    description: 'Move the current line up or down',
    shortcutWindows: 'Alt+Up/Down',
    shortcutMac: 'Option+Up/Down',
    category: 'editing' as ShortcutCategory,
    context: 'When you want to reorder lines of code',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 15,
  },
  {
    id: 'vscode-shortcut-6',
    name: 'Multi-Cursor',
    description: 'Add multiple cursors for parallel editing',
    shortcutWindows: 'Alt+Click',
    shortcutMac: 'Option+Click',
    category: 'editing' as ShortcutCategory,
    context: 'When you want to edit multiple locations at once',
    difficulty: 'intermediate' as DifficultyLevel,
    xpValue: 20,
  },
];

// Search shortcuts
const searchShortcuts = [
  {
    id: 'vscode-shortcut-7',
    name: 'Find',
    description: 'Search within the current file',
    shortcutWindows: 'Ctrl+F',
    shortcutMac: 'Cmd+F',
    category: 'search' as ShortcutCategory,
    context: 'When you need to find text in the current file',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'vscode-shortcut-8',
    name: 'Find and Replace',
    description: 'Search and replace within the current file',
    shortcutWindows: 'Ctrl+H',
    shortcutMac: 'Cmd+Option+F',
    category: 'search' as ShortcutCategory,
    context: 'When you need to find and replace text in the current file',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 15,
  },
  {
    id: 'vscode-shortcut-9',
    name: 'Search Across Files',
    description: 'Search across all files in the workspace',
    shortcutWindows: 'Ctrl+Shift+F',
    shortcutMac: 'Cmd+Shift+F',
    category: 'search' as ShortcutCategory,
    context: 'When you need to find text across multiple files',
    difficulty: 'intermediate' as DifficultyLevel,
    xpValue: 20,
  },
];

// Terminal shortcuts
const terminalShortcuts = [
  {
    id: 'vscode-shortcut-10',
    name: 'Toggle Terminal',
    description: 'Show or hide the integrated terminal',
    shortcutWindows: 'Ctrl+`',
    shortcutMac: 'Cmd+`',
    category: 'terminal' as ShortcutCategory,
    context: 'When you need to access the terminal quickly',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'vscode-shortcut-11',
    name: 'New Terminal',
    description: 'Create a new terminal instance',
    shortcutWindows: 'Ctrl+Shift+`',
    shortcutMac: 'Cmd+Shift+`',
    category: 'terminal' as ShortcutCategory,
    context: 'When you need to create a new terminal session',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 15,
  },
];

// VS Code track data
export const vscodeTrack: IApplicationTrack = {
  id: ApplicationType.VSCODE,
  name: 'Visual Studio Code',
  description: 'Learn VS Code shortcuts to enhance your coding efficiency and productivity.',
  icon: 'vscode-icon.svg',
  modules: [
    {
      id: 'vscode-basics',
      title: 'VS Code Basics',
      description: 'Learn the essential VS Code shortcuts for everyday use',
      category: 'navigation',
      difficulty: 'beginner',
      order: 1,
      lessons: [
        createCompleteLesson({
          id: 'vscode-basics-1',
          title: 'Navigation Fundamentals',
          description: 'Learn how to navigate efficiently in VS Code.',
          shortcuts: navigationShortcuts.slice(0, 3),
          difficulty: 'beginner',
          category: 'navigation',
          xpReward: 50,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-basics-2',
          title: 'Basic Editing',
          description: 'Master the essential editing shortcuts in VS Code.',
          shortcuts: editingShortcuts.slice(0, 3),
          difficulty: 'beginner',
          category: 'editing',
          xpReward: 50,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-basics-3',
          title: 'Search Techniques',
          description: 'Learn how to search efficiently within VS Code.',
          shortcuts: searchShortcuts.slice(0, 3),
          difficulty: 'beginner',
          category: 'search',
          xpReward: 50,
          order: 3,
          steps: [],
        }),
      ],
    },
    {
      id: 'vscode-intermediate',
      title: 'VS Code Intermediate',
      description: 'Take your VS Code skills to the next level',
      category: 'editing',
      difficulty: 'intermediate',
      order: 2,
      lessons: [
        createCompleteLesson({
          id: 'vscode-intermediate-1',
          title: 'Advanced Navigation',
          description: 'Learn advanced navigation techniques in VS Code.',
          shortcuts: navigationShortcuts.slice(0, 3),
          difficulty: 'intermediate',
          category: 'navigation',
          xpReward: 75,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-intermediate-2',
          title: 'Advanced Editing',
          description: 'Master advanced editing shortcuts in VS Code.',
          shortcuts: editingShortcuts.slice(0, 3),
          difficulty: 'intermediate',
          category: 'editing',
          xpReward: 75,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-intermediate-3',
          title: 'Terminal Integration',
          description: 'Learn how to use the integrated terminal effectively.',
          shortcuts: terminalShortcuts.slice(0, 2),
          difficulty: 'intermediate',
          category: 'terminal',
          xpReward: 75,
          order: 3,
          steps: [],
        }),
      ],
    },
    {
      id: 'vscode-mastery',
      title: 'VS Code Mastery',
      description: 'Become a VS Code power user with these advanced shortcuts',
      category: 'other',
      difficulty: 'advanced',
      order: 3,
      lessons: [
        createCompleteLesson({
          id: 'vscode-mastery-navigation',
          title: 'Navigation Mastery',
          description: 'Master all navigation shortcuts in VS Code.',
          shortcuts: navigationShortcuts,
          difficulty: 'advanced',
          category: 'navigation',
          xpReward: 100,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-mastery-editing',
          title: 'Editing Mastery',
          description: 'Master all editing shortcuts in VS Code.',
          shortcuts: editingShortcuts,
          difficulty: 'advanced',
          category: 'editing',
          xpReward: 100,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-mastery-search',
          title: 'Search Mastery',
          description: 'Master all search shortcuts in VS Code.',
          shortcuts: searchShortcuts,
          difficulty: 'advanced',
          category: 'search',
          xpReward: 100,
          order: 3,
          steps: [],
        }),
        createCompleteLesson({
          id: 'vscode-mastery-comprehensive',
          title: 'Comprehensive Mastery',
          description: 'Master all VS Code shortcuts in a comprehensive challenge.',
          shortcuts: [...navigationShortcuts, ...editingShortcuts, ...searchShortcuts, ...terminalShortcuts],
          difficulty: 'expert',
          category: 'other',
          xpReward: 150,
          order: 4,
          steps: [],
        }),
      ],
    },
  ],
  path: vscodePath,
  version: '1.0.0',
  isActive: true,
  isDefault: true,
};

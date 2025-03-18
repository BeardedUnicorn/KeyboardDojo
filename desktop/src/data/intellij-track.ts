/**
 * IntelliJ Track Data
 *
 * This file contains sample data for the IntelliJ IDEA application track.
 */

import { ApplicationType } from '@/types/progress/ICurriculum';
import { intellijPath } from '@data/paths';

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
    id: 'intellij-shortcut-1',
    name: 'Navigate to Class',
    description: 'Quickly open a class by name',
    shortcutWindows: 'Ctrl+N',
    shortcutMac: 'Cmd+O',
    category: 'navigation' as ShortcutCategory,
    context: 'When you need to open a class quickly',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'intellij-shortcut-2',
    name: 'Navigate to File',
    description: 'Quickly open a file by name',
    shortcutWindows: 'Ctrl+Shift+N',
    shortcutMac: 'Cmd+Shift+O',
    category: 'navigation' as ShortcutCategory,
    context: 'When you need to open a file quickly',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'intellij-shortcut-3',
    name: 'Recent Files',
    description: 'Show recently opened files',
    shortcutWindows: 'Ctrl+E',
    shortcutMac: 'Cmd+E',
    category: 'navigation' as ShortcutCategory,
    context: 'When you need to switch between recently opened files',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 15,
  },
];

// Editing shortcuts
const editingShortcuts = [
  {
    id: 'intellij-shortcut-4',
    name: 'Basic Code Completion',
    description: 'Show basic code completion suggestions',
    shortcutWindows: 'Ctrl+Space',
    shortcutMac: 'Ctrl+Space',
    category: 'editing' as ShortcutCategory,
    context: 'When you need code completion suggestions',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
  {
    id: 'intellij-shortcut-5',
    name: 'Smart Code Completion',
    description: 'Show smart code completion suggestions',
    shortcutWindows: 'Ctrl+Shift+Space',
    shortcutMac: 'Ctrl+Shift+Space',
    category: 'editing' as ShortcutCategory,
    context: 'When you need context-aware code completion',
    difficulty: 'intermediate' as DifficultyLevel,
    xpValue: 15,
  },
  {
    id: 'intellij-shortcut-6',
    name: 'Duplicate Line',
    description: 'Duplicate the current line or selection',
    shortcutWindows: 'Ctrl+D',
    shortcutMac: 'Cmd+D',
    category: 'editing' as ShortcutCategory,
    context: 'When you want to duplicate code',
    difficulty: 'beginner' as DifficultyLevel,
    xpValue: 10,
  },
];

// Refactoring shortcuts
const refactoringShortcuts = [
  {
    id: 'intellij-shortcut-7',
    name: 'Refactor This',
    description: 'Show refactoring options for the current context',
    shortcutWindows: 'Ctrl+Alt+Shift+T',
    shortcutMac: 'Ctrl+T',
    category: 'refactoring' as ShortcutCategory,
    context: 'When you want to refactor code',
    difficulty: 'intermediate' as DifficultyLevel,
    xpValue: 20,
  },
  {
    id: 'intellij-shortcut-8',
    name: 'Rename',
    description: 'Rename the selected symbol',
    shortcutWindows: 'Shift+F6',
    shortcutMac: 'Shift+F6',
    category: 'refactoring' as ShortcutCategory,
    context: 'When you want to rename a variable, method, or class',
    difficulty: 'intermediate' as DifficultyLevel,
    xpValue: 15,
  },
  {
    id: 'intellij-shortcut-9',
    name: 'Extract Method',
    description: 'Extract selected code into a method',
    shortcutWindows: 'Ctrl+Alt+M',
    shortcutMac: 'Cmd+Alt+M',
    category: 'refactoring' as ShortcutCategory,
    context: 'When you want to extract code into a separate method',
    difficulty: 'advanced' as DifficultyLevel,
    xpValue: 25,
  },
];

// IntelliJ track data
export const intellijTrack: IApplicationTrack = {
  id: ApplicationType.INTELLIJ,
  name: 'IntelliJ IDEA',
  description: 'Master IntelliJ IDEA shortcuts to become more productive in your Java development.',
  icon: 'intellij-icon.svg',
  version: '1.0.0',
  isActive: true,
  modules: [
    {
      id: 'intellij-basics',
      title: 'IntelliJ Basics',
      description: 'Learn the essential IntelliJ shortcuts for everyday use',
      category: 'navigation',
      difficulty: 'beginner',
      order: 1,
      lessons: [
        createCompleteLesson({
          id: 'intellij-basics-1',
          title: 'Navigation Fundamentals',
          description: 'Learn how to navigate efficiently in IntelliJ.',
          shortcuts: navigationShortcuts.slice(0, 3),
          difficulty: 'beginner',
          category: 'navigation',
          xpReward: 50,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-basics-2',
          title: 'Basic Editing',
          description: 'Master the essential editing shortcuts in IntelliJ.',
          shortcuts: editingShortcuts.slice(0, 3),
          difficulty: 'beginner',
          category: 'editing',
          xpReward: 50,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-basics-3',
          title: 'Basic Refactoring',
          description: 'Learn basic refactoring techniques in IntelliJ.',
          shortcuts: refactoringShortcuts.slice(0, 2),
          difficulty: 'intermediate',
          category: 'refactoring',
          xpReward: 50,
          order: 3,
          steps: [],
        }),
      ],
    },
    {
      id: 'intellij-intermediate',
      title: 'IntelliJ Intermediate',
      description: 'Take your IntelliJ skills to the next level',
      category: 'editing',
      difficulty: 'intermediate',
      order: 2,
      lessons: [
        createCompleteLesson({
          id: 'intellij-intermediate-1',
          title: 'Advanced Navigation',
          description: 'Learn advanced navigation techniques in IntelliJ.',
          shortcuts: navigationShortcuts,
          difficulty: 'intermediate',
          category: 'navigation',
          xpReward: 75,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-intermediate-2',
          title: 'Advanced Editing',
          description: 'Master advanced editing shortcuts in IntelliJ.',
          shortcuts: editingShortcuts,
          difficulty: 'intermediate',
          category: 'editing',
          xpReward: 75,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-intermediate-3',
          title: 'Advanced Refactoring',
          description: 'Learn advanced refactoring techniques in IntelliJ.',
          shortcuts: refactoringShortcuts,
          difficulty: 'intermediate',
          category: 'refactoring',
          xpReward: 75,
          order: 3,
          steps: [],
        }),
      ],
    },
    {
      id: 'intellij-mastery',
      title: 'IntelliJ Mastery',
      description: 'Become an IntelliJ power user with these advanced shortcuts',
      category: 'other',
      difficulty: 'advanced',
      order: 3,
      lessons: [
        createCompleteLesson({
          id: 'intellij-mastery-navigation',
          title: 'Navigation Mastery',
          description: 'Master all navigation shortcuts in IntelliJ.',
          shortcuts: navigationShortcuts,
          difficulty: 'advanced',
          category: 'navigation',
          xpReward: 100,
          order: 1,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-mastery-editing',
          title: 'Editing Mastery',
          description: 'Master all editing shortcuts in IntelliJ.',
          shortcuts: editingShortcuts,
          difficulty: 'advanced',
          category: 'editing',
          xpReward: 100,
          order: 2,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-mastery-refactoring',
          title: 'Refactoring Mastery',
          description: 'Master all refactoring shortcuts in IntelliJ.',
          shortcuts: refactoringShortcuts,
          difficulty: 'intermediate',
          category: 'refactoring',
          xpReward: 100,
          order: 3,
          steps: [],
        }),
        createCompleteLesson({
          id: 'intellij-mastery-comprehensive',
          title: 'Comprehensive Mastery',
          description: 'Master all IntelliJ shortcuts in a comprehensive challenge.',
          shortcuts: [...navigationShortcuts, ...editingShortcuts, ...refactoringShortcuts],
          difficulty: 'expert',
          category: 'other',
          xpReward: 150,
          order: 4,
          steps: [],
        }),
      ],
    },
  ],
  path: intellijPath,
};

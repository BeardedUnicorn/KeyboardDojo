/**
 * IntelliJ Path Data
 *
 * This file contains the path data for the IntelliJ IDEA application track.
 * It defines the visual path layout with nodes representing lessons and checkpoints.
 */
import { loggerService } from '@/services';
import { PathNodeType , ApplicationType } from '@/types/progress/ICurriculum';

import type { IPath } from '@/types/progress/ICurriculum';

// IntelliJ path data
export const intellijPath: IPath = {
  id: 'intellij-path',
  trackId: ApplicationType.INTELLIJ,
  name: 'IntelliJ IDEA Shortcuts Path',
  description: 'Master IntelliJ IDEA shortcuts from beginner to expert level',
  version: '1.0.0',
  title: 'IntelliJ IDEA Shortcuts Path',
  icon: 'intellij',
  unlockRequirements: {
    xpRequired: 0,
    levelRequired: 0,
  },
  nodes: [
    // Beginner Section - Navigation
    {
      id: 'intellij-node-1',
      type: PathNodeType.LESSON,
      title: 'Basic Navigation',
      description: 'Learn essential navigation shortcuts',
      position: { x: 100, y: 100 },
      connections: ['intellij-node-2'],
      unlockRequirements: {
        previousNodes: [],
        xpRequired: 0,
        levelRequired: 0,
      },
      content: 'intellij-basic-navigation',
      status: 'unlocked',
      difficulty: 'beginner',
      category: 'navigation',
    },
    {
      id: 'intellij-node-2',
      type: PathNodeType.LESSON,
      title: 'File Navigation',
      description: 'Learn how to navigate between files',
      position: { x: 200, y: 100 },
      connections: ['intellij-node-3'],
      unlockRequirements: {
        previousNodes: ['intellij-node-1'],
        xpRequired: 10,
        levelRequired: 0,
      },
      content: 'intellij-file-navigation',
      status: 'locked',
      difficulty: 'beginner',
      category: 'navigation',
    },
    {
      id: 'intellij-node-3',
      type: PathNodeType.LESSON,
      title: 'Recent Files',
      description: 'Learn how to quickly access recent files',
      position: { x: 300, y: 100 },
      connections: ['intellij-node-4'],
      unlockRequirements: {
        previousNodes: ['intellij-node-2'],
        xpRequired: 20,
        levelRequired: 0,
      },
      content: 'intellij-recent-files',
      status: 'locked',
      difficulty: 'beginner',
      category: 'navigation',
    },
    {
      id: 'intellij-node-4',
      type: PathNodeType.CHECKPOINT,
      title: 'Navigation Mastery',
      description: 'Test your knowledge of navigation shortcuts',
      position: { x: 400, y: 100 },
      connections: ['intellij-node-5'],
      unlockRequirements: {
        previousNodes: ['intellij-node-3'],
        xpRequired: 30,
        levelRequired: 0,
      },
      content: 'intellij-navigation-checkpoint',
      status: 'locked',
      difficulty: 'beginner',
      category: 'navigation',
      lessons: ['intellij-node-1', 'intellij-node-2', 'intellij-node-3'],
    },

    // Beginner Section - Editing
    {
      id: 'intellij-node-5',
      type: PathNodeType.LESSON,
      title: 'Basic Editing',
      description: 'Learn essential text editing shortcuts',
      position: { x: 100, y: 200 },
      connections: ['intellij-node-6'],
      unlockRequirements: {
        previousNodes: ['intellij-node-4'],
        xpRequired: 40,
        levelRequired: 1,
      },
      content: 'intellij-basic-editing',
      status: 'locked',
      difficulty: 'beginner',
      category: 'editing',
    },
    {
      id: 'intellij-node-6',
      type: PathNodeType.LESSON,
      title: 'Code Completion',
      description: 'Master code completion shortcuts',
      position: { x: 200, y: 200 },
      connections: ['intellij-node-7'],
      unlockRequirements: {
        previousNodes: ['intellij-node-5'],
        xpRequired: 50,
        levelRequired: 1,
      },
      content: 'intellij-code-completion',
      status: 'locked',
      difficulty: 'beginner',
      category: 'editing',
    },
    {
      id: 'intellij-node-7',
      type: PathNodeType.LESSON,
      title: 'Line Operations',
      description: 'Learn shortcuts for working with entire lines',
      position: { x: 300, y: 200 },
      connections: ['intellij-node-8'],
      unlockRequirements: {
        previousNodes: ['intellij-node-6'],
        xpRequired: 60,
        levelRequired: 1,
      },
      content: 'intellij-line-operations',
      status: 'locked',
      difficulty: 'beginner',
      category: 'editing',
    },
    {
      id: 'intellij-node-8',
      type: PathNodeType.CHECKPOINT,
      title: 'Editing Mastery',
      description: 'Test your knowledge of editing shortcuts',
      position: { x: 400, y: 200 },
      connections: ['intellij-node-9'],
      unlockRequirements: {
        previousNodes: ['intellij-node-7'],
        xpRequired: 70,
        levelRequired: 1,
      },
      content: 'intellij-editing-checkpoint',
      status: 'locked',
      difficulty: 'beginner',
      category: 'editing',
      lessons: ['intellij-node-5', 'intellij-node-6', 'intellij-node-7'],
    },

    // Intermediate Section - Search
    {
      id: 'intellij-node-9',
      type: PathNodeType.LESSON,
      title: 'Find & Replace',
      description: 'Learn how to use find and replace efficiently',
      position: { x: 100, y: 300 },
      connections: ['intellij-node-10'],
      unlockRequirements: {
        previousNodes: ['intellij-node-8'],
        xpRequired: 80,
        levelRequired: 2,
      },
      content: 'intellij-find-replace',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'search',
    },
    {
      id: 'intellij-node-10',
      type: PathNodeType.LESSON,
      title: 'Search Everywhere',
      description: 'Master the Search Everywhere feature',
      position: { x: 200, y: 300 },
      connections: ['intellij-node-11'],
      unlockRequirements: {
        previousNodes: ['intellij-node-9'],
        xpRequired: 90,
        levelRequired: 2,
      },
      content: 'intellij-search-everywhere',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'search',
    },
    {
      id: 'intellij-node-11',
      type: PathNodeType.LESSON,
      title: 'Find in Path',
      description: 'Learn how to search across multiple files',
      position: { x: 300, y: 300 },
      connections: ['intellij-node-12'],
      unlockRequirements: {
        previousNodes: ['intellij-node-10'],
        xpRequired: 100,
        levelRequired: 2,
      },
      content: 'intellij-find-in-path',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'search',
    },
    {
      id: 'intellij-node-12',
      type: PathNodeType.CHECKPOINT,
      title: 'Search Mastery',
      description: 'Test your knowledge of search shortcuts',
      position: { x: 400, y: 300 },
      connections: ['intellij-node-13'],
      unlockRequirements: {
        previousNodes: ['intellij-node-11'],
        xpRequired: 110,
        levelRequired: 2,
      },
      content: 'intellij-search-checkpoint',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'search',
      lessons: ['intellij-node-9', 'intellij-node-10', 'intellij-node-11'],
    },

    // Intermediate Section - Refactoring
    {
      id: 'intellij-node-13',
      type: PathNodeType.LESSON,
      title: 'Basic Refactoring',
      description: 'Learn essential refactoring shortcuts',
      position: { x: 100, y: 400 },
      connections: ['intellij-node-14'],
      unlockRequirements: {
        previousNodes: ['intellij-node-12'],
        xpRequired: 120,
        levelRequired: 3,
      },
      content: 'intellij-basic-refactoring',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'refactoring',
    },
    {
      id: 'intellij-node-14',
      type: PathNodeType.LESSON,
      title: 'Rename Refactoring',
      description: 'Master the rename refactoring shortcut',
      position: { x: 200, y: 400 },
      connections: ['intellij-node-15'],
      unlockRequirements: {
        previousNodes: ['intellij-node-13'],
        xpRequired: 130,
        levelRequired: 3,
      },
      content: 'intellij-rename-refactoring',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'refactoring',
    },
    {
      id: 'intellij-node-15',
      type: PathNodeType.LESSON,
      title: 'Extract Method',
      description: 'Learn how to extract code into methods',
      position: { x: 300, y: 400 },
      connections: ['intellij-node-16'],
      unlockRequirements: {
        previousNodes: ['intellij-node-14'],
        xpRequired: 140,
        levelRequired: 3,
      },
      content: 'intellij-extract-method',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'refactoring',
    },
    {
      id: 'intellij-node-16',
      type: PathNodeType.CHECKPOINT,
      title: 'Refactoring Mastery',
      description: 'Test your knowledge of refactoring shortcuts',
      position: { x: 400, y: 400 },
      connections: ['intellij-node-17'],
      unlockRequirements: {
        previousNodes: ['intellij-node-15'],
        xpRequired: 150,
        levelRequired: 3,
      },
      content: 'intellij-refactoring-checkpoint',
      status: 'locked',
      difficulty: 'intermediate',
      category: 'refactoring',
      lessons: ['intellij-node-13', 'intellij-node-14', 'intellij-node-15'],
    },

    // Advanced Section - Debugging
    {
      id: 'intellij-node-17',
      type: PathNodeType.LESSON,
      title: 'Debugging Basics',
      description: 'Learn essential debugging shortcuts',
      position: { x: 100, y: 500 },
      connections: ['intellij-node-18'],
      unlockRequirements: {
        previousNodes: ['intellij-node-16'],
        xpRequired: 160,
        levelRequired: 4,
      },
      content: 'intellij-debugging-basics',
      status: 'locked',
      difficulty: 'advanced',
      category: 'debugging',
    },
    {
      id: 'intellij-node-18',
      type: PathNodeType.LESSON,
      title: 'Breakpoints',
      description: 'Master breakpoint shortcuts',
      position: { x: 200, y: 500 },
      connections: ['intellij-node-19'],
      unlockRequirements: {
        previousNodes: ['intellij-node-17'],
        xpRequired: 170,
        levelRequired: 4,
      },
      content: 'intellij-breakpoints',
      status: 'locked',
      difficulty: 'advanced',
      category: 'debugging',
    },
    {
      id: 'intellij-node-19',
      type: PathNodeType.LESSON,
      title: 'Step Controls',
      description: 'Learn how to step through code during debugging',
      position: { x: 300, y: 500 },
      connections: ['intellij-node-20'],
      unlockRequirements: {
        previousNodes: ['intellij-node-18'],
        xpRequired: 180,
        levelRequired: 4,
      },
      content: 'intellij-step-controls',
      status: 'locked',
      difficulty: 'advanced',
      category: 'debugging',
    },
    {
      id: 'intellij-node-20',
      type: PathNodeType.CHECKPOINT,
      title: 'Debugging Mastery',
      description: 'Test your knowledge of debugging shortcuts',
      position: { x: 400, y: 500 },
      connections: ['intellij-node-21'],
      unlockRequirements: {
        previousNodes: ['intellij-node-19'],
        xpRequired: 190,
        levelRequired: 4,
      },
      content: 'intellij-debugging-checkpoint',
      status: 'locked',
      difficulty: 'advanced',
      category: 'debugging',
      lessons: ['intellij-node-17', 'intellij-node-18', 'intellij-node-19'],
    },

    // Expert Section - Advanced Features
    {
      id: 'intellij-node-21',
      type: PathNodeType.LESSON,
      title: 'Version Control',
      description: 'Learn version control shortcuts',
      position: { x: 100, y: 600 },
      connections: ['intellij-node-22'],
      unlockRequirements: {
        previousNodes: ['intellij-node-20'],
        xpRequired: 200,
        levelRequired: 5,
      },
      content: 'intellij-version-control',
      status: 'locked',
      difficulty: 'expert',
      category: 'git',
    },
    {
      id: 'intellij-node-22',
      type: PathNodeType.LESSON,
      title: 'Advanced Refactoring',
      description: 'Master advanced refactoring shortcuts',
      position: { x: 200, y: 600 },
      connections: ['intellij-node-23'],
      unlockRequirements: {
        previousNodes: ['intellij-node-21'],
        xpRequired: 210,
        levelRequired: 5,
      },
      content: 'intellij-advanced-refactoring',
      status: 'locked',
      difficulty: 'expert',
      category: 'refactoring',
    },
    {
      id: 'intellij-node-23',
      type: PathNodeType.LESSON,
      title: 'Code Generation',
      description: 'Learn shortcuts for code generation',
      position: { x: 300, y: 600 },
      connections: ['intellij-node-24'],
      unlockRequirements: {
        previousNodes: ['intellij-node-22'],
        xpRequired: 220,
        levelRequired: 5,
      },
      content: 'intellij-code-generation',
      status: 'locked',
      difficulty: 'expert',
      category: 'editing',
    },
    {
      id: 'intellij-node-24',
      type: PathNodeType.CHALLENGE,
      title: 'IntelliJ Master Challenge',
      description: 'Final challenge to test all your IntelliJ IDEA shortcuts knowledge',
      position: { x: 400, y: 600 },
      connections: [],
      unlockRequirements: {
        previousNodes: ['intellij-node-23'],
        xpRequired: 230,
        levelRequired: 5,
      },
      content: 'intellij-master-challenge',
      status: 'locked',
      difficulty: 'expert',
      category: 'other',
    },
  ],
  connections: [],
};

// Original logger call replaced with conditional logging that won't throw
// This prevents issues during the module's initialization
try {
  // Only log in development environment
  if (process.env.NODE_ENV === 'development' && loggerService && typeof loggerService.debug === 'function') {
    // Use setTimeout to defer logging until after the module has been fully loaded
    setTimeout(() => {
      loggerService.debug('IntelliJ path loaded', {
        pathId: intellijPath.id,
        nodesCount: intellijPath.nodes.length,
      });
    }, 0);
  }
} catch (err) {
  // Silently ignore logging errors to prevent import failures
  console.warn('Failed to log IntelliJ path load:', err);
}

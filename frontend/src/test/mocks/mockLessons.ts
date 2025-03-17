import { Lesson, Shortcut } from '../../api/lessonsService';

export const mockShortcut: Shortcut = {
  id: '1',
  name: 'Copy',
  description: 'Copy selected text or item',
  keyCombination: ['Cmd', 'C'],
  operatingSystem: 'mac',
  context: 'Global',
};

export const mockLesson: Lesson = {
  lessonId: '1',
  id: '1',
  title: 'VS Code Basics',
  description: 'Learn the essential keyboard shortcuts for VS Code',
  category: 'editor',
  difficulty: 'beginner',
  order: 1,
  content: {
    introduction: 'VS Code is a powerful code editor with many keyboard shortcuts that can boost your productivity.',
    shortcuts: [
      {
        id: 'vscode-1',
        name: 'Quick Open',
        description: 'Quickly open files',
        keyCombination: ['Ctrl', 'P'],
        operatingSystem: 'all',
        context: 'global'
      },
      {
        id: 'vscode-2',
        name: 'Command Palette',
        description: 'Access all commands',
        keyCombination: ['Ctrl', 'Shift', 'P'],
        operatingSystem: 'all',
        context: 'global'
      }
    ],
    tips: ['Practice these shortcuts daily', 'Try to avoid using the mouse']
  },
  shortcuts: [
    {
      id: 'vscode-1',
      name: 'Quick Open',
      description: 'Quickly open files',
      keyCombination: ['Ctrl', 'P'],
      operatingSystem: 'all',
      context: 'global'
    },
    {
      id: 'vscode-2',
      name: 'Command Palette',
      description: 'Access all commands',
      keyCombination: ['Ctrl', 'Shift', 'P'],
      operatingSystem: 'all',
      context: 'global'
    }
  ],
  isPremium: false,
  createdAt: 1609459200000,
  updatedAt: 1609459200000
};

export const mockPremiumLesson: Lesson = {
  lessonId: '2',
  id: '2',
  title: 'Advanced Git Commands',
  description: 'Master advanced Git operations with keyboard shortcuts',
  category: 'git',
  difficulty: 'advanced',
  order: 2,
  content: {
    introduction: 'Git is essential for version control. These advanced shortcuts will help you become a Git power user.',
    shortcuts: [
      {
        id: 'git-1',
        name: 'Git Status',
        description: 'Check repository status',
        keyCombination: ['git', 'status'],
        operatingSystem: 'all',
        context: 'terminal'
      },
      {
        id: 'git-2',
        name: 'Git Commit',
        description: 'Commit changes',
        keyCombination: ['git', 'commit', '-m'],
        operatingSystem: 'all',
        context: 'terminal'
      }
    ],
    tips: ['Use these in combination with aliases', 'Create custom Git commands for common workflows']
  },
  shortcuts: [
    {
      id: 'git-1',
      name: 'Git Status',
      description: 'Check repository status',
      keyCombination: ['git', 'status'],
      operatingSystem: 'all',
      context: 'terminal'
    },
    {
      id: 'git-2',
      name: 'Git Commit',
      description: 'Commit changes',
      keyCombination: ['git', 'commit', '-m'],
      operatingSystem: 'all',
      context: 'terminal'
    }
  ],
  isPremium: true,
  createdAt: 1609545600000,
  updatedAt: 1609545600000
};

export const mockLessons = [mockLesson, mockPremiumLesson]; 
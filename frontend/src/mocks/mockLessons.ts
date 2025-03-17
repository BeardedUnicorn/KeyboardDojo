import { Lesson } from '../api/lessonsService';

export const mockLesson: Lesson = {
  lessonId: '1',
  title: 'Basic Typing',
  description: 'Learn the basics of touch typing',
  content: {
    introduction: 'Welcome to the basic typing lesson',
    tips: [
      'Keep your fingers on the home row',
      'Look at the screen, not your hands',
    ],
    shortcuts: [
      {
        id: '1',
        name: 'Copy',
        description: 'Copy selected text',
        keyCombination: ['Meta', 'c'],
        operatingSystem: 'all',
        context: 'Global',
      },
    ],
  },
  category: 'Basics',
  difficulty: 'beginner',
  isPremium: false,
  order: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockPremiumLesson: Lesson = {
  lessonId: '2',
  title: 'Advanced Shortcuts',
  description: 'Master advanced keyboard shortcuts',
  content: {
    introduction: 'Welcome to advanced shortcuts',
    tips: [
      'Practice these advanced shortcuts',
      'Focus on speed and accuracy',
    ],
    shortcuts: [
      {
        id: '1',
        name: 'Redo',
        description: 'Redo last action',
        keyCombination: ['Meta', 'Shift', 'z'],
        operatingSystem: 'all',
        context: 'Global',
      },
    ],
  },
  category: 'Advanced',
  difficulty: 'advanced',
  isPremium: true,
  order: 2,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}; 
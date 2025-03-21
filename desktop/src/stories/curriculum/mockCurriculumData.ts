import { ApplicationType } from '@/types/progress/ICurriculum';
import type { 
  ICurriculumMetadata,
  IApplicationTrack,
  IModule,
  ILesson,
  IUserProgress,
  IPath,
  PathNode
} from '@/types/progress/ICurriculum';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';

// Mock curriculum metadata
export const mockCurriculumMetadata: ICurriculumMetadata[] = [
  {
    id: 'keyboard-shortcuts-2023',
    name: 'Keyboard Shortcuts 2023',
    version: '1.0.0',
    description: 'Learn keyboard shortcuts for popular applications',
    author: 'Keyboard Dojo Team',
  },
  {
    id: 'advanced-shortcuts-2023',
    name: 'Advanced Shortcuts 2023',
    version: '1.0.0',
    description: 'Advanced keyboard shortcuts for power users',
    author: 'Keyboard Dojo Team',
  }
];

// Mock lessons
const createMockLessons = (moduleId: string, count: number, difficulty: DifficultyLevel): ILesson[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${moduleId}-lesson-${i + 1}`,
    title: `Lesson ${i + 1}`,
    description: `This is a description for lesson ${i + 1} in module ${moduleId}`,
    content: [],
    estimatedTime: 10,
    xpReward: 100,
    difficulty,
    category: i % 2 === 0 ? 'Navigation' : 'Editing',
  }));
};

// Mock modules
const createMockModules = (trackId: ApplicationType): IModule[] => {
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  return [
    {
      id: `${trackId}-basics`,
      title: 'Basics',
      description: 'Learn the basic shortcuts for navigation and editing',
      order: 1,
      difficulty: 'beginner',
      lessons: createMockLessons(`${trackId}-basics`, 5, 'beginner'),
      prerequisites: [],
    },
    {
      id: `${trackId}-intermediate`,
      title: 'Intermediate Skills',
      description: 'Build on your basic knowledge with more advanced shortcuts',
      order: 2,
      difficulty: 'intermediate',
      lessons: createMockLessons(`${trackId}-intermediate`, 4, 'intermediate'),
      prerequisites: [`${trackId}-basics`],
    },
    {
      id: `${trackId}-advanced`,
      title: 'Advanced Techniques',
      description: 'Master advanced shortcuts for power users',
      order: 3,
      difficulty: 'advanced',
      lessons: createMockLessons(`${trackId}-advanced`, 3, 'advanced'),
      prerequisites: [`${trackId}-intermediate`],
    },
    {
      id: `${trackId}-expert`,
      title: 'Expert Workflows',
      description: 'Learn expert workflows and combinations',
      order: 4,
      difficulty: 'expert',
      lessons: createMockLessons(`${trackId}-expert`, 2, 'expert'),
      prerequisites: [`${trackId}-advanced`],
    },
    {
      id: `${trackId}-mastery`,
      title: 'Mastery Challenges',
      description: 'Test your knowledge with challenges',
      order: 5,
      difficulty: 'expert',
      lessons: [
        {
          id: `${trackId}-challenge-1`,
          title: 'Speed Challenge',
          description: 'Complete shortcuts as quickly as possible',
          content: [],
          estimatedTime: 15,
          xpReward: 200,
          difficulty: 'expert',
          category: 'Challenge',
        },
        {
          id: `${trackId}-challenge-2`,
          title: 'Accuracy Challenge',
          description: 'Complete shortcuts with perfect accuracy',
          content: [],
          estimatedTime: 15,
          xpReward: 200,
          difficulty: 'expert',
          category: 'Challenge',
        }
      ],
      prerequisites: [`${trackId}-expert`],
    }
  ];
};

// Mock application tracks
export const mockApplicationTracks: IApplicationTrack[] = [
  {
    id: ApplicationType.VSCODE,
    name: 'VS Code',
    description: 'Learn keyboard shortcuts for Visual Studio Code',
    modules: createMockModules(ApplicationType.VSCODE),
  },
  {
    id: ApplicationType.INTELLIJ,
    name: 'IntelliJ IDEA',
    description: 'Learn keyboard shortcuts for IntelliJ IDEA',
    modules: createMockModules(ApplicationType.INTELLIJ),
  },
  {
    id: ApplicationType.CURSOR,
    name: 'Cursor',
    description: 'Learn keyboard shortcuts for Cursor',
    modules: createMockModules(ApplicationType.CURSOR),
  },
];

// Mock user progress for different states
export const mockUserProgress: Record<string, IUserProgress> = {
  // New user with no progress
  new: {
    userId: 'user-1',
    completedLessons: [],
    currentLessons: [],
    lastActivity: new Date().toISOString(),
  },
  // User with some progress
  partial: {
    userId: 'user-2',
    completedLessons: [
      { lessonId: 'vscode-basics-lesson-1', trackId: ApplicationType.VSCODE, completedAt: new Date().toISOString() },
      { lessonId: 'vscode-basics-lesson-2', trackId: ApplicationType.VSCODE, completedAt: new Date().toISOString() },
    ],
    currentLessons: [
      { lessonId: 'vscode-basics-lesson-3', trackId: ApplicationType.VSCODE, progress: 50 },
    ],
    lastActivity: new Date().toISOString(),
  },
  // User with completed modules
  advanced: {
    userId: 'user-3',
    completedLessons: [
      ...Array.from({ length: 5 }, (_, i) => ({ 
        lessonId: `vscode-basics-lesson-${i + 1}`, 
        trackId: ApplicationType.VSCODE, 
        completedAt: new Date().toISOString() 
      })),
      ...Array.from({ length: 4 }, (_, i) => ({ 
        lessonId: `vscode-intermediate-lesson-${i + 1}`, 
        trackId: ApplicationType.VSCODE, 
        completedAt: new Date().toISOString() 
      })),
    ],
    currentLessons: [
      { lessonId: 'vscode-advanced-lesson-1', trackId: ApplicationType.VSCODE, progress: 30 },
    ],
    lastActivity: new Date().toISOString(),
  },
};

// Mock paths
export const mockPaths: IPath[] = [
  {
    id: 'vscode-main-path',
    name: 'VS Code Main Path',
    description: 'The main learning path for VS Code',
    trackId: ApplicationType.VSCODE,
    nodes: [
      {
        id: 'node-1',
        type: 'module',
        moduleId: 'vscode-basics',
        title: 'Basics',
        description: 'Learn the basics',
        position: { x: 100, y: 100 },
        connections: ['node-2'],
      },
      {
        id: 'node-2',
        type: 'module',
        moduleId: 'vscode-intermediate',
        title: 'Intermediate',
        description: 'Intermediate skills',
        position: { x: 300, y: 100 },
        connections: ['node-3'],
      },
      {
        id: 'node-3',
        type: 'module',
        moduleId: 'vscode-advanced',
        title: 'Advanced',
        description: 'Advanced techniques',
        position: { x: 500, y: 100 },
        connections: ['node-4'],
      },
      {
        id: 'node-4',
        type: 'module',
        moduleId: 'vscode-expert',
        title: 'Expert',
        description: 'Expert workflows',
        position: { x: 700, y: 100 },
        connections: ['node-5'],
      },
      {
        id: 'node-5',
        type: 'module',
        moduleId: 'vscode-mastery',
        title: 'Mastery',
        description: 'Mastery challenges',
        position: { x: 900, y: 100 },
        connections: [],
      },
    ],
  },
];

// Mock shortcuts
export const mockShortcuts: IShortcut[] = [
  {
    id: 'shortcut-1',
    name: 'Save File',
    description: 'Save the current file',
    applications: [ApplicationType.VSCODE, ApplicationType.INTELLIJ, ApplicationType.CURSOR],
    shortcutsByPlatform: {
      mac: [{ key: 'Cmd+S' }],
      windows: [{ key: 'Ctrl+S' }],
      linux: [{ key: 'Ctrl+S' }],
    },
    category: 'File Operations',
  },
  {
    id: 'shortcut-2',
    name: 'Find',
    description: 'Find text in the current file',
    applications: [ApplicationType.VSCODE, ApplicationType.INTELLIJ, ApplicationType.CURSOR],
    shortcutsByPlatform: {
      mac: [{ key: 'Cmd+F' }],
      windows: [{ key: 'Ctrl+F' }],
      linux: [{ key: 'Ctrl+F' }],
    },
    category: 'Editing',
  },
];

// Mock curriculum service implementation
export const createMockCurriculumService = (userProgressState: 'new' | 'partial' | 'advanced' = 'new') => {
  return {
    // General curriculum methods
    getAllCurriculums: () => [{ metadata: mockCurriculumMetadata[0] }],
    getCurriculumMetadata: () => mockCurriculumMetadata,
    getActiveCurriculum: () => ({ metadata: mockCurriculumMetadata[0] }),
    setActiveCurriculum: () => true,
    
    // Track and module methods
    getApplicationTracks: () => mockApplicationTracks,
    getTrackById: (trackId: ApplicationType) => mockApplicationTracks.find(track => track.id === trackId),
    getModules: (trackId: ApplicationType) => {
      const track = mockApplicationTracks.find(t => t.id === trackId);
      return track ? track.modules : [];
    },
    
    // Progress methods
    getUserProgress: () => mockUserProgress[userProgressState],
    isModuleUnlocked: () => true,
    isLessonUnlocked: () => true,
    
    // Helper methods for story state
    isLessonCompleted: (lessonId: string) => {
      const progress = mockUserProgress[userProgressState];
      return progress.completedLessons.some(lesson => lesson.lessonId === lessonId);
    },
    getLessonProgress: (lessonId: string) => {
      const progress = mockUserProgress[userProgressState];
      const currentLesson = progress.currentLessons.find(lesson => lesson.lessonId === lessonId);
      return currentLesson ? currentLesson.progress : 0;
    },
  };
}; 
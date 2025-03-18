/**
 * Curriculum Data Types
 *
 * This file contains type definitions for the curriculum structure,
 * including application tracks, lessons, and shortcuts.
 */
import type { CurriculumType } from '@/types/curriculum/CurriculumType';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ILessonNode } from '@/types/curriculum/lesson/ILessonNode';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';

// Application types
export enum ApplicationType {
  VSCODE = 'vscode',
  INTELLIJ = 'intellij',
  CURSOR = 'cursor'
}

// Path node types
export enum PathNodeType {
  LESSON = 'lesson',
  CHECKPOINT = 'checkpoint',
  CHALLENGE = 'challenge'
}

// Module definition (group of related lessons)
export interface IModule {
  id: string;
  title: string;
  description: string;
  lessons: ILesson[];
  category: ShortcutCategory;
  difficulty: DifficultyLevel;
  unlockRequirements?: {
    previousModules?: string[];
    xpRequired?: number;
    level?: number;
  };
  order: number;
}

// Path structure
export interface IPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  nodes: PathNode[];
  connections: PathConnection[];
  unlockRequirements: {
    xpRequired?: number;
    levelRequired?: number;
    previousPaths?: string[];
  };
  trackId?: ApplicationType;
  name?: string;
  version?: string;
}

// Checkpoint structure
export interface ICheckpoint {
  id: string;
  title: string;
  description: string;
  shortcuts: IShortcut[];
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds
  passingScore: number; // percentage
  xpReward: number;
  heartsRequired: number;
}

// Application track definition
export interface IApplicationTrack {
  id: ApplicationType;
  name: string;
  description: string;
  icon: string;
  modules: IModule[];
  path?: IPath; // New path-based structure
  version: string;
  isActive: boolean;
  isDefault?: boolean;
}

// Curriculum metadata
export interface ICurriculumMetadata {
  id: string;
  name: string;
  description: string;
  type: CurriculumType;
  icon: string;
  version: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  isActive: boolean;
  isDefault?: boolean;
}

// Curriculum definition (collection of all application tracks)
export interface ICurriculum {
  id: string;
  metadata: ICurriculumMetadata;
  tracks: IApplicationTrack[];
  paths: IPath[];
  lessons: ILesson[];
}

// Mastery challenge definition
export interface IMasteryChallenge {
  id: string;
  title: string;
  description: string;
  shortcuts: IShortcut[];
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds
  passingScore: number; // percentage
  xpReward: number;
  unlockRequirements: {
    lessonIds: string[];
    xpRequired?: number;
  };
}

// Hearts system
export interface IHeartsSystem {
  maxHearts: number;
  currentHearts: number;
  regenerationRate: number; // hearts per hour
  lastRegenerationTime: string;
  isPremium: boolean; // unlimited hearts for premium users
}

// Virtual currency
export interface ICurrency {
  amount: number;
  transactions: {
    id: string;
    amount: number;
    reason: string;
    timestamp: string;
  }[];
}

// StorePage items
export interface IStoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hearts' | 'streak' | 'cosmetic' | 'boost';
  image: string;
  effect: {
    type: 'hearts_refill' | 'streak_freeze' | 'xp_boost' | 'theme' | 'mascot_outfit';
    value: any;
  };
  isPremiumOnly: boolean;
}

// Streak system
export interface IStreakSystem {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  streakFreezeAvailable: boolean;
  calendar: {
    date: string;
    completed: boolean;
    xpEarned: number;
  }[];
}

// Spaced repetition system
export interface ISpacedRepetitionSystem {
  shortcuts: {
    shortcutId: string;
    easeFactor: number; // 1.3 to 2.5
    interval: number; // days
    nextReviewDate: string;
    reviewHistory: {
      date: string;
      performance: 'again' | 'hard' | 'good' | 'easy';
    }[];
  }[];
}

// User performance
export interface IUserPerformance {
  shortcutPerformance: {
    shortcutId: string;
    attempts: number;
    successes: number;
    lastAttemptDate: string;
    averageResponseTime: number; // milliseconds
  }[];
  categoryPerformance: {
    category: ShortcutCategory;
    attempts: number;
    successes: number;
    mastery: number; // 0-100
  }[];
  difficultyPerformance: {
    difficulty: DifficultyLevel;
    attempts: number;
    successes: number;
    mastery: number; // 0-100
  }[];
}

// Practice session
export interface IPracticeSession {
  id: string;
  type: 'spaced_repetition' | 'category_focus' | 'difficulty_focus' | 'custom';
  shortcuts: IShortcut[];
  duration: number; // minutes
  xpReward: number;
  currencyReward: number;
  heartsRequired: number;
  settings: {
    includeCategories?: ShortcutCategory[];
    includeDifficulties?: DifficultyLevel[];
    includeApplications?: ApplicationType[];
    focusOnWeakShortcuts?: boolean;
    timeLimit?: number; // seconds per exercise
  };
}

export interface IQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ICodeContext {
  beforeCode: string;
  afterCode: string;
  highlightLines?: number[];
}

export interface ICheckpointNode {
  id: string;
  type: 'checkpoint';
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  position: {
    x: number;
    y: number;
  };
  connections?: string[];
  unlockRequirements: {
    previousNodes?: string[];
    xpRequired?: number;
    levelRequired?: number;
  };
  lessons: string[]; // IDs of lessons to test in this checkpoint
  content?: string;
  status?: 'locked' | 'unlocked' | 'completed';
  category?: ShortcutCategory;
  order?: number;
}

export interface IChallengeNode {
  id: string;
  type: 'challenge';
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  position: {
    x: number;
    y: number;
  };
  connections?: string[];
  unlockRequirements: {
    previousNodes?: string[];
    xpRequired?: number;
    levelRequired?: number;
  };
  content?: string;
  status?: 'locked' | 'unlocked' | 'completed';
  category?: ShortcutCategory;
  lessons?: string[]; // IDs of lessons to test in this challenge
  order?: number;
}

export type PathNode = ILessonNode | ICheckpointNode | IChallengeNode;

export interface ITrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  paths: string[]; // Path IDs
  unlockRequirements: {
    xpRequired?: number;
    levelRequired?: number;
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface PathConnection {
  id: string;
  start: Point;
  end: Point;
  isCompleted: boolean;
}

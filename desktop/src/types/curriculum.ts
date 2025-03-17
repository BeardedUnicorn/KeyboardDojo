/**
 * Curriculum Data Types
 * 
 * This file contains type definitions for the curriculum structure,
 * including application tracks, lessons, and shortcuts.
 */

// Application types
export type ApplicationType = 'vscode' | 'intellij' | 'cursor';

// Difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Shortcut category
export type ShortcutCategory = 
  | 'navigation' 
  | 'editing' 
  | 'search' 
  | 'refactoring' 
  | 'debugging'
  | 'terminal'
  | 'git'
  | 'window'
  | 'ai'
  | 'other';

// Shortcut definition
export interface Shortcut {
  id: string;
  name: string;
  description: string;
  shortcutWindows: string;
  shortcutMac?: string;
  category: ShortcutCategory;
  context?: string;
  difficulty: DifficultyLevel;
  xpValue: number;
}

// Lesson definition
export interface Lesson {
  id: string;
  title: string;
  description: string;
  shortcuts: Shortcut[];
  difficulty: DifficultyLevel;
  category: ShortcutCategory;
  unlockRequirements?: {
    previousLessons?: string[];
    xpRequired?: number;
    level?: number;
  };
  xpReward: number;
  estimatedTime: number; // in minutes
  order: number;
}

// Module definition (group of related lessons)
export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  category: ShortcutCategory;
  difficulty: DifficultyLevel;
  unlockRequirements?: {
    previousModules?: string[];
    xpRequired?: number;
    level?: number;
  };
  order: number;
}

// Application track definition
export interface ApplicationTrack {
  id: ApplicationType;
  name: string;
  description: string;
  icon: string;
  modules: Module[];
  version: string;
  isActive: boolean;
  isDefault?: boolean;
}

// Curriculum definition (collection of all application tracks)
export interface Curriculum {
  tracks: ApplicationTrack[];
  version: string;
  lastUpdated: string;
}

// User progress tracking
export interface UserProgress {
  userId: string;
  completedLessons: {
    lessonId: string;
    completedAt: string;
    score: number;
    timeSpent: number; // in seconds
  }[];
  completedModules: {
    moduleId: string;
    completedAt: string;
  }[];
  currentLessons: {
    trackId: ApplicationType;
    lessonId: string;
    progress: number; // 0-100
  }[];
  xp: number;
  level: number;
  streakDays: number;
  lastActivity: string;
}

// Mastery challenge definition
export interface MasteryChallenge {
  id: string;
  title: string;
  description: string;
  shortcuts: Shortcut[];
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds
  passingScore: number; // percentage
  xpReward: number;
  unlockRequirements: {
    lessonIds: string[];
    xpRequired?: number;
  };
} 
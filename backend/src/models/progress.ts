/**
 * Progress interface representing the structure of user progress documents in DynamoDB
 */
export interface Progress {
  userId: string;
  completedLessons: {
    [lessonId: string]: LessonCompletion;
  };
  totalLessonsCompleted: number;
  streakDays: number;
  lastActivityDate: number;
  updatedAt: number;
}

/**
 * Interface representing completion details for a specific lesson
 */
export interface LessonCompletion {
  completedAt: number;
  score: number;
  attempts: number;
  timeSpent: number; // in seconds
  shortcuts: {
    [shortcutId: string]: ShortcutProgress;
  };
}

/**
 * Interface representing progress on individual shortcuts
 */
export interface ShortcutProgress {
  mastered: boolean;
  attempts: number;
  correctAttempts: number;
  lastAttemptAt: number;
} 
import { getToken } from './authService';

export interface ShortcutProgress {
  mastered: boolean;
  attempts: number;
  correctAttempts: number;
  lastAttemptAt: number;
}

export interface LessonCompletion {
  completedAt: number;
  score: number;
  attempts: number;
  timeSpent: number; // in seconds
  shortcuts: {
    [shortcutId: string]: ShortcutProgress;
  };
}

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

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.keyboarddojo.com' // Replace with actual API URL in production
  : 'http://localhost:3000'; // Local development API URL

/**
 * Get user progress
 */
export const getUserProgress = async (): Promise<Progress> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to fetch progress');
  }
  
  const response = await fetch(`${API_BASE_URL}/progress`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user progress');
  }

  return await response.json();
};

/**
 * Update lesson progress
 */
export const updateLessonProgress = async (
  lessonId: string,
  data: Partial<LessonCompletion>
): Promise<Progress> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to update progress');
  }
  
  const response = await fetch(`${API_BASE_URL}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'lesson',
      lessonId,
      data,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update lesson progress');
  }

  return await response.json();
};

/**
 * Update shortcut progress
 */
export const updateShortcutProgress = async (
  lessonId: string,
  shortcutId: string,
  data: Partial<ShortcutProgress>
): Promise<Progress> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required to update progress');
  }
  
  const response = await fetch(`${API_BASE_URL}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'shortcut',
      lessonId,
      shortcutId,
      data,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update shortcut progress');
  }

  return await response.json();
}; 
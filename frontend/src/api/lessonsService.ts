import { getToken } from './authService';

export interface Shortcut {
  id: string;
  name: string;
  description: string;
  keyCombination: string[];
  operatingSystem?: 'windows' | 'mac' | 'linux' | 'all';
  context?: string;
}

export interface Lesson {
  lessonId: string;
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  content: {
    introduction: string;
    shortcuts: Shortcut[];
    tips: string[];
  };
  shortcuts: Shortcut[];
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
}

// New interface for creating/updating lessons
export interface LessonInput {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  content: {
    introduction: string;
    shortcuts: Shortcut[];
    tips: string[];
  };
  shortcuts: Shortcut[];
  isPremium: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get all lessons
 */
export const getAllLessons = async (): Promise<Lesson[]> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}/lessons`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch lessons');
  }

  return await response.json();
};

/**
 * Get a lesson by ID
 */
export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch lesson');
  }

  return await response.json();
};

/**
 * Get lessons by category
 */
export const getLessonsByCategory = async (category: string): Promise<Lesson[]> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}/lessons/category/${category}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to fetch ${category} lessons`);
  }

  return await response.json();
};

/**
 * Create a new lesson (admin only)
 */
export const createLesson = async (lessonData: LessonInput): Promise<Lesson> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(lessonData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create lesson');
  }

  return await response.json();
};

/**
 * Update an existing lesson (admin only)
 */
export const updateLesson = async (lessonId: string, lessonData: Partial<LessonInput>): Promise<Lesson> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(lessonData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update lesson');
  }

  return await response.json();
};

/**
 * Delete a lesson (admin only)
 */
export const deleteLesson = async (lessonId: string): Promise<void> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete lesson');
  }
};

/**
 * Seed lessons from template (admin only)
 */
export const seedLessons = async (): Promise<{ message: string; results: Array<{ id?: string; title: string; status: 'created' | 'failed' }> }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}/admin/seed-lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to seed lessons');
  }

  return await response.json();
}; 
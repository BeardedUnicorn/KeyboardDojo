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
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.keyboarddojo.com' // Replace with actual API URL in production
  : 'http://localhost:3000'; // Local development API URL

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
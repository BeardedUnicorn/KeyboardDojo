import { getToken } from './authService';
import { captureException } from '../utils/sentry';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Lesson completion interface
interface LessonCompletion {
  completed: boolean;
  completedAt: number;
  score?: number;
}

// User interface
interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: number;
  isPremium: boolean;
  progress?: {
    lastActivityDate: number;
    completedLessons: Record<string, LessonCompletion>;
  };
}

// Lesson interface
interface Lesson {
  lessonId: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
}

// Progress interface
interface Progress {
  userId: string;
  completedLessons: Record<string, LessonCompletion>;
  totalLessonsCompleted: number;
  streakDays: number;
  lastActivityDate: number;
  updatedAt: number;
}

// Admin dashboard stats interface
export interface AdminDashboardStats {
  totalUsers: number;
  totalLessons: number;
  activeUsers: number;
  premiumUsers: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    joinDate: string;
  }>;
  recentLessons: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: string;
  }>;
  userEngagement: {
    beginnerCompletionRate: number;
    intermediateCompletionRate: number;
    advancedCompletionRate: number;
  };
}

/**
 * Get admin dashboard stats
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log('Fetching admin dashboard stats...');
    
    // Fetch users data
    console.log('Fetching users data...');
    console.log('API URL:', API_BASE_URL);
    console.log('Token available:', !!token);
    
    // First, make a preflight request manually to ensure CORS is working
    try {
      console.log('Making manual preflight request');
      const preflightResponse = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type,Authorization',
          'Origin': window.location.origin,
        },
      });
      
      console.log('Preflight response status:', preflightResponse.status);
      console.log('Preflight response headers:', Object.fromEntries([...preflightResponse.headers.entries()]));
    } catch (preflightError) {
      console.error('Preflight request failed:', preflightError);
    }
    
    // Now make the actual request
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // Use 'omit' to avoid CORS issues with credentials
      credentials: 'omit',
      // Add mode: 'cors' explicitly
      mode: 'cors',
    });

    console.log('Users response status:', usersResponse.status);
    console.log('Users response headers:', Object.fromEntries([...usersResponse.headers.entries()]));
    
    // Try to get the response text regardless of status
    let responseText = '';
    try {
      responseText = await usersResponse.text();
      console.log('Response text:', responseText);
    } catch (textError) {
      console.error('Error getting response text:', textError);
    }
    
    if (!usersResponse.ok) {
      let errorMessage = 'Failed to fetch users data';
      let errorData;
      try {
        // Only try to parse as JSON if it looks like JSON
        if (responseText.trim().startsWith('{')) {
          errorData = JSON.parse(responseText);
          console.error('Failed to fetch users data:', errorData);
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = responseText || errorMessage;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorMessage = responseText || errorMessage;
      }
      
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: usersResponse.status,
        endpoint: '/admin/users',
        errorData,
        responseText
      });
      throw error;
    }
    
    // Parse the successful response
    let userData;
    try {
      userData = JSON.parse(responseText);
      // Check if userData is an object with a users property
      if (userData && typeof userData === 'object' && userData.users) {
        userData = userData.users; // Extract the users array
      } else if (!Array.isArray(userData)) {
        console.error('Unexpected userData format:', userData);
        throw new Error('Invalid response format: userData is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing successful response:', parseError);
      throw new Error('Invalid response format from server');
    }

    // Fetch lessons data
    console.log('Fetching lessons data...');
    const lessonsResponse = await fetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Lessons response status:', lessonsResponse.status);
    
    if (!lessonsResponse.ok) {
      let errorMessage = 'Failed to fetch lessons data';
      let errorData;
      try {
        errorData = await lessonsResponse.json();
        console.error('Failed to fetch lessons data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: lessonsResponse.status,
        endpoint: '/admin/lessons',
        errorData
      });
      throw error;
    }

    const lessonsData = await lessonsResponse.json() as Lesson[];
    console.log(`Fetched ${lessonsData.length} lessons`);
    
    // Calculate stats from the fetched data
    const totalUsers = userData.length;
    const totalLessons = lessonsData.length;
    
    // Count premium users
    const premiumUsers = userData.filter((user: User) => user.isPremium).length;
    
    // Calculate active users (users with activity in the last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const activeUsers = userData.filter((user: User) => {
      // If the user has progress and lastActivityDate is within the last 30 days
      return user.progress && user.progress.lastActivityDate && user.progress.lastActivityDate > thirtyDaysAgo;
    }).length;
    
    // Get recent users (last 3 joined)
    const recentUsers = userData
      .sort((a: User, b: User) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map((user: User) => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      }));
    
    // Get recent lessons (last 3 created)
    const recentLessons = lessonsData
      .sort((a: Lesson, b: Lesson) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map((lesson: Lesson) => ({
        id: lesson.lessonId,
        title: lesson.title,
        category: lesson.category,
        createdAt: new Date(lesson.createdAt).toISOString().split('T')[0],
      }));
    
    // Calculate lesson completion rates by difficulty
    const beginnerLessons = lessonsData.filter((lesson: Lesson) => lesson.difficulty === 'beginner');
    const intermediateLessons = lessonsData.filter((lesson: Lesson) => lesson.difficulty === 'intermediate');
    const advancedLessons = lessonsData.filter((lesson: Lesson) => lesson.difficulty === 'advanced');
    
    let beginnerCompletionRate = 0;
    let intermediateCompletionRate = 0;
    let advancedCompletionRate = 0;
    
    // Calculate completion rates
    if (beginnerLessons.length > 0) {
      const beginnerCompletions = userData.reduce((total: number, user: User) => {
        if (user.progress && user.progress.completedLessons) {
          const userBeginnerCompletions = Object.keys(user.progress.completedLessons)
            .filter(lessonId => 
              beginnerLessons.some((lesson: Lesson) => lesson.lessonId === lessonId)
            ).length;
          return total + userBeginnerCompletions;
        }
        return total;
      }, 0);
      
      beginnerCompletionRate = Math.round((beginnerCompletions / (beginnerLessons.length * totalUsers)) * 100);
    }
    
    if (intermediateLessons.length > 0) {
      const intermediateCompletions = userData.reduce((total: number, user: User) => {
        if (user.progress && user.progress.completedLessons) {
          const userIntermediateCompletions = Object.keys(user.progress.completedLessons)
            .filter(lessonId => 
              intermediateLessons.some((lesson: Lesson) => lesson.lessonId === lessonId)
            ).length;
          return total + userIntermediateCompletions;
        }
        return total;
      }, 0);
      
      intermediateCompletionRate = Math.round((intermediateCompletions / (intermediateLessons.length * totalUsers)) * 100);
    }
    
    if (advancedLessons.length > 0) {
      const advancedCompletions = userData.reduce((total: number, user: User) => {
        if (user.progress && user.progress.completedLessons) {
          const userAdvancedCompletions = Object.keys(user.progress.completedLessons)
            .filter(lessonId => 
              advancedLessons.some((lesson: Lesson) => lesson.lessonId === lessonId)
            ).length;
          return total + userAdvancedCompletions;
        }
        return total;
      }, 0);
      
      advancedCompletionRate = Math.round((advancedCompletions / (advancedLessons.length * totalUsers)) * 100);
    }
    
    console.log('Admin dashboard stats calculated successfully');
    
    // Return the compiled stats
    return {
      totalUsers,
      totalLessons,
      activeUsers,
      premiumUsers,
      recentUsers,
      recentLessons,
      userEngagement: {
        beginnerCompletionRate,
        intermediateCompletionRate,
        advancedCompletionRate,
      },
    };
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'getAdminDashboardStats',
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to fetch users';
      let errorData;
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: response.status,
        endpoint: '/admin/users',
        errorData
      });
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'getAllUsers',
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Get user progress by ID (admin only)
 */
export const getUserProgressById = async (userId: string): Promise<Progress> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      let errorMessage = `Failed to fetch progress for user ${userId}`;
      let errorData;
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: response.status,
        endpoint: `/admin/users/${userId}/progress`,
        userId,
        errorData
      });
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in getUserProgressById for user ${userId}:`, error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'getUserProgressById',
      userId,
      apiUrl: API_BASE_URL
    });
    throw error;
  }
}; 
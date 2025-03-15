import { DynamoDB } from 'aws-sdk';
import { Progress, LessonCompletion, ShortcutProgress } from '../models/progress';

// Initialize DynamoDB client
const dynamoDb = new DynamoDB.DocumentClient();
const progressTable = process.env.PROGRESS_TABLE || '';

/**
 * Get user's progress
 */
export const getUserProgress = async (userId: string): Promise<Progress | null> => {
  try {
    const result = await dynamoDb
      .get({
        TableName: progressTable,
        Key: { userId },
      })
      .promise();

    return result.Item as Progress || null;
  } catch (error) {
    console.error(`Error getting progress for user ${userId}:`, error);
    return null;
  }
};

/**
 * Initialize a new progress record for a user
 */
export const initializeUserProgress = async (userId: string): Promise<Progress | null> => {
  try {
    const now = Date.now();
    const progress: Progress = {
      userId,
      completedLessons: {},
      totalLessonsCompleted: 0,
      streakDays: 0,
      lastActivityDate: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: progressTable,
        Item: progress,
        ConditionExpression: 'attribute_not_exists(userId)',
      })
      .promise();

    return progress;
  } catch (error) {
    console.error(`Error initializing progress for user ${userId}:`, error);
    return null;
  }
};

/**
 * Get or initialize user progress
 */
export const getOrInitializeUserProgress = async (userId: string): Promise<Progress | null> => {
  const existingProgress = await getUserProgress(userId);
  
  if (existingProgress) {
    return existingProgress;
  }
  
  return initializeUserProgress(userId);
};

/**
 * Update a user's lesson progress
 */
export const updateLessonProgress = async (
  userId: string,
  lessonId: string,
  lessonData: Partial<LessonCompletion>
): Promise<Progress | null> => {
  try {
    // First get the current progress
    let progress = await getOrInitializeUserProgress(userId);
    
    if (!progress) {
      return null;
    }
    
    const now = Date.now();
    const lessonCompletionData: LessonCompletion = {
      completedAt: now,
      score: 0,
      attempts: 1,
      timeSpent: 0,
      shortcuts: {},
      ...(progress.completedLessons[lessonId] || {}),
      ...lessonData,
    };
    
    // Check if this is a new completion
    const isNewCompletion = !progress.completedLessons[lessonId]?.completedAt;
    
    // Update the progress
    const updatedProgress = {
      ...progress,
      completedLessons: {
        ...progress.completedLessons,
        [lessonId]: lessonCompletionData,
      },
      lastActivityDate: now,
      updatedAt: now,
    };
    
    // If this is a new completion, increment the total
    if (isNewCompletion) {
      updatedProgress.totalLessonsCompleted += 1;
    }
    
    // Update streak
    updatedProgress.streakDays = calculateStreak(progress, now);
    
    // Save the updated progress
    await dynamoDb
      .put({
        TableName: progressTable,
        Item: updatedProgress,
      })
      .promise();
    
    return updatedProgress;
  } catch (error) {
    console.error(`Error updating lesson progress for user ${userId}, lesson ${lessonId}:`, error);
    return null;
  }
};

/**
 * Update a user's shortcut progress
 */
export const updateShortcutProgress = async (
  userId: string,
  lessonId: string,
  shortcutId: string,
  shortcutData: Partial<ShortcutProgress>
): Promise<Progress | null> => {
  try {
    // Get the current progress
    let progress = await getOrInitializeUserProgress(userId);
    
    if (!progress) {
      return null;
    }
    
    const now = Date.now();
    const currentLesson = progress.completedLessons[lessonId] || {
      completedAt: 0,
      score: 0,
      attempts: 0,
      timeSpent: 0,
      shortcuts: {},
    };
    
    const currentShortcut = currentLesson.shortcuts[shortcutId] || {
      mastered: false,
      attempts: 0,
      correctAttempts: 0,
      lastAttemptAt: 0,
    };
    
    // Update the shortcut data
    const updatedShortcut: ShortcutProgress = {
      ...currentShortcut,
      ...shortcutData,
      lastAttemptAt: now,
    };
    
    // Increment attempts if not specified in the update
    if (shortcutData.attempts === undefined) {
      updatedShortcut.attempts += 1;
    }
    
    // Update lesson data
    const updatedLesson: LessonCompletion = {
      ...currentLesson,
      shortcuts: {
        ...currentLesson.shortcuts,
        [shortcutId]: updatedShortcut,
      },
    };
    
    // If adding a correct attempt, update the score
    if (shortcutData.correctAttempts !== undefined) {
      // Calculate lesson score based on shortcut mastery
      const allShortcuts = Object.values({
        ...updatedLesson.shortcuts,
      });
      
      const totalShortcuts = allShortcuts.length;
      const masteredShortcuts = allShortcuts.filter(s => s.mastered).length;
      
      if (totalShortcuts > 0) {
        updatedLesson.score = Math.round((masteredShortcuts / totalShortcuts) * 100);
      }
    }
    
    return updateLessonProgress(userId, lessonId, updatedLesson);
  } catch (error) {
    console.error(`Error updating shortcut progress for user ${userId}, lesson ${lessonId}, shortcut ${shortcutId}:`, error);
    return null;
  }
};

/**
 * Calculate streak based on last activity date
 */
const calculateStreak = (progress: Progress, now: number): number => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  const lastDate = new Date(progress.lastActivityDate);
  const today = new Date(now);
  
  // Reset time parts to compare dates only
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysDifference = Math.round(
    (today.getTime() - lastDate.getTime()) / MILLISECONDS_PER_DAY
  );
  
  // If the last activity was today, maintain streak
  if (daysDifference === 0) {
    return progress.streakDays;
  }
  
  // If the last activity was yesterday, increment streak
  if (daysDifference === 1) {
    return progress.streakDays + 1;
  }
  
  // If more than one day has passed, reset streak to 1 (today's activity)
  return 1;
}; 
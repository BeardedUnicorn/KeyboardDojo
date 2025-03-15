import { DynamoDB } from 'aws-sdk';
import { Lesson } from '../models/lesson';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const dynamoDb = new DynamoDB.DocumentClient();
const lessonsTable = process.env.LESSONS_TABLE || '';

/**
 * Get all lessons
 */
export const getAllLessons = async (premiumAllowed = false): Promise<Lesson[]> => {
  try {
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: lessonsTable,
    };

    // If premium not allowed, filter out premium lessons
    if (!premiumAllowed) {
      params.FilterExpression = 'isPremium = :isPremium';
      params.ExpressionAttributeValues = {
        ':isPremium': false,
      };
    }

    const result = await dynamoDb.scan(params).promise();
    
    // Sort by order property
    const lessons = (result.Items as Lesson[]) || [];
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error getting all lessons:', error);
    return [];
  }
};

/**
 * Get a lesson by ID
 */
export const getLessonById = async (
  lessonId: string,
  premiumAllowed = false
): Promise<Lesson | null> => {
  try {
    const result = await dynamoDb
      .get({
        TableName: lessonsTable,
        Key: { lessonId },
      })
      .promise();

    const lesson = result.Item as Lesson;
    
    // If lesson is premium and premium not allowed, return null
    if (lesson && lesson.isPremium && !premiumAllowed) {
      return null;
    }
    
    return lesson || null;
  } catch (error) {
    console.error(`Error getting lesson by ID ${lessonId}:`, error);
    return null;
  }
};

/**
 * Get lessons by category
 */
export const getLessonsByCategory = async (
  category: string,
  premiumAllowed = false
): Promise<Lesson[]> => {
  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: lessonsTable,
      IndexName: 'CategoryIndex',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category,
      },
    };

    // If premium not allowed, filter out premium lessons
    if (!premiumAllowed) {
      params.FilterExpression = 'isPremium = :isPremium';
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ':isPremium': false,
      };
    }

    const result = await dynamoDb.query(params).promise();
    
    // Sort by order property
    const lessons = (result.Items as Lesson[]) || [];
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`Error getting lessons by category ${category}:`, error);
    return [];
  }
};

/**
 * Create a new lesson (admin only)
 */
export const createLesson = async (lessonData: Omit<Lesson, 'lessonId' | 'createdAt' | 'updatedAt'>): Promise<Lesson | null> => {
  try {
    const now = Date.now();
    const lesson: Lesson = {
      ...lessonData,
      lessonId: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: lessonsTable,
        Item: lesson,
      })
      .promise();

    return lesson;
  } catch (error) {
    console.error('Error creating lesson:', error);
    return null;
  }
};

/**
 * Update an existing lesson (admin only)
 */
export const updateLesson = async (
  lessonId: string,
  updates: Partial<Omit<Lesson, 'lessonId' | 'createdAt' | 'updatedAt'>>
): Promise<Lesson | null> => {
  try {
    // Check if lesson exists
    const existingLesson = await getLessonById(lessonId, true);
    if (!existingLesson) {
      return null;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build update expression
    Object.entries(updates).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    // Add updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = Date.now();

    if (updateExpressions.length === 0) {
      return existingLesson;
    }

    const result = await dynamoDb
      .update({
        TableName: lessonsTable,
        Key: { lessonId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return result.Attributes as Lesson;
  } catch (error) {
    console.error(`Error updating lesson ${lessonId}:`, error);
    return null;
  }
};

/**
 * Delete a lesson (admin only)
 */
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  try {
    await dynamoDb
      .delete({
        TableName: lessonsTable,
        Key: { lessonId },
      })
      .promise();

    return true;
  } catch (error) {
    console.error(`Error deleting lesson ${lessonId}:`, error);
    return false;
  }
}; 
import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { updateLessonProgress, updateShortcutProgress } from '../../utils/progress';
import { LessonCompletion, ShortcutProgress } from '../../models/progress';

/**
 * Lambda handler to update a user's progress
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload) {
      return unauthorizedResponse();
    }
    
    const userId = tokenPayload.userId;
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { type, lessonId, shortcutId, data } = requestBody;
    
    if (!type || !lessonId || !data) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Type, lessonId, and data are required',
        }),
      };
    }
    
    let updatedProgress;
    
    // Update progress based on type
    if (type === 'lesson') {
      // Update lesson progress
      updatedProgress = await updateLessonProgress(
        userId,
        lessonId,
        data as Partial<LessonCompletion>
      );
    } else if (type === 'shortcut') {
      // Validate shortcutId for shortcut updates
      if (!shortcutId) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            message: 'ShortcutId is required for shortcut progress updates',
          }),
        };
      }
      
      // Update shortcut progress
      updatedProgress = await updateShortcutProgress(
        userId,
        lessonId,
        shortcutId,
        data as Partial<ShortcutProgress>
      );
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid progress update type. Must be "lesson" or "shortcut"',
        }),
      };
    }
    
    if (!updatedProgress) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Failed to update progress',
        }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(updatedProgress),
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error updating user progress',
      }),
    };
  }
}; 
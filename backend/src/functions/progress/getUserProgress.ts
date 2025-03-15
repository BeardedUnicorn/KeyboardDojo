import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getUserProgress, initializeUserProgress } from '../../utils/progress';

/**
 * Lambda handler to get a user's progress
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload) {
      return unauthorizedResponse();
    }
    
    const userId = tokenPayload.userId;
    
    // Get user progress
    let progress = await getUserProgress(userId);
    
    // If no progress found, initialize it
    if (!progress) {
      progress = await initializeUserProgress(userId);
      
      if (!progress) {
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            message: 'Failed to initialize user progress',
          }),
        };
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(progress),
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error retrieving user progress',
      }),
    };
  }
}; 
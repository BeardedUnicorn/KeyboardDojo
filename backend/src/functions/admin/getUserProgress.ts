import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getUserProgress } from '../../utils/progress';
import { captureException } from '../../utils/sentry';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

/**
 * Lambda handler to get a user's progress (admin only)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('Received request for admin/users/{userId}/progress');
    
    // Extract token and verify admin
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload || !tokenPayload.isAdmin) {
      console.log('Unauthorized access attempt', tokenPayload);
      if (tokenPayload) {
        captureException(new Error('Non-admin user attempted to access admin endpoint'), {
          context: 'getUserProgress',
          userId: tokenPayload.userId,
          email: tokenPayload.email,
          targetUserId: event.pathParameters?.userId
        });
      }
      return unauthorizedResponse();
    }
    
    // Extract user ID from path parameters
    const userId = event.pathParameters?.userId;
    
    if (!userId) {
      console.log('Missing userId parameter');
      captureException(new Error('Missing userId parameter in getUserProgress'), {
        context: 'getUserProgress',
        adminId: tokenPayload.userId,
        pathParameters: JSON.stringify(event.pathParameters)
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'User ID is required',
        }),
      };
    }
    
    console.log(`Admin verified, fetching progress for user ${userId}`);
    
    // Get user progress
    const progress = await getUserProgress(userId);
    
    if (!progress) {
      console.log(`No progress found for user ${userId}`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'User progress not found',
        }),
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(progress),
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    captureException(error instanceof Error ? error : new Error('Error getting user progress'), {
      context: 'getUserProgress',
      userId: event.pathParameters?.userId
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `Error retrieving user progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.stack : String(error)
      }),
    };
  }
}; 
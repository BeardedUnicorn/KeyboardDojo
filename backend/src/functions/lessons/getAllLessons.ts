import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAllLessons } from '../../utils/lessons';
import { extractAndVerifyToken } from '../../utils/auth';

/**
 * Lambda handler to get all lessons
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Check if user is premium (authenticated users with isPremium: true)
    const tokenPayload = extractAndVerifyToken(event);
    const isPremium = tokenPayload?.isPremium || false;
    
    // Get all lessons, filtering premium lessons for non-premium users
    const lessons = await getAllLessons(isPremium);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(lessons),
    };
  } catch (error) {
    console.error('Error getting all lessons:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error retrieving lessons',
      }),
    };
  }
}; 
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getLessonById } from '../../utils/lessons';
import { extractAndVerifyToken } from '../../utils/auth';

/**
 * Lambda handler to get a lesson by ID
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Get lesson ID from path parameters
    const lessonId = event.pathParameters?.id;
    
    if (!lessonId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Lesson ID is required',
        }),
      };
    }
    
    // Check if user is premium
    const tokenPayload = extractAndVerifyToken(event);
    const isPremium = tokenPayload?.isPremium || false;
    
    // Get the lesson
    const lesson = await getLessonById(lessonId, isPremium);
    
    if (!lesson) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Lesson not found',
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
      body: JSON.stringify(lesson),
    };
  } catch (error) {
    console.error(`Error getting lesson:`, error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error retrieving lesson',
      }),
    };
  }
}; 
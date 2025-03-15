import { APIGatewayProxyHandler } from 'aws-lambda';
import { getLessonsByCategory } from '../../utils/lessons';
import { extractAndVerifyToken } from '../../utils/auth';

/**
 * Lambda handler to get lessons by category
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Get category from path parameters
    const category = event.pathParameters?.category;
    
    if (!category) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Category is required',
        }),
      };
    }
    
    // Check if user is premium
    const tokenPayload = extractAndVerifyToken(event);
    const isPremium = tokenPayload?.isPremium || false;
    
    // Get the lessons by category
    const lessons = await getLessonsByCategory(category, isPremium);
    
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
    console.error(`Error getting lessons by category:`, error);
    
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
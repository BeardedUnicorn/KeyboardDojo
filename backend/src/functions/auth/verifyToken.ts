import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getUserById } from '../../utils/dynamodb';

/**
 * Lambda handler to verify JWT token and return user data
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token from Authorization header
    const payload = extractAndVerifyToken(event);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    // Get user from database to ensure they still exist
    const user = await getUserById(payload.userId);
    
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Return success with user data (omitting sensitive information)
    const { hashedPassword, salt, ...safeUser } = user;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        valid: true,
        user: safeUser,
      }),
    };
  } catch (error) {
    console.error('Token verification error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'An error occurred during token verification',
      }),
    };
  }
}; 
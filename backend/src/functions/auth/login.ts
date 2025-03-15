import { APIGatewayProxyHandler } from 'aws-lambda';
import { verifyPassword, createAuthResponse } from '../../utils/auth';
import { getUserByEmail } from '../../utils/dynamodb';

/**
 * Lambda handler for user login with email and password
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { email, password } = requestBody;

    // Validate required fields
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Email and password are required',
        }),
      };
    }

    // Get user by email
    const user = await getUserByEmail(email.toLowerCase());
    
    // User not found or not using email authentication
    if (!user || user.authProvider !== 'email' || !user.hashedPassword || !user.salt) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid email or password',
        }),
      };
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.hashedPassword, user.salt);
    
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid email or password',
        }),
      };
    }

    // Return success response with token and user data
    return createAuthResponse(user);
  } catch (error) {
    console.error('Login error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'An error occurred during login',
      }),
    };
  }
}; 
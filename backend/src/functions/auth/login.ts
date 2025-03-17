import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyPassword, createAuthResponse } from '../../utils/auth';
import { getUserByEmail } from '../../utils/dynamodb';
import { withLogger } from '../../utils/middleware';
import { formatErrorResponse } from '../../utils/responseFormatter';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/errorHandler';

/**
 * Lambda handler for user login with email and password
 */
export const rawHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { email, password } = requestBody;

    // Validate required fields
    if (!email || !password) {
      logger.warn('Login attempt missing required fields', { 
        email: !!email, 
        hasPassword: !!password 
      });
      
      return formatErrorResponse(
        'Email and password are required',
        400
      );
    }

    // Get user by email
    const user = await getUserByEmail(email.toLowerCase());
    
    // User not found or not using email authentication
    if (!user || user.authProvider !== 'email' || !user.hashedPassword || !user.salt) {
      logger.warn('Invalid login attempt', { 
        email, 
        userExists: !!user,
        authProvider: user?.authProvider || 'none'
      });
      
      return formatErrorResponse(
        'Invalid email or password',
        401
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.hashedPassword, user.salt);
    
    if (!isPasswordValid) {
      logger.warn('Invalid password attempt', { 
        email, 
        userId: user.userId 
      });
      
      return formatErrorResponse(
        'Invalid email or password',
        401
      );
    }

    logger.info('User logged in successfully', { 
      userId: user.userId, 
      email 
    });
    
    // Return success response with token and user data
    return createAuthResponse(user);
  } catch (error) {
    // This will be caught by the middleware and properly logged
    throw new AppError(
      'An error occurred during login',
      500,
      'LOGIN_ERROR',
      { error: String(error) }
    );
  }
};

// Apply the logger middleware
export const handler = withLogger(rawHandler); 
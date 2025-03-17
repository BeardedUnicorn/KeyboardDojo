import { sign, verify } from 'jsonwebtoken';
import { createHash, randomBytes, pbkdf2Sync } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { captureException } from './sentry';

/**
 * Custom authorizer event interface
 */
interface CustomAuthorizerEvent {
  type: string;
  authorizationToken?: string;
  methodArn?: string;
  [key: string]: any;
}

/**
 * User interface representing the structure of user documents in DynamoDB
 */
export interface User {
  userId: string;
  email: string;
  name: string;
  authProvider: 'email' | 'google' | 'github' | 'apple';
  providerId?: string;
  hashedPassword?: string;
  salt?: string;
  createdAt: number;
  isAdmin: boolean;
  isPremium: boolean;
  stripeCustomerId?: string;
}

/**
 * JWT token payload structure
 */
export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isPremium: boolean;
}

/**
 * Generates a JWT token for a user
 */
export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    isPremium: user.isPremium,
  };

  return sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: '7d', // Token expires in 7 days
  });
};

/**
 * Verifies a JWT token and returns the decoded payload
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    console.log('Verifying token');
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      captureException(new Error('JWT_SECRET is not defined'), {
        context: 'verifyToken.missingSecret'
      });
      return null;
    }
    
    const decoded = verify(token, process.env.JWT_SECRET) as TokenPayload;
    console.log('Token verified successfully for user:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    console.error('Token verification error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Log more specific error information
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        console.error('Invalid token format or signature');
      } else if (error.name === 'NotBeforeError') {
        console.error('Token not yet valid');
      }
    }
    
    captureException(error instanceof Error ? error : new Error('Token verification failed'), {
      context: 'verifyToken',
      errorType: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
};

/**
 * Extract and verify the JWT token from an API Gateway event or custom authorizer event
 */
export const extractAndVerifyToken = (event: APIGatewayProxyEvent | CustomAuthorizerEvent): TokenPayload | null => {
  try {
    // Log the entire event structure for debugging
    console.log('Event structure:', JSON.stringify({
      ...event,
      // Mask any sensitive data
      body: 'body' in event && event.body ? '[REDACTED]' : undefined,
      headers: 'headers' in event && event.headers ? '[HEADERS PRESENT]' : '[NO HEADERS]',
    }));
    
    // Check if event is null or undefined
    if (!event) {
      console.error('Event object is null or undefined');
      captureException(new Error('Event object is null or undefined'), {
        context: 'extractAndVerifyToken'
      });
      return null;
    }
    
    // Check if this is a custom authorizer event
    if ('type' in event && event.type === 'TOKEN' && 'authorizationToken' in event && event.authorizationToken) {
      console.log('This appears to be a custom authorizer event');
      const authHeader = event.authorizationToken;
      
      if (!authHeader) {
        console.error('No authorizationToken found in custom authorizer event');
        return null;
      }
      
      const tokenParts = authHeader.split(' ');
      
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.error('Invalid Authorization header format in custom authorizer event');
        return null;
      }
      
      return verifyToken(tokenParts[1]);
    }
    
    // Handle regular API Gateway event
    if (!('headers' in event) || !event.headers) {
      console.error('No headers found in event');
      captureException(new Error('No headers found in event'), {
        context: 'extractAndVerifyToken',
        eventPath: 'path' in event ? event.path : undefined,
        eventHttpMethod: 'httpMethod' in event ? event.httpMethod : undefined,
        eventKeys: Object.keys(event)
      });
      return null;
    }
    
    // Log the headers for debugging
    console.log('Request headers:', JSON.stringify({
      ...event.headers,
      // Mask the token for security
      Authorization: event.headers.Authorization ? 
        `${event.headers.Authorization.substring(0, 20)}...` : undefined,
    }));
    
    const authHeader = event.headers.Authorization || event.headers.authorization;
    
    if (!authHeader) {
      console.error('No Authorization header found in headers');
      captureException(new Error('No Authorization header found'), {
        context: 'extractAndVerifyToken',
        eventPath: 'path' in event ? event.path : undefined,
        eventHttpMethod: 'httpMethod' in event ? event.httpMethod : undefined,
        headers: JSON.stringify(Object.keys(event.headers))
      });
      return null;
    }
    
    const tokenParts = authHeader.split(' ');
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.error('Invalid Authorization header format:', 
        authHeader.substring(0, 15) + '...');
      captureException(new Error('Invalid Authorization header format'), {
        context: 'extractAndVerifyToken',
        authHeaderFormat: tokenParts.length > 0 ? tokenParts[0] : 'empty'
      });
      return null;
    }
    
    const token = tokenParts[1];
    console.log('Token extracted successfully, length:', token.length);
    
    return verifyToken(token);
  } catch (error) {
    console.error('Error in extractAndVerifyToken:', error);
    console.error('Extract token error stack:', error instanceof Error ? error.stack : 'No stack trace');
    captureException(error instanceof Error ? error : new Error('Error in extractAndVerifyToken'), {
      context: 'extractAndVerifyToken',
      eventKeys: event ? Object.keys(event) : []
    });
    return null;
  }
};

/**
 * Generate a salt for password hashing
 */
export const generateSalt = (): string => {
  return randomBytes(16).toString('hex');
};

/**
 * Hash a password with PBKDF2
 */
export const hashPassword = (password: string, salt: string): string => {
  return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

/**
 * Verify a password against a stored hash and salt
 */
export const verifyPassword = (
  password: string,
  storedHash: string,
  salt: string
): boolean => {
  const hash = hashPassword(password, salt);
  return hash === storedHash;
};

/**
 * Generate a unique user ID
 */
export const generateUserId = (): string => {
  return createHash('sha256')
    .update(randomBytes(16).toString('hex') + Date.now().toString())
    .digest('hex');
};

/**
 * Create unauthorized response
 */
export const unauthorizedResponse = () => {
  return {
    statusCode: 401,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Request-Id',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify({
      message: 'Unauthorized',
    }),
  };
};

/**
 * Create authorized response with user object (omitting sensitive information)
 */
export const createAuthResponse = (user: User): any => {
  // Create a new object without the sensitive fields
  const { hashedPassword, salt, ...safeUser } = user;

  const token = generateToken(user);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      token,
      user: safeUser,
    }),
  };
}; 
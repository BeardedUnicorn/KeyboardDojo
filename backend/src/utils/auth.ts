import { sign, verify } from 'jsonwebtoken';
import { createHash, randomBytes, pbkdf2Sync } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';

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
    return verify(token, process.env.JWT_SECRET || '') as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Extract and verify the JWT token from an API Gateway event
 */
export const extractAndVerifyToken = (event: APIGatewayProxyEvent): TokenPayload | null => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  const tokenParts = authHeader.split(' ');
  
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return null;
  }
  
  return verifyToken(tokenParts[1]);
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
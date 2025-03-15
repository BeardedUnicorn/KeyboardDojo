import { APIGatewayProxyHandler } from 'aws-lambda';
import { 
  generateUserId, 
  generateSalt, 
  hashPassword, 
  createAuthResponse, 
  User 
} from '../../utils/auth';
import { createUser, userExistsByEmail } from '../../utils/dynamodb';

/**
 * Lambda handler for user registration with email and password
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { name, email, password } = requestBody;

    // Validate required fields
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Name, email, and password are required',
        }),
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid email format',
        }),
      };
    }

    // Password strength validation
    if (password.length < 8) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Password must be at least 8 characters long',
        }),
      };
    }

    // Check if email already exists
    const emailExists = await userExistsByEmail(email);
    if (emailExists) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Email already in use',
        }),
      };
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Create user object
    const user: User = {
      userId: generateUserId(),
      email: email.toLowerCase(),
      name,
      authProvider: 'email',
      hashedPassword,
      salt,
      createdAt: Date.now(),
      isAdmin: false,
      isPremium: false,
    };

    // Save user to database
    const success = await createUser(user);
    if (!success) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Failed to create user',
        }),
      };
    }

    // Return success response with token and user data
    return createAuthResponse(user);
  } catch (error) {
    console.error('Registration error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'An error occurred during registration',
      }),
    };
  }
}; 
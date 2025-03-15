import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { 
  generateUserId, 
  createAuthResponse, 
  User 
} from '../../../utils/auth';
import { 
  createUser, 
  userExistsByProviderId, 
  userExistsByEmail,
  updateUser
} from '../../../utils/dynamodb';

/**
 * Lambda handler for Google OAuth callback
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { code } = requestBody;

    if (!code) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Authorization code is required',
        }),
      };
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.CLIENT_URL}/auth/callback/google`,
        grant_type: 'authorization_code',
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Failed to get access token from Google',
        }),
      };
    }

    // Get user info from Google
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { id, email, name } = userInfoResponse.data;

    if (!id || !email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Failed to get user information from Google',
        }),
      };
    }

    // Check if user already exists by Google ID
    let user = await userExistsByProviderId('google', id);

    if (user) {
      // User exists, return auth response
      return createAuthResponse(user);
    }

    // Check if user exists by email
    const existingUser = await userExistsByEmail(email);

    if (existingUser) {
      // If user registered with email but now using Google, update the user
      if (existingUser.authProvider === 'email') {
        user = await updateUser(existingUser.userId, {
          authProvider: 'google',
          providerId: id,
        });

        if (!user) {
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
              message: 'Failed to update user authentication method',
            }),
          };
        }

        return createAuthResponse(user);
      }

      // User registered with another OAuth provider
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: `Email already in use with ${existingUser.authProvider} authentication`,
        }),
      };
    }

    // Create a new user
    const newUser: User = {
      userId: generateUserId(),
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      authProvider: 'google',
      providerId: id,
      createdAt: Date.now(),
      isAdmin: false,
      isPremium: false,
    };

    const success = await createUser(newUser);

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

    // Return success response
    return createAuthResponse(newUser);
  } catch (error) {
    console.error('Google OAuth error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'An error occurred during Google authentication',
        error: error.message || 'Unknown error',
      }),
    };
  }
}; 
import { 
  APIGatewayProxyHandler, 
  APIGatewayAuthorizerHandler, 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult,
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerEvent
} from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getUserById } from '../../utils/dynamodb';
import { captureException } from '../../utils/sentry';

/**
 * Lambda handler to verify JWT token and return user data
 */
export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    console.log('verifyToken handler called with event:', JSON.stringify({
      ...event,
      // Mask sensitive data
      body: event.body ? '[REDACTED]' : undefined,
      headers: event.headers ? {
        ...event.headers,
        Authorization: event.headers.Authorization ? 
          `${event.headers.Authorization.substring(0, 20)}...` : undefined,
      } : undefined,
    }));
    
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
    captureException(error instanceof Error ? error : new Error('Token verification error'), {
      context: 'verifyToken',
    });
    
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

/**
 * Lambda authorizer handler to verify JWT token and generate IAM policy
 */
export const authorizerHandler: APIGatewayAuthorizerHandler = async (
  event: APIGatewayAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    console.log('Authorizer handler called with event:', JSON.stringify({
      ...event,
      // Mask sensitive data
      authorizationToken: (event as any).authorizationToken ? 
        `${(event as any).authorizationToken.substring(0, 20)}...` : undefined,
    }));
    
    // Extract token from authorizationToken
    const payload = extractAndVerifyToken(event);
    
    if (!payload) {
      console.log('Token verification failed');
      return generateDenyPolicy('user', (event as any).methodArn);
    }
    
    // Get user from database to ensure they still exist
    const user = await getUserById(payload.userId);
    
    if (!user) {
      console.log('User not found in database');
      return generateDenyPolicy('user', (event as any).methodArn);
    }
    
    console.log('User verified:', {
      userId: user.userId,
      isAdmin: user.isAdmin,
    });
    
    // Generate policy
    return generateAllowPolicy(user.userId, (event as any).methodArn, {
      userId: user.userId,
      isAdmin: user.isAdmin ? 'true' : 'false',
      email: user.email,
    });
  } catch (error) {
    console.error('Authorizer error:', error);
    captureException(error instanceof Error ? error : new Error('Authorizer error'), {
      context: 'verifyToken.authorizer',
    });
    
    return generateDenyPolicy('user', (event as any).methodArn);
  }
};

/**
 * Generate IAM allow policy
 */
const generateAllowPolicy = (
  principalId: string, 
  resource: string, 
  context: Record<string, string> = {}
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource,
        },
      ],
    },
    context,
  };
};

/**
 * Generate IAM deny policy
 */
const generateDenyPolicy = (principalId: string, resource: string): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: resource,
        },
      ],
    },
  };
}; 
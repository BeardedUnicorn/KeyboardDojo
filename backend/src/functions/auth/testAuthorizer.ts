import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { captureException } from '../../utils/sentry';
import { extractAndVerifyToken } from '../../utils/auth';
import { addCorsHeaders, createOptionsResponse, isOptionsRequest } from '../../utils/cors';

/**
 * Lambda handler to test the authorizer
 */
export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  // Handle OPTIONS request
  if (isOptionsRequest(event.httpMethod)) {
    return createOptionsResponse();
  }
  
  try {
    console.log('testAuthorizer handler called with event:', JSON.stringify({
      ...event,
      // Mask sensitive data
      body: event.body ? '[REDACTED]' : undefined,
      headers: event.headers ? {
        ...event.headers,
        Authorization: event.headers.Authorization ? 
          `${event.headers.Authorization.substring(0, 20)}...` : undefined,
      } : undefined,
    }));
    
    // Extract token from Authorization header for comparison
    const tokenPayload = extractAndVerifyToken(event);
    
    // Check if we have authorizer context
    if (event.requestContext?.authorizer) {
      console.log('Authorizer context found:', JSON.stringify(event.requestContext.authorizer));
      
      return addCorsHeaders({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Authorizer test successful',
          authorizerContext: event.requestContext.authorizer,
          tokenPayload: tokenPayload ? {
            userId: tokenPayload.userId,
            email: tokenPayload.email,
            isAdmin: tokenPayload.isAdmin,
            isPremium: tokenPayload.isPremium
          } : null,
          comparison: {
            userId: {
              fromAuthorizer: event.requestContext.authorizer.userId,
              fromToken: tokenPayload?.userId,
              match: event.requestContext.authorizer.userId === tokenPayload?.userId
            },
            isAdmin: {
              fromAuthorizer: event.requestContext.authorizer.isAdmin,
              fromToken: tokenPayload?.isAdmin,
              match: String(event.requestContext.authorizer.isAdmin) === String(tokenPayload?.isAdmin)
            }
          }
        }),
      });
    } else {
      console.log('No authorizer context found');
      
      return addCorsHeaders({
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'No authorizer context found',
          tokenPayload: tokenPayload ? {
            userId: tokenPayload.userId,
            email: tokenPayload.email,
            isAdmin: tokenPayload.isAdmin,
            isPremium: tokenPayload.isPremium
          } : null
        }),
      });
    }
  } catch (error) {
    console.error('Error in testAuthorizer:', error);
    captureException(error instanceof Error ? error : new Error('Error in testAuthorizer'), {
      context: 'testAuthorizer',
    });
    
    return addCorsHeaders({
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'An error occurred during authorizer test',
        error: error instanceof Error ? error.message : String(error)
      }),
    });
  }
}; 
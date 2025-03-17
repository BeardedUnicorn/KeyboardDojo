import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getAllLessons } from '../../utils/lessons';
import { captureException } from '../../utils/sentry';
import { addCorsHeaders, createOptionsResponse, isOptionsRequest } from '../../utils/cors';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

/**
 * Lambda handler to get all lessons (admin only)
 */
export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  // Handle OPTIONS request
  if (isOptionsRequest(event.httpMethod)) {
    return createOptionsResponse();
  }
  
  let userId = '';
  
  try {
    console.log('getLessons handler called with event:', JSON.stringify({
      ...event,
      // Mask sensitive data
      body: event.body ? '[REDACTED]' : undefined,
      headers: event.headers ? {
        ...event.headers,
        Authorization: event.headers.Authorization ? 
          `${event.headers.Authorization.substring(0, 20)}...` : undefined,
      } : undefined,
      requestContext: event.requestContext ? {
        ...event.requestContext,
        authorizer: event.requestContext.authorizer || 'No authorizer context'
      } : 'No requestContext'
    }));
    
    // Extract token from Authorization header for comparison
    const tokenPayload = extractAndVerifyToken(event);
    
    // Check if we have authorizer context
    if (event.requestContext?.authorizer) {
      console.log('Authorizer context found:', JSON.stringify(event.requestContext.authorizer));
      
      if (event.requestContext.authorizer.isAdmin === 'true') {
        console.log('User is admin according to authorizer context');
        userId = event.requestContext.authorizer.userId;
        
        console.log('User is admin, proceeding with request', { userId });
      } else {
        console.log('User is not admin according to authorizer context', {
          isAdmin: event.requestContext.authorizer.isAdmin,
          userId: event.requestContext.authorizer.userId
        });
        
        return addCorsHeaders({
          statusCode: 403,
          headers,
          body: JSON.stringify({
            message: 'Forbidden - Admin access required',
            context: 'From authorizer context'
          }),
        });
      }
    } else if (tokenPayload) {
      userId = tokenPayload.userId;
      console.log('Token payload:', JSON.stringify({
        userId: tokenPayload.userId,
        isAdmin: tokenPayload.isAdmin,
        email: tokenPayload.email
      }));
      
      // Check if user is admin
      if (!tokenPayload.isAdmin) {
        console.log('User is not admin according to token payload', { userId });
        captureException(new Error('Non-admin user attempted to access admin endpoint'), {
          context: 'getLessons',
          userId,
        });
        
        return addCorsHeaders({
          statusCode: 403,
          headers,
          body: JSON.stringify({
            message: 'Forbidden - Admin access required',
            context: 'From token payload'
          }),
        });
      }
      
      console.log('User is admin according to token payload, proceeding with request', { userId });
    } else {
      console.log('No authorizer context or token payload found');
      return addCorsHeaders(unauthorizedResponse());
    }
    
    // Get all lessons (including premium)
    const lessons = await getAllLessons(true);
    console.log(`Found ${lessons.length} lessons`);
    
    return addCorsHeaders({
      statusCode: 200,
      headers,
      body: JSON.stringify(lessons),
    });
  } catch (error) {
    console.error('Error getting lessons:', error);
    captureException(error instanceof Error ? error : new Error('Error getting lessons'), {
      context: 'getLessons',
      userId,
    });
    
    return addCorsHeaders({
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'An error occurred while retrieving lessons',
        error: error instanceof Error ? error.message : String(error)
      }),
    });
  }
};
 
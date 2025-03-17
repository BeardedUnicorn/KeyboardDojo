import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/node';
import { logger, LogContext } from './logger';
import { handleError } from './errorHandler';

/**
 * Type for Lambda handler functions
 */
export type LambdaHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

/**
 * Extract request ID from event or generate a new one
 * @param event - API Gateway event
 * @returns Request ID
 */
const getRequestId = (event: APIGatewayProxyEvent): string => {
  // Try to get request ID from API Gateway
  const requestId = event.requestContext?.requestId || 
                   event.headers['x-request-id'] || 
                   event.headers['X-Request-Id'];
  
  // If not found, generate a new one
  return requestId || uuidv4();
};

/**
 * Extract user ID from event if available
 * @param event - API Gateway event
 * @returns User ID or undefined
 */
const getUserId = (event: APIGatewayProxyEvent): string | undefined => {
  // Try to get user ID from requestContext authorizer
  return event.requestContext?.authorizer?.principalId ||
         event.requestContext?.authorizer?.claims?.sub;
};

/**
 * Create a log context from event and context
 * @param event - API Gateway event
 * @param context - Lambda context
 * @returns Log context
 */
const createLogContext = (
  event: APIGatewayProxyEvent,
  context: Context
): LogContext => {
  const requestId = getRequestId(event);
  const userId = getUserId(event);
  
  return {
    requestId,
    userId,
    functionName: context.functionName,
    awsRequestId: context.awsRequestId,
    path: event.path,
    httpMethod: event.httpMethod,
    queryParams: event.queryStringParameters,
    sourceIp: event.requestContext?.identity?.sourceIp,
  };
};

/**
 * Middleware to add logging, error handling, and Sentry integration to Lambda functions
 * @param handler - The Lambda handler function
 * @returns Wrapped handler function
 */
export const withLogger = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // Create log context
    const logContext = createLogContext(event, context);
    const { requestId } = logContext;
    
    // Start timer for performance tracking
    const startTime = logger.startTimer(`${context.functionName}`);
    
    // Configure Sentry transaction
    const transaction = Sentry.startTransaction?.({
      op: 'lambda',
      name: context.functionName,
      data: {
        requestId,
        path: event.path,
        httpMethod: event.httpMethod,
      },
    }) || { setData: () => {}, setStatus: () => {}, finish: () => {} };
    
    // Set Sentry context
    Sentry.configureScope?.(scope => {
      scope.setTag('requestId', requestId);
      scope.setTag('functionName', context.functionName);
      if (logContext.userId) {
        scope.setUser({ id: logContext.userId });
      }
    });
    
    try {
      // Log request
      logger.info('Lambda invocation started', {
        ...logContext,
        body: event.body ? JSON.parse(event.body) : undefined,
      });
      
      // Execute handler
      const response = await handler(event, context);
      
      // Log response
      const duration = logger.endTimer(`${context.functionName}`, startTime, {
        ...logContext,
        statusCode: response.statusCode,
      });
      
      // Add request ID to response headers
      const headers = {
        ...response.headers,
        'X-Request-Id': requestId || '',
      };
      
      // Finish Sentry transaction
      transaction.setData('statusCode', response.statusCode);
      transaction.setData('duration', duration);
      transaction.finish();
      
      // Return response with request ID header
      return {
        ...response,
        headers,
      };
    } catch (error) {
      // Log error
      logger.error('Lambda invocation failed', error, logContext);
      
      // Finish Sentry transaction with error status
      transaction.setStatus('error');
      transaction.finish();
      
      // Handle error and return standardized response
      return handleError(error, requestId);
    }
  };
}; 
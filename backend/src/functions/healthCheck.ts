import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withLogger } from '../utils/middleware';
import { formatSuccessResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

/**
 * Health check Lambda function
 * @param event - API Gateway event
 * @returns API Gateway response
 */
export const rawHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Health check requested', { path: event.path });
  
  return formatSuccessResponse({
    message: 'Keyboard Dojo API is healthy',
    stage: process.env.STAGE || 'dev',
    timestamp: new Date().toISOString(),
  });
};

// Apply the logger middleware
export const handler = withLogger(rawHandler); 
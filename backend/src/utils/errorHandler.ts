import { APIGatewayProxyResult } from 'aws-lambda';
import { captureException } from './sentry';
import { logger } from './logger';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Custom error class with additional properties
 */
export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle errors and return a standardized API response
 * @param error - The error to handle
 * @param requestId - Optional request ID for tracking
 * @returns API Gateway proxy result
 */
export const handleError = (error: unknown, requestId?: string): APIGatewayProxyResult => {
  // Use the new logger instead of console.error
  logger.error('Error occurred', error, { requestId });
  
  // Capture error in Sentry (this is now redundant as logger.error does this,
  // but keeping for backward compatibility)
  if (error instanceof Error) {
    captureException(error, { requestId });
  }

  // Default error response
  let statusCode = 500;
  const response: ErrorResponse = {
    message: 'An unexpected error occurred',
  };

  // Handle AppError with custom status code and details
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    response.message = error.message;
    if (error.code) response.code = error.code;
    if (error.details) response.details = error.details;
  } 
  // Handle standard Error
  else if (error instanceof Error) {
    response.message = error.message;
  }
  // Handle string error
  else if (typeof error === 'string') {
    response.message = error;
  }

  // Add request ID if available
  if (requestId) {
    response.details = { 
      ...(typeof response.details === 'object' ? response.details as object : {}),
      requestId 
    };
  }

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'X-Request-Id': requestId || '',
    },
    body: JSON.stringify(response),
  };
}; 
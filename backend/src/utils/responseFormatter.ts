import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Standard headers for API responses
 * @param requestId - Optional request ID to include in headers
 * @returns Headers object
 */
export const getStandardHeaders = (requestId?: string): { [key: string]: string | boolean } => {
  const headers: { [key: string]: string | boolean } = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  
  if (requestId) {
    headers['X-Request-Id'] = requestId;
  }
  
  return headers;
};

/**
 * Format a success response
 * @param data - Response data
 * @param statusCode - HTTP status code (default: 200)
 * @param requestId - Optional request ID
 * @returns API Gateway proxy result
 */
export const formatSuccessResponse = (
  data: any,
  statusCode = 200,
  requestId?: string
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: getStandardHeaders(requestId),
    body: JSON.stringify(data),
  };
};

/**
 * Format an error response
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param code - Optional error code
 * @param details - Optional error details
 * @param requestId - Optional request ID
 * @returns API Gateway proxy result
 */
export const formatErrorResponse = (
  message: string,
  statusCode = 500,
  code?: string,
  details?: unknown,
  requestId?: string
): APIGatewayProxyResult => {
  const response: any = { message };
  
  if (code) {
    response.code = code;
  }
  
  if (details) {
    response.details = details;
  }
  
  if (requestId) {
    response.requestId = requestId;
  }
  
  return {
    statusCode,
    headers: getStandardHeaders(requestId),
    body: JSON.stringify(response),
  };
}; 
import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Default CORS headers for all responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Request-Id',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

/**
 * Add CORS headers to a response
 */
export const addCorsHeaders = (response: APIGatewayProxyResult): APIGatewayProxyResult => {
  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  };
};

/**
 * Create a CORS response for OPTIONS requests
 */
export const createOptionsResponse = (): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: '',
  };
};

/**
 * Check if the request is an OPTIONS request
 */
export const isOptionsRequest = (httpMethod?: string): boolean => {
  return httpMethod === 'OPTIONS';
}; 
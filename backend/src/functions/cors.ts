import { APIGatewayProxyHandler } from 'aws-lambda';

/**
 * Lambda handler for CORS preflight requests
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  // Get the origin from the request headers
  const origin = event.headers?.origin || event.headers?.Origin || '*';
  
  console.log('CORS handler called with origin:', origin);
  console.log('Request headers:', JSON.stringify(event.headers));
  
  // For preflight requests with credentials, we can't use a wildcard
  // We must specify the exact origin
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Request-Id',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    },
    body: '',
  };
}; 
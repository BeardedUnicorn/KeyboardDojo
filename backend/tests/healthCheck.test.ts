import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/functions/healthCheck';

describe('Health Check Lambda', () => {
  it('should return a 200 status code', async () => {
    // Mock API Gateway event
    const event = {} as APIGatewayProxyEvent;
    
    // Call the handler
    const response = await handler(event);
    
    // Assert the response
    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty('Content-Type', 'application/json');
    expect(response.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
    
    // Parse the response body
    const body = JSON.parse(response.body);
    
    // Assert the body properties
    expect(body).toHaveProperty('message', 'Keyboard Dojo API is healthy');
    expect(body).toHaveProperty('stage');
    expect(body).toHaveProperty('timestamp');
  });
}); 
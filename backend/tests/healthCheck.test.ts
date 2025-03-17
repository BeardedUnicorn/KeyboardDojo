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

  it('should include CORS headers in the response', async () => {
    // Mock API Gateway event
    const event = {} as APIGatewayProxyEvent;
    
    // Call the handler
    const response = await handler(event);
    
    // Assert CORS headers
    expect(response.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
    expect(response.headers).toHaveProperty('Access-Control-Allow-Credentials', true);
  });

  it('should include the correct stage in the response', async () => {
    // Save original env
    const originalEnv = process.env.STAGE;
    
    try {
      // Set test environment
      process.env.STAGE = 'test';
      
      // Mock API Gateway event
      const event = {} as APIGatewayProxyEvent;
      
      // Call the handler
      const response = await handler(event);
      
      // Parse the response body
      const body = JSON.parse(response.body);
      
      // Assert the stage
      expect(body.stage).toBe('test');
    } finally {
      // Restore original env
      process.env.STAGE = originalEnv;
    }
  });

  it('should include a valid ISO timestamp in the response', async () => {
    // Mock API Gateway event
    const event = {} as APIGatewayProxyEvent;
    
    // Call the handler
    const response = await handler(event);
    
    // Parse the response body
    const body = JSON.parse(response.body);
    
    // Assert the timestamp is a valid ISO string
    expect(() => new Date(body.timestamp)).not.toThrow();
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
}); 
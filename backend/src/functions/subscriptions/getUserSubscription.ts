import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { getUserSubscription } from '../../utils/stripe';

/**
 * Lambda function to get a user's subscription details
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload) {
      return unauthorizedResponse();
    }
    
    const userId = tokenPayload.userId;
    
    // Get user's subscription
    const subscription = await getUserSubscription(userId);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        subscription: subscription || null,
        isPremium: !!subscription && (
          subscription.status === 'active' || 
          subscription.status === 'trialing'
        ),
      }),
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error getting user subscription',
      }),
    };
  }
}; 
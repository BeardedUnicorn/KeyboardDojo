import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { cancelSubscription } from '../../utils/stripe';

/**
 * Lambda function to cancel a user's subscription
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload) {
      return unauthorizedResponse();
    }
    
    const userId = tokenPayload.userId;
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { immediateCancel } = requestBody;
    
    // Default to cancellation at period end (false) if not specified
    const atPeriodEnd = immediateCancel === true ? false : true;
    
    // Cancel the subscription
    const cancelledSubscription = await cancelSubscription(userId, atPeriodEnd);
    
    if (!cancelledSubscription) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'No active subscription found for user',
        }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        subscription: cancelledSubscription,
        message: atPeriodEnd 
          ? 'Subscription will be cancelled at the end of the billing period' 
          : 'Subscription has been cancelled immediately',
      }),
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error cancelling subscription',
      }),
    };
  }
}; 
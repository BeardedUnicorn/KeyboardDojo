import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { createCheckoutSession, SubscriptionPlan } from '../../utils/stripe';

/**
 * Lambda function to create a Stripe checkout session for subscription
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract and verify token
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload) {
      return unauthorizedResponse();
    }
    
    const userId = tokenPayload.userId;
    const email = tokenPayload.email;
    const name = tokenPayload.name || email;
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { plan, successUrl, cancelUrl } = requestBody;
    
    if (!plan || !successUrl || !cancelUrl) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields: plan, successUrl, or cancelUrl',
        }),
      };
    }
    
    // Validate plan
    if (!Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid subscription plan',
          validPlans: Object.values(SubscriptionPlan),
        }),
      };
    }
    
    // Create checkout session
    const checkoutUrl = await createCheckoutSession(
      userId,
      email,
      name,
      plan as SubscriptionPlan,
      successUrl,
      cancelUrl
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        url: checkoutUrl,
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error creating checkout session',
      }),
    };
  }
}; 
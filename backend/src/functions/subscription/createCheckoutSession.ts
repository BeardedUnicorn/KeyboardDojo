import { APIGatewayProxyHandler } from 'aws-lambda';
import Stripe from 'stripe';
import { User, SubscriptionPlan } from '../../types';
import { getUserByEmail } from '../../utils/dynamodb';
import { verifyToken } from '../../utils/auth';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionStatus } from '../../types';
import { dynamoDb } from '../../utils/dynamodb';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Subscription table name
const subscriptionsTable = process.env.SUBSCRIPTIONS_TABLE || '';

// Price IDs for the different subscription plans (to be created in Stripe dashboard)
const PLAN_PRICE_IDS: Record<string, string> = {
  MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  ANNUAL: process.env.STRIPE_ANNUAL_PRICE_ID || '',
};

/**
 * Lambda function to create a Stripe checkout session for subscription
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };
    
    // Verify authentication token
    const token = event.headers.Authorization?.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized - No token provided' }),
      };
    }
    
    // Verify the token and get user email
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized - Invalid token' }),
      };
    }
    
    // Get the user from the database
    const user = await getUserByEmail(decodedToken.email);
    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    const { plan, successUrl, cancelUrl } = requestBody;
    
    // Validate required fields
    if (!plan || !successUrl || !cancelUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Missing required fields: plan, successUrl, and cancelUrl are required' 
        }),
      };
    }
    
    // Get the correct price ID based on the selected plan
    const priceId = PLAN_PRICE_IDS[plan];
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid subscription plan' }),
      };
    }
    
    // Create customer in Stripe if they don't already have a Stripe customer ID
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || user.email,
        metadata: {
          userId: user.userId,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Save the Stripe customer ID to the user's record (not waiting for this to complete)
      // In a production app, you might want to update the user first and then create the checkout session
      try {
        // Update user record with Stripe customer ID (implementation depends on your DB utility functions)
        // await updateUser(user.id, { stripeCustomerId });
      } catch (error) {
        console.error('Error updating user with Stripe customer ID', error);
        // Continue anyway since we have the customer ID for this session
      }
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.userId,
        plan,
      },
    });
    
    // Create the subscription record in DynamoDB
    await dynamoDb.put({
      TableName: subscriptionsTable,
      Item: {
        id: uuidv4(),
        userId: user.userId,
        stripeCustomerId,
        stripeSubscriptionId: '',
        plan: plan === 'monthly' ? SubscriptionPlan.MONTHLY : SubscriptionPlan.ANNUAL,
        status: SubscriptionStatus.INCOMPLETE,
        currentPeriodStart: Date.now(),
        currentPeriodEnd: Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000,
        cancelAtPeriodEnd: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    }).promise();
    
    // Return the checkout session URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
    };
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ 
        message: 'Error creating checkout session',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}; 
import { APIGatewayProxyHandler } from 'aws-lambda';
import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';
import { verifyToken } from '../../utils/auth';
import { getUserByEmail } from '../../utils/dynamodb';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient();
const subscriptionsTable = process.env.SUBSCRIPTIONS_TABLE || '';

/**
 * Lambda function to cancel a user's subscription
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
    const { immediateCancel = false } = requestBody;
    
    // Get user's subscription from the Subscriptions table
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': user.id,
      },
    }).promise();
    
    // Check if the user has an active subscription
    if (!subscriptions || subscriptions.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'No active subscription found' }),
      };
    }
    
    // Sort by creation date in descending order to get the most recent subscription
    const sortedSubscriptions = subscriptions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Get the most recent subscription
    const subscription = sortedSubscriptions[0];
    
    // Check if the subscription is already cancelled
    if (subscription.cancelAtPeriodEnd) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Subscription is already scheduled for cancellation' }),
      };
    }
    
    // Check if the subscription is already inactive
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Subscription is not active' }),
      };
    }
    
    // Cancel the subscription in Stripe
    if (subscription.stripeSubscriptionId) {
      if (immediateCancel) {
        // Cancel immediately
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } else {
        // Cancel at period end
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      }
      
      // Update the subscription in the database
      const timestamp = new Date().toISOString();
      const updatedSubscription = await dynamoDB.update({
        TableName: subscriptionsTable,
        Key: { id: subscription.id },
        UpdateExpression: 'SET cancelAtPeriodEnd = :cancelAtPeriodEnd, updatedAt = :updatedAt, status = :status',
        ExpressionAttributeValues: {
          ':cancelAtPeriodEnd': !immediateCancel,
          ':updatedAt': timestamp,
          ':status': immediateCancel ? 'canceled' : subscription.status,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();
      
      // Return the updated subscription
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: immediateCancel ? 'Subscription cancelled immediately' : 'Subscription will be cancelled at the end of the billing period',
          subscription: updatedSubscription.Attributes,
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No Stripe subscription ID found' }),
      };
    }
    
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ 
        message: 'Error cancelling subscription',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}; 
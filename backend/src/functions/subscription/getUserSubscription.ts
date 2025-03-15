import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { verifyToken } from '../../utils/auth';
import { getUserByEmail } from '../../utils/dynamodb';

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient();
const subscriptionsTable = process.env.SUBSCRIPTIONS_TABLE || '';

/**
 * Lambda function to get a user's subscription details
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
    
    // Get user's subscription from the Subscriptions table
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': user.id,
      },
    }).promise();
    
    // Return the active subscription if found
    if (subscriptions && subscriptions.length > 0) {
      // Sort by creation date in descending order to get the most recent subscription
      const sortedSubscriptions = subscriptions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Get the most recent subscription
      const subscription = sortedSubscriptions[0];
      
      // Determine if the user has premium access
      const isPremium = subscription.status === 'active' || 
                       subscription.status === 'trialing';
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          subscription,
          isPremium,
        }),
      };
    }
    
    // If no subscription is found, return null subscription with isPremium: false
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subscription: null,
        isPremium: false,
      }),
    };
    
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ 
        message: 'Error fetching user subscription',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}; 
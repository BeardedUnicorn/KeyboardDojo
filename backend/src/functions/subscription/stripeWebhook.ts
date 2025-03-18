import { APIGatewayProxyHandler } from 'aws-lambda';
import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';
import { Subscription } from '../../types';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient();
const subscriptionsTable = process.env.SUBSCRIPTIONS_TABLE || '';
const usersTable = process.env.USERS_TABLE || '';

/**
 * Lambda function to handle Stripe webhook events
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Verify webhook signature
    const signature = event.headers['stripe-signature'];
    if (!signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing Stripe signature' }),
      };
    }

    // Get the raw request body for signature verification
    const payload = event.body || '';

    // Verify the event with Stripe
    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid signature' }),
      };
    }

    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Error handling webhook:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error handling webhook',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  try {
    // Skip if not a subscription checkout
    if (session.mode !== 'subscription') return;

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Get customer ID and user ID from the session
    const customerId = session.customer as string;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No userId found in session metadata');
      return;
    }

    // Create a new subscription record in DynamoDB
    const timestamp = new Date().toISOString();
    const subscriptionId = `sub_${Date.now()}`;

    // StorePage subscription in DynamoDB
    await dynamoDB.put({
      TableName: subscriptionsTable,
      Item: {
        id: subscriptionId,
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        plan: session.metadata?.plan || 'MONTHLY',
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    }).promise();

    // Update the user record with the Stripe customer ID if not already set
    const userResponse = await dynamoDB.get({
      TableName: usersTable,
      Key: { id: userId },
    }).promise();

    const user = userResponse.Item;
    if (user && !user.stripeCustomerId) {
      await dynamoDB.update({
        TableName: usersTable,
        Key: { id: userId },
        UpdateExpression: 'SET stripeCustomerId = :stripeCustomerId',
        ExpressionAttributeValues: {
          ':stripeCustomerId': customerId,
        },
      }).promise();
    }

  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  try {
    // Query DynamoDB to find the subscription record
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'StripeSubscriptionIdIndex',
      KeyConditionExpression: 'stripeSubscriptionId = :stripeSubscriptionId',
      ExpressionAttributeValues: {
        ':stripeSubscriptionId': subscription.id,
      },
    }).promise();

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No subscription found for Stripe subscription ID: ${subscription.id}`);
      return;
    }

    // Update the subscription record in DynamoDB
    const dbSubscription = subscriptions[0];
    const timestamp = new Date().toISOString();

    await dynamoDB.update({
      TableName: subscriptionsTable,
      Key: { id: dbSubscription.id },
      UpdateExpression: 'SET #status = :status, currentPeriodStart = :currentPeriodStart, currentPeriodEnd = :currentPeriodEnd, cancelAtPeriodEnd = :cancelAtPeriodEnd, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': subscription.status,
        ':currentPeriodStart': new Date(subscription.current_period_start * 1000).toISOString(),
        ':currentPeriodEnd': new Date(subscription.current_period_end * 1000).toISOString(),
        ':cancelAtPeriodEnd': subscription.cancel_at_period_end,
        ':updatedAt': timestamp,
      },
    }).promise();

  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  try {
    // Query DynamoDB to find the subscription record
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'StripeSubscriptionIdIndex',
      KeyConditionExpression: 'stripeSubscriptionId = :stripeSubscriptionId',
      ExpressionAttributeValues: {
        ':stripeSubscriptionId': subscription.id,
      },
    }).promise();

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No subscription found for Stripe subscription ID: ${subscription.id}`);
      return;
    }

    // Update the subscription record in DynamoDB
    const dbSubscription = subscriptions[0];
    const timestamp = new Date().toISOString();

    await dynamoDB.update({
      TableName: subscriptionsTable,
      Key: { id: dbSubscription.id },
      UpdateExpression: 'SET #status = :status, cancelAtPeriodEnd = :cancelAtPeriodEnd, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'canceled',
        ':cancelAtPeriodEnd': false,
        ':updatedAt': timestamp,
      },
    }).promise();

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  try {
    // Skip if not a subscription invoice
    if (!invoice.subscription) return;

    // Query DynamoDB to find the subscription record
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'StripeSubscriptionIdIndex',
      KeyConditionExpression: 'stripeSubscriptionId = :stripeSubscriptionId',
      ExpressionAttributeValues: {
        ':stripeSubscriptionId': invoice.subscription as string,
      },
    }).promise();

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No subscription found for Stripe subscription ID: ${invoice.subscription}`);
      return;
    }

    // If needed, update the subscription status in DynamoDB
    const dbSubscription = subscriptions[0];
    if (dbSubscription.status !== 'active') {
      const timestamp = new Date().toISOString();

      await dynamoDB.update({
        TableName: subscriptionsTable,
        Key: { id: dbSubscription.id },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'active',
          ':updatedAt': timestamp,
        },
      }).promise();
    }

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  try {
    // Skip if not a subscription invoice
    if (!invoice.subscription) return;

    // Query DynamoDB to find the subscription record
    const { Items: subscriptions } = await dynamoDB.query({
      TableName: subscriptionsTable,
      IndexName: 'StripeSubscriptionIdIndex',
      KeyConditionExpression: 'stripeSubscriptionId = :stripeSubscriptionId',
      ExpressionAttributeValues: {
        ':stripeSubscriptionId': invoice.subscription as string,
      },
    }).promise();

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No subscription found for Stripe subscription ID: ${invoice.subscription}`);
      return;
    }

    // Update the subscription status in DynamoDB
    const dbSubscription = subscriptions[0];
    const timestamp = new Date().toISOString();

    await dynamoDB.update({
      TableName: subscriptionsTable,
      Key: { id: dbSubscription.id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'past_due',
        ':updatedAt': timestamp,
      },
    }).promise();

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}

import Stripe from 'stripe';
import { DynamoDB } from 'aws-sdk';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Specify the Stripe API version
});

// Initialize DynamoDB
const dynamoDb = new DynamoDB.DocumentClient();
const usersTable = process.env.USERS_TABLE || '';
const subscriptionsTable = process.env.SUBSCRIPTIONS_TABLE || '';

/**
 * Subscription plan types
 */
export enum SubscriptionPlan {
  MONTHLY = 'price_monthly',
  ANNUAL = 'price_annual',
}

/**
 * Subscription status types
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  TRIALING = 'trialing',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
}

/**
 * Interface for subscription data
 */
export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Get the Stripe customer ID for a user
 * Creates a new customer if one doesn't exist
 */
export const getOrCreateStripeCustomer = async (
  userId: string,
  email: string,
  name?: string
): Promise<string> => {
  try {
    // First, check if the user already has a Stripe customer ID
    const userResult = await dynamoDb.get({
      TableName: usersTable,
      Key: { userId },
    }).promise();

    const user = userResult.Item;
    
    if (user && user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // If no Stripe customer ID exists, create a new customer
    const customer = await stripe.customers.create({
      email,
      name: name || email,
      metadata: {
        userId,
      },
    });

    // Update the user record with the new Stripe customer ID
    await dynamoDb.update({
      TableName: usersTable,
      Key: { userId },
      UpdateExpression: 'set stripeCustomerId = :stripeCustomerId, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':stripeCustomerId': customer.id,
        ':updatedAt': Date.now(),
      },
    }).promise();

    return customer.id;
  } catch (error) {
    console.error('Error in getOrCreateStripeCustomer:', error);
    throw error;
  }
};

/**
 * Create a Stripe checkout session for subscription
 */
export const createCheckoutSession = async (
  userId: string,
  email: string,
  name: string,
  plan: SubscriptionPlan,
  successUrl: string,
  cancelUrl: string
): Promise<string> => {
  try {
    // Get or create Stripe customer
    const stripeCustomerId = await getOrCreateStripeCustomer(userId, email, name);

    // Get the price ID based on the plan
    const priceId = process.env[plan] || '';
    
    if (!priceId) {
      throw new Error(`Price ID for plan ${plan} not found`);
    }

    // Create checkout session
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
        userId,
        plan,
      },
    });

    return session.url || '';
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Create a subscription record in DynamoDB
 */
export const createSubscription = async (
  stripeSubscription: Stripe.Subscription,
  userId: string,
  stripeCustomerId: string
): Promise<Subscription> => {
  try {
    const now = Date.now();
    
    const subscription: Subscription = {
      id: `sub_${userId}_${now}`,
      userId,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscription.id,
      plan: stripeSubscription.items.data[0].price.id as SubscriptionPlan,
      status: stripeSubscription.status as SubscriptionStatus,
      currentPeriodStart: stripeSubscription.current_period_start * 1000, // Convert to milliseconds
      currentPeriodEnd: stripeSubscription.current_period_end * 1000, // Convert to milliseconds
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      createdAt: now,
      updatedAt: now,
    };

    // Store the subscription in DynamoDB
    await dynamoDb.put({
      TableName: subscriptionsTable,
      Item: subscription,
    }).promise();

    // Update user record to set premium status
    await dynamoDb.update({
      TableName: usersTable,
      Key: { userId },
      UpdateExpression: 'set isPremium = :isPremium, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isPremium': true,
        ':updatedAt': now,
      },
    }).promise();

    return subscription;
  } catch (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  }
};

/**
 * Update a subscription record in DynamoDB
 */
export const updateSubscription = async (
  stripeSubscription: Stripe.Subscription
): Promise<Subscription | null> => {
  try {
    // Get the user ID from the subscription's customer metadata
    const customer = await stripe.customers.retrieve(stripeSubscription.customer as string);
    
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }
    
    const userId = customer.metadata.userId;
    
    if (!userId) {
      throw new Error('User ID not found in customer metadata');
    }

    // Get current subscription record
    const subscriptionResult = await dynamoDb.query({
      TableName: subscriptionsTable,
      IndexName: 'ByStripeSubscriptionId',
      KeyConditionExpression: 'stripeSubscriptionId = :stripeSubscriptionId',
      ExpressionAttributeValues: {
        ':stripeSubscriptionId': stripeSubscription.id,
      },
    }).promise();

    if (!subscriptionResult.Items || subscriptionResult.Items.length === 0) {
      console.error('Subscription not found:', stripeSubscription.id);
      return null;
    }

    const subscriptionRecord = subscriptionResult.Items[0] as Subscription;
    const now = Date.now();
    
    // Update subscription record
    const updatedSubscription: Subscription = {
      ...subscriptionRecord,
      status: stripeSubscription.status as SubscriptionStatus,
      currentPeriodStart: stripeSubscription.current_period_start * 1000,
      currentPeriodEnd: stripeSubscription.current_period_end * 1000,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      updatedAt: now,
    };

    await dynamoDb.put({
      TableName: subscriptionsTable,
      Item: updatedSubscription,
    }).promise();

    // Update user premium status based on subscription status
    const isPremium = stripeSubscription.status === 'active' || 
                     stripeSubscription.status === 'trialing';
    
    await dynamoDb.update({
      TableName: usersTable,
      Key: { userId },
      UpdateExpression: 'set isPremium = :isPremium, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isPremium': isPremium,
        ':updatedAt': now,
      },
    }).promise();

    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (
  userId: string,
  atPeriodEnd: boolean = true
): Promise<Subscription | null> => {
  try {
    // Get user's subscription
    const subscriptionResult = await dynamoDb.query({
      TableName: subscriptionsTable,
      IndexName: 'ByUserId',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }).promise();

    if (!subscriptionResult.Items || subscriptionResult.Items.length === 0) {
      throw new Error('No active subscription found for user');
    }

    const subscription = subscriptionResult.Items[0] as Subscription;

    // Cancel the subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: atPeriodEnd,
    });

    if (!atPeriodEnd) {
      // If cancelling immediately, update the subscription status
      const cancelledSubscription = await stripe.subscriptions.cancel(
        subscription.stripeSubscriptionId
      );
      
      return updateSubscription(cancelledSubscription);
    } else {
      // If cancelling at period end, just update the cancelAtPeriodEnd flag
      const now = Date.now();
      
      const updatedSubscription: Subscription = {
        ...subscription,
        cancelAtPeriodEnd: true,
        updatedAt: now,
      };

      await dynamoDb.put({
        TableName: subscriptionsTable,
        Item: updatedSubscription,
      }).promise();

      return updatedSubscription;
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Get user subscription
 */
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    const result = await dynamoDb.query({
      TableName: subscriptionsTable,
      IndexName: 'ByUserId',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }).promise();

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    // Sort by created date descending to get the most recent subscription
    const subscriptions = result.Items as Subscription[];
    subscriptions.sort((a, b) => b.createdAt - a.createdAt);

    return subscriptions[0];
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
};

/**
 * Verify webhook signature from Stripe
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );
}; 
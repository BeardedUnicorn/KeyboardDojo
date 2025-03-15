import { APIGatewayProxyHandler } from 'aws-lambda';
import { 
  verifyWebhookSignature, 
  createSubscription,
  updateSubscription,
} from '../../utils/stripe';
import Stripe from 'stripe';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Missing stripe-signature header',
        }),
      };
    }
    
    // Parse the event
    const stripeEvent = verifyWebhookSignature(event.body || '', signature);
    
    console.log('Stripe event received:', stripeEvent.type);
    
    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        
        // Get customer and subscription ID from the session
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        // Get the subscription from Stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2023-10-16',
        });
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Create a new subscription record
        const userId = session.metadata?.userId;
        
        if (!userId) {
          console.error('Missing userId in session metadata');
          break;
        }
        
        await createSubscription(subscription, userId, customerId);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await updateSubscription(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await updateSubscription(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Get the subscription from Stripe
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
          });
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Update the subscription record
          await updateSubscription(subscription);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Get the subscription from Stripe
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
          });
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Update the subscription record
          await updateSubscription(subscription);
        }
        break;
      }
      
      default:
        // Ignore other event types
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error handling Stripe webhook',
      }),
    };
  }
}; 
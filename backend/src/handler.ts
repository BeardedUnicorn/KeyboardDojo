import { initSentry } from './utils/sentry';
import * as Sentry from '@sentry/node';
import { logger } from './utils/logger';

// Initialize Sentry as early as possible
logger.info('Initializing Sentry in handler.ts');
initSentry();

// Send a test message to verify Sentry is working
if (process.env.SENTRY_DSN) {
  logger.info('Sending test message to Sentry from handler.ts', {
    context: 'handler.init',
    environment: process.env.STAGE || 'development'
  });
  
  // Ensure the message is sent
  Sentry.flush(2000).catch(err => {
    logger.error('Error flushing Sentry events', err);
  });
}

// Import handlers from their respective files
import { handler as healthCheckHandler } from './functions/healthCheck';
import { handler as registerHandler } from './functions/auth/register';
import { handler as loginHandler } from './functions/auth/login';
import { handler as verifyTokenHandler } from './functions/auth/verifyToken';
import { authorizerHandler } from './functions/auth/verifyToken';
import { handler as googleAuthHandler } from './functions/auth/oauth/google';
import { handler as getAllLessonsHandler } from './functions/lessons/getAllLessons';
import { handler as getLessonByIdHandler } from './functions/lessons/getLessonById';
import { handler as getLessonsByCategoryHandler } from './functions/lessons/getLessonsByCategory';
import { handler as getUserProgressHandler } from './functions/progress/getUserProgress';
import { handler as updateUserProgressHandler } from './functions/progress/updateUserProgress';
import { handler as createCheckoutSessionHandler } from './functions/subscriptions/createCheckoutSession';
import { handler as getUserSubscriptionHandler } from './functions/subscriptions/getUserSubscription';
import { handler as cancelSubscriptionHandler } from './functions/subscriptions/cancelSubscription';
import { handler as stripeWebhookHandler } from './functions/subscriptions/stripeWebhook';
import { handler as seedLessonsHandler } from './functions/admin/seedLessons';
import { handler as getUsersHandler } from './functions/admin/getUsers';
import { handler as getLessonsHandler } from './functions/admin/getLessons';
import { handler as getAdminUserProgressHandler } from './functions/admin/getUserProgress';
import { handler as testAuthorizerHandler } from './functions/auth/testAuthorizer';
import { handler as testAdminHandler } from './functions/admin/testAdmin';

// Export handlers with unique names
export {
  healthCheckHandler,
  registerHandler,
  loginHandler,
  verifyTokenHandler,
  googleAuthHandler,
  getAllLessonsHandler,
  getLessonByIdHandler,
  getLessonsByCategoryHandler,
  getUserProgressHandler,
  updateUserProgressHandler,
  createCheckoutSessionHandler,
  getUserSubscriptionHandler,
  cancelSubscriptionHandler,
  stripeWebhookHandler,
  seedLessonsHandler,
  getUsersHandler,
  getLessonsHandler,
  getAdminUserProgressHandler,
  authorizerHandler,
  testAuthorizerHandler,
  testAdminHandler
}; 
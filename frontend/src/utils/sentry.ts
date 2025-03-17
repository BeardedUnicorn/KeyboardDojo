import * as Sentry from '@sentry/react';

// Initialize Sentry
// https://docs.sentry.io/platforms/javascript/guides/react/
export const initSentry = (): void => {
  // Only initialize if SENTRY_DSN is set
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE || 'development',
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,
      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,
    });
    
    console.log(`Sentry initialized for environment: ${import.meta.env.MODE || 'development'}`);
  } else {
    console.log('Sentry DSN not found, skipping initialization');
  }
};

// Capture exceptions
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error captured (Sentry disabled):', error, context);
  }
};

// Capture messages
export const captureMessage = (message: string, context?: Record<string, unknown>): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      extra: context,
    });
  } else {
    console.log('Message captured (Sentry disabled):', message, context);
  }
};

// Set user context
export const setUser = (user: { id: string; email?: string; username?: string }): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

// Clear user context
export const clearUser = (): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser(null);
  }
}; 
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import path from 'path';

// Initialize Sentry
// https://docs.sentry.io/platforms/node/
export const initSentry = (): void => {
  // Only initialize if SENTRY_DSN is set
  if (process.env.SENTRY_DSN) {
    try {
      console.log(`Initializing Sentry with DSN: ${process.env.SENTRY_DSN.substring(0, 15)}... for environment: ${process.env.STAGE || 'development'}`);
      
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.STAGE || 'development',
        integrations: [
          // Rewrite frames to make them readable in Sentry UI
          // @ts-ignore - Type mismatch between @sentry/node and @sentry/integrations
          new RewriteFrames({
            root: path.join(__dirname, '../../'),
          }),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        tracesSampleRate: 1.0,
        // Ensure errors are sent immediately
        beforeSend: (event) => {
          console.log(`Sending event to Sentry: ${event.event_id}`);
          return event;
        },
        // Add debug mode for troubleshooting
        debug: process.env.STAGE !== 'production',
        // Increase timeout for sending events
        shutdownTimeout: 5000,
        // Ensure we capture all errors
        maxBreadcrumbs: 50,
        autoSessionTracking: true,
      });
      
      // Verify initialization
      console.log('Sentry initialization complete');
      
      // Send a test event to verify connectivity
      Sentry.captureMessage('Sentry initialization test', {
        level: 'info',
        extra: {
          timestamp: new Date().toISOString(),
          environment: process.env.STAGE || 'development'
        }
      });
      
      // Flush events to ensure they're sent
      Sentry.flush(2000).then(
        () => console.log('Initialization test event flushed successfully'),
        (e) => console.error('Failed to flush initialization test event:', e)
      );
      
    } catch (error) {
      console.error('Error initializing Sentry:', error);
    }
  } else {
    console.log('Sentry DSN not found, skipping initialization');
  }
};

// Safely stringify context to avoid circular references
const safeStringify = (obj: any): string => {
  try {
    const cache: any[] = [];
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value)) {
          return '[Circular]';
        }
        cache.push(value);
      }
      return value;
    });
  } catch (error) {
    return `[Error stringifying object: ${error}]`;
  }
};

// Capture exceptions
export const captureException = (error: Error, context?: Record<string, any>): void => {
  if (process.env.SENTRY_DSN) {
    try {
      // Log the error and context for debugging
      console.log(`Capturing exception in Sentry: ${error.message}`);
      if (context) {
        console.log(`Context: ${safeStringify(context)}`);
      }
      
      // Add breadcrumb for debugging
      Sentry.addBreadcrumb({
        category: 'error',
        message: `Error: ${error.message}`,
        level: 'error',
        data: context
      });
      
      // Create a structured extra context with transaction name
      const extraContext = {
        ...context,
        _transaction: context?.context || 'unknown'
      };
      
      // Check if Sentry is initialized by attempting to capture
      Sentry.captureException(error, {
        extra: extraContext,
        tags: {
          transaction: context?.context || 'unknown',
          errorType: error.name
        }
      });
      
      // Flush events to ensure they're sent immediately
      Sentry.flush(2000).then(
        () => console.log('Sentry events flushed successfully'),
        (e) => console.error('Failed to flush Sentry events:', e)
      );
    } catch (captureError) {
      console.error('Error capturing exception in Sentry:', captureError);
      console.error('Original error:', error);
      console.error('Context:', context ? safeStringify(context) : 'No context');
      
      // Try to reinitialize Sentry
      try {
        console.log('Attempting to reinitialize Sentry...');
        initSentry();
        
        // Try again after reinitialization
        Sentry.captureException(error, {
          extra: {
            ...context,
            reinitialized: true
          },
        });
        
        // Flush events again
        Sentry.flush(2000).catch(e => 
          console.error('Failed to flush Sentry events after reinitialization:', e)
        );
      } catch (reinitError) {
        console.error('Failed to reinitialize Sentry:', reinitError);
      }
    }
  } else {
    console.error('Error captured (Sentry disabled):', error, context ? safeStringify(context) : 'No context');
  }
};

// Capture messages
export const captureMessage = (message: string, context?: Record<string, any>): void => {
  if (process.env.SENTRY_DSN) {
    try {
      // Log the message and context for debugging
      console.log(`Capturing message in Sentry: ${message}`);
      if (context) {
        console.log(`Context: ${safeStringify(context)}`);
      }
      
      // Add breadcrumb for debugging
      Sentry.addBreadcrumb({
        category: 'message',
        message: message,
        level: 'info',
        data: context
      });
      
      // Create a structured extra context with transaction name
      const extraContext = {
        ...context,
        _transaction: context?.context || 'unknown'
      };
      
      // Check if Sentry is initialized by attempting to capture
      Sentry.captureMessage(message, {
        extra: extraContext,
        tags: {
          transaction: context?.context || 'unknown',
          messageType: 'info'
        }
      });
      
      // Flush events to ensure they're sent immediately
      Sentry.flush(2000).then(
        () => console.log('Sentry events flushed successfully'),
        (e) => console.error('Failed to flush Sentry events:', e)
      );
    } catch (captureError) {
      console.error('Error capturing message in Sentry:', captureError);
      console.error('Original message:', message);
      console.error('Context:', context ? safeStringify(context) : 'No context');
      
      // Try to reinitialize Sentry
      try {
        console.log('Attempting to reinitialize Sentry...');
        initSentry();
        
        // Try again after reinitialization
        Sentry.captureMessage(message, {
          extra: {
            ...context,
            reinitialized: true
          },
        });
        
        // Flush events again
        Sentry.flush(2000).catch(e => 
          console.error('Failed to flush Sentry events after reinitialization:', e)
        );
      } catch (reinitError) {
        console.error('Failed to reinitialize Sentry:', reinitError);
      }
    }
  } else {
    console.log('Message captured (Sentry disabled):', message, context ? safeStringify(context) : 'No context');
  }
};

// Set user context
export const setUser = (user: { id: string; email?: string; username?: string }): void => {
  if (process.env.SENTRY_DSN) {
    try {
      Sentry.setUser(user);
      console.log(`Set Sentry user context: ${user.id}`);
    } catch (error) {
      console.error('Error setting Sentry user context:', error);
    }
  }
};

// Clear user context
export const clearUser = (): void => {
  if (process.env.SENTRY_DSN) {
    try {
      Sentry.setUser(null);
      console.log('Cleared Sentry user context');
    } catch (error) {
      console.error('Error clearing Sentry user context:', error);
    }
  }
}; 
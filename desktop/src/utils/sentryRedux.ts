import * as Sentry from '@sentry/react';

import type { RootState } from '@store/index';
import type { Middleware, Store, AnyAction } from 'redux';

// Actions that should not be sent to Sentry
const BLACKLISTED_ACTIONS = [
  // Authentication actions with sensitive data
  'auth/login',
  'auth/register',
  'auth/refreshToken',
  'auth/updateCredentials',
  
  // User data actions with sensitive information
  'user/updateProfile',
  'user/updateEmail',
  'user/updatePassword',
  'user/updatePersonalInfo',
  
  // Payment and subscription actions
  'subscription/updatePaymentMethod',
  'subscription/processPayment',
  
  // API calls that might contain sensitive data
  'api/executeQuery',
  'api/executeMutation',
  
  // High-frequency actions that would create noise
  'app/setLastActive',
  'app/heartbeat',
  'app/updateOnlineStatus',
];

// Paths in the state that contain sensitive information
const SENSITIVE_PATHS = [
  // Authentication data
  'auth.credentials',
  'auth.token',
  'auth.refreshToken',
  
  // User personal information
  'user.personalInfo',
  'user.email',
  'user.password',
  'user.phoneNumber',
  
  // Payment information
  'subscription.paymentDetails',
  'subscription.cardInfo',
  'subscription.billingAddress',
  
  // Any API credentials or keys
  'settings.apiKeys',
  'app.credentials',
];

// Performance transaction names for important Redux flows
const PERFORMANCE_TRANSACTIONS = {
  'curriculum/fetchData': 'Redux: Fetch Curriculum',
  'lesson/start': 'Redux: Start Lesson',
  'lesson/complete': 'Redux: Complete Lesson',
  'challenge/start': 'Redux: Start Challenge',
  'challenge/submit': 'Redux: Submit Challenge',
  'gamification/addXP': 'Redux: Add XP',
  'user/login': 'Redux: User Login',
  'user/register': 'Redux: User Registration',
};

/**
 * Creates a breadcrumb for Redux actions
 * @param action The Redux action
 * @returns A sanitized breadcrumb object
 */
const createActionBreadcrumb = (action: AnyAction) => {
  // Clone the action to avoid mutating the original
  const sanitizedAction = { ...action };
  
  // Redact sensitive payload data if needed
  if (sanitizedAction.payload) {
    if (typeof sanitizedAction.payload === 'object') {
      // For objects, replace with a redacted indicator
      sanitizedAction.payload = '[REDACTED PAYLOAD]';
    } else if (
      typeof sanitizedAction.payload === 'string' && 
      (sanitizedAction.payload.includes('password') || 
       sanitizedAction.payload.includes('token') || 
       sanitizedAction.payload.includes('key'))
    ) {
      // For strings that might contain sensitive data
      sanitizedAction.payload = '[REDACTED STRING]';
    }
  }
  
  return {
    category: 'redux.action',
    message: action.type,
    level: 'info' as Sentry.SeverityLevel,
    data: {
      type: action.type,
      // Include a sanitized version of the payload
      payload: sanitizedAction.payload,
    },
  };
};

/**
 * Creates a sanitized copy of the state
 * @param state The Redux state
 * @returns A sanitized copy of the state
 */
const sanitizeState = (state: RootState): Partial<RootState> => {
  // Helper function to determine if a value should be redacted
  const shouldRedact = (key: string, value: any): boolean => {
    const sensitiveKeywords = [
      'password',
      'token',
      'secret',
      'key',
      'credential',
      'auth',
      'credit',
      'card',
    ];
    
    return sensitiveKeywords.some((keyword) => 
      key.toLowerCase().includes(keyword),
    );
  };

  // Helper function to process values
  const processValue = (value: any): any => {
    if (value === null || value === undefined) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map((item) => processValue(item));
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'object') {
      const processed = {};
      Object.entries(value).forEach(([key, val]) => {
        if (shouldRedact(key, val)) {
          processed[key] = '[REDACTED]';
        } else {
          processed[key] = processValue(val);
        }
      });
      return processed;
    }

    // Handle primitive values
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    // For any other types, convert to string
    return String(value);
  };

  try {
    // Process each slice of the state
    const sanitizedState = Object.entries(state).reduce((acc, [key, value]) => {
      // Skip processing for certain slices that might contain sensitive data
      if (SENSITIVE_PATHS.some((path) => path.startsWith(key + '.'))) {
        acc[key] = '[REDACTED]';
        return acc;
      }

      acc[key] = processValue(value);
      return acc;
    }, {} as Partial<RootState>);

    return sanitizedState;
  } catch (error) {
    console.error('Error sanitizing state:', error);
    return {};
  }
};

/**
 * Enriches Sentry context with Redux state
 * @param state The Redux state
 */
const enrichContextWithReduxState = (state: RootState) => {
  try {
    // Sanitize the state before sending to Sentry
    const sanitizedState = sanitizeState(state);
    
    // Process each slice of the state to ensure proper serialization
    const processedState = Object.entries(sanitizedState).reduce((acc, [key, value]) => {
      // Skip if the value is null or undefined
      if (value == null) return acc;

      // For each slice, create a processed version that's more readable in Sentry
      const processedValue = { ...value };

      // Process date fields if they exist
      if (typeof value === 'object') {
        Object.entries(value).forEach(([fieldKey, fieldValue]) => {
          // Check if the field value is a valid date string
          if (typeof fieldValue === 'string' && !isNaN(Date.parse(fieldValue))) {
            processedValue[fieldKey] = new Date(fieldValue).toISOString();
          }
        });
      }

      // Remove any undefined or null values
      Object.keys(processedValue).forEach((k) => {
        if (processedValue[k] == null) {
          delete processedValue[k];
        }
      });

      return {
        ...acc,
        [key]: processedValue,
      };
    }, {});

    // Set the Redux state as context with additional metadata
    Sentry.setContext('redux', {
      state: processedState,
      stateVersion: '1.0',
      lastUpdated: new Date().toISOString(),
      slices: Object.keys(processedState),
    });

    // Add a breadcrumb for state updates
    Sentry.addBreadcrumb({
      category: 'redux.state',
      message: 'Redux state updated',
      level: 'info',
      data: {
        slices: Object.keys(processedState),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Log any errors during context enrichment
    console.error('Error enriching Sentry context with Redux state:', error);
    
    // Add error breadcrumb
    Sentry.addBreadcrumb({
      category: 'redux.error',
      message: 'Failed to enrich Sentry context with Redux state',
      level: 'error',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Starts a performance transaction for important Redux actions
 * @param action The Redux action
 * @returns The transaction object or null
 */
const startPerformanceTransaction = (action: AnyAction): any | null => {
  const transactionName = PERFORMANCE_TRANSACTIONS[action.type];
  if (!transactionName) return null;
  
  try {
    // Add a breadcrumb for performance monitoring
    Sentry.addBreadcrumb({
      category: 'redux.performance',
      message: `Starting transaction: ${transactionName}`,
      level: 'info',
    });
    
    // For now, just return a simple object that we can use to track timing
    // This avoids using Sentry APIs that might not be available
    const startTime = Date.now();
    return {
      startTime,
      name: transactionName,
      finish: () => {
        const duration = Date.now() - startTime;
        Sentry.addBreadcrumb({
          category: 'redux.performance',
          message: `Finished transaction: ${transactionName} (${duration}ms)`,
          level: 'info',
          data: { duration },
        });
      },
      setStatus: (status: string) => {
        Sentry.addBreadcrumb({
          category: 'redux.performance',
          message: `Transaction status: ${transactionName} (${status})`,
          level: 'info',
          data: { status },
        });
      },
    };
  } catch (error) {
    console.error('Error starting performance tracking:', error);
    return null;
  }
};

/**
 * Creates Sentry middleware for Redux
 * @returns Redux middleware for Sentry integration
 */
export const createSentryMiddleware = (): Middleware => {
  return (store) => (next) => (action: AnyAction) => {
    // Track performance for important actions
    const transaction = startPerformanceTransaction(action);
    
    try {
      // Skip blacklisted actions for breadcrumbs
      if (!BLACKLISTED_ACTIONS.includes(action.type)) {
        // Add breadcrumb for the action
        Sentry.addBreadcrumb(createActionBreadcrumb(action));
      }
      
      // Process the action
      const result = next(action);
      
      // Get the updated state
      const state = store.getState();
      
      // Update Sentry context with new state
      enrichContextWithReduxState(state);
      
      // Finish performance tracking if applicable
      if (transaction) {
        transaction.finish();
      }
      
      return result;
    } catch (error) {
      // Capture the error with additional context
      Sentry.withScope((scope) => {
        scope.setExtra('action', action);
        scope.setExtra('state', sanitizeState(store.getState()));
        scope.setTag('redux.action_type', action.type);
        
        if (error instanceof Error) {
          Sentry.captureException(error);
        } else {
          Sentry.captureMessage('Redux middleware error');
        }
      });
      
      // Re-throw the error
      throw error;
    }
  };
};

/**
 * Initializes Sentry Redux integration
 * @param store The Redux store
 */
export const initSentryRedux = (store: Store<RootState>): void => {
  try {
    // Set initial state in Sentry
    const state = store.getState();
    enrichContextWithReduxState(state);
    
    // Add Redux integration info to Sentry
    Sentry.addBreadcrumb({
      category: 'redux',
      message: 'Redux integration initialized',
      level: 'info',
      data: {
        storeSlices: Object.keys(state),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to initialize Sentry Redux integration:', error);
  }
}; 

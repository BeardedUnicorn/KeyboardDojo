import * as Sentry from '@sentry/react';

/**
 * Capture an exception and send it to Sentry
 * @param error The error to capture
 * @param context Additional context to include with the error
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Capture a message and send it to Sentry
 * @param message The message to capture
 * @param level The severity level
 * @param context Additional context to include with the message
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>,
) => {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};

/**
 * Set user information for Sentry
 * @param user User information
 */
export const setUser = (user: { id?: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

/**
 * Clear user information from Sentry
 */
export const clearUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb to Sentry
 * @param breadcrumb Breadcrumb information
 */
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Set tags for Sentry
 * @param tags Tags to set
 */
export const setTags = (tags: Record<string, string>) => {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}; 

import * as Sentry from '@sentry/node';
import { captureException, captureMessage } from './sentry';

/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Interface for structured log context
 */
export interface LogContext {
  [key: string]: any;
  requestId?: string;
  userId?: string;
  functionName?: string;
  action?: string;
  duration?: number;
}

/**
 * Sanitizes sensitive data from objects before logging
 * @param data - The data to sanitize
 * @returns Sanitized data
 */
const sanitizeData = (data: any): any => {
  if (!data) return data;
  
  // If it's not an object, return as is
  if (typeof data !== 'object') return data;
  
  // Clone the object to avoid modifying the original
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  // List of sensitive fields to mask
  const sensitiveFields = [
    'password', 'token', 'secret', 'authorization', 'apiKey', 'api_key',
    'accessToken', 'refreshToken', 'hashedPassword', 'salt'
  ];
  
  // Recursively sanitize the object
  Object.keys(sanitized).forEach(key => {
    // Check if the key is sensitive
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } 
    // Recursively sanitize nested objects
    else if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Formats a log message with context
 * @param level - Log level
 * @param message - Log message
 * @param context - Additional context
 * @returns Formatted log string
 */
const formatLog = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeData(context) : {};
  
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...sanitizedContext
  });
};

/**
 * Logger class for structured logging with Sentry integration
 */
class Logger {
  /**
   * Log a debug message
   * @param message - The message to log
   * @param context - Additional context
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.STAGE === 'production') return;
    
    console.debug(formatLog(LogLevel.DEBUG, message, context));
  }
  
  /**
   * Log an info message
   * @param message - The message to log
   * @param context - Additional context
   */
  info(message: string, context?: LogContext): void {
    console.info(formatLog(LogLevel.INFO, message, context));
    
    // Add breadcrumb to Sentry
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      level: 'info',
      data: sanitizeData(context)
    });
  }
  
  /**
   * Log a warning message
   * @param message - The message to log
   * @param context - Additional context
   */
  warn(message: string, context?: LogContext): void {
    console.warn(formatLog(LogLevel.WARN, message, context));
    
    // Capture warning in Sentry
    captureMessage(message, {
      level: 'warning',
      ...sanitizeData(context)
    });
  }
  
  /**
   * Log an error message
   * @param message - The message to log
   * @param error - The error object
   * @param context - Additional context
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(formatLog(LogLevel.ERROR, message, context));
    
    // Capture error in Sentry
    if (error instanceof Error) {
      captureException(error, sanitizeData(context));
    } else {
      captureMessage(message, {
        level: 'error',
        error: error ? String(error) : undefined,
        ...sanitizeData(context)
      });
    }
  }
  
  /**
   * Start timing an operation
   * @param operationName - Name of the operation
   * @returns Start time in milliseconds
   */
  startTimer(operationName: string): number {
    this.debug(`Starting operation: ${operationName}`);
    return Date.now();
  }
  
  /**
   * End timing an operation and log the duration
   * @param operationName - Name of the operation
   * @param startTime - Start time from startTimer
   * @param context - Additional context
   * @returns Duration in milliseconds
   */
  endTimer(operationName: string, startTime: number, context?: LogContext): number {
    const duration = Date.now() - startTime;
    this.info(`Completed operation: ${operationName}`, {
      ...context,
      duration,
      operation: operationName
    });
    return duration;
  }
}

// Export a singleton instance
export const logger = new Logger(); 
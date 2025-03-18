/**
 * Logger Service
 *
 * A centralized logging system for the desktop application with Sentry integration.
 * This service provides structured logging with different log levels and context enrichment.
 */

import { captureException, captureMessage, addBreadcrumb } from '../utils/sentry';

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
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  duration?: number;
  tags?: Record<string, string>;
}

/**
 * Configuration options for the logger
 */
export interface LoggerConfig {
  /**
   * Minimum log level to display
   * @default LogLevel.INFO in production, LogLevel.DEBUG in development
   */
  minLevel?: LogLevel;

  /**
   * Whether to include timestamps in console logs
   * @default true
   */
  includeTimestamps?: boolean;

  /**
   * Whether to send logs to Sentry
   * @default true
   */
  enableSentry?: boolean;

  /**
   * Whether to format logs as JSON
   * @default false
   */
  jsonFormat?: boolean;

  /**
   * Global context to include with all logs
   */
  globalContext?: Record<string, any>;
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
    'accessToken', 'refreshToken', 'hashedPassword', 'salt', 'credential',
  ];

  // Recursively sanitize the object
  Object.keys(sanitized).forEach((key) => {
    // Check if the key is sensitive
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
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
 * @param config - Logger configuration
 * @returns Formatted log string or object
 */
const formatLog = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  config?: LoggerConfig,
): string | object => {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeData(context) : {};

  const logData = {
    ...(config?.includeTimestamps !== false && { timestamp }),
    level,
    message,
    ...sanitizedContext,
    ...(config?.globalContext || {}),
  };

  return config?.jsonFormat ? logData : JSON.stringify(logData);
};

/**
 * Logger class for structured logging with Sentry integration
 */
class LoggerService {
  private config: LoggerConfig;

  constructor(config?: LoggerConfig) {
    this.config = {
      minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
      includeTimestamps: true,
      enableSentry: true,
      jsonFormat: false,
      globalContext: {},
      ...config,
    };
  }

  /**
   * Update logger configuration
   * @param config - New configuration options
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Set global context for all logs
   * @param context - Global context object
   */
  setGlobalContext(context: Record<string, any>): void {
    this.config.globalContext = {
      ...this.config.globalContext,
      ...sanitizeData(context),
    };
  }

  /**
   * Check if a log level should be displayed
   * @param level - Log level to check
   * @returns Whether the log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.minLevel || LogLevel.INFO);
    const logLevelIndex = levels.indexOf(level);

    return logLevelIndex >= configLevelIndex;
  }

  /**
   * Log a debug message
   * @param message - The message to log
   * @param context - Additional context
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formattedLog = formatLog(LogLevel.DEBUG, message, context, this.config);
    console.info(formattedLog);

    // Add breadcrumb to Sentry if enabled
    if (this.config.enableSentry) {
      addBreadcrumb({
        category: 'debug',
        message,
        level: 'debug',
        data: sanitizeData(context),
      });
    }
  }

  /**
   * Log an info message
   * @param message - The message to log
   * @param context - Additional context
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const formattedLog = formatLog(LogLevel.INFO, message, context, this.config);
    console.info(formattedLog);

    // Add breadcrumb to Sentry if enabled
    if (this.config.enableSentry) {
      addBreadcrumb({
        category: 'info',
        message,
        level: 'info',
        data: sanitizeData(context),
      });
    }
  }

  /**
   * Log a warning message
   * @param message - The message to log
   * @param context - Additional context
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formattedLog = formatLog(LogLevel.WARN, message, context, this.config);
    console.warn(formattedLog);

    // Capture warning in Sentry if enabled
    if (this.config.enableSentry) {
      captureMessage(message, 'warning', sanitizeData(context));
    }
  }

  /**
   * Log an error message
   * @param message - The message to log
   * @param error - The error object
   * @param context - Additional context
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formattedLog = formatLog(LogLevel.ERROR, message, context, this.config);
    console.error(formattedLog);

    // Capture error in Sentry if enabled
    if (this.config.enableSentry) {
      if (error instanceof Error) {
        captureException(error, sanitizeData(context));
      } else {
        captureMessage(message, 'error', {
          error: error ? String(error) : undefined,
          ...sanitizeData(context),
        });
      }
    }
  }

  /**
   * Start timing an operation
   * @param operationName - Name of the operation
   * @param context - Additional context
   * @returns Start time in milliseconds
   */
  startTimer(operationName: string, context?: LogContext): number {
    this.debug(`Starting operation: ${operationName}`, context);
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
      operation: operationName,
    });
    return duration;
  }

  /**
   * Log a component lifecycle event
   * @param component - Component name
   * @param lifecycle - Lifecycle event (mount, update, unmount)
   * @param props - Component props
   */
  component(component: string, lifecycle: 'mount' | 'update' | 'unmount', props?: Record<string, any>): void {
    this.debug(`Component ${lifecycle}`, {
      component,
      lifecycle,
      props: sanitizeData(props),
    });
  }

  /**
   * Log a user action
   * @param action - Action name
   * @param details - Action details
   * @param context - Additional context
   */
  userAction(action: string, details?: Record<string, any>, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      action,
      details: sanitizeData(details),
    });

    // Add breadcrumb to Sentry if enabled
    if (this.config.enableSentry) {
      addBreadcrumb({
        category: 'user',
        message: `User action: ${action}`,
        level: 'info',
        data: {
          ...sanitizeData(details),
          ...sanitizeData(context),
        },
      });
    }
  }

  /**
   * Log an API request
   * @param method - HTTP method
   * @param url - Request URL
   * @param status - Response status
   * @param duration - Request duration
   * @param context - Additional context
   */
  apiRequest(
    method: string,
    url: string,
    status?: number,
    duration?: number,
    context?: LogContext,
  ): void {
    const level = status && status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API ${method} ${url} ${status || ''}`;

    if (level === LogLevel.ERROR) {
      this.error(message, null, {
        ...context,
        method,
        url,
        status,
        duration,
      });
    } else {
      this.info(message, {
        ...context,
        method,
        url,
        status,
        duration,
      });
    }
  }
}

// Export a singleton instance
export const loggerService = new LoggerService();

// Export a hook for React components
export const useLogger = (component: string) => {
  const logger = loggerService;

  return {
    debug: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.debug(message, { ...context, component }),
    info: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.info(message, { ...context, component }),
    warn: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.warn(message, { ...context, component }),
    error: (message: string, error?: Error | unknown, context?: Omit<LogContext, 'component'>) =>
      logger.error(message, error, { ...context, component }),
    startTimer: (operationName: string, context?: Omit<LogContext, 'component'>) =>
      logger.startTimer(operationName, { ...context, component }),
    endTimer: (operationName: string, startTime: number, context?: Omit<LogContext, 'component'>) =>
      logger.endTimer(operationName, startTime, { ...context, component }),
    userAction: (action: string, details?: Record<string, any>, context?: Omit<LogContext, 'component'>) =>
      logger.userAction(action, details, { ...context, component }),
    apiRequest: (method: string, url: string, status?: number, duration?: number, context?: Omit<LogContext, 'component'>) =>
      logger.apiRequest(method, url, status, duration, { ...context, component }),
    component: (lifecycle: 'mount' | 'update' | 'unmount', props?: Record<string, any>) =>
      logger.component(component, lifecycle, props),
  };
};

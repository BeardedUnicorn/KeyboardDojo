# Logger Service Documentation

This document provides guidelines and examples for using the centralized logging system in the Keyboard Dojo application.

## Overview

The logging system provides a consistent way to log messages across the application with different severity levels. It integrates with Sentry for error tracking and provides context enrichment capabilities.

## Basic Usage

### Import the Logger

```typescript
// For services and utilities
import { loggerService } from '../services/loggerService';

// For React components (recommended)
import { useLogger } from '../services/loggerService';
```

### Logging in Services and Utilities

```typescript
// Basic logging
loggerService.debug('Debug message');
loggerService.info('Info message');
loggerService.warn('Warning message');
loggerService.error('Error message', new Error('Something went wrong'));

// With context
loggerService.info('User logged in', { 
  userId: 'user123', 
  action: 'login' 
});

// Timing operations
const startTime = loggerService.startTimer('dataFetch');
// ... perform operation
const duration = loggerService.endTimer('dataFetch', startTime);
```

### Logging in React Components

```typescript
import React, { useEffect } from 'react';
import { useLogger } from '../services/loggerService';

const MyComponent = ({ userId, data }) => {
  // Initialize logger with component name
  const logger = useLogger('MyComponent');
  
  useEffect(() => {
    // Log component mount
    logger.component('mount', { userId, dataLength: data?.length });
    
    return () => {
      // Log component unmount
      logger.component('unmount');
    };
  }, []);
  
  const handleButtonClick = () => {
    // Log user action
    logger.userAction('buttonClick', { userId });
    
    // ... handle the action
  };
  
  const fetchData = async () => {
    const startTime = logger.startTimer('fetchData');
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      logger.apiRequest('GET', '/api/data', response.status, Date.now() - startTime);
      return data;
    } catch (error) {
      logger.error('Failed to fetch data', error);
      throw error;
    }
  };
  
  return (
    // ... component JSX
  );
};
```

## Log Levels

The logger supports four log levels:

1. **DEBUG**: Detailed information for debugging purposes
   - Only shown in development by default
   - Example: `logger.debug('Rendering component with props', props);`

2. **INFO**: General information about application operation
   - Example: `logger.info('User logged in', { userId });`

3. **WARN**: Warning conditions that don't cause errors but should be addressed
   - Example: `logger.warn('API rate limit approaching', { remainingCalls });`

4. **ERROR**: Error conditions that affect functionality
   - Example: `logger.error('Failed to save user data', error, { userId });`

## Context Enrichment

Adding context to logs makes them more useful for debugging and analysis:

```typescript
logger.info('User completed lesson', {
  userId: 'user123',
  lessonId: 'lesson456',
  duration: 300, // seconds
  score: 95,
  tags: {
    track: 'vscode',
    difficulty: 'intermediate'
  }
});
```

## Specialized Logging Methods

### API Request Logging

```typescript
logger.apiRequest(
  'GET',           // HTTP method
  '/api/lessons',  // URL
  200,             // Status code
  150,             // Duration in ms
  { userId: 'user123' } // Additional context
);
```

### User Action Logging

```typescript
logger.userAction(
  'completeLesson',  // Action name
  {                  // Action details
    lessonId: 'lesson123',
    score: 95
  },
  { userId: 'user123' } // Additional context
);
```

### Component Lifecycle Logging

```typescript
logger.component(
  'LessonView',     // Component name
  'mount',          // Lifecycle event (mount, update, unmount)
  { lessonId: 'lesson123' } // Component props
);
```

## Error Boundary Integration

The application includes an ErrorBoundary component that uses the logger:

```typescript
import { ErrorBoundary } from '../components/ErrorBoundary';

const App = () => (
  <ErrorBoundary componentName="App">
    {/* Your app components */}
  </ErrorBoundary>
);
```

## Sentry Integration

The logger automatically integrates with Sentry:

- All ERROR level logs are sent to Sentry as exceptions or messages
- All INFO and WARN level logs create breadcrumbs in Sentry
- Context added to logs is included in Sentry reports

## Best Practices

1. **Be Consistent**: Use the appropriate log level for each situation
2. **Add Context**: Include relevant information with each log
3. **Protect Sensitive Data**: Don't log passwords, tokens, or personal information
4. **Use Component Names**: Always specify the component name when using `useLogger`
5. **Log User Actions**: Track important user interactions for analytics and debugging
6. **Log API Requests**: Monitor API performance and errors
7. **Use Error Boundaries**: Wrap key components with error boundaries

## Configuration

The logger can be configured globally:

```typescript
import { loggerService, LogLevel } from '../services/loggerService';

// Configure logger
loggerService.configure({
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  includeTimestamps: true,
  enableSentry: true,
  jsonFormat: false
});

// Set global context
loggerService.setGlobalContext({
  appVersion: '1.2.3',
  environment: process.env.NODE_ENV
});
``` 
# Service Layer Architecture

This document outlines the standardized service pattern used in the Keyboard Dojo application.

## Overview

The service layer provides a consistent way to manage application state, handle business logic, and interact with external systems. All services follow a standardized pattern to ensure consistency, maintainability, and testability.

## Service Structure

### BaseService

All services extend the `BaseService` class, which provides:

- Standard lifecycle methods (`initialize`, `cleanup`, `reset`)
- Error handling and status tracking
- Logging integration

```typescript
class MyService extends BaseService {
  async initialize(): Promise<void> {
    await super.initialize();
    // Service-specific initialization
  }

  cleanup(): void {
    // Service-specific cleanup
    super.cleanup();
  }
}
```

### Service Factory

The `ServiceFactory` manages service instances and their lifecycle:

- Registers services with unique names
- Handles initialization and cleanup in the correct order
- Provides access to services throughout the application

```typescript
// Register a service
const myService = new MyService();
serviceFactory.register('myService', myService);

// Get a service
const service = serviceFactory.get<MyService>('myService');
```

## Service Lifecycle

1. **Registration**: Services are registered with the `ServiceFactory` during application startup
2. **Initialization**: Services are initialized in the correct order using `initializeAllServices()`
3. **Usage**: Services are accessed throughout the application via imports or the `ServiceFactory`
4. **Cleanup**: Services are cleaned up in reverse order using `cleanupAllServices()`

## Creating a New Service

1. Create a new file in the `services` directory
2. Extend the `BaseService` class
3. Implement the required methods (`initialize`, `cleanup`)
4. Register the service with the `ServiceFactory`
5. Export the service instance
6. Add the service to `initializeServices`

```typescript
// myService.ts
import { BaseService } from './BaseService';
import { serviceFactory } from './ServiceFactory';
import { loggerService } from './loggerService';

class MyService extends BaseService {
  private _data: any = null;

  async initialize(): Promise<void> {
    await super.initialize();
    // Initialize your service
    loggerService.info('MyService initialized', { component: 'MyService' });
  }

  cleanup(): void {
    // Clean up your service
    loggerService.info('MyService cleaned up', { component: 'MyService' });
    super.cleanup();
  }

  // Service-specific methods
  getData(): any {
    return this._data;
  }

  setData(data: any): void {
    this._data = data;
  }
}

// Create and register the service
const myService = new MyService();
serviceFactory.register('myService', myService);

// Export the singleton instance
export { myService };
```

## Best Practices

1. **Single Responsibility**: Each service should have a single responsibility
2. **Dependency Injection**: Services should receive dependencies through constructor parameters or the `ServiceFactory`
3. **Error Handling**: Use try/catch blocks and log errors appropriately
4. **Logging**: Use the `loggerService` for all logging
5. **Cleanup**: Always clean up resources in the `cleanup` method
6. **Initialization Order**: Consider dependencies when initializing services
7. **Singleton Pattern**: Services should be singletons, registered with the `ServiceFactory`
8. **Event-Based Communication**: Use events for communication between services
9. **Immutable Data**: Return copies of data to prevent unintended modifications

## Service Categories

Services are organized into the following categories:

1. **Core Services**: Fundamental services required by the application
   - `windowService`
   - `offlineService`
   - `osDetectionService`
   - `audioService`
   - `keyboardService`

2. **Feature Services**: Services that implement specific features
   - `updateService`
   - `curriculumService`
   - `userProgressService`
   - `spacedRepetitionService`

3. **Gamification Services**: Services related to gamification features
   - `streakService`
   - `xpService`
   - `heartsService`
   - `currencyService`
   - `achievementsService`
   - `subscriptionService` 

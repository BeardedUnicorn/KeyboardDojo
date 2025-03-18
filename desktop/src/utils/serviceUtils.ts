/**
 * Service Utilities
 * 
 * This module provides utility functions and types for working with services
 * and handling service subscriptions consistently across the application.
 */

/**
 * Generic service event handler type
 */
export type ServiceEventHandler<T = any> = (data: T) => void;

/**
 * Interface for services that support subscriptions
 */
export interface SubscribableService<T = any> {
  subscribe: (handler: ServiceEventHandler<T>) => void;
  unsubscribe: (handler: ServiceEventHandler<T>) => void;
}

/**
 * Options for service subscription
 */
export interface SubscriptionOptions {
  /**
   * Whether to subscribe immediately
   */
  immediate?: boolean;
  
  /**
   * Whether to automatically unsubscribe on cleanup
   */
  autoUnsubscribe?: boolean;
}

/**
 * Subscribe to a service and handle cleanup
 * 
 * @param service The service to subscribe to
 * @param handler The event handler
 * @param options Subscription options
 * @returns Cleanup function
 */
export function subscribeToService<T>(
  service: SubscribableService<T>,
  handler: ServiceEventHandler<T>,
  options: SubscriptionOptions = {},
): () => void {
  const { immediate = true, autoUnsubscribe = true } = options;
  
  if (immediate) {
    service.subscribe(handler);
  }
  
  return () => {
    if (autoUnsubscribe) {
      service.unsubscribe(handler);
    }
  };
}

/**
 * Create a debounced version of a service event handler
 * 
 * @param handler The original handler
 * @param delay Debounce delay in milliseconds
 * @returns Debounced handler
 */
export function debounceServiceHandler<T>(
  handler: ServiceEventHandler<T>,
  delay: number = 300,
): ServiceEventHandler<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (data: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handler(data);
    }, delay);
  };
}

/**
 * Create a throttled version of a service event handler
 * 
 * @param handler The original handler
 * @param limit Throttle limit in milliseconds
 * @returns Throttled handler
 */
export function throttleServiceHandler<T>(
  handler: ServiceEventHandler<T>,
  limit: number = 300,
): ServiceEventHandler<T> {
  let lastRun = 0;
  let throttled = false;
  let lastData: T;
  
  return (data: T) => {
    lastData = data;
    
    if (throttled) return;
    
    const now = Date.now();
    const timeSinceLastRun = now - lastRun;
    
    if (timeSinceLastRun >= limit) {
      handler(data);
      lastRun = now;
    } else {
      throttled = true;
      setTimeout(() => {
        throttled = false;
        handler(lastData);
        lastRun = Date.now();
      }, limit - timeSinceLastRun);
    }
  };
}

/**
 * Create a filtered service event handler that only triggers when data changes
 * 
 * @param handler The original handler
 * @param comparator Function to compare old and new data
 * @returns Filtered handler
 */
export function filterServiceHandler<T>(
  handler: ServiceEventHandler<T>,
  comparator: (prev: T | undefined, current: T) => boolean,
): ServiceEventHandler<T> {
  let previousData: T | undefined;
  
  return (data: T) => {
    if (previousData === undefined || !comparator(previousData, data)) {
      handler(data);
      previousData = data;
    }
  };
}

/**
 * Create a service event handler that only triggers once
 * 
 * @param handler The original handler
 * @returns One-time handler
 */
export function onceServiceHandler<T>(
  handler: ServiceEventHandler<T>,
): ServiceEventHandler<T> {
  let hasRun = false;
  
  return (data: T) => {
    if (!hasRun) {
      handler(data);
      hasRun = true;
    }
  };
} 

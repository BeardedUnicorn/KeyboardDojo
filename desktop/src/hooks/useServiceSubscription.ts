/**
 * useServiceSubscription Hook
 *
 * A custom hook for subscribing to services with automatic cleanup.
 * Useful for components that need to listen to service events.
 */

import { useState, useEffect } from 'react';

import { loggerService } from '@/services';

/**
 * Generic service subscription hook
 * @param service Service object with subscribe and unsubscribe methods
 * @param initialState Initial state
 * @returns Current state from the service
 */
export function useServiceSubscription<T>(
  service: {
    subscribe: (callback: (data: T) => void) => void;
    unsubscribe: (callback: (data: T) => void) => void;
  },
  initialState: T,
): T {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const handleUpdate = (data: T) => {
      setState(data);
    };

    try {
      service.subscribe(handleUpdate);
    } catch (error) {
      loggerService.error('Error subscribing to service:', { error });
    }

    return () => {
      try {
        service.unsubscribe(handleUpdate);
      } catch (error) {
        loggerService.error('Error unsubscribing from service:', { error });
      }
    };
  }, [service]);

  return state;
}

/**
 * Hook for subscribing to a service with a custom selector
 * @param service Service object with subscribe and unsubscribe methods
 * @param selector Function to select specific data from the service state
 * @param initialState Initial state
 * @returns Selected state from the service
 */
export function useServiceSelector<T, S>(
  service: {
    subscribe: (callback: (data: T) => void) => void;
    unsubscribe: (callback: (data: T) => void) => void;
  },
  selector: (data: T) => S,
  initialState: S,
): S {
  const [state, setState] = useState<S>(initialState);

  useEffect(() => {
    const handleUpdate = (data: T) => {
      try {
        const selectedData = selector(data);
        setState(selectedData);
      } catch (error) {
        loggerService.error('Error in service selector:', { error });
      }
    };

    try {
      service.subscribe(handleUpdate);
    } catch (error) {
      loggerService.error('Error subscribing to service:', { error });
    }

    return () => {
      try {
        service.unsubscribe(handleUpdate);
      } catch (error) {
        loggerService.error('Error unsubscribing from service:', { error });
      }
    };
  }, [service, selector]);

  return state;
}

export default useServiceSubscription;

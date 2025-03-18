import { useRef, useMemo, useCallback } from 'react';

import { loggerService } from '@/services';

/**
 * Options for the useMemoizedValue hook
 */
interface MemoizationOptions<T> {
  /** Maximum number of cached values */
  maxCacheSize?: number;
  /** Custom cache key generator */
  keyGenerator?: (...args: any[]) => string;
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Custom equality function for comparing values */
  isEqual?: (prev: T, next: T) => boolean;
}

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  value: T;
  lastAccessed: number;
}

/**
 * Hook for memoizing expensive calculations with LRU caching
 * @template T The type of the memoized value
 * @template Args The types of the calculation function arguments
 *
 * @example
 * ```tsx
 * const calculateExpensiveValue = useMemoizedValue(
 *   (data: number[]) => data.reduce((sum, n) => sum + n, 0),
 *   { maxCacheSize: 100 }
 * );
 * ```
 */
export function useMemoizedValue<T, Args extends any[]>(
  calculation: (...args: Args) => T,
  options: MemoizationOptions<T> = {},
) {
  const {
    maxCacheSize = 100,
    keyGenerator = (...args) => JSON.stringify(args),
    debug = false,
    isEqual = (a, b) => a === b,
  } = options;

  // Use useRef for the cache to persist between renders
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const debugLogRef = useRef<boolean>(debug);

  // Memoize the cache cleanup function
  const cleanupCache = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size <= maxCacheSize) return;

    // Sort entries by last accessed time and remove oldest
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);

    const entriesToRemove = entries.slice(maxCacheSize);
    entriesToRemove.forEach(([key]) => cache.delete(key));

    if (debugLogRef.current) {
      loggerService.info(`Cache cleanup: removed ${entriesToRemove.length} entries`);
    }
  }, [maxCacheSize]);

  // Memoize the calculation function with caching
  const memoizedCalculation = useCallback(
    (...args: Args): T => {
      const key = keyGenerator(...args);
      const cache = cacheRef.current;
      const now = Date.now();

      // Check if value is cached
      const cached = cache.get(key);
      if (cached) {
        cached.lastAccessed = now;
        if (debugLogRef.current) {
          loggerService.info('Cache hit:', { key });
        }
        return cached.value;
      }

      // Calculate new value
      const value = calculation(...args);

      // StorePage in cache
      cache.set(key, { value, lastAccessed: now });
      if (debugLogRef.current) {
        loggerService.info('Cache miss:', { key });
      }

      // Cleanup if needed
      cleanupCache();

      return value;
    },
    [calculation, keyGenerator, cleanupCache],
  );

  // Return the memoized calculation function and cache management utilities
  return useMemo(
    () => ({
      calculate: memoizedCalculation,
      clearCache: () => cacheRef.current.clear(),
      getCacheSize: () => cacheRef.current.size,
      setDebug: (enabled: boolean) => {
        debugLogRef.current = enabled;
      },
    }),
    [memoizedCalculation],
  );
}

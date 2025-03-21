/**
 * A utility file containing memoization helper functions
 */

/**
 * Simple memoization function that caches results based on arguments
 * @param fn The function to memoize
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Creates a memoized selector that can be used with Redux
 * @param selector The selector function to memoize
 * @returns A memoized version of the selector
 */
export function createMemoizedSelector<State, Result, Args extends any[]>(
  selector: (state: State, ...args: Args) => Result
): (state: State, ...args: Args) => Result {
  return memoize(selector);
} 
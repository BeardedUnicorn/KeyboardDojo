/**
 * TypeScript declaration for Vitest global variables
 * This provides compatibility for code that still uses Jest-like syntax
 */

import { MockInstance } from 'vitest';

declare const vi: {
  /**
   * Mock a module with a replacement implementation
   */
  mock: (moduleName: string, factory?: () => unknown) => void;
  
  /**
   * Create a mock function
   */
  fn: <T extends (...args: any[]) => any>(implementation?: T) => MockInstance<Parameters<T>, ReturnType<T>>;
  
  /**
   * Reset all mocks
   */
  resetAllMocks: () => void;
  
  /**
   * Clear all mocks
   */
  clearAllMocks: () => void;
  
  /**
   * Restore all mocks
   */
  restoreAllMocks: () => void;
};

// Type compatibility layer for code that still uses Jest types
declare namespace jest {
  type Mock<TReturn = any, TArgs extends any[] = any[]> = MockInstance<TArgs, TReturn>;
} 
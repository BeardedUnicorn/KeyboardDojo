/**
 * Environment detection utility
 * Used to determine if the application is running in desktop or web environment
 */

/**
 * Checks if the application is running in a Tauri desktop environment
 */
export const isDesktop = (): boolean => {
  return typeof window !== 'undefined' && 'Tauri' in window;
};

/**
 * Checks if the application is running in a web browser environment
 */
export const isWeb = (): boolean => {
  return !isDesktop();
};

/**
 * Returns the current environment name
 */
export const getEnvironment = (): 'desktop' | 'web' => {
  return isDesktop() ? 'desktop' : 'web';
};

/**
 * Executes different functions based on the current environment
 * @param options Object containing functions to execute in different environments
 * @returns The result of the executed function
 */
export const runInEnvironment = <T, U>(options: {
  desktop: () => T;
  web: () => U;
}): T | U => {
  return isDesktop() ? options.desktop() : options.web();
}; 
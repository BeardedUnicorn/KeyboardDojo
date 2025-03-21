/**
 * Utils Index
 *
 * This file exports all utility functions from the utils directory.
 */

// Export utility modules with namespaces to avoid naming conflicts
export * as keyboardUtils from './keyboardUtils';
export * as sizeUtils from './sizeUtils';
export * as animationUtils from './animationUtils';
export * as animationSystem from './animationSystem';
export * as serviceUtils from './serviceUtils';
export * as formatUtils from './formatUtils';
export * as dateTimeUtils from './dateTimeUtils';
export * as windowManager from './windowManager';
export * as sentry from './sentry';
export * as responsive from './responsive';
export * as shortcutDetector from './shortcutDetector';
export * as styleUtils from './styleUtils';

// Export the new key normalization functions
export * from './keyNormalization';

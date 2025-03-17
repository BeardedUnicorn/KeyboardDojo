import { isDesktop } from './environment';

/**
 * Feature flag configuration
 * This object contains all feature flags for the application
 * Each flag can be controlled via environment variables or code
 */
export interface FeatureFlags {
  // Core features
  NEW_DASHBOARD: boolean;
  ADVANCED_ANALYTICS: boolean;
  KEYBOARD_SHORTCUTS: boolean;
  
  // Platform-specific features
  DESKTOP_ONLY_FEATURES: boolean;
  WEB_ONLY_FEATURES: boolean;
  
  // Experimental features
  EXPERIMENTAL_UI: boolean;
  BETA_FEATURES: boolean;
}

/**
 * Default feature flag values
 * These values are used as fallbacks when environment variables are not set
 */
const defaultFlags: FeatureFlags = {
  // Core features - enabled by default
  NEW_DASHBOARD: true,
  ADVANCED_ANALYTICS: true,
  KEYBOARD_SHORTCUTS: true,
  
  // Platform-specific features - determined at runtime
  DESKTOP_ONLY_FEATURES: false,
  WEB_ONLY_FEATURES: true,
  
  // Experimental features - disabled by default
  EXPERIMENTAL_UI: false,
  BETA_FEATURES: false,
};

/**
 * Current feature flag values
 * This object is initialized with default values and updated at runtime
 */
export const FEATURES: FeatureFlags = {
  ...defaultFlags,
};

/**
 * Initialize feature flags based on environment variables and platform
 * This function should be called during application initialization
 */
export function initializeFeatureFlags(): void {
  // Override with environment variables if available
  if (typeof process !== 'undefined' && process.env) {
    FEATURES.NEW_DASHBOARD = process.env.REACT_APP_ENABLE_NEW_DASHBOARD === 'true' || defaultFlags.NEW_DASHBOARD;
    FEATURES.ADVANCED_ANALYTICS = process.env.REACT_APP_ENABLE_ADVANCED_ANALYTICS === 'true' || defaultFlags.ADVANCED_ANALYTICS;
    FEATURES.EXPERIMENTAL_UI = process.env.REACT_APP_ENABLE_EXPERIMENTAL_UI === 'true' || defaultFlags.EXPERIMENTAL_UI;
    FEATURES.BETA_FEATURES = process.env.REACT_APP_ENABLE_BETA_FEATURES === 'true' || defaultFlags.BETA_FEATURES;
  }
  
  // Set platform-specific features
  const desktop = isDesktop();
  FEATURES.DESKTOP_ONLY_FEATURES = desktop;
  FEATURES.WEB_ONLY_FEATURES = !desktop;
  
  // Keyboard shortcuts are always enabled on desktop
  if (desktop) {
    FEATURES.KEYBOARD_SHORTCUTS = true;
  }
  
  // Log feature flag initialization in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Feature flags initialized:', FEATURES);
  }
}

/**
 * Check if a feature is enabled
 * @param feature The feature to check
 * @returns True if the feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURES[feature];
}

/**
 * Enable a feature at runtime
 * @param feature The feature to enable
 */
export function enableFeature(feature: keyof FeatureFlags): void {
  FEATURES[feature] = true;
  
  // Log feature enablement in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Feature enabled: ${feature}`);
  }
}

/**
 * Disable a feature at runtime
 * @param feature The feature to disable
 */
export function disableFeature(feature: keyof FeatureFlags): void {
  FEATURES[feature] = false;
  
  // Log feature disablement in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Feature disabled: ${feature}`);
  }
}

/**
 * Reset a feature to its default value
 * @param feature The feature to reset
 */
export function resetFeature(feature: keyof FeatureFlags): void {
  FEATURES[feature] = defaultFlags[feature];
  
  // Log feature reset in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Feature reset to default: ${feature}`);
  }
}

/**
 * Reset all features to their default values
 */
export function resetAllFeatures(): void {
  Object.assign(FEATURES, defaultFlags);
  
  // Set platform-specific features again
  const desktop = isDesktop();
  FEATURES.DESKTOP_ONLY_FEATURES = desktop;
  FEATURES.WEB_ONLY_FEATURES = !desktop;
  
  // Log feature reset in development
  if (process.env.NODE_ENV === 'development') {
    console.log('All features reset to defaults');
  }
} 
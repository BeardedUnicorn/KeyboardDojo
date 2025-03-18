/**
 * Component Utilities
 * 
 * Common utility functions for components, including size calculations,
 * color determination, and other shared functionality.
 */

import type { Theme } from '@mui/material';

/**
 * Component size types
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Component variant types
 */
export type ComponentVariant = 'default' | 'compact' | 'large';

/**
 * Map a size prop to icon dimensions
 * @param size Component size
 * @returns Icon size in pixels
 */
export const getIconSize = (size: ComponentSize = 'medium'): number => {
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 32;
    case 'medium':
    default:
      return 24;
  }
};

/**
 * Map a size prop to font size
 * @param size Component size
 * @returns Font size as a MUI typography variant
 */
export const getFontSize = (size: ComponentSize = 'medium'): string => {
  switch (size) {
    case 'small':
      return 'caption';
    case 'large':
      return 'h6';
    case 'medium':
    default:
      return 'body2';
  }
};

/**
 * Map a variant to component dimensions
 * @param variant Component variant
 * @returns Dimensions object with height, padding, etc.
 */
export const getComponentDimensions = (variant: ComponentVariant = 'default') => {
  switch (variant) {
    case 'compact':
      return {
        height: 32,
        padding: 1,
        gap: 0.5,
      };
    case 'large':
      return {
        height: 56,
        padding: 2,
        gap: 1.5,
      };
    case 'default':
    default:
      return {
        height: 40,
        padding: 1.5,
        gap: 1,
      };
  }
};

/**
 * Get a color based on a value and thresholds
 * @param value Current value
 * @param maxValue Maximum possible value
 * @param theme MUI theme
 * @returns Color from the theme palette
 */
export const getColorByValue = (value: number, maxValue: number, theme: Theme): string => {
  const ratio = value / maxValue;
  
  if (ratio <= 0.25) {
    return theme.palette.error.main;
  } else if (ratio <= 0.5) {
    return theme.palette.warning.main;
  } else if (ratio <= 0.75) {
    return theme.palette.info.main;
  } else {
    return theme.palette.success.main;
  }
};

/**
 * Format a time duration in milliseconds to a human-readable string
 * @param milliseconds Time in milliseconds
 * @returns Formatted time string (e.g., "2m 30s")
 */
export const formatTimeRemaining = (milliseconds: number | null): string => {
  if (milliseconds === null || milliseconds <= 0) {
    return '0m 0s';
  }
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  
  return `${minutes}m ${seconds}s`;
};

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * @param date Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return 'just now';
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMin / 60);
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  }
  
  // Convert to years
  const diffYears = Math.floor(diffMonths / 12);
  
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}; 

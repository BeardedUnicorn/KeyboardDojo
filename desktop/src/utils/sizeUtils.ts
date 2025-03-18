/**
 * Size Utilities
 * 
 * This module provides utility functions for handling sizes, dimensions,
 * and responsive calculations.
 */

/**
 * Common size constants in pixels
 */
export const sizes = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Common breakpoints in pixels
 */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

/**
 * Convert pixels to rem units
 * 
 * @param px Pixel value
 * @param baseFontSize Base font size in pixels (default: 16)
 * @returns Rem value as string with unit
 */
export function pxToRem(px: number, baseFontSize: number = 16): string {
  return `${px / baseFontSize}rem`;
}

/**
 * Convert rem to pixels
 * 
 * @param rem Rem value (without unit)
 * @param baseFontSize Base font size in pixels (default: 16)
 * @returns Pixel value
 */
export function remToPx(rem: number, baseFontSize: number = 16): number {
  return rem * baseFontSize;
}

/**
 * Calculate percentage based on two values
 * 
 * @param value Current value
 * @param total Total value
 * @returns Percentage as a number between 0-100
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Clamp a value between min and max
 * 
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate aspect ratio dimensions
 * 
 * @param width Original width
 * @param height Original height
 * @param targetWidth Target width (optional)
 * @param targetHeight Target height (optional)
 * @returns New dimensions maintaining aspect ratio
 */
export function calculateAspectRatio(
  width: number,
  height: number,
  targetWidth?: number,
  targetHeight?: number,
): { width: number; height: number } {
  const aspectRatio = width / height;
  
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: targetWidth / aspectRatio,
    };
  }
  
  if (targetHeight && !targetWidth) {
    return {
      width: targetHeight * aspectRatio,
      height: targetHeight,
    };
  }
  
  return { width, height };
}

/**
 * Check if a value is within a range
 * 
 * @param value Value to check
 * @param min Minimum value
 * @param max Maximum value
 * @returns True if value is within range
 */
export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Get the current viewport dimensions
 * 
 * @returns Object with width and height
 */
export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if the current viewport matches a breakpoint
 * 
 * @param breakpoint Breakpoint to check
 * @returns True if viewport width is at or above the breakpoint
 */
export function matchesBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  const { width } = getViewportSize();
  return width >= breakpoints[breakpoint];
} 

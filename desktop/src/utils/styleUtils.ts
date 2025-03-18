/**
 * Style Utilities
 *
 * This module provides utility functions and constants for styling components
 * consistently across the application, with theme awareness.
 */

import type { Theme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

/**
 * Common border radius values
 */
export const borderRadius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  round: 9999,
};

/**
 * Common shadow levels
 */
export const shadowLevels = {
  none: 0,
  low: 1,
  medium: 2,
  high: 4,
  elevated: 8,
};

/**
 * Common spacing values (in pixels)
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Common z-index values
 */
export const zIndex = {
  base: 0,
  content: 1,
  overlay: 10,
  modal: 100,
  tooltip: 1000,
  notification: 1100,
};

/**
 * Get a color with proper contrast for text on a background
 *
 * @param backgroundColor The background color to check against
 * @param theme The current theme
 * @returns A contrasting text color
 */
export function getContrastText(backgroundColor: string, theme: Theme): string {
  return theme.palette.getContrastText(backgroundColor);
}

/**
 * Get a theme-aware color value
 *
 * @param colorKey The color key in the theme palette
 * @param variant The color variant (main, light, dark, etc.)
 * @param theme The current theme
 * @returns The theme color value
 */
export function getThemeColor(
  colorKey: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'text',
  variant: 'main' | 'light' | 'dark' | 'contrastText' | 'primary' | 'secondary' | 'disabled',
  theme: Theme,
): string {
  if (colorKey === 'text') {
    return theme.palette.text[variant as 'primary' | 'secondary' | 'disabled'];
  }

  return theme.palette[colorKey][variant as 'main' | 'light' | 'dark' | 'contrastText'];
}

/**
 * Get a theme-aware spacing value
 *
 * @param value The spacing value (number or key)
 * @param theme The current theme
 * @returns The spacing value in pixels
 */
export function getThemeSpacing(
  value: number | keyof typeof spacing,
  theme: Theme,
): number | string {
  if (typeof value === 'number') {
    return theme.spacing(value);
  }

  // Convert string spacing to number
  const spacingValue = spacing[value] / 8; // MUI spacing unit is 8px
  return theme.spacing(spacingValue);
}

/**
 * Get a theme-aware shadow value
 *
 * @param level The shadow level
 * @param theme The current theme
 * @returns The shadow CSS value
 */
export function getThemeShadow(
  level: keyof typeof shadowLevels,
  theme: Theme,
): string {
  return theme.shadows[shadowLevels[level]];
}

/**
 * Create a theme-aware style object for a card
 *
 * @param theme The current theme
 * @param elevation The card elevation level
 * @param radius The border radius size
 * @returns Style object for the card
 */
export function getCardStyle(
  theme: Theme,
  elevation: keyof typeof shadowLevels = 'low',
  radius: keyof typeof borderRadius = 'medium',
): CSSProperties {
  return {
    backgroundColor: theme.palette.background.paper,
    borderRadius: borderRadius[radius],
    boxShadow: getThemeShadow(elevation, theme),
    overflow: 'hidden',
  };
}

/**
 * Create a theme-aware style object for a button
 *
 * @param theme The current theme
 * @param color The button color
 * @param variant The button variant
 * @returns Style object for the button
 */
export function getButtonStyle(
  theme: Theme,
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'primary',
  variant: 'contained' | 'outlined' | 'text' = 'contained',
): any {
  const baseStyle = {
    borderRadius: borderRadius.medium,
    fontWeight: 500,
    textTransform: 'none' as const,
  };

  if (variant === 'contained') {
    return {
      ...baseStyle,
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText,
    };
  }

  if (variant === 'outlined') {
    return {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: theme.palette[color].main,
      border: `1px solid ${theme.palette[color].main}`,
    };
  }

  // Text variant
  return {
    ...baseStyle,
    backgroundColor: 'transparent',
    color: theme.palette[color].main,
  };
}

/**
 * Create a theme-aware style object for text
 *
 * @param theme The current theme
 * @param variant The text variant
 * @param color The text color
 * @returns Style object for the text
 */
export function getTextStyle(
  theme: Theme,
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline' = 'body1',
  color: 'primary' | 'secondary' | 'error' = 'primary',
): CSSProperties {
  let textColor: string;

  if (color === 'primary') {
    textColor = theme.palette.text.primary;
  } else if (color === 'secondary') {
    textColor = theme.palette.text.secondary;
  } else {
    textColor = theme.palette[color].main;
  }

  return {
    ...theme.typography[variant],
    color: textColor,
  } as CSSProperties;
}

/**
 * Create a theme-aware style object for a container
 *
 * @param theme The current theme
 * @param padding The padding size
 * @param margin The margin size
 * @returns Style object for the container
 */
export function getContainerStyle(
  theme: Theme,
  padding: keyof typeof spacing = 'md',
  margin: keyof typeof spacing = 'none',
): CSSProperties {
  return {
    padding: theme.spacing(spacing[padding] / 8) as string,
    margin: theme.spacing(spacing[margin] / 8) as string,
    backgroundColor: theme.palette.background.default,
  };
}

/**
 * Create a theme-aware style object for a flex container
 *
 * @param theme The current theme
 * @param direction The flex direction
 * @param align The align items value
 * @param justify The justify content value
 * @returns Style object for the flex container
 */
export function getFlexStyle(
  theme: Theme,
  direction: 'row' | 'column' = 'row',
  align: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' = 'center',
  justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start',
): CSSProperties {
  return {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
  };
}

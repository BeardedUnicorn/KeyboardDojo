/**
 * useResponsiveProps Hook
 * 
 * A custom hook for adjusting component props based on screen size.
 * Useful for making components responsive without duplicating logic.
 */

import { useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Responsive props configuration
 */
export interface ResponsivePropsConfig<T> {
  /**
   * Default props for all screen sizes
   */
  default: T;
  
  /**
   * Props for small screens (xs)
   */
  xs?: Partial<T>;
  
  /**
   * Props for medium screens (sm)
   */
  sm?: Partial<T>;
  
  /**
   * Props for large screens (md)
   */
  md?: Partial<T>;
  
  /**
   * Props for extra large screens (lg)
   */
  lg?: Partial<T>;
  
  /**
   * Props for extra extra large screens (xl)
   */
  xl?: Partial<T>;
}

/**
 * Hook for responsive component props
 * @param config Responsive props configuration
 * @returns Props object adjusted for current screen size
 */
export function useResponsiveProps<T extends object>(config: ResponsivePropsConfig<T>): T {
  const theme = useTheme();
  const [props, setProps] = useState<T>({ ...config.default });
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  useEffect(() => {
    // Start with default props
    let newProps = { ...config.default };
    
    // Apply breakpoint-specific props
    if (isXs && config.xs) {
      newProps = { ...newProps, ...config.xs };
    } else if (isSm && config.sm) {
      newProps = { ...newProps, ...config.sm };
    } else if (isMd && config.md) {
      newProps = { ...newProps, ...config.md };
    } else if (isLg && config.lg) {
      newProps = { ...newProps, ...config.lg };
    } else if (isXl && config.xl) {
      newProps = { ...newProps, ...config.xl };
    }
    
    setProps(newProps);
  }, [isXs, isSm, isMd, isLg, isXl, config]);
  
  return props;
}

/**
 * Hook for a single responsive prop
 * @param breakpoints Values for different breakpoints
 * @returns Value adjusted for current screen size
 */
export function useResponsiveProp<T>(breakpoints: {
  default: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): T {
  const theme = useTheme();
  const [value, setValue] = useState<T>(breakpoints.default);
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  useEffect(() => {
    if (isXs && breakpoints.xs !== undefined) {
      setValue(breakpoints.xs);
    } else if (isSm && breakpoints.sm !== undefined) {
      setValue(breakpoints.sm);
    } else if (isMd && breakpoints.md !== undefined) {
      setValue(breakpoints.md);
    } else if (isLg && breakpoints.lg !== undefined) {
      setValue(breakpoints.lg);
    } else if (isXl && breakpoints.xl !== undefined) {
      setValue(breakpoints.xl);
    } else {
      setValue(breakpoints.default);
    }
  }, [isXs, isSm, isMd, isLg, isXl, breakpoints]);
  
  return value;
}

export default useResponsiveProps; 

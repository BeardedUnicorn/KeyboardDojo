import { getCurrentWindow } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';

// Window size breakpoints
export enum WindowSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

// Breakpoint values (in pixels)
export const breakpoints = {
  [WindowSize.XS]: 0,
  [WindowSize.SM]: 600,
  [WindowSize.MD]: 900,
  [WindowSize.LG]: 1200,
  [WindowSize.XL]: 1536,
};

/**
 * Hook to get current window size
 * @returns Current window size and dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    size: WindowSize;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
    size: getWindowSizeFromWidth(window.innerWidth),
  });

  useEffect(() => {
    const handleResize = async () => {
      try {
        // Get window size from Tauri API if available
        const appWindow = await getCurrentWindow();
        const { width, height } = await appWindow.innerSize();
        
        setWindowSize({
          width: width,
          height: height,
          size: getWindowSizeFromWidth(width),
        });
      } catch (error) {
        // Fallback to browser API if Tauri API is not available
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
          size: getWindowSizeFromWidth(window.innerWidth),
        });
      }
    };

    // Initial size
    handleResize();

    let unlistenPromise: Promise<() => void> | null = null;

    // Listen for resize events
    const setupResizeListener = async () => {
      try {
        const appWindow = await getCurrentWindow();
        unlistenPromise = appWindow.listen('tauri://resize', () => {
          handleResize();
        });
      } catch (error: unknown) {
        console.warn('Tauri API not available, falling back to browser API');
      }
    };
    
    setupResizeListener().catch((error: unknown) => {
      console.warn('Failed to set up resize listener:', error);
    });
    
    // Fallback for browser
    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up
      if (unlistenPromise) {
        unlistenPromise.then((unlisten: () => void) => unlisten());
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * Get window size category from width
 * @param width Window width in pixels
 * @returns Window size category
 */
export const getWindowSizeFromWidth = (width: number): WindowSize => {
  if (width < breakpoints[WindowSize.SM]) return WindowSize.XS;
  if (width < breakpoints[WindowSize.MD]) return WindowSize.SM;
  if (width < breakpoints[WindowSize.LG]) return WindowSize.MD;
  if (width < breakpoints[WindowSize.XL]) return WindowSize.LG;
  return WindowSize.XL;
};

/**
 * Check if window size is at least the given size
 * @param currentSize Current window size
 * @param minSize Minimum window size to check
 * @returns True if window size is at least the given size
 */
export const isWindowSizeAtLeast = (
  currentSize: WindowSize,
  minSize: WindowSize,
): boolean => {
  const currentValue = breakpoints[currentSize];
  const minValue = breakpoints[minSize];
  return currentValue >= minValue;
};

/**
 * Get responsive value based on window size
 * @param values Object with values for different window sizes
 * @param currentSize Current window size
 * @returns Value for current window size, falling back to smaller sizes if needed
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<WindowSize, T>>,
  currentSize: WindowSize,
): T | undefined => {
  // Try current size first
  if (values[currentSize] !== undefined) {
    return values[currentSize];
  }

  // Fall back to smaller sizes
  const sizes = Object.values(WindowSize);
  const currentIndex = sizes.indexOf(currentSize);

  // Try smaller sizes in descending order
  for (let i = currentIndex - 1; i >= 0; i--) {
    const size = sizes[i];
    if (values[size] !== undefined) {
      return values[size];
    }
  }

  // Try larger sizes in ascending order
  for (let i = currentIndex + 1; i < sizes.length; i++) {
    const size = sizes[i];
    if (values[size] !== undefined) {
      return values[size];
    }
  }

  return undefined;
}; 

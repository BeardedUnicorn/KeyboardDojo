/**
 * @deprecated This file is deprecated. Use the consolidated animationSystem instead.
 *
 * Animation Utilities
 *
 * This module provides utility functions and constants for animations
 * and transitions across the application.
 */

import type { CSSProperties } from 'react';

/**
 * Standard animation durations in milliseconds
 */
export const animationDurations = {
  veryFast: 150,
  fast: 300,
  normal: 500,
  slow: 800,
  verySlow: 1200,
};

/**
 * Standard animation easing functions
 */
export const animationEasings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

/**
 * Animation intensity levels
 */
export type AnimationIntensity = 'low' | 'medium' | 'high';

/**
 * Animation types
 */
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'confetti' | 'stars';

/**
 * Animation direction
 */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  easing: string;
  intensity: AnimationIntensity;
  direction?: AnimationDirection;
  delay?: number;
}

/**
 * Get animation duration based on intensity
 *
 * @param intensity Animation intensity
 * @returns Duration in milliseconds
 */
export function getAnimationDuration(intensity: AnimationIntensity = 'medium'): number {
  switch (intensity) {
    case 'low':
      return animationDurations.fast;
    case 'high':
      return animationDurations.slow;
    case 'medium':
    default:
      return animationDurations.normal;
  }
}

/**
 * Get animation configuration based on type and intensity
 *
 * @param type Animation type
 * @param intensity Animation intensity
 * @returns Animation configuration
 */
export function getAnimationConfig(
  type: AnimationType = 'fade',
  intensity: AnimationIntensity = 'medium',
): AnimationConfig {
  const duration = getAnimationDuration(intensity);

  switch (type) {
    case 'slide':
      return {
        type,
        duration,
        easing: animationEasings.easeOut,
        intensity,
        direction: 'up',
      };
    case 'scale':
      return {
        type,
        duration,
        easing: animationEasings.easeInOut,
        intensity,
      };
    case 'rotate':
      return {
        type,
        duration,
        easing: animationEasings.easeInOut,
        intensity,
      };
    case 'bounce':
      return {
        type,
        duration: duration * 1.2,
        easing: animationEasings.bounce,
        intensity,
      };
    case 'confetti':
    case 'stars':
      return {
        type,
        duration: duration * 1.5,
        easing: animationEasings.easeOut,
        intensity,
      };
    case 'fade':
    default:
      return {
        type: 'fade',
        duration,
        easing: animationEasings.easeInOut,
        intensity,
      };
  }
}

/**
 * Get CSS transform value for an animation
 *
 * @param type Animation type
 * @param intensity Animation intensity
 * @param direction Animation direction
 * @returns CSS transform value
 */
export function getAnimationTransform(
  type: AnimationType,
  intensity: AnimationIntensity = 'medium',
  direction: AnimationDirection = 'up',
): string {
  const intensityValues = {
    low: {
      scale: 0.95,
      translate: 10,
      rotate: 5,
    },
    medium: {
      scale: 0.9,
      translate: 20,
      rotate: 10,
    },
    high: {
      scale: 0.8,
      translate: 30,
      rotate: 15,
    },
  };

  const value = intensityValues[intensity];

  switch (type) {
    case 'scale':
      return `scale(${value.scale})`;
    case 'rotate':
      return `rotate(${value.rotate}deg)`;
    case 'slide':
      switch (direction) {
        case 'up':
          return `translateY(${value.translate}px)`;
        case 'down':
          return `translateY(-${value.translate}px)`;
        case 'left':
          return `translateX(${value.translate}px)`;
        case 'right':
          return `translateX(-${value.translate}px)`;
        default:
          return `translateY(${value.translate}px)`;
      }
    case 'bounce':
      return `translateY(${value.translate}px)`;
    default:
      return '';
  }
}

/**
 * Get CSS keyframes for an animation
 *
 * @param type Animation type
 * @param intensity Animation intensity
 * @returns CSS keyframes object
 */
export function getAnimationKeyframes(
  type: AnimationType,
  intensity: AnimationIntensity = 'medium',
): Record<string, CSSProperties> {
  const intensityValues = {
    low: {
      scale: 0.95,
      translate: 10,
      rotate: 5,
      opacity: 0.9,
    },
    medium: {
      scale: 0.9,
      translate: 20,
      rotate: 10,
      opacity: 0.7,
    },
    high: {
      scale: 0.8,
      translate: 30,
      rotate: 15,
      opacity: 0.5,
    },
  };

  const value = intensityValues[intensity];

  switch (type) {
    case 'fade':
      return {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };
    case 'scale':
      return {
        from: { transform: `scale(${value.scale})`, opacity: value.opacity },
        to: { transform: 'scale(1)', opacity: 1 },
      };
    case 'slide':
      return {
        from: { transform: `translateY(${value.translate}px)`, opacity: value.opacity },
        to: { transform: 'translateY(0)', opacity: 1 },
      };
    case 'rotate':
      return {
        from: { transform: `rotate(${value.rotate}deg)`, opacity: value.opacity },
        to: { transform: 'rotate(0deg)', opacity: 1 },
      };
    case 'bounce':
      return {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: `translateY(-${value.translate}px)` },
        '100%': { transform: 'translateY(0)' },
      };
    default:
      return {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };
  }
}

/**
 * Generate CSS for an animation
 *
 * @param config Animation configuration
 * @returns CSS properties object
 */
export function getAnimationStyles(config: AnimationConfig): CSSProperties {
  const { type, duration, easing, intensity, delay = 0 } = config;

  return {
    animation: `${type} ${duration}ms ${easing} ${delay}ms forwards`,
    opacity: type === 'fade' ? 0 : undefined,
    transform: type !== 'fade' ? getAnimationTransform(type, intensity, config.direction) : undefined,
  };
}

/**
 * Animation Utilities
 *
 * Common easing functions and animation helpers.
 */

export type EasingFunction = (t: number) => number;

// Standard easing functions
export const easings = {
  // Linear
  linear: (t: number): number => t,

  // Quadratic
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Cubic
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Elastic
  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Bounce
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

// Animation timing helpers
export const timing = {
  /**
   * Returns a promise that resolves after the specified duration
   */
  delay: (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Returns a promise that resolves on the next animation frame
   */
  nextFrame: (): Promise<number> =>
    new Promise((resolve) => requestAnimationFrame(resolve)),
};

// Animation state helpers
export interface AnimationState {
  isPlaying: boolean;
  progress: number;
  elapsedTime: number;
  remainingTime: number;
}

/**
 * Creates an animation state object
 */
export const createAnimationState = (
  elapsedTime: number,
  duration: number,
): AnimationState => ({
  isPlaying: elapsedTime < duration,
  progress: Math.min(elapsedTime / duration, 1),
  elapsedTime,
  remainingTime: Math.max(duration - elapsedTime, 0),
});

/**
 * Interpolates between two numbers based on progress
 */
export const interpolate = (
  start: number,
  end: number,
  progress: number,
): number => start + (end - start) * progress;

/**
 * Interpolates between two colors based on progress
 */
export const interpolateColor = (
  start: string,
  end: string,
  progress: number,
): string => {
  // Convert hex to RGB
  const hex2rgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ] : [0, 0, 0];
  };

  // Convert RGB to hex
  const rgb2hex = (r: number, g: number, b: number): string =>
    '#' + [r, g, b].map((x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');

  const [r1, g1, b1] = hex2rgb(start);
  const [r2, g2, b2] = hex2rgb(end);

  return rgb2hex(
    interpolate(r1, r2, progress),
    interpolate(g1, g2, progress),
    interpolate(b1, b2, progress),
  );
};

/**
 * Animation System
 *
 * This module provides a comprehensive system for animations across the application.
 * It consolidates functionality from the previous animationUtils and useFeedbackAnimation.
 */

import { useState, useEffect, useCallback } from 'react';

import { audioService } from '../services';

import type { CSSProperties } from 'react';

// ===== Animation Types and Constants =====

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

// ===== Animation Utility Functions =====

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
        '0%': { transform: 'translateY(0)', opacity: value.opacity },
        '50%': { transform: `translateY(-${value.translate}px)`, opacity: 1 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      };
    case 'confetti':
    case 'stars':
      return {
        '0%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
        '50%': { transform: 'scale(1) rotate(180deg)', opacity: 1 },
        '100%': { transform: 'scale(0) rotate(360deg)', opacity: 0 },
      };
    default:
      return {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };
  }
}

/**
 * Get CSS styles for an animation
 *
 * @param config Animation configuration
 * @returns CSS styles object
 */
export function getAnimationStyles(config: AnimationConfig): CSSProperties {
  const { type, duration, easing, intensity, direction, delay = 0 } = config;

  return {
    animation: `${duration}ms ${easing} ${delay}ms forwards`,
    transform: getAnimationTransform(type, intensity, direction),
    opacity: type === 'fade' ? 0 : undefined,
  };
}

// ===== Feedback Animation Hook =====

/**
 * Options for the useFeedbackAnimation hook
 */
export interface FeedbackAnimationOptions {
  /**
   * Duration of the animation in milliseconds
   */
  duration?: number;

  /**
   * Whether to play sound effects
   */
  playSounds?: boolean;

  /**
   * Sound to play on success
   */
  successSound?: string;

  /**
   * Sound to play on failure
   */
  failureSound?: string;

  /**
   * Animation intensity
   */
  intensity?: AnimationIntensity;

  /**
   * Auto-hide animation after duration
   */
  autoHide?: boolean;
}

/**
 * State for the useFeedbackAnimation hook
 */
export interface FeedbackAnimationState {
  /**
   * Whether the animation is visible
   */
  isVisible: boolean;

  /**
   * Type of animation
   */
  type: AnimationType;

  /**
   * Whether the feedback is positive (success) or negative (failure)
   */
  isSuccess: boolean;

  /**
   * Animation intensity
   */
  intensity: AnimationIntensity;

  /**
   * Animation configuration
   */
  config: AnimationConfig;
}

/**
 * Actions for the useFeedbackAnimation hook
 */
export interface FeedbackAnimationActions {
  /**
   * Show success animation
   */
  showSuccess: (type?: AnimationType) => void;

  /**
   * Show failure animation
   */
  showFailure: (type?: AnimationType) => void;

  /**
   * Hide animation
   */
  hide: () => void;

  /**
   * Reset animation state
   */
  reset: () => void;
}

/**
 * Hook for managing feedback animations
 *
 * @param options Animation options
 * @returns Animation state and actions
 */
export function useFeedbackAnimation(
  options: FeedbackAnimationOptions = {},
): [FeedbackAnimationState, FeedbackAnimationActions] {
  const {
    duration,
    playSounds = true,
    successSound = 'correct',
    failureSound = 'incorrect',
    intensity = 'medium',
    autoHide = true,
  } = options;

  const [state, setState] = useState<FeedbackAnimationState>({
    isVisible: false,
    type: 'confetti',
    isSuccess: true,
    intensity,
    config: getAnimationConfig('confetti', intensity),
  });

  // Show success animation
  const showSuccess = useCallback((type: AnimationType = 'confetti') => {
    if (playSounds) {
      audioService.playSound(successSound);
    }

    setState({
      isVisible: true,
      type,
      isSuccess: true,
      intensity,
      config: getAnimationConfig(type, intensity),
    });
  }, [playSounds, successSound, intensity]);

  // Show failure animation
  const showFailure = useCallback((type: AnimationType = 'fade') => {
    if (playSounds) {
      audioService.playSound(failureSound);
    }

    setState({
      isVisible: true,
      type,
      isSuccess: false,
      intensity,
      config: getAnimationConfig(type, intensity),
    });
  }, [playSounds, failureSound, intensity]);

  // Hide animation
  const hide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  // Reset animation state
  const reset = useCallback(() => {
    setState({
      isVisible: false,
      type: 'confetti',
      isSuccess: true,
      intensity,
      config: getAnimationConfig('confetti', intensity),
    });
  }, [intensity]);

  // Auto-hide animation after duration
  useEffect(() => {
    if (state.isVisible && autoHide) {
      const timer = setTimeout(() => {
        hide();
      }, duration || state.config.duration);

      return () => clearTimeout(timer);
    }
  }, [state.isVisible, state.config.duration, autoHide, duration, hide]);

  return [
    state,
    { showSuccess, showFailure, hide, reset },
  ];
}

// ===== Animation Helpers =====

/**
 * Play animation sound
 *
 * @param sound Sound name
 * @param fallback Fallback sound if the specified sound is not found
 */
export function playAnimationSound(sound: string, fallback: string = 'correct'): void {
  audioService.playSound(sound);
}

/**
 * Generate random animation delay
 *
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 * @returns Random delay in milliseconds
 */
export function getRandomAnimationDelay(min: number = 0, max: number = 500): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random position within a container
 *
 * @param containerSize Container size (width or height)
 * @param elementSize Element size (width or height)
 * @param padding Padding from the edges
 * @returns Random position
 */
export function getRandomPosition(
  containerSize: number,
  elementSize: number = 0,
  padding: number = 0,
): number {
  return Math.random() * (containerSize - elementSize - padding * 2) + padding;
}

/**
 * Generate random color from a palette or random HSL
 *
 * @param palette Optional color palette to choose from
 * @returns Random color
 */
export function getRandomColor(palette?: string[]): string {
  if (palette && palette.length > 0) {
    return palette[Math.floor(Math.random() * palette.length)];
  }

  // Generate random HSL color
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 30) + 50; // 50-80%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

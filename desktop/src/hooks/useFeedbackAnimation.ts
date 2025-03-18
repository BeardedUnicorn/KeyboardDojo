/**
 * @deprecated This hook is deprecated. Use the consolidated animationSystem.ts instead.
 *
 * useFeedbackAnimation Hook
 *
 * A custom hook for managing feedback animations in response to user actions.
 */

import { useState, useEffect, useCallback } from 'react';

import { audioService } from '@/services';

import {
  getAnimationConfig,
} from '../utils/animationUtils';

import type {
  AnimationType,
  AnimationIntensity } from '../utils/animationUtils';

interface FeedbackAnimationOptions {
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

interface FeedbackAnimationState {
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
  config: ReturnType<typeof getAnimationConfig>;
}

interface FeedbackAnimationActions {
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

export default useFeedbackAnimation;

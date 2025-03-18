/**
 * Animation Hook
 * 
 * This hook provides a convenient way to use animations in components.
 * It supports both feedback animations and custom animations.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

import {
  useFeedbackAnimation,
  type FeedbackAnimationOptions,
  type FeedbackAnimationState,
  type FeedbackAnimationActions,
  type AnimationType,
  type AnimationIntensity,
} from '../utils/animationSystem';
import {
  type EasingFunction,
  easings,
  timing,
  createAnimationState,
  type AnimationState,
} from '../utils/animationUtils';

export {
  type FeedbackAnimationOptions,
  type FeedbackAnimationState,
  type FeedbackAnimationActions,
  type AnimationType,
  type AnimationIntensity,
};

interface CustomAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: EasingFunction | keyof typeof easings;
  autoplay?: boolean;
  loop?: boolean;
  yoyo?: boolean;
  onComplete?: () => void;
  onLoop?: () => void;
}

type AnimationHookOptions =
  | FeedbackAnimationOptions
  | (CustomAnimationOptions & {
      callback: (progress: number) => void;
    });

interface AnimationControls {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  reverse: () => void;
  seek: (progress: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
}

/**
 * Custom animation hook implementation - not exported, used internally by useAnimation
 */
function useCustomAnimation(
  options: Partial<
    CustomAnimationOptions & {
      callback: (progress: number) => void;
    }
  >,
): AnimationControls {
  const {
    callback = () => {},
    duration = 1000,
    delay = 0,
    easing = 'linear',
    autoplay = true,
    loop = false,
    yoyo = false,
    onComplete,
    onLoop,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReversed, setIsReversed] = useState(false);

  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number | undefined>(undefined);
  // eslint-disable-next-line no-undef
  const delayTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const loopCountRef = useRef(0);

  const easingFn = typeof easing === 'string' ? easings[easing] : easing;

  const cleanup = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = undefined;
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    let rawProgress = Math.min(elapsed / duration, 1);

    if (isReversed) {
      rawProgress = 1 - rawProgress;
    }

    const currentProgress = easingFn(rawProgress);
    setProgress(currentProgress);
    callback(currentProgress);

    if (rawProgress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      if (loop) {
        loopCountRef.current++;
        onLoop?.();
        
        if (yoyo) {
          setIsReversed((prev) => !prev);
        }
        
        startTimeRef.current = timestamp;
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        cleanup();
        onComplete?.();
      }
    }
  }, [callback, duration, easingFn, loop, yoyo, isReversed, onComplete, onLoop, cleanup]);

  const start = useCallback(() => {
    cleanup();
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = undefined;
    loopCountRef.current = 0;

    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(() => {
        frameRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [animate, cleanup, delay]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    cleanup();
  }, [cleanup]);

  const pause = useCallback(() => {
    if (isPlaying && !isPaused) {
      setIsPaused(true);
      cleanup();
      pausedTimeRef.current = performance.now();
    }
  }, [isPlaying, isPaused, cleanup]);

  const resume = useCallback(() => {
    if (isPlaying && isPaused && pausedTimeRef.current && startTimeRef.current) {
      setIsPaused(false);
      const pauseDuration = performance.now() - pausedTimeRef.current;
      startTimeRef.current += pauseDuration;
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, isPaused, animate]);

  const reset = useCallback(() => {
    stop();
    if (autoplay) {
      start();
    }
  }, [stop, start, autoplay]);

  const reverse = useCallback(() => {
    setIsReversed((prev) => !prev);
  }, []);

  const seek = useCallback((progressValue: number) => {
    if (progressValue !== undefined) {
      const clampedProgress = Math.max(0, Math.min(1, progressValue));
      setProgress(clampedProgress);
      callback(easingFn(clampedProgress));
    }
  }, [callback, easingFn]);

  // Start animation if autoplay is true
  useEffect(() => {
    if (autoplay) {
      start();
    }
    return cleanup;
  }, [autoplay, start, cleanup]);

  return {
    start,
    stop,
    pause,
    resume,
    reset,
    reverse,
    seek,
    isPlaying,
    isPaused,
    progress,
  };
}

/**
 * Feedback animation hook wrapper - not exported, used internally by useAnimation
 */
function useFeedbackAnimationWrapper(options: Partial<FeedbackAnimationOptions>): AnimationControls {
  const [state, actions] = useFeedbackAnimation(options as FeedbackAnimationOptions);
  
  return {
    start: () => actions.showSuccess(),
    stop: () => actions.hide(),
    pause: () => {},
    resume: () => {},
    reset: () => actions.reset(),
    reverse: () => {},
    seek: () => {},
    isPlaying: state.isVisible,
    isPaused: false,
    progress: 0,
  };
}

/**
 * Hook for managing animations
 * 
 * @param options Animation options. Can be either FeedbackAnimationOptions or CustomAnimationOptions with callback
 * @returns Animation controls
 */
export function useAnimation(options: AnimationHookOptions): AnimationControls {
  // Using an empty object to avoid undefined errors when passing to hooks
  const emptyOptions = {} as any;
  
  // Create both types of controls, but we'll only use one based on the options type
  const customControls = useCustomAnimation('callback' in options ? options : emptyOptions);
  const feedbackControls = useFeedbackAnimationWrapper('callback' in options ? emptyOptions : options);
  
  // Return the appropriate controls based on options type
  return 'callback' in options ? customControls : feedbackControls;
} 

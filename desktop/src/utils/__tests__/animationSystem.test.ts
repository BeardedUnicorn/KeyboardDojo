import './setup';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import {
  animationDurations,
  animationEasings,
  getAnimationDuration,
  getAnimationConfig,
  getAnimationTransform,
  getAnimationKeyframes,
  getAnimationStyles,
  getRandomAnimationDelay,
  getRandomPosition,
  getRandomColor,
  useFeedbackAnimation,
  type AnimationIntensity,
  type AnimationType,
  type AnimationDirection,
  type FeedbackAnimationState,
  type FeedbackAnimationActions
} from '../animationSystem';

// Mock services
vi.mock('../services', () => ({
  audioService: {
    play: vi.fn(),
    playSound: vi.fn(),
  },
}));

describe('Animation System', () => {
  describe('animation constants and utility functions', () => {
    test('animation durations are defined correctly', () => {
      expect(animationDurations.veryFast).toBeDefined();
      expect(animationDurations.fast).toBeDefined();
      expect(animationDurations.normal).toBeDefined();
      expect(animationDurations.slow).toBeDefined();
      expect(animationDurations.verySlow).toBeDefined();
      
      expect(animationDurations.veryFast).toBeLessThan(animationDurations.fast);
      expect(animationDurations.fast).toBeLessThan(animationDurations.normal);
      expect(animationDurations.normal).toBeLessThan(animationDurations.slow);
      expect(animationDurations.slow).toBeLessThan(animationDurations.verySlow);
    });

    test('animation easing functions are defined correctly', () => {
      expect(animationEasings.linear).toBeDefined();
      expect(animationEasings.easeIn).toBeDefined();
      expect(animationEasings.easeOut).toBeDefined();
      expect(animationEasings.easeInOut).toBeDefined();
      expect(animationEasings.sharp).toBeDefined();
      expect(animationEasings.bounce).toBeDefined();
      
      expect(animationEasings.linear).toBe('linear');
      expect(animationEasings.easeIn).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.easeOut).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.easeInOut).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.sharp).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.bounce).toMatch(/^cubic-bezier\(/);
    });

    test('getAnimationDuration returns correct durations', () => {
      expect(getAnimationDuration('low')).toBe(animationDurations.fast);
      expect(getAnimationDuration('medium')).toBe(animationDurations.normal);
      expect(getAnimationDuration('high')).toBe(animationDurations.slow);
      expect(getAnimationDuration()).toBe(animationDurations.normal); // default
    });

    test('getAnimationConfig returns correct configurations', () => {
      const fadeConfig = getAnimationConfig('fade', 'medium');
      expect(fadeConfig.type).toBe('fade');
      expect(fadeConfig.duration).toBe(animationDurations.normal);
      expect(fadeConfig.easing).toBe(animationEasings.easeInOut);
      expect(fadeConfig.intensity).toBe('medium');

      const slideConfig = getAnimationConfig('slide', 'high');
      expect(slideConfig.type).toBe('slide');
      expect(slideConfig.duration).toBe(animationDurations.slow);
      expect(slideConfig.easing).toBe(animationEasings.easeOut);
      expect(slideConfig.intensity).toBe('high');
      expect(slideConfig.direction).toBe('up');
    });

    test('getAnimationTransform returns correct transform values', () => {
      expect(getAnimationTransform('scale', 'low')).toBe('scale(0.95)');
      expect(getAnimationTransform('rotate', 'medium')).toBe('rotate(10deg)');
      expect(getAnimationTransform('slide', 'high', 'down')).toBe('translateY(-30px)');
      expect(getAnimationTransform('fade')).toBe(''); // No transform for fade
    });

    test('getAnimationKeyframes returns correct keyframes', () => {
      const fadeKeyframes = getAnimationKeyframes('fade');
      expect(fadeKeyframes.from).toHaveProperty('opacity', 0);
      expect(fadeKeyframes.to).toHaveProperty('opacity', 1);

      const scaleKeyframes = getAnimationKeyframes('scale', 'low');
      expect(scaleKeyframes.from).toHaveProperty('transform', 'scale(0.95)');
      expect(scaleKeyframes.from).toHaveProperty('opacity', 0.9);
      expect(scaleKeyframes.to).toHaveProperty('transform', 'scale(1)');
      expect(scaleKeyframes.to).toHaveProperty('opacity', 1);
    });

    test('getAnimationStyles returns correct styles', () => {
      const config = {
        type: 'fade' as AnimationType,
        duration: 500,
        easing: 'ease-in-out',
        intensity: 'medium' as AnimationIntensity,
        delay: 200,
      };
      
      const styles = getAnimationStyles(config);
      
      expect(styles).toHaveProperty('animation');
      expect(styles.animation).toContain('500ms ease-in-out 200ms forwards');
      expect(styles).toHaveProperty('opacity', 0);
    });

    test('getRandomAnimationDelay returns number within range', () => {
      const delay = getRandomAnimationDelay(100, 200);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(200);
      
      // Test default values
      const defaultDelay = getRandomAnimationDelay();
      expect(defaultDelay).toBeGreaterThanOrEqual(0);
      expect(defaultDelay).toBeLessThanOrEqual(500);
    });

    test('getRandomPosition calculates position within container boundaries', () => {
      const position = getRandomPosition(1000, 100, 20);
      expect(position).toBeGreaterThanOrEqual(20); // At least padding
      expect(position).toBeLessThanOrEqual(880); // Container size - element size - padding
      
      // Test without element size and padding
      const defaultPosition = getRandomPosition(1000);
      expect(defaultPosition).toBeGreaterThanOrEqual(0);
      expect(defaultPosition).toBeLessThanOrEqual(1000);
    });

    test('getRandomColor returns valid color', () => {
      const palette = ['#FF0000', '#00FF00', '#0000FF'];
      const color = getRandomColor(palette);
      expect(palette).toContain(color);
      
      // Test default colors when no palette provided
      const defaultColor = getRandomColor();
      expect(defaultColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });
  });

  describe('useFeedbackAnimation hook', () => {
    test('initializes with correct default state', () => {
      const { result } = renderHook(() => useFeedbackAnimation());
      
      expect(result.current[0].isVisible).toBe(false);
      expect(result.current[0].isSuccess).toBe(true);
      expect(result.current[0].intensity).toBe('medium');
      expect(result.current[0].type).toBe('confetti');
      expect(result.current[0].config).toBeDefined();
    });

    test('showSuccess displays success animation', () => {
      const { result } = renderHook(() => useFeedbackAnimation());
      
      act(() => {
        const [, actions] = result.current;
        actions.showSuccess('scale');
      });
      
      expect(result.current[0].isVisible).toBe(true);
      expect(result.current[0].isSuccess).toBe(true);
      expect(result.current[0].type).toBe('scale');
    });

    test('showFailure displays failure animation', () => {
      const { result } = renderHook(() => useFeedbackAnimation());
      
      act(() => {
        const [, actions] = result.current;
        actions.showFailure('bounce');
      });
      
      expect(result.current[0].isVisible).toBe(true);
      expect(result.current[0].isSuccess).toBe(false);
      expect(result.current[0].type).toBe('bounce');
    });

    test('hide hides animation', () => {
      const { result } = renderHook(() => useFeedbackAnimation());
      
      // First show animation
      act(() => {
        const [, actions] = result.current;
        actions.showSuccess();
      });
      
      // Then hide it
      act(() => {
        const [, actions] = result.current;
        actions.hide();
      });
      
      expect(result.current[0].isVisible).toBe(false);
    });

    test('reset resets animation state', () => {
      const { result } = renderHook(() => useFeedbackAnimation());
      
      // First modify state
      act(() => {
        const [, actions] = result.current;
        actions.showFailure('rotate');
      });
      
      // Then reset
      act(() => {
        const [, actions] = result.current;
        actions.reset();
      });
      
      expect(result.current[0].isVisible).toBe(false);
      expect(result.current[0].isSuccess).toBe(true);
      expect(result.current[0].type).toBe('confetti'); // Default type
    });

    test('autoHide automatically hides animation after duration', () => {
      vi.useFakeTimers();
      
      const { result } = renderHook(() => 
        useFeedbackAnimation({ 
          duration: 500, 
          autoHide: true 
        })
      );
      
      act(() => {
        const [, actions] = result.current;
        actions.showSuccess();
      });
      
      expect(result.current[0].isVisible).toBe(true);
      
      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(600);
      });
      
      // Animation should be hidden
      expect(result.current[0].isVisible).toBe(false);
      
      vi.useRealTimers();
    });

    test('respects custom animation options', () => {
      const { result } = renderHook(() => 
        useFeedbackAnimation({ 
          duration: 1200, 
          intensity: 'high',
          playSounds: true,
          successSound: 'success.mp3',
          failureSound: 'failure.mp3'
        })
      );
      
      expect(result.current[0].intensity).toBe('high');
      expect(result.current[0].config.duration).toBe(1200);
    });
  });
}); 
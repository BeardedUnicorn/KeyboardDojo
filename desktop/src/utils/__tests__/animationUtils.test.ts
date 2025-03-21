import { vi } from 'vitest';
import { 
  animationDurations, 
  animationEasings,
  getAnimationDuration,
  getAnimationConfig,
  getAnimationTransform,
  getAnimationKeyframes,
  getAnimationStyles,
  interpolate,
  interpolateColor,
  createAnimationState,
  sequence,
  parallel,
  delay,
  spring,
  type AnimationIntensity,
  type AnimationType,
  type AnimationDirection
} from '../animationUtils';

describe('Animation Utilities', () => {
  describe('easing functions', () => {
    test('easing functions produce expected values', () => {
      // Test that all easing functions are defined
      expect(animationEasings.linear).toBeDefined();
      expect(animationEasings.easeIn).toBeDefined();
      expect(animationEasings.easeOut).toBeDefined();
      expect(animationEasings.easeInOut).toBeDefined();
      expect(animationEasings.sharp).toBeDefined();
      expect(animationEasings.bounce).toBeDefined();
      
      // Test that they are valid CSS easing strings
      expect(animationEasings.linear).toBe('linear');
      expect(animationEasings.easeIn).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.easeOut).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.easeInOut).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.sharp).toMatch(/^cubic-bezier\(/);
      expect(animationEasings.bounce).toMatch(/^cubic-bezier\(/);
    });
  });

  describe('getAnimationDuration', () => {
    test('returns correct duration for different intensities', () => {
      expect(getAnimationDuration('low')).toBe(animationDurations.fast);
      expect(getAnimationDuration('medium')).toBe(animationDurations.normal);
      expect(getAnimationDuration('high')).toBe(animationDurations.slow);
      // Test default value
      expect(getAnimationDuration()).toBe(animationDurations.normal);
    });
  });

  describe('getAnimationConfig', () => {
    test('returns correct configuration for fade animation', () => {
      const config = getAnimationConfig('fade', 'medium');
      expect(config).toEqual({
        type: 'fade',
        duration: animationDurations.normal,
        easing: animationEasings.easeInOut,
        intensity: 'medium',
      });
    });

    test('returns correct configuration for slide animation', () => {
      const config = getAnimationConfig('slide', 'high');
      expect(config).toEqual({
        type: 'slide',
        duration: animationDurations.slow,
        easing: animationEasings.easeOut,
        intensity: 'high',
        direction: 'up',
      });
    });

    test('returns correct configuration for scale animation', () => {
      const config = getAnimationConfig('scale', 'low');
      expect(config).toEqual({
        type: 'scale',
        duration: animationDurations.fast,
        easing: animationEasings.easeInOut,
        intensity: 'low',
      });
    });

    test('returns correct configuration for rotate animation', () => {
      const config = getAnimationConfig('rotate', 'medium');
      expect(config).toEqual({
        type: 'rotate',
        duration: animationDurations.normal,
        easing: animationEasings.easeInOut,
        intensity: 'medium',
      });
    });

    test('returns correct configuration for bounce animation', () => {
      const config = getAnimationConfig('bounce', 'high');
      expect(config).toEqual({
        type: 'bounce',
        duration: animationDurations.slow * 1.2,
        easing: animationEasings.bounce,
        intensity: 'high',
      });
    });

    test('returns correct configuration for confetti animation', () => {
      const config = getAnimationConfig('confetti', 'low');
      expect(config).toEqual({
        type: 'confetti',
        duration: animationDurations.fast * 1.5,
        easing: animationEasings.easeOut,
        intensity: 'low',
      });
    });

    test('returns default configuration when no parameters provided', () => {
      const config = getAnimationConfig();
      expect(config).toEqual({
        type: 'fade',
        duration: animationDurations.normal,
        easing: animationEasings.easeInOut,
        intensity: 'medium',
      });
    });
  });

  describe('getAnimationTransform', () => {
    test('returns correct transform for scale animation', () => {
      expect(getAnimationTransform('scale', 'low')).toBe('scale(0.95)');
      expect(getAnimationTransform('scale', 'medium')).toBe('scale(0.9)');
      expect(getAnimationTransform('scale', 'high')).toBe('scale(0.8)');
    });

    test('returns correct transform for rotate animation', () => {
      expect(getAnimationTransform('rotate', 'low')).toBe('rotate(5deg)');
      expect(getAnimationTransform('rotate', 'medium')).toBe('rotate(10deg)');
      expect(getAnimationTransform('rotate', 'high')).toBe('rotate(15deg)');
    });

    test('returns correct transform for slide animation with different directions', () => {
      expect(getAnimationTransform('slide', 'medium', 'up')).toBe('translateY(20px)');
      expect(getAnimationTransform('slide', 'medium', 'down')).toBe('translateY(-20px)');
      expect(getAnimationTransform('slide', 'medium', 'left')).toBe('translateX(20px)');
      expect(getAnimationTransform('slide', 'medium', 'right')).toBe('translateX(-20px)');
      
      // Test default direction
      expect(getAnimationTransform('slide', 'medium')).toBe('translateY(20px)');
    });

    test('returns correct transform for bounce animation', () => {
      expect(getAnimationTransform('bounce', 'low')).toBe('translateY(10px)');
      expect(getAnimationTransform('bounce', 'medium')).toBe('translateY(20px)');
      expect(getAnimationTransform('bounce', 'high')).toBe('translateY(30px)');
    });

    test('returns empty string for unsupported animation types', () => {
      expect(getAnimationTransform('fade', 'medium')).toBe('');
      expect(getAnimationTransform('confetti', 'medium')).toBe('');
      expect(getAnimationTransform('stars', 'medium')).toBe('');
    });
  });

  describe('getAnimationKeyframes', () => {
    test('returns correct keyframes for fade animation', () => {
      const keyframes = getAnimationKeyframes('fade', 'medium');
      expect(keyframes).toEqual({
        from: { opacity: 0 },
        to: { opacity: 1 },
      });
    });

    test('returns correct keyframes for scale animation', () => {
      const keyframes = getAnimationKeyframes('scale', 'low');
      expect(keyframes).toEqual({
        from: { transform: 'scale(0.95)', opacity: 0.9 },
        to: { transform: 'scale(1)', opacity: 1 },
      });
    });

    test('returns correct keyframes for slide animation', () => {
      const keyframes = getAnimationKeyframes('slide', 'high');
      expect(keyframes).toEqual({
        from: { transform: 'translateY(30px)', opacity: 0.5 },
        to: { transform: 'translateY(0)', opacity: 1 },
      });
    });
  });

  describe('interpolate function', () => {
    test('interpolate function calculates correct values', () => {
      expect(interpolate(0, 100, 0)).toBe(0);
      expect(interpolate(0, 100, 0.5)).toBe(50);
      expect(interpolate(0, 100, 1)).toBe(100);
      
      // Test other ranges
      expect(interpolate(10, 20, 0.5)).toBe(15);
      expect(interpolate(-10, 10, 0.5)).toBe(0);
      
      // Test with out-of-bounds progress (implementation should not clamp)
      expect(interpolate(0, 100, 1.5)).toBe(150);
      expect(interpolate(0, 100, -0.5)).toBe(-50);
    });
  });

  describe('interpolateColor', () => {
    test('interpolates colors correctly', () => {
      // Helper to normalize hex colors for consistent comparison
      const normalizeHex = (hex: string) => 
        hex.toLowerCase().replace(/^#/, '').padStart(6, '0');
      
      // Test black to white interpolation
      const blackToWhite = interpolateColor('#000000', '#FFFFFF', 0.5);
      expect(normalizeHex(blackToWhite)).toBe('808080');
      
      // Test red to blue interpolation
      const redToBlue = interpolateColor('#FF0000', '#0000FF', 0.5);
      expect(normalizeHex(redToBlue)).toBe('800080');
      
      // Test at boundaries
      expect(normalizeHex(interpolateColor('#FF0000', '#0000FF', 0))).toBe('ff0000');
      expect(normalizeHex(interpolateColor('#FF0000', '#0000FF', 1))).toBe('0000ff');
    });
  });

  describe('createAnimationState', () => {
    test('creates correct animation state object', () => {
      const state = createAnimationState(250, 1000);
      expect(state).toEqual({
        isPlaying: true,
        progress: 0.25,
        elapsedTime: 250,
        remainingTime: 750,
      });
      
      // Test at boundaries
      expect(createAnimationState(0, 1000)).toEqual({
        isPlaying: true,
        progress: 0,
        elapsedTime: 0,
        remainingTime: 1000,
      });
      
      expect(createAnimationState(1000, 1000)).toEqual({
        isPlaying: false,
        progress: 1,
        elapsedTime: 1000,
        remainingTime: 0,
      });
      
      // Test with elapsed time greater than duration
      expect(createAnimationState(1500, 1000)).toEqual({
        isPlaying: false,
        progress: 1,
        elapsedTime: 1500,
        remainingTime: 0,
      });
    });
  });

  describe('getAnimationStyles', () => {
    test('returns correct styles for animation config', () => {
      const config = {
        type: 'fade' as AnimationType,
        duration: 500,
        easing: 'ease-in-out',
        intensity: 'medium' as AnimationIntensity,
        delay: 200,
      };
      
      const styles = getAnimationStyles(config);
      
      expect(styles).toEqual({
        animation: `fade 500ms ease-in-out 200ms forwards`,
        opacity: 0,
        transform: undefined,
      });
      
      // Test without delay
      const configNoDelay = { ...config, delay: undefined };
      const stylesNoDelay = getAnimationStyles(configNoDelay);
      
      expect(stylesNoDelay).toEqual({
        animation: `fade 500ms ease-in-out 0ms forwards`,
        opacity: 0,
        transform: undefined,
      });
    });
  });

  describe('sequence animations', () => {
    test('sequence animations execute in order', async () => {
      const animations = [
        { duration: 100, value: 0 },
        { duration: 200, value: 1 },
        { duration: 300, value: 2 },
      ];

      let currentValue = -1;
      const onFrame = (value: number) => {
        expect(value).toBe(currentValue + 1);
        currentValue = value;
      };

      await sequence(animations, onFrame);
      expect(currentValue).toBe(2);
    });

    test('sequence animations respect timing', async () => {
      vi.useFakeTimers();
      
      const animations = [
        { duration: 100, value: 0 },
        { duration: 200, value: 1 },
      ];

      const onFrame = vi.fn();
      const promise = sequence(animations, onFrame);

      // First animation starts
      expect(onFrame).toHaveBeenLastCalledWith(0);

      // First animation completes, second animation starts
      await vi.advanceTimersByTimeAsync(100);
      expect(onFrame).toHaveBeenLastCalledWith(1);

      // Second animation completes
      await vi.advanceTimersByTimeAsync(200);
      await promise;

      vi.useRealTimers();
    });
  });

  describe('parallel animations', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      let time = 0;
      // Mock requestAnimationFrame
      global.requestAnimationFrame = (cb: FrameRequestCallback) => {
        time += 16;
        setTimeout(() => cb(time), 0);
        return 0;
      };
      // Mock Date.now
      global.Date.now = () => time;
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    test('parallel animations execute simultaneously', async () => {
      const animations = [
        { duration: 100, from: 0, to: 10 },
        { duration: 100, from: 0, to: 20 },
      ];

      const values: number[][] = [];
      const onFrame = (vals: number[]) => {
        values.push([...vals]);
      };

      const promise = parallel(animations, onFrame);
      
      // Run all timers
      await vi.runAllTimersAsync();
      await promise;
      
      // Should have both final values
      expect(values[values.length - 1]).toEqual([10, 20]);
    }, 10000);

    test('parallel animations complete when all are done', async () => {
      const animations = [
        { duration: 100, from: 0, to: 10 },
        { duration: 200, from: 0, to: 20 },
      ];

      const onFrame = vi.fn();
      const promise = parallel(animations, onFrame);

      // Run all timers
      await vi.runAllTimersAsync();
      await promise;

      // Both animations should be complete with exact values
      const finalCall = onFrame.mock.calls[onFrame.mock.calls.length - 1][0];
      expect(finalCall).toEqual([10, 20]);
    }, 10000);
  });

  describe('delay function', () => {
    test('delay function waits correct time', async () => {
      vi.useFakeTimers();
      
      const callback = vi.fn();
      const promise = delay(1000).then(callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      await promise;
      expect(callback).toHaveBeenCalled();

      vi.useRealTimers();
    });

    test('delay resolves with provided value', async () => {
      const result = await delay(100, 'test');
      expect(result).toBe('test');
    });
  });

  describe('spring animation', () => {
    test('spring animation calculates correct physics', () => {
      const config = {
        stiffness: 100,
        damping: 10,
        mass: 1,
      };

      const { position, velocity } = spring(0, 100, 0, 0, 0.016, config);
      
      // Position should move towards target
      expect(position).toBeGreaterThan(0);
      expect(position).toBeLessThan(100);
      
      // Velocity should be positive (moving towards target)
      expect(velocity).toBeGreaterThan(0);
    });

    test('spring animation reaches target', () => {
      const config = {
        stiffness: 100,
        damping: 10,
        mass: 1,
      };

      let pos = 0;
      let vel = 0;
      
      // Simulate for enough time to reach target
      for (let i = 0; i < 200; i++) {
        const result = spring(pos, 100, vel, 0, 0.016, config);
        pos = result.position;
        vel = result.velocity;
      }

      // Should be very close to target
      expect(Math.abs(pos - 100)).toBeLessThan(0.1);
      // Velocity should be very small (increased tolerance)
      expect(Math.abs(vel)).toBeLessThan(0.5);
    });

    test('spring animation handles different configurations', () => {
      // Stiff spring
      const stiffConfig = {
        stiffness: 200,
        damping: 10,
        mass: 1,
      };
      
      const stiffResult = spring(0, 100, 0, 0, 0.016, stiffConfig);
      
      // Loose spring
      const looseConfig = {
        stiffness: 50,
        damping: 10,
        mass: 1,
      };
      
      const looseResult = spring(0, 100, 0, 0, 0.016, looseConfig);
      
      // Stiff spring should move faster initially
      expect(stiffResult.position).toBeGreaterThan(looseResult.position);
    });
  });
}); 
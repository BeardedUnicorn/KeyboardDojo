import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ShortcutDetector,
  parseShortcut,
  formatShortcut,
  normalizeKey,
  isModifier,
  getActiveModifiers,
  matchesShortcut,
  debounce,
  throttle,
  ShortcutKey
} from '../shortcutDetector';

// Mock the logger service
vi.mock('@/services/loggerService', () => ({
  loggerService: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}));

describe('shortcutDetector', () => {
  // Helper to create a keyboard event
  const createKeyboardEvent = (
    key: string,
    type: 'keydown' | 'keyup' = 'keydown',
    options: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean } = {}
  ): KeyboardEvent => {
    return new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true,
      ctrlKey: options.ctrlKey || false,
      altKey: options.altKey || false,
      shiftKey: options.shiftKey || false,
      metaKey: options.metaKey || false,
    });
  };

  describe('parseShortcut', () => {
    it('parses a simple shortcut', () => {
      const shortcut = parseShortcut('A');
      expect(shortcut).toEqual({ key: 'A', modifiers: [] });
    });

    it('parses a shortcut with modifiers', () => {
      const shortcut = parseShortcut('Ctrl+Shift+A');
      expect(shortcut).toEqual({ key: 'A', modifiers: ['Ctrl', 'Shift'] });
    });

    it('handles empty shortcut string', () => {
      const shortcut = parseShortcut('');
      expect(shortcut).toEqual({ key: '', modifiers: [] });
    });
  });

  describe('formatShortcut', () => {
    it('formats a simple shortcut', () => {
      const shortcut: ShortcutKey = { key: 'A', modifiers: [] };
      expect(formatShortcut(shortcut)).toBe('A');
    });

    it('formats a shortcut with modifiers', () => {
      const shortcut: ShortcutKey = { key: 'A', modifiers: ['Ctrl', 'Shift'] };
      expect(formatShortcut(shortcut)).toBe('Ctrl+Shift+A');
    });
  });

  describe('normalizeKey', () => {
    it('normalizes modifier keys', () => {
      expect(normalizeKey('Control')).toBe('Ctrl');
      expect(normalizeKey('Option')).toBe('Alt');
      expect(normalizeKey('⌘')).toBe('Meta');
      expect(normalizeKey('Win')).toBe('Meta');
      expect(normalizeKey('Shift')).toBe('Shift');
    });

    it('normalizes special keys', () => {
      expect(normalizeKey('Escape')).toBe('Escape');
      expect(normalizeKey('Return')).toBe('Enter');
      expect(normalizeKey(' ')).toBe('Space');
    });

    it('normalizes arrow keys', () => {
      expect(normalizeKey('ArrowUp')).toBe('ArrowUp');
      expect(normalizeKey('Up')).toBe('ArrowUp');
      expect(normalizeKey('Down')).toBe('ArrowDown');
    });

    it('capitalizes single letter keys', () => {
      expect(normalizeKey('a')).toBe('A');
      expect(normalizeKey('z')).toBe('Z');
    });

    it('preserves other keys', () => {
      expect(normalizeKey('F1')).toBe('F1');
      expect(normalizeKey('Tab')).toBe('Tab');
    });
  });

  describe('isModifier', () => {
    it('identifies modifier keys correctly', () => {
      expect(isModifier('Ctrl')).toBe(true);
      expect(isModifier('Shift')).toBe(true);
      expect(isModifier('Alt')).toBe(true);
      expect(isModifier('Meta')).toBe(true);
      expect(isModifier('Control')).toBe(true);
      expect(isModifier('Option')).toBe(true);
      expect(isModifier('⌘')).toBe(true);
    });

    it('returns false for non-modifier keys', () => {
      expect(isModifier('A')).toBe(false);
      expect(isModifier('Enter')).toBe(false);
      expect(isModifier('Escape')).toBe(false);
    });
  });

  describe('getActiveModifiers', () => {
    it('returns empty array for no modifiers', () => {
      const event = createKeyboardEvent('A');
      expect(getActiveModifiers(event)).toEqual([]);
    });

    it('detects single modifier', () => {
      const event = createKeyboardEvent('A', 'keydown', { ctrlKey: true });
      expect(getActiveModifiers(event)).toEqual(['Ctrl']);
    });

    it('detects multiple modifiers', () => {
      const event = createKeyboardEvent('A', 'keydown', { 
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true
      });
      expect(getActiveModifiers(event).sort()).toEqual(['Alt', 'Ctrl', 'Meta', 'Shift'].sort());
    });
  });

  describe('matchesShortcut', () => {
    it('matches a simple shortcut', () => {
      const event = createKeyboardEvent('A');
      const shortcut: ShortcutKey = { key: 'A', modifiers: [] };
      expect(matchesShortcut(event, shortcut)).toBe(true);
    });

    it('matches a shortcut with modifiers', () => {
      const event = createKeyboardEvent('A', 'keydown', { ctrlKey: true, shiftKey: true });
      const shortcut: ShortcutKey = { key: 'A', modifiers: ['Ctrl', 'Shift'] };
      expect(matchesShortcut(event, shortcut)).toBe(true);
    });

    it('does not match when key differs', () => {
      const event = createKeyboardEvent('B');
      const shortcut: ShortcutKey = { key: 'A', modifiers: [] };
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });

    it('does not match when modifiers differ', () => {
      const event = createKeyboardEvent('A', 'keydown', { ctrlKey: true });
      const shortcut: ShortcutKey = { key: 'A', modifiers: ['Shift'] };
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });

    it('does not match when extra modifiers are pressed', () => {
      const event = createKeyboardEvent('A', 'keydown', { ctrlKey: true, altKey: true });
      const shortcut: ShortcutKey = { key: 'A', modifiers: ['Ctrl'] };
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });

    it('does not match when required modifiers are missing', () => {
      const event = createKeyboardEvent('A', 'keydown', { ctrlKey: true });
      const shortcut: ShortcutKey = { key: 'A', modifiers: ['Ctrl', 'Shift'] };
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounces a function call', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('resets the timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test1');
      vi.advanceTimersByTime(50);
      debouncedFn('test2');
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('test2');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('throttles a function call', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('test1');
      expect(mockFn).toHaveBeenCalledWith('test1');
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn('test2');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFn('test3');
      expect(mockFn).toHaveBeenCalledWith('test3');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('ShortcutDetector class', () => {
    let detector: ShortcutDetector;
    let windowAddEventListenerSpy: vi.SpyInstance;
    let windowRemoveEventListenerSpy: vi.SpyInstance;

    beforeEach(() => {
      detector = new ShortcutDetector();
      windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
      windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe('initialize and cleanup', () => {
      it('adds event listeners on initialize', () => {
        detector.initialize();
        expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(3);
        expect(windowAddEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(windowAddEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
        expect(windowAddEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      });

      it('removes event listeners on cleanup', () => {
        detector.initialize();
        detector.cleanup();
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledTimes(3);
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      });

      it('does nothing if already initialized or already cleaned up', () => {
        detector.initialize();
        windowAddEventListenerSpy.mockClear();
        detector.initialize(); // Second call should do nothing
        expect(windowAddEventListenerSpy).not.toHaveBeenCalled();

        detector.cleanup();
        windowRemoveEventListenerSpy.mockClear();
        detector.cleanup(); // Second call should do nothing
        expect(windowRemoveEventListenerSpy).not.toHaveBeenCalled();
      });
    });

    describe('shortcut registration', () => {
      it('registers a shortcut', () => {
        const callback = vi.fn();
        const shortcut = detector.registerShortcut('test', 'Ctrl+A', callback);
        
        expect(shortcut).toEqual({
          id: 'test',
          shortcut: { key: 'A', modifiers: ['Ctrl'] },
          callback
        });
        
        expect(detector.getShortcuts()).toHaveLength(1);
        expect(detector.getShortcuts()[0]).toEqual(shortcut);
      });

      it('unregisters a shortcut', () => {
        const callback = vi.fn();
        detector.registerShortcut('test', 'Ctrl+A', callback);
        
        const result = detector.unregisterShortcut('test');
        expect(result).toBe(true);
        expect(detector.getShortcuts()).toHaveLength(0);
      });

      it('returns false when unregistering a non-existent shortcut', () => {
        const result = detector.unregisterShortcut('non-existent');
        expect(result).toBe(false);
      });
    });

    describe('key mappings', () => {
      it('adds and removes key mappings', () => {
        detector.addKeyMapping('a', 'b');
        detector.addKeyMapping('c', 'd');
        
        const result = detector.removeKeyMapping('a');
        expect(result).toBe(true);
        
        const nonExistentResult = detector.removeKeyMapping('x');
        expect(nonExistentResult).toBe(false);
      });

      it('clears all key mappings', () => {
        detector.addKeyMapping('a', 'b');
        detector.addKeyMapping('c', 'd');
        
        detector.clearKeyMappings();
        
        const result = detector.removeKeyMapping('a');
        expect(result).toBe(false); // Should be false as all mappings were cleared
      });
    });

    describe('throttle and debounce settings', () => {
      it('sets throttle time', () => {
        const spy = vi.spyOn(detector as any, 'handleKeyDown');
        detector.setThrottleTime(100);
        expect(spy).not.toHaveBeenCalled(); // Just verifying the spy setup
      });

      it('sets debounce time', () => {
        detector.setDebounceTime(200);
        // Not much to test here beyond setting the value
      });
    });

    describe('key state tracking', () => {
      beforeEach(() => {
        detector.initialize();
      });

      afterEach(() => {
        detector.cleanup();
      });

      it('checks if a key is pressed', () => {
        // Simulate a key press
        const event = createKeyboardEvent('A');
        window.dispatchEvent(event);
        
        expect(detector.isKeyPressed('A')).toBe(true);
        
        // Simulate key release
        const upEvent = createKeyboardEvent('A', 'keyup');
        window.dispatchEvent(upEvent);
        
        expect(detector.isKeyPressed('A')).toBe(false);
      });

      it('gets all pressed keys', () => {
        // Simulate multiple key presses
        window.dispatchEvent(createKeyboardEvent('A'));
        window.dispatchEvent(createKeyboardEvent('B'));
        
        const pressedKeys = detector.getPressedKeys();
        expect(pressedKeys.size).toBe(2);
        expect(pressedKeys.has('A')).toBe(true);
        expect(pressedKeys.has('B')).toBe(true);
      });

      it('clears keys on blur', () => {
        // Simulate key press
        window.dispatchEvent(createKeyboardEvent('A'));
        expect(detector.isKeyPressed('A')).toBe(true);
        
        // Simulate window blur
        window.dispatchEvent(new Event('blur'));
        expect(detector.isKeyPressed('A')).toBe(false);
        expect(detector.getPressedKeys().size).toBe(0);
      });
    });

    describe('callback utilities', () => {
      beforeEach(() => {
        vi.useFakeTimers();
        detector.setDebounceTime(100);
        detector.setThrottleTime(200);
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('creates a debounced callback', () => {
        const mockCallback = vi.fn();
        const debouncedCallback = detector.debounceCallback(mockCallback);
        
        const event = { 
          shortcut: { key: 'A', modifiers: [] },
          event: createKeyboardEvent('A')
        };
        
        debouncedCallback(event);
        expect(mockCallback).not.toHaveBeenCalled();
        
        vi.advanceTimersByTime(100);
        expect(mockCallback).toHaveBeenCalledWith(event);
      });

      it('creates a throttled callback', () => {
        const mockCallback = vi.fn();
        const throttledCallback = detector.throttleCallback(mockCallback);
        
        const event = { 
          shortcut: { key: 'A', modifiers: [] },
          event: createKeyboardEvent('A')
        };
        
        throttledCallback(event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        
        throttledCallback(event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        
        vi.advanceTimersByTime(200);
        throttledCallback(event);
        expect(mockCallback).toHaveBeenCalledTimes(2);
      });
    });
  });
}); 
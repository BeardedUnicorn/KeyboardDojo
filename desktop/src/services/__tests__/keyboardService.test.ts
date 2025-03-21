import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { keyboardService } from '../keyboardService';
import { shortcutDetector } from '../../utils/shortcutDetector';
import { osDetectionService } from '../osDetectionService';
import type { ShortcutEvent, Modifier } from '../../utils/shortcutDetector';

// Mock dependencies
vi.mock('../../utils/shortcutDetector', () => ({
  shortcutDetector: {
    initialize: vi.fn(),
    cleanup: vi.fn(),
    registerShortcut: vi.fn(),
    unregisterShortcut: vi.fn(),
    addKeyMapping: vi.fn(),
    setThrottleTime: vi.fn(),
    setDebounceTime: vi.fn(),
    isKeyPressed: vi.fn(),
    getPressedKeys: vi.fn()
  }
}));

vi.mock('../osDetectionService', () => ({
  osDetectionService: {
    isMacOS: vi.fn().mockReturnValue(false),
    isLinux: vi.fn().mockReturnValue(false),
    isWindows: vi.fn().mockReturnValue(true),
    getOSInfo: vi.fn().mockReturnValue({ os: 'windows', version: '10' }),
    formatShortcutForOS: vi.fn()
  }
}));

vi.mock('../loggerService', () => ({
  loggerService: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('KeyboardService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Reset service state
    if (keyboardService.isInitialized()) {
      keyboardService.cleanup();
    }
  });

  afterEach(() => {
    if (keyboardService.isInitialized()) {
      keyboardService.cleanup();
    }
  });

  describe('initialization and cleanup', () => {
    it('initializes correctly', async () => {
      await keyboardService.initialize();
      
      expect(keyboardService.isInitialized()).toBe(true);
      expect(shortcutDetector.initialize).toHaveBeenCalled();
      expect(osDetectionService.getOSInfo).toHaveBeenCalled();
    });

    it('does not initialize twice', async () => {
      await keyboardService.initialize();
      await keyboardService.initialize();
      
      expect(shortcutDetector.initialize).toHaveBeenCalledTimes(1);
    });

    it('cleans up correctly', async () => {
      await keyboardService.initialize();
      keyboardService.cleanup();
      
      expect(keyboardService.isInitialized()).toBe(false);
      expect(shortcutDetector.cleanup).toHaveBeenCalled();
    });

    it('does nothing on cleanup if not initialized', () => {
      keyboardService.cleanup();
      
      expect(shortcutDetector.cleanup).not.toHaveBeenCalled();
    });
  });

  describe('shortcut registration', () => {
    beforeEach(async () => {
      await keyboardService.initialize();
    });

    it('registers global shortcuts', () => {
      const callback = vi.fn();
      keyboardService.registerGlobalShortcut('Ctrl+A', callback);
      
      expect(shortcutDetector.registerShortcut).toHaveBeenCalledWith(
        'Ctrl+A',
        'Ctrl+A',
        expect.any(Function)
      );
    });

    it('unregisters global shortcuts', () => {
      const callback = vi.fn();
      keyboardService.registerGlobalShortcut('Ctrl+A', callback);
      keyboardService.unregisterGlobalShortcut('Ctrl+A');
      
      expect(shortcutDetector.unregisterShortcut).toHaveBeenCalledWith('Ctrl+A');
    });

    it('triggers callback when shortcut is activated', () => {
      const callback = vi.fn();
      keyboardService.registerGlobalShortcut('Ctrl+A', callback);
      
      // Get the callback function passed to registerShortcut
      const callbackFn = vi.mocked(shortcutDetector.registerShortcut).mock.calls[0][2];
      
      // Simulate triggering the shortcut with proper type
      const mockEvent: ShortcutEvent = { 
        shortcut: { key: 'A', modifiers: ['Ctrl' as Modifier] }, 
        event: {} as KeyboardEvent 
      };
      callbackFn(mockEvent);
      
      expect(callback).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('platform-specific mappings', () => {
    it('applies Windows key mappings when on Windows', async () => {
      vi.mocked(osDetectionService.getOSInfo).mockReturnValue({ os: 'windows', version: '10' });
      
      await keyboardService.initialize();
      
      // Windows specific mappings
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Windows', 'Meta');
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Win', 'Meta');
    });

    it('applies macOS key mappings when on macOS', async () => {
      vi.mocked(osDetectionService.getOSInfo).mockReturnValue({ os: 'macos', version: '11' });
      
      await keyboardService.initialize();
      
      // macOS specific mappings
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Command', 'Meta');
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Cmd', 'Meta');
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('⌘', 'Meta');
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Option', 'Alt');
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('⌥', 'Alt');
    });

    it('applies Linux key mappings when on Linux', async () => {
      vi.mocked(osDetectionService.getOSInfo).mockReturnValue({ os: 'linux', version: 'Ubuntu 20.04' });
      
      await keyboardService.initialize();
      
      // Linux specific mappings
      expect(shortcutDetector.addKeyMapping).toHaveBeenCalledWith('Super', 'Meta');
    });
  });

  describe('throttle and debounce configuration', () => {
    beforeEach(async () => {
      await keyboardService.initialize();
    });

    it('sets throttle time', () => {
      keyboardService.setThrottleTime(100);
      
      expect(shortcutDetector.setThrottleTime).toHaveBeenCalledWith(100);
    });

    it('sets debounce time', () => {
      keyboardService.setDebounceTime(200);
      
      expect(shortcutDetector.setDebounceTime).toHaveBeenCalledWith(200);
    });
  });

  describe('shortcut formatting', () => {
    beforeEach(async () => {
      await keyboardService.initialize();
    });

    it('formats shortcuts for OS display', () => {
      vi.mocked(osDetectionService.formatShortcutForOS).mockReturnValue('Ctrl + A');
      
      const result = keyboardService.formatShortcutForOS('Ctrl+A');
      
      expect(osDetectionService.formatShortcutForOS).toHaveBeenCalledWith('Ctrl+A');
      expect(result).toBe('Ctrl + A');
    });
  });

  describe('key state management', () => {
    beforeEach(async () => {
      await keyboardService.initialize();
    });

    it('checks if a key is pressed', () => {
      vi.mocked(shortcutDetector.isKeyPressed).mockReturnValue(true);
      
      const isPressed = keyboardService.isKeyPressed('A');
      
      expect(shortcutDetector.isKeyPressed).toHaveBeenCalledWith('A');
      expect(isPressed).toBe(true);
    });

    it('gets all pressed keys', () => {
      const mockPressedKeys = new Set(['A', 'Ctrl']);
      vi.mocked(shortcutDetector.getPressedKeys).mockReturnValue(mockPressedKeys);
      
      const pressedKeys = keyboardService.getPressedKeys();
      
      expect(shortcutDetector.getPressedKeys).toHaveBeenCalled();
      expect(pressedKeys).toBe(mockPressedKeys);
    });
  });
}); 
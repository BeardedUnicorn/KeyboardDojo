import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  getOSShortcut,
  normalizeKeyName,
  parseShortcut,
  formatShortcutForDisplay,
  checkKeysMatch,
  getModifierKeys,
  isModifierKey,
  getActiveModifiers,
  normalizeShortcut,
  isShortcutMatch,
  ShortcutDefinition,
  KeyCombo,
  KeyboardShortcut
} from '../keyboardUtils';
import { osDetectionService } from '../../services/osDetectionService';

// Mock OS detection service
vi.mock('../../services/osDetectionService', () => ({
  osDetectionService: {
    isMacOS: vi.fn(),
    isLinux: vi.fn(),
    isWindows: vi.fn()
  }
}));

describe('keyboardUtils', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe('getOSShortcut', () => {
    it('returns macOS shortcut when on macOS', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getOSShortcut(shortcut)).toBe('Command+C');
    });

    it('returns Linux shortcut when on Linux', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(true);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getOSShortcut(shortcut)).toBe('Ctrl+C');
    });

    it('returns Windows shortcut when on Windows', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getOSShortcut(shortcut)).toBe('Ctrl+C');
    });

    it('falls back to Windows shortcut when Linux shortcut is not defined', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(true);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        windows: 'Ctrl+C'
      };
      
      expect(getOSShortcut(shortcut)).toBe('Ctrl+C');
    });
  });

  describe('normalizeKeyName', () => {
    it('normalizes modifier keys', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      expect(normalizeKeyName('Control')).toBe('ctrl');
      expect(normalizeKeyName('Ctrl')).toBe('ctrl');
      expect(normalizeKeyName('Alt')).toBe('alt');
      expect(normalizeKeyName('Option')).toBe('alt');
      expect(normalizeKeyName('Shift')).toBe('shift');
      expect(normalizeKeyName('Meta')).toBe('win');
      expect(normalizeKeyName('Win')).toBe('win');
      expect(normalizeKeyName('Windows')).toBe('win');
    });

    it('normalizes Mac command key differently', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      
      expect(normalizeKeyName('Command')).toBe('cmd');
      expect(normalizeKeyName('Meta')).toBe('cmd');
    });

    it('normalizes special keys', () => {
      expect(normalizeKeyName('Escape')).toBe('esc');
      expect(normalizeKeyName('Esc')).toBe('esc');
      expect(normalizeKeyName(' ')).toBe('space');
      expect(normalizeKeyName('Enter')).toBe('enter');
      expect(normalizeKeyName('Return')).toBe('enter');
    });

    it('normalizes arrow keys', () => {
      expect(normalizeKeyName('ArrowUp')).toBe('up');
      expect(normalizeKeyName('Up')).toBe('up');
      expect(normalizeKeyName('ArrowDown')).toBe('down');
      expect(normalizeKeyName('Down')).toBe('down');
      expect(normalizeKeyName('ArrowLeft')).toBe('left');
      expect(normalizeKeyName('Left')).toBe('left');
      expect(normalizeKeyName('ArrowRight')).toBe('right');
      expect(normalizeKeyName('Right')).toBe('right');
    });

    it('returns lowercase for other keys', () => {
      expect(normalizeKeyName('a')).toBe('a');
      expect(normalizeKeyName('Z')).toBe('z');
      expect(normalizeKeyName('F1')).toBe('f1');
    });
  });

  describe('parseShortcut', () => {
    it('parses a shortcut with a single key', () => {
      const result = parseShortcut('A');
      expect(result).toEqual(['a']);
    });

    it('parses a shortcut with multiple modifiers', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const result = parseShortcut('Ctrl+Shift+A');
      expect(result).toEqual(['ctrl', 'shift', 'a']);
    });

    it('handles whitespace in the shortcut string', () => {
      const result = parseShortcut('Ctrl + A');
      expect(result).toEqual(['ctrl', 'a']);
    });

    it('handles case insensitivity', () => {
      const result = parseShortcut('ctrl+a');
      expect(result).toEqual(['ctrl', 'a']);
    });

    it('normalizes keys during parsing', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const result = parseShortcut('Control+Alt+Escape');
      expect(result).toEqual(['ctrl', 'alt', 'esc']);
    });
  });

  describe('formatShortcutForDisplay', () => {
    it('formats a simple shortcut', () => {
      const result = formatShortcutForDisplay('a');
      expect(result).toBe('A');
    });

    it('formats a shortcut with modifiers', () => {
      const result = formatShortcutForDisplay('ctrl+shift+a');
      expect(result).toBe('Ctrl + Shift + A');
    });

    it('handles whitespace and capitalization', () => {
      const result = formatShortcutForDisplay(' ctrl + a ');
      expect(result).toBe('Ctrl + A');
    });
  });

  describe('checkKeysMatch', () => {
    it('returns true when all expected keys are pressed', () => {
      const pressedKeys: KeyCombo = new Set(['ctrl', 'shift', 'a']);
      const expectedKeys = ['ctrl', 'shift', 'a'];
      
      expect(checkKeysMatch(pressedKeys, expectedKeys)).toBe(true);
    });

    it('returns false when some expected keys are not pressed', () => {
      const pressedKeys: KeyCombo = new Set(['ctrl', 'a']);
      const expectedKeys = ['ctrl', 'shift', 'a'];
      
      expect(checkKeysMatch(pressedKeys, expectedKeys)).toBe(false);
    });

    it('returns false when extra keys are pressed', () => {
      const pressedKeys: KeyCombo = new Set(['ctrl', 'shift', 'a', 'b']);
      const expectedKeys = ['ctrl', 'shift', 'a'];
      
      expect(checkKeysMatch(pressedKeys, expectedKeys)).toBe(false);
    });

    it('is case insensitive', () => {
      const pressedKeys: KeyCombo = new Set(['CTRL', 'SHIFT', 'A']);
      const expectedKeys = ['ctrl', 'shift', 'a'];
      
      expect(checkKeysMatch(pressedKeys, expectedKeys)).toBe(true);
    });
  });

  describe('getModifierKeys', () => {
    it('returns the list of modifier keys', () => {
      const modifiers = getModifierKeys();
      expect(modifiers).toEqual(['ctrl', 'alt', 'shift', 'meta', 'cmd', 'win']);
    });
  });

  describe('isModifierKey', () => {
    it('returns true for modifier keys', () => {
      expect(isModifierKey('Ctrl')).toBe(true);
      expect(isModifierKey('Alt')).toBe(true);
      expect(isModifierKey('Shift')).toBe(true);
      expect(isModifierKey('Meta')).toBe(true);
      expect(isModifierKey('Command')).toBe(true);
      expect(isModifierKey('Win')).toBe(true);
    });

    it('returns false for non-modifier keys', () => {
      expect(isModifierKey('A')).toBe(false);
      expect(isModifierKey('Enter')).toBe(false);
      expect(isModifierKey('Space')).toBe(false);
      expect(isModifierKey('F1')).toBe(false);
    });
  });

  describe('getActiveModifiers', () => {
    // Helper to create a keyboard event
    const createKeyboardEvent = (
      key: string,
      options: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean } = {}
    ): KeyboardEvent => {
      return {
        key,
        ctrlKey: options.ctrlKey || false,
        altKey: options.altKey || false,
        shiftKey: options.shiftKey || false,
        metaKey: options.metaKey || false,
      } as KeyboardEvent;
    };

    it('returns an empty array when no modifiers are pressed', () => {
      const event = createKeyboardEvent('a');
      expect(getActiveModifiers(event)).toEqual([]);
    });

    it('returns the correct modifiers when modifiers are pressed', () => {
      const event = createKeyboardEvent('a', {
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: false
      });
      
      expect(getActiveModifiers(event).sort()).toEqual(['alt', 'ctrl', 'shift'].sort());
    });

    it('returns cmd for meta key on macOS', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      
      const event = createKeyboardEvent('a', { metaKey: true });
      expect(getActiveModifiers(event)).toEqual(['cmd']);
    });

    it('returns win for meta key on Windows', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const event = createKeyboardEvent('a', { metaKey: true });
      expect(getActiveModifiers(event)).toEqual(['win']);
    });
  });

  describe('normalizeShortcut', () => {
    it('normalizes a string shortcut', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const result = normalizeShortcut('Ctrl+Shift+A');
      expect(result).toEqual({
        key: 'a',
        modifiers: ['ctrl', 'shift']
      });
    });

    it('returns the shortcut object unchanged if already a KeyboardShortcut', () => {
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl', 'shift']
      };
      
      const result = normalizeShortcut(shortcut);
      expect(result).toEqual(shortcut);
    });

    it('handles a shortcut with only modifiers', () => {
      const result = normalizeShortcut('Ctrl+Shift');
      expect(result).toEqual({
        key: '',
        modifiers: ['ctrl', 'shift']
      });
    });

    it('handles a shortcut with only a non-modifier key', () => {
      const result = normalizeShortcut('A');
      expect(result).toEqual({
        key: 'a',
        modifiers: []
      });
    });
  });

  describe('isShortcutMatch', () => {
    // Helper to create a keyboard event
    const createKeyboardEvent = (
      key: string,
      options: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean } = {}
    ): KeyboardEvent => {
      return {
        key,
        ctrlKey: options.ctrlKey || false,
        altKey: options.altKey || false,
        shiftKey: options.shiftKey || false,
        metaKey: options.metaKey || false,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as unknown as KeyboardEvent;
    };

    it('returns true when event matches shortcut', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl', 'shift']
      };
      
      const event = createKeyboardEvent('a', {
        ctrlKey: true,
        shiftKey: true
      });
      
      expect(isShortcutMatch(event, shortcut)).toBe(true);
    });

    it('returns false when key does not match', () => {
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl', 'shift']
      };
      
      const event = createKeyboardEvent('b', {
        ctrlKey: true,
        shiftKey: true
      });
      
      expect(isShortcutMatch(event, shortcut)).toBe(false);
    });

    it('returns false when modifiers do not match', () => {
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl', 'shift']
      };
      
      const event = createKeyboardEvent('a', {
        ctrlKey: true
      });
      
      expect(isShortcutMatch(event, shortcut)).toBe(false);
    });

    it('returns false when extra modifiers are pressed', () => {
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl']
      };
      
      const event = createKeyboardEvent('a', {
        ctrlKey: true,
        shiftKey: true
      });
      
      expect(isShortcutMatch(event, shortcut)).toBe(false);
    });

    it('normalizes keys for comparison', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      
      const shortcut: KeyboardShortcut = {
        key: 'a',
        modifiers: ['ctrl', 'shift']
      };
      
      const event = createKeyboardEvent('A', {
        ctrlKey: true,
        shiftKey: true
      });
      
      expect(isShortcutMatch(event, shortcut)).toBe(true);
    });
  });
}); 
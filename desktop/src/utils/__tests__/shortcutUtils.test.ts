import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  getOSType,
  getShortcutForCurrentOS,
  normalizeKeyName,
  parseShortcut,
  formatShortcutForDisplay,
  isShortcutMatch,
  getKeyDisplayName,
  ShortcutDefinition
} from '../shortcutUtils';
import { osDetectionService } from '../../services/osDetectionService';

// Mock OS detection service
vi.mock('../../services/osDetectionService', () => ({
  osDetectionService: {
    isMacOS: vi.fn(),
    isLinux: vi.fn(),
    isWindows: vi.fn()
  }
}));

describe('shortcutUtils', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe('getOSType', () => {
    it('returns "macOS" when on macOS', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(false);
      
      expect(getOSType()).toBe('macOS');
    });

    it('returns "Linux" when on Linux', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(true);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(false);
      
      expect(getOSType()).toBe('Linux');
    });

    it('returns "Windows" when on Windows', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(true);
      
      expect(getOSType()).toBe('Windows');
    });

    it('defaults to "Windows" when OS cannot be determined', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(false);
      
      expect(getOSType()).toBe('Windows');
    });
  });

  describe('getShortcutForCurrentOS', () => {
    it('returns macOS shortcut when on macOS', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(false);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getShortcutForCurrentOS(shortcut)).toBe('Command+C');
    });

    it('returns Linux shortcut when on Linux', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(true);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(false);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getShortcutForCurrentOS(shortcut)).toBe('Ctrl+C');
    });

    it('returns Windows shortcut when on Windows', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(false);
      vi.mocked(osDetectionService.isLinux).mockReturnValue(false);
      vi.mocked(osDetectionService.isWindows).mockReturnValue(true);
      
      const shortcut: ShortcutDefinition = {
        mac: 'Command+C',
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      expect(getShortcutForCurrentOS(shortcut)).toBe('Ctrl+C');
    });

    it('returns default OS shortcut when current OS shortcut is not defined', () => {
      vi.mocked(osDetectionService.isMacOS).mockReturnValue(true);
      
      const shortcut: ShortcutDefinition = {
        mac: '', // Empty but required property
        linux: 'Ctrl+C',
        windows: 'Ctrl+C'
      };
      
      // Should use mac as defined (empty string)
      expect(getShortcutForCurrentOS(shortcut)).toBe('');
    });
  });

  describe('normalizeKeyName', () => {
    it('normalizes modifier keys', () => {
      expect(normalizeKeyName('Control')).toBe('ctrl');
      expect(normalizeKeyName('ctrl')).toBe('ctrl');
      expect(normalizeKeyName('Alt')).toBe('alt');
      expect(normalizeKeyName('Option')).toBe('alt');
      expect(normalizeKeyName('Shift')).toBe('shift');
      
      // Test with isMac = true
      expect(normalizeKeyName('Command', true)).toBe('cmd');
      expect(normalizeKeyName('Meta', true)).toBe('cmd');
      
      // Test with isMac = false
      expect(normalizeKeyName('Command', false)).toBe('win');
      expect(normalizeKeyName('Meta', false)).toBe('win');
    });

    it('normalizes special keys', () => {
      expect(normalizeKeyName('Escape')).toBe('esc');
      expect(normalizeKeyName(' ')).toBe('space');
    });

    it('normalizes to lowercase for all other keys', () => {
      expect(normalizeKeyName('a')).toBe('a');
      expect(normalizeKeyName('Z')).toBe('z');
      expect(normalizeKeyName('Enter')).toBe('enter');
      expect(normalizeKeyName('ArrowUp')).toBe('arrowup');
    });
  });

  describe('parseShortcut', () => {
    it('parses a shortcut with a single key', () => {
      const result = parseShortcut('A');
      expect(result).toEqual(['a']);
    });

    it('parses a shortcut with multiple modifiers', () => {
      const result = parseShortcut('Ctrl+Shift+A');
      expect(result).toEqual(['ctrl', 'shift', 'a']);
    });

    it('normalizes keys when parsing', () => {
      const result = parseShortcut('Control+Alt+a');
      expect(result).toEqual(['ctrl', 'alt', 'a']);
    });

    it('handles special keys correctly', () => {
      const result = parseShortcut('Ctrl+Space');
      expect(result).toEqual(['ctrl', 'space']);
    });

    it('handles macOS command key', () => {
      // When isMac is true
      const result = parseShortcut('Command+S', true);
      expect(result).toEqual(['cmd', 's']);
      
      // When isMac is false
      const result2 = parseShortcut('Command+S', false);
      expect(result2).toEqual(['win', 's']);
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

    it('handles whitespace in input', () => {
      const result = formatShortcutForDisplay(' ctrl + a ');
      expect(result).toBe('Ctrl + A');
    });
  });

  describe('isShortcutMatch', () => {
    it('returns true when pressed keys match expected shortcut', () => {
      const pressedKeys = ['ctrl', 'shift', 'a'];
      const expectedShortcut = ['ctrl', 'shift', 'a'];
      
      expect(isShortcutMatch(pressedKeys, expectedShortcut)).toBe(true);
    });

    it('returns false when key does not match', () => {
      const pressedKeys = ['ctrl', 'shift', 'b'];
      const expectedShortcut = ['ctrl', 'shift', 'a'];
      
      expect(isShortcutMatch(pressedKeys, expectedShortcut)).toBe(false);
    });

    it('returns false when modifiers do not match', () => {
      const pressedKeys = ['ctrl', 'a'];
      const expectedShortcut = ['ctrl', 'shift', 'a'];
      
      expect(isShortcutMatch(pressedKeys, expectedShortcut)).toBe(false);
    });

    it('returns false when extra keys are pressed', () => {
      const pressedKeys = ['ctrl', 'shift', 'alt', 'a'];
      const expectedShortcut = ['ctrl', 'shift', 'a'];
      
      expect(isShortcutMatch(pressedKeys, expectedShortcut)).toBe(false);
    });

    it('is case-insensitive', () => {
      const pressedKeys = ['CTRL', 'SHIFT', 'A'];
      const expectedShortcut = ['ctrl', 'shift', 'a'];
      
      expect(isShortcutMatch(pressedKeys, expectedShortcut)).toBe(true);
    });
  });

  describe('getKeyDisplayName', () => {
    it('returns formatted names for modifier keys', () => {
      expect(getKeyDisplayName('ctrl')).toBe('Ctrl');
      expect(getKeyDisplayName('alt')).toBe('Alt');
      expect(getKeyDisplayName('shift')).toBe('Shift');
      expect(getKeyDisplayName('cmd')).toBe('⌘');
      expect(getKeyDisplayName('win')).toBe('Win');
    });

    it('returns formatted names for special keys', () => {
      expect(getKeyDisplayName('esc')).toBe('Esc');
      expect(getKeyDisplayName('enter')).toBe('Enter');
      expect(getKeyDisplayName('space')).toBe('Space');
      expect(getKeyDisplayName('tab')).toBe('Tab');
    });

    it('returns arrow symbols for arrow keys', () => {
      expect(getKeyDisplayName('arrowup')).toBe('↑');
      expect(getKeyDisplayName('arrowdown')).toBe('↓');
      expect(getKeyDisplayName('arrowleft')).toBe('←');
      expect(getKeyDisplayName('arrowright')).toBe('→');
    });

    it('capitalizes single letter keys', () => {
      expect(getKeyDisplayName('a')).toBe('A');
      expect(getKeyDisplayName('z')).toBe('Z');
    });

    it('returns other keys as is', () => {
      expect(getKeyDisplayName('f1')).toBe('f1');
      expect(getKeyDisplayName('home')).toBe('home');
    });
  });
}); 
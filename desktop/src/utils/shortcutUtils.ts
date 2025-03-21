/**
 * Shortcut Utilities
 * 
 * This file contains shared utilities for handling keyboard shortcuts
 * across different components in the application.
 */

import { osDetectionService } from '../services/osDetectionService';
import { 
  normalizeKey, 
  normalizeKeyName as baseNormalizeKeyName, 
  parseShortcut as baseParseShortcut,
  formatKeyCombination,
  isModifierKey,
} from './keyNormalization';

/**
 * Shortcut representation for different operating systems
 */
export interface ShortcutDefinition {
  windows: string;
  mac: string;
  linux?: string;
}

/**
 * Normalized key press representation
 */
export type KeyCombo = Set<string>;

/**
 * Determines the current OS type
 * @returns The current OS type (macOS, Linux, or Windows)
 */
export const getOSType = (): 'macOS' | 'Linux' | 'Windows' => {
  const isMac = osDetectionService.isMacOS();
  const isLinux = osDetectionService.isLinux();
  return isMac ? 'macOS' : isLinux ? 'Linux' : 'Windows';
};

/**
 * Gets the appropriate shortcut string for the current OS
 * @param shortcut The shortcut definition for different OSes
 * @returns The shortcut string for the current OS
 */
export const getShortcutForCurrentOS = (shortcut: ShortcutDefinition): string => {
  const isMac = osDetectionService.isMacOS();
  const isLinux = osDetectionService.isLinux();
  
  return isMac
    ? shortcut.mac
    : isLinux && shortcut.linux
      ? shortcut.linux
      : shortcut.windows;
};

/**
 * Normalizes a key name for consistent comparison (using unified implementation)
 * @param key The key name to normalize
 * @param isMac Whether the current OS is macOS
 * @returns The normalized key name
 */
export const normalizeKeyName = (key: string, isMac = osDetectionService.isMacOS()): string => {
  // Use a different format option for arrow keys to preserve the 'arrow' prefix
  if (key.toLowerCase().startsWith('arrow')) {
    return key.toLowerCase();
  }
  
  // Special handling for command/meta keys based on OS
  const lowerKey = key.toLowerCase();
  if (['meta', 'command', 'cmd', '⌘', 'super', 'win', 'windows'].includes(lowerKey)) {
    return isMac ? 'cmd' : 'win';
  }
  
  // For all other keys, use the standard normalization
  return normalizeKey(key, { isMac, lowercase: true });
};

/**
 * Parses a shortcut string into individual keys (using unified implementation)
 * @param shortcutStr The shortcut string (e.g., "Ctrl+C")
 * @param isMac Whether the current OS is macOS
 * @returns Array of normalized key names
 */
export const parseShortcut = (shortcutStr: string, isMac: boolean = osDetectionService.isMacOS()): string[] => {
  return baseParseShortcut(shortcutStr, { isMac });
};

/**
 * Formats a shortcut string for display
 * @param shortcutStr The shortcut string (e.g., "Ctrl+C")
 * @returns Formatted shortcut string (e.g., "Ctrl + C")
 */
export const formatShortcutForDisplay = (shortcutStr: string): string => {
  return shortcutStr
    .split('+')
    .map((key) => key.trim())
    .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
    .join(' + ');
};

/**
 * Checks if a key combo matches the expected shortcut
 * @param pressedKeys The currently pressed keys
 * @param expectedShortcut The expected shortcut keys
 * @returns Whether the pressed keys match the expected shortcut
 */
export const isShortcutMatch = (pressedKeys: string[], expectedShortcut: string[]): boolean => {
  // Convert to lowercase for case-insensitive comparison
  const normalizedPressed = pressedKeys.map((k) => k.toLowerCase());
  const normalizedExpected = expectedShortcut.map((k) => k.toLowerCase());
  
  // Check if all expected keys are pressed
  const allExpectedKeysPressed = normalizedExpected.every((expectedKey) =>
    normalizedPressed.some((pressedKey) => pressedKey === expectedKey),
  );
  
  // Check if only the expected keys are pressed (no extra keys)
  const onlyExpectedKeysPressed = normalizedPressed.length === normalizedExpected.length;
  
  return allExpectedKeysPressed && onlyExpectedKeysPressed;
};

/**
 * Gets a display name for a key
 * @param key The key name
 * @returns A user-friendly display name for the key
 */
export const getKeyDisplayName = (key: string): string => {
  switch (key.toLowerCase()) {
    case 'ctrl':
      return 'Ctrl';
    case 'alt':
      return 'Alt';
    case 'shift':
      return 'Shift';
    case 'cmd':
      return '⌘';
    case 'win':
      return 'Win';
    case 'esc':
      return 'Esc';
    case 'enter':
      return 'Enter';
    case 'space':
      return 'Space';
    case 'tab':
      return 'Tab';
    case 'backspace':
      return 'Backspace';
    case 'delete':
      return 'Delete';
    case 'arrowup':
      return '↑';
    case 'arrowdown':
      return '↓';
    case 'arrowleft':
      return '←';
    case 'arrowright':
      return '→';
    default:
      // Capitalize single letters
      if (key.length === 1) {
        return key.toUpperCase();
      }
      // Return as is for other keys
      return key;
  }
}; 

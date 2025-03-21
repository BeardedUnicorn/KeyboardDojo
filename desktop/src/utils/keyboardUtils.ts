/**
 * Keyboard Utilities
 * 
 * This module provides utility functions for handling keyboard shortcuts,
 * normalizing key names, and detecting key combinations.
 */

import { osDetectionService } from '../services/osDetectionService';
import { 
  normalizeKey, 
  normalizeKeyName as baseNormalizeKeyName, 
  parseShortcut as baseParseShortcut,
  isModifierKey as baseIsModifierKey,
} from './keyNormalization';

/**
 * Represents a keyboard shortcut with OS-specific variations
 */
export interface ShortcutDefinition {
  windows: string;
  mac: string;
  linux?: string;
}

/**
 * Represents a set of pressed keys
 */
export type KeyCombo = Set<string>;

/**
 * Represents a keyboard shortcut
 */
export interface KeyboardShortcut {
  key: string;
  modifiers: string[];
}

/**
 * Handler function for keyboard shortcuts
 */
export type KeyboardShortcutHandler = (event: KeyboardEvent) => void;

/**
 * Get the appropriate shortcut string for the current OS
 * 
 * @param shortcut The shortcut definition with OS-specific variations
 * @returns The shortcut string for the current OS
 */
export function getOSShortcut(shortcut: ShortcutDefinition): string {
  const isMac = osDetectionService.isMacOS();
  const isLinux = osDetectionService.isLinux();
  
  return isMac 
    ? shortcut.mac 
    : isLinux && shortcut.linux 
      ? shortcut.linux 
      : shortcut.windows;
}

/**
 * Normalize a key name to a standard format (using unified implementation)
 * 
 * @param key The key name to normalize
 * @returns The normalized key name
 */
export function normalizeKeyName(key: string): string {
  return normalizeKey(key, { lowercase: true });
}

/**
 * Parse a shortcut string into an array of individual keys (using unified implementation)
 * 
 * @param shortcutStr The shortcut string (e.g., "Ctrl+Shift+P")
 * @returns Array of normalized key names
 */
export function parseShortcut(shortcutStr: string): string[] {
  return baseParseShortcut(shortcutStr);
}

/**
 * Format a shortcut string for display
 * 
 * @param shortcutStr The shortcut string to format
 * @returns Formatted shortcut string
 */
export function formatShortcutForDisplay(shortcutStr: string): string {
  return shortcutStr
    .split('+')
    .map((key) => key.trim())
    .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
    .join(' + ');
}

/**
 * Check if all expected keys are pressed in the current key combo
 * 
 * @param pressedKeys Set of currently pressed keys
 * @param expectedKeys Array of expected keys
 * @returns True if all expected keys are pressed
 */
export function checkKeysMatch(pressedKeys: KeyCombo, expectedKeys: string[]): boolean {
  const currentKeys = Array.from(pressedKeys);
  
  // Check if all expected keys are pressed (case insensitive)
  const expectedLower = expectedKeys.map((k) => k.toLowerCase());
  const allExpectedKeysPressed = expectedLower.every((expectedKey) => 
    currentKeys.some((pressedKey) => pressedKey.toLowerCase() === expectedKey),
  );
  
  // Check if only the expected keys are pressed
  const onlyExpectedKeysPressed = currentKeys.length === expectedLower.length;
  
  return allExpectedKeysPressed && onlyExpectedKeysPressed;
}

/**
 * Get a list of modifier keys (Ctrl, Alt, Shift, Meta)
 * 
 * @returns Array of modifier key names
 */
export function getModifierKeys(): string[] {
  return ['ctrl', 'alt', 'shift', 'meta', 'cmd', 'win'];
}

/**
 * Check if a key is a modifier key (using unified implementation)
 * 
 * @param key The key to check
 * @returns Whether the key is a modifier key
 */
export function isModifierKey(key: string): boolean {
  return baseIsModifierKey(key);
}

/**
 * Get active modifier keys from a keyboard event
 * 
 * @param event The keyboard event
 * @returns Array of active modifier keys
 */
export function getActiveModifiers(event: KeyboardEvent): string[] {
  const modifiers: string[] = [];
  
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey) modifiers.push('shift');
  if (event.metaKey) modifiers.push(osDetectionService.isMacOS() ? 'cmd' : 'win');
  
  return modifiers;
}

/**
 * Normalize a shortcut string or object into a KeyboardShortcut object
 * 
 * @param shortcut The shortcut to normalize
 * @returns Normalized KeyboardShortcut object
 */
export function normalizeShortcut(shortcut: string | KeyboardShortcut): KeyboardShortcut {
  if (typeof shortcut === 'string') {
    const keys = parseShortcut(shortcut);
    const modifiers = keys.filter(isModifierKey);
    const mainKey = keys.find((key) => !isModifierKey(key)) || '';
    
    return {
      key: mainKey,
      modifiers,
    };
  }
  
  return shortcut;
}

/**
 * Check if a keyboard event matches a shortcut
 * 
 * @param event The keyboard event
 * @param shortcut The shortcut to check against
 * @returns True if the event matches the shortcut
 */
export function isShortcutMatch(
  event: KeyboardEvent, 
  shortcut: KeyboardShortcut,
): boolean {
  const { key, modifiers } = shortcut;
  const normalizedKey = normalizeKeyName(event.key);
  const activeModifiers = getActiveModifiers(event);
  
  // Check if the main key matches
  const keyMatches = normalizedKey === normalizeKeyName(key);
  
  // Check if all required modifiers are active
  const allModifiersActive = modifiers.every((mod) => 
    activeModifiers.includes(normalizeKeyName(mod)),
  );
  
  // Check if only the required modifiers are active
  const onlyRequiredModifiersActive = activeModifiers.length === modifiers.length;
  
  return keyMatches && allModifiersActive && onlyRequiredModifiersActive;
} 

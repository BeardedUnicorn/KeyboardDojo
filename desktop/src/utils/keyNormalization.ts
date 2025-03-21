import { osDetectionService } from '@/services';

/**
 * KeyboardKey normalization options
 */
export interface KeyNormalizationOptions {
  /** Whether to use macOS specific key names (cmd vs win) */
  isMac?: boolean;
  /** Output format - 'display' for user-facing text, 'internal' for consistent internal use */
  format?: 'display' | 'internal';
  /** Whether to use lowercase output (for internal comparison) */
  lowercase?: boolean;
}

/**
 * Normalize a key to a standard format
 * 
 * This unified function replaces multiple different key normalization functions
 * that were previously scattered across the codebase, ensuring consistent key handling.
 * 
 * @param key The key to normalize
 * @param options Normalization options
 * @returns Normalized key name
 */
export function normalizeKey(key: string, options: KeyNormalizationOptions = {}): string {
  const {
    isMac = osDetectionService.isMacOS(),
    format = 'internal',
    lowercase = format === 'internal',
  } = options;

  // Convert key to lowercase for initial normalization
  const lowerKey = key.toLowerCase();
  
  // Normalize key names based on format
  let normalizedKey = lowerKey;
  
  // Normalize control/ctrl
  if (lowerKey === 'control' || lowerKey === 'ctrl') {
    normalizedKey = format === 'display' ? 'Ctrl' : 'ctrl';
  }
  // Normalize alt/option
  else if (lowerKey === 'alt' || lowerKey === 'option' || lowerKey === '⌥') {
    normalizedKey = format === 'display' ? 'Alt' : 'alt';
  }
  // Normalize shift
  else if (lowerKey === 'shift' || lowerKey === '⇧') {
    normalizedKey = format === 'display' ? 'Shift' : 'shift';
  }
  // Normalize meta/command/win
  else if (['meta', 'command', 'cmd', '⌘', 'super', 'win', 'windows'].includes(lowerKey)) {
    if (format === 'display') {
      normalizedKey = isMac ? 'Cmd' : 'Win';
    } else {
      normalizedKey = isMac ? 'cmd' : 'win';
    }
  }
  // Normalize escape
  else if (lowerKey === 'escape' || lowerKey === 'esc') {
    normalizedKey = format === 'display' ? 'Esc' : 'esc';
  }
  // Normalize enter/return
  else if (lowerKey === 'enter' || lowerKey === 'return') {
    normalizedKey = format === 'display' ? 'Enter' : 'enter';
  }
  // Normalize space
  else if (lowerKey === 'space' || lowerKey === ' ') {
    normalizedKey = format === 'display' ? 'Space' : 'space';
  }
  // Normalize arrow keys
  else if (lowerKey === 'arrowup' || lowerKey === 'up') {
    normalizedKey = format === 'display' ? 'Up' : 'up';
  }
  else if (lowerKey === 'arrowdown' || lowerKey === 'down') {
    normalizedKey = format === 'display' ? 'Down' : 'down';
  }
  else if (lowerKey === 'arrowleft' || lowerKey === 'left') {
    normalizedKey = format === 'display' ? 'Left' : 'left';
  }
  else if (lowerKey === 'arrowright' || lowerKey === 'right') {
    normalizedKey = format === 'display' ? 'Right' : 'right';
  }
  // Single characters for display format
  else if (format === 'display' && lowerKey.length === 1) {
    normalizedKey = lowerKey.toUpperCase();
  }
  
  // Apply case transformation if needed
  return lowercase ? normalizedKey.toLowerCase() : normalizedKey;
}

/**
 * Check if a key is a modifier key
 * 
 * @param key The key to check
 * @returns Whether the key is a modifier key
 */
export function isModifierKey(key: string): boolean {
  const normalized = normalizeKey(key, { lowercase: true });
  return ['ctrl', 'alt', 'shift', 'cmd', 'win'].includes(normalized);
}

/**
 * Parse a shortcut string into an array of individual keys
 * 
 * @param shortcutStr The shortcut string (e.g., "Ctrl+Shift+P")
 * @param options Normalization options
 * @returns Array of normalized key names
 */
export function parseShortcut(shortcutStr: string, options: KeyNormalizationOptions = {}): string[] {
  // Normalize the shortcut string first
  const normalizedShortcut = shortcutStr
    .replace(/\s+/g, '') // Remove all whitespace
    .toLowerCase(); // Convert to lowercase for case-insensitive comparison
  
  // Split by '+' and normalize each key
  return normalizedShortcut.split('+').map((key) => normalizeKey(key, options));
}

/**
 * Format a key combination for display
 * 
 * @param keys Array of keys to format
 * @param options Formatting options
 * @returns Formatted key combination string
 */
export function formatKeyCombination(keys: string[], options: KeyNormalizationOptions = {}): string {
  const displayOptions = { ...options, format: 'display' as const };
  return keys.map((key) => normalizeKey(key, displayOptions)).join('+');
}

/**
 * Legacy function to maintain backward compatibility with old code
 * @deprecated Use normalizeKey instead
 */
export function normalizeKeyName(key: string, isMac: boolean = osDetectionService.isMacOS()): string {
  return normalizeKey(key, { isMac, lowercase: true });
} 

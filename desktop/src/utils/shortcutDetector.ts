/**
 * Shortcut Detector Utility
 *
 * This utility provides functionality for detecting and handling keyboard shortcuts,
 * including multi-key combinations (e.g., Ctrl+Shift+P).
 */

import { loggerService } from '@/services/loggerService';
import { normalizeKey as baseNormalizeKey, isModifierKey } from './keyNormalization';

// Types for shortcut handling
export type Modifier = 'Ctrl' | 'Alt' | 'Shift' | 'Meta';
export type KeyState = 'down' | 'up';

export interface ShortcutKey {
  key: string;
  modifiers: Modifier[];
}

export interface ShortcutEvent {
  shortcut: ShortcutKey;
  event: KeyboardEvent;
}

export type ShortcutCallback = (event: ShortcutEvent) => void;

export interface RegisteredShortcut {
  id: string;
  shortcut: ShortcutKey;
  callback: ShortcutCallback;
}

// Custom key mapping interface
export interface KeyMapping {
  from: string;
  to: string;
}

/**
 * Normalize a key name 
 * @param key Key name to normalize
 * @returns Normalized key name
 */
export const normalizeKey = (key: string): string => {
  // This function translates keys to the format expected by the shortcutDetector tests
  const lowercaseKey = key.toLowerCase();
  
  // Handle modifier keys
  if (lowercaseKey === 'control' || lowercaseKey === 'ctrl') return 'Ctrl';
  if (lowercaseKey === 'alt' || lowercaseKey === 'option' || lowercaseKey === '⌥') return 'Alt';
  if (lowercaseKey === 'shift' || lowercaseKey === '⇧') return 'Shift';
  if (['meta', 'command', 'cmd', '⌘', 'super', 'win', 'windows'].includes(lowercaseKey)) return 'Meta';
  
  // Handle special keys
  if (lowercaseKey === 'return') return 'Enter';
  if (lowercaseKey === ' ' || lowercaseKey === 'space') return 'Space';
  
  // Handle arrow keys
  if (lowercaseKey === 'up') return 'ArrowUp';
  if (lowercaseKey === 'down') return 'ArrowDown';
  if (lowercaseKey === 'left') return 'ArrowLeft';
  if (lowercaseKey === 'right') return 'ArrowRight';
  
  // Handle single letter keys - capitalize
  if (lowercaseKey.length === 1 && lowercaseKey >= 'a' && lowercaseKey <= 'z') {
    return lowercaseKey.toUpperCase();
  }
  
  // Return other keys as is
  return key;
};

/**
 * Parse a shortcut string into a ShortcutKey object
 * @param shortcutStr Shortcut string (e.g., "Ctrl+Shift+P")
 * @returns ShortcutKey object
 */
export const parseShortcut = (shortcutStr: string): ShortcutKey => {
  const parts = shortcutStr.split('+');
  const key = parts.pop() || '';
  const modifiers = parts as Modifier[];

  return { key, modifiers };
};

/**
 * Format a ShortcutKey object into a string
 * @param shortcut ShortcutKey object
 * @returns Formatted shortcut string
 */
export const formatShortcut = (shortcut: ShortcutKey): string => {
  return [...shortcut.modifiers, shortcut.key].join('+');
};

/**
 * Check if a key is a modifier key
 * @param key The key to check
 * @returns Whether the key is a modifier
 */
export const isModifier = (key: string): boolean => {
  return isModifierKey(key);
};

/**
 * Get active modifiers from a keyboard event
 * @param event Keyboard event
 * @returns Array of active modifiers
 */
export const getActiveModifiers = (event: KeyboardEvent): Modifier[] => {
  const modifiers: Modifier[] = [];

  if (event.ctrlKey) modifiers.push('Ctrl');
  if (event.altKey) modifiers.push('Alt');
  if (event.shiftKey) modifiers.push('Shift');
  if (event.metaKey) modifiers.push('Meta');

  return modifiers;
};

/**
 * Check if a keyboard event matches a shortcut
 * @param event Keyboard event
 * @param shortcut Shortcut to match
 * @returns Whether the event matches the shortcut
 */
export const matchesShortcut = (event: KeyboardEvent, shortcut: ShortcutKey): boolean => {
  // Get active modifiers
  const activeModifiers = getActiveModifiers(event);

  // Check if all required modifiers are active
  const allModifiersActive = shortcut.modifiers.every((mod) => activeModifiers.includes(mod));

  // Check if no extra modifiers are active
  const noExtraModifiers = activeModifiers.every((mod) => shortcut.modifiers.includes(mod));

  // Normalize the key from event
  const normalizedEventKey = normalizeKey(event.key);
  // Normalize the target key from shortcut
  const normalizedShortcutKey = normalizeKey(shortcut.key);

  // Check if the key matches (either direct match or normalized match)
  const keyMatches = normalizedEventKey === normalizedShortcutKey ||
                    event.key === shortcut.key;

  return allModifiersActive && noExtraModifiers && keyMatches;
};

/**
 * Debounce a function
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
};

/**
 * Throttle a function
 * @param func The function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      func(...args);
      lastCall = now;
    }
  };
};

export class ShortcutDetector {
  private shortcuts: Map<string, RegisteredShortcut> = new Map();
  private activeKeys: Set<string> = new Set();
  private isInitialized: boolean = false;
  private keyMappings: KeyMapping[] = [];
  private throttleTime: number = 0;
  private debounceTime: number = 0;
  private lastKeyTime: number = 0;
  private logger = {
    debug: (message: string, context?: any) => 
      loggerService.debug(message, { ...context, component: 'ShortcutDetector' }),
    info: (message: string, context?: any) => 
      loggerService.info(message, { ...context, component: 'ShortcutDetector' }),
    warn: (message: string, context?: any) => 
      loggerService.warn(message, { ...context, component: 'ShortcutDetector' }),
    error: (message: string, error?: Error | unknown, context?: any) => 
      loggerService.error(message, error, { ...context, component: 'ShortcutDetector' }),
  };

  /**
   * Initialize the shortcut detector
   * This sets up event listeners for keyboard events
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Add event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);

    this.isInitialized = true;
    this.logger.debug('Shortcut detector initialized');
  }

  /**
   * Clean up the shortcut detector
   * This removes event listeners
   */
  cleanup(): void {
    if (!this.isInitialized) {
      return;
    }

    // Remove event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);

    this.isInitialized = false;
    this.logger.debug('Shortcut detector cleaned up');
  }

  /**
   * Register a shortcut
   * @param id Shortcut ID
   * @param shortcutStr Shortcut string (e.g., "Ctrl+Shift+P")
   * @param callback Callback function
   * @returns Registered shortcut
   */
  registerShortcut(id: string, shortcutStr: string, callback: ShortcutCallback): RegisteredShortcut {
    const shortcut = parseShortcut(shortcutStr);

    const registeredShortcut: RegisteredShortcut = {
      id,
      shortcut,
      callback,
    };

    this.shortcuts.set(id, registeredShortcut);
    this.logger.debug(`Registered shortcut: ${formatShortcut(shortcut)} (${id})`);

    return registeredShortcut;
  }

  /**
   * Unregister a shortcut
   * @param id Shortcut ID
   * @returns Whether the shortcut was unregistered
   */
  unregisterShortcut(id: string): boolean {
    const shortcut = this.shortcuts.get(id);

    if (shortcut) {
      this.shortcuts.delete(id);
      this.logger.debug(`Unregistered shortcut: ${formatShortcut(shortcut.shortcut)} (${id})`);
      return true;
    }

    return false;
  }

  /**
   * Get all registered shortcuts
   * @returns Array of registered shortcuts
   */
  getShortcuts(): RegisteredShortcut[] {
    return [...this.shortcuts.values()];
  }

  /**
   * Set the throttle time for keyboard events
   * @param time Throttle time in milliseconds
   */
  setThrottleTime(time: number): void {
    this.throttleTime = time;
    this.logger.debug(`Set throttle time to ${time}ms`);

    // Re-create the throttled handler
    this.handleKeyDown = throttle(this.handleKeyDownImpl, this.throttleTime);
  }

  /**
   * Set the debounce time for keyboard events
   * @param time Debounce time in milliseconds
   */
  setDebounceTime(time: number): void {
    this.debounceTime = time;
    this.logger.debug(`Set debounce time to ${time}ms`);
  }

  /**
   * Add a custom key mapping
   * @param from Key to map from
   * @param to Key to map to
   */
  addKeyMapping(from: string, to: string): void {
    this.keyMappings.push({ from, to });
    this.logger.debug(`Added key mapping: ${from} -> ${to}`);
  }

  /**
   * Remove a custom key mapping
   * @param from Key to remove mapping for
   * @returns Whether the mapping was removed
   */
  removeKeyMapping(from: string): boolean {
    const index = this.keyMappings.findIndex((mapping) => mapping.from === from);

    if (index !== -1) {
      const mapping = this.keyMappings[index];
      this.keyMappings.splice(index, 1);
      this.logger.debug(`Removed key mapping: ${mapping.from} -> ${mapping.to}`);
      return true;
    }

    return false;
  }

  /**
   * Clear all custom key mappings
   */
  clearKeyMappings(): void {
    this.keyMappings = [];
    this.logger.debug('Cleared all key mappings');
  }

  /**
   * Apply key mappings to a key
   * @param key Key to map
   * @returns Mapped key
   */
  private applyKeyMappings(key: string): string {
    const mapping = this.keyMappings.find((m) => m.from === key);
    return mapping ? mapping.to : key;
  }

  /**
   * Handle key down event
   */
  private handleKeyDownImpl = (event: KeyboardEvent): void => {
    // Skip if event is already processed
    if (event.defaultPrevented) {
      return;
    }

    // Apply key mappings
    const rawKey = event.key;
    const mappedKey = this.applyKeyMappings(rawKey);
    const normalizedKey = normalizeKey(mappedKey);

    // Add to active keys
    this.activeKeys.add(normalizedKey);

    // Check if this event matches any registered shortcuts
    for (const shortcut of this.shortcuts.values()) {
      if (matchesShortcut(event, shortcut.shortcut)) {
        this.logger.debug(
          `Shortcut detected: ${formatShortcut(shortcut.shortcut)} (${shortcut.id})`,
        );

        // Invoke callback with the shortcut event
        shortcut.callback({
          shortcut: shortcut.shortcut,
          event,
        });

        // Prevent default action for the event
        event.preventDefault();
        break;
      }
    }
  };

  /**
   * Handle key down event (throttled)
   */
  private handleKeyDown = throttle(this.handleKeyDownImpl, this.throttleTime);

  /**
   * Handle key up event
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    // Apply key mappings
    const rawKey = event.key;
    const mappedKey = this.applyKeyMappings(rawKey);
    const normalizedKey = normalizeKey(mappedKey);

    // Remove from active keys
    this.activeKeys.delete(normalizedKey);
  };

  /**
   * Handle window blur event - clear active keys
   */
  private handleBlur = (): void => {
    this.activeKeys.clear();
    this.logger.debug('Window blur detected, cleared active keys');
  };

  /**
   * Check if a key is currently pressed
   * @param key The key to check
   * @returns Whether the key is pressed
   */
  isKeyPressed(key: string): boolean {
    const normalizedKey = normalizeKey(key);
    return this.activeKeys.has(normalizedKey);
  }

  /**
   * Get all currently pressed keys
   * @returns Set of pressed keys
   */
  getPressedKeys(): Set<string> {
    return new Set(this.activeKeys);
  }

  /**
   * Create a debounced callback
   * @param callback The callback to debounce
   * @returns Debounced callback
   */
  debounceCallback(callback: ShortcutCallback): ShortcutCallback {
    return debounce(callback, this.debounceTime);
  }

  /**
   * Create a throttled callback
   * @param callback The callback to throttle
   * @returns Throttled callback
   */
  throttleCallback(callback: ShortcutCallback): ShortcutCallback {
    return throttle(callback, this.throttleTime);
  }
}

// Export a singleton instance
export const shortcutDetector = new ShortcutDetector();

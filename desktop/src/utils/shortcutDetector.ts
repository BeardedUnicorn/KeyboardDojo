/**
 * Shortcut Detector Utility
 * 
 * This utility provides functionality for detecting and handling keyboard shortcuts,
 * including multi-key combinations (e.g., Ctrl+Shift+P).
 */

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
 * Normalize a key to a standard format
 * @param key The key to normalize
 * @returns Normalized key
 */
export const normalizeKey = (key: string): string => {
  // Normalize key names
  switch (key.toLowerCase()) {
    case 'control':
    case 'ctrl':
      return 'Ctrl';
    case 'alt':
    case 'option':
    case '⌥':
      return 'Alt';
    case 'shift':
    case '⇧':
      return 'Shift';
    case 'meta':
    case 'command':
    case 'cmd':
    case '⌘':
    case 'super':
    case 'win':
    case 'windows':
      return 'Meta';
    case 'escape':
      return 'Escape';
    case 'return':
    case 'enter':
      return 'Enter';
    case 'space':
    case ' ':
      return 'Space';
    case 'arrowup':
    case 'up':
      return 'ArrowUp';
    case 'arrowdown':
    case 'down':
      return 'ArrowDown';
    case 'arrowleft':
    case 'left':
      return 'ArrowLeft';
    case 'arrowright':
    case 'right':
      return 'ArrowRight';
    default:
      // Capitalize single letters
      if (key.length === 1) {
        return key.toUpperCase();
      }
      return key;
  }
};

/**
 * Check if a key is a modifier key
 * @param key The key to check
 * @returns Whether the key is a modifier
 */
export const isModifier = (key: string): boolean => {
  const normalizedKey = normalizeKey(key);
  return ['Ctrl', 'Alt', 'Shift', 'Meta'].includes(normalizedKey);
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
  const allModifiersActive = shortcut.modifiers.every(mod => activeModifiers.includes(mod));
  
  // Check if no extra modifiers are active
  const noExtraModifiers = activeModifiers.every(mod => shortcut.modifiers.includes(mod));
  
  // Normalize the key
  const normalizedKey = normalizeKey(event.key);
  
  // Check if the key matches
  const keyMatches = normalizedKey === shortcut.key;
  
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
  wait: number
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
  limit: number
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
  private shortcuts: RegisteredShortcut[] = [];
  private activeKeys: Set<string> = new Set();
  private isInitialized: boolean = false;
  private keyMappings: KeyMapping[] = [];
  private throttleTime: number = 100; // Default throttle time in ms
  private debounceTime: number = 300; // Default debounce time in ms
  
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
    console.log('Shortcut detector initialized');
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
    console.log('Shortcut detector cleaned up');
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
      callback
    };
    
    this.shortcuts.push(registeredShortcut);
    console.log(`Registered shortcut: ${formatShortcut(shortcut)} (${id})`);
    
    return registeredShortcut;
  }
  
  /**
   * Unregister a shortcut
   * @param id Shortcut ID
   * @returns Whether the shortcut was unregistered
   */
  unregisterShortcut(id: string): boolean {
    const index = this.shortcuts.findIndex(s => s.id === id);
    
    if (index !== -1) {
      const shortcut = this.shortcuts[index];
      this.shortcuts.splice(index, 1);
      console.log(`Unregistered shortcut: ${formatShortcut(shortcut.shortcut)} (${id})`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all registered shortcuts
   * @returns Array of registered shortcuts
   */
  getShortcuts(): RegisteredShortcut[] {
    return [...this.shortcuts];
  }
  
  /**
   * Set the throttle time for keyboard events
   * @param time Throttle time in milliseconds
   */
  setThrottleTime(time: number): void {
    this.throttleTime = time;
    console.log(`Set throttle time to ${time}ms`);
    
    // Re-create the throttled handler
    this.handleKeyDown = throttle(this.handleKeyDownImpl, this.throttleTime);
  }
  
  /**
   * Set the debounce time for keyboard events
   * @param time Debounce time in milliseconds
   */
  setDebounceTime(time: number): void {
    this.debounceTime = time;
    console.log(`Set debounce time to ${time}ms`);
  }
  
  /**
   * Add a custom key mapping
   * @param from Key to map from
   * @param to Key to map to
   */
  addKeyMapping(from: string, to: string): void {
    this.keyMappings.push({ from, to });
    console.log(`Added key mapping: ${from} -> ${to}`);
  }
  
  /**
   * Remove a custom key mapping
   * @param from Key to remove mapping for
   * @returns Whether the mapping was removed
   */
  removeKeyMapping(from: string): boolean {
    const index = this.keyMappings.findIndex(m => m.from === from);
    
    if (index !== -1) {
      const mapping = this.keyMappings[index];
      this.keyMappings.splice(index, 1);
      console.log(`Removed key mapping: ${mapping.from} -> ${mapping.to}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Clear all custom key mappings
   */
  clearKeyMappings(): void {
    this.keyMappings = [];
    console.log('Cleared all key mappings');
  }
  
  /**
   * Apply key mappings to a key
   * @param key Key to map
   * @returns Mapped key
   */
  private applyKeyMappings(key: string): string {
    const mapping = this.keyMappings.find(m => m.from === key);
    return mapping ? mapping.to : key;
  }
  
  /**
   * Handle key down event (throttled implementation)
   * @param event Keyboard event
   */
  private handleKeyDownImpl = (event: KeyboardEvent): void => {
    // Apply key mappings
    const mappedKey = this.applyKeyMappings(normalizeKey(event.key));
    
    // Add to active keys
    this.activeKeys.add(mappedKey);
    
    // Check for matching shortcuts
    for (const shortcut of this.shortcuts) {
      if (matchesShortcut(event, shortcut.shortcut)) {
        // Create shortcut event
        const shortcutEvent: ShortcutEvent = {
          shortcut: shortcut.shortcut,
          event
        };
        
        // Call the callback
        shortcut.callback(shortcutEvent);
        
        // Prevent default if it's a shortcut
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };
  
  /**
   * Handle key down event (throttled)
   */
  private handleKeyDown = throttle(this.handleKeyDownImpl, this.throttleTime);
  
  /**
   * Handle key up event
   * @param event Keyboard event
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    // Apply key mappings
    const mappedKey = this.applyKeyMappings(normalizeKey(event.key));
    
    // Remove from active keys
    this.activeKeys.delete(mappedKey);
  };
  
  /**
   * Handle blur event
   * This clears all active keys when the window loses focus
   */
  private handleBlur = (): void => {
    this.activeKeys.clear();
  };
  
  /**
   * Check if a key is currently pressed
   * @param key The key to check
   * @returns Whether the key is pressed
   */
  isKeyPressed(key: string): boolean {
    return this.activeKeys.has(normalizeKey(key));
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
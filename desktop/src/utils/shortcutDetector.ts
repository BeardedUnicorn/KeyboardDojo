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
 * Normalize key names for consistent comparison
 * @param key Key name
 * @returns Normalized key name
 */
export const normalizeKey = (key: string): string => {
  // Map special keys to consistent names
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'Control': 'Ctrl',
    'Command': 'Meta',
    'Windows': 'Meta',
    'OS': 'Meta',
    'Escape': 'Esc',
    'Delete': 'Del',
    'Return': 'Enter',
    'ArrowUp': 'Up',
    'ArrowDown': 'Down',
    'ArrowLeft': 'Left',
    'ArrowRight': 'Right',
  };
  
  return keyMap[key] || key;
};

/**
 * Check if a key is a modifier key
 * @param key Key name
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
 * @param shortcut Shortcut to check
 * @returns Whether the event matches the shortcut
 */
export const matchesShortcut = (event: KeyboardEvent, shortcut: ShortcutKey): boolean => {
  // Check if the key matches
  const normalizedEventKey = normalizeKey(event.key);
  const normalizedShortcutKey = normalizeKey(shortcut.key);
  
  if (normalizedEventKey.toLowerCase() !== normalizedShortcutKey.toLowerCase()) {
    return false;
  }
  
  // Check if all required modifiers are pressed
  const activeModifiers = getActiveModifiers(event);
  
  // All required modifiers must be active
  for (const modifier of shortcut.modifiers) {
    if (!activeModifiers.includes(modifier)) {
      return false;
    }
  }
  
  // No extra modifiers should be active
  for (const modifier of activeModifiers) {
    if (!shortcut.modifiers.includes(modifier)) {
      return false;
    }
  }
  
  return true;
};

/**
 * ShortcutDetector class for managing keyboard shortcuts
 */
export class ShortcutDetector {
  private shortcuts: RegisteredShortcut[] = [];
  private activeKeys: Set<string> = new Set();
  private isInitialized: boolean = false;
  
  /**
   * Initialize the shortcut detector
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    
    this.isInitialized = true;
  }
  
  /**
   * Clean up the shortcut detector
   */
  cleanup(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    
    this.shortcuts = [];
    this.activeKeys.clear();
    this.isInitialized = false;
  }
  
  /**
   * Register a shortcut
   * @param id Unique identifier for the shortcut
   * @param shortcutStr Shortcut string (e.g., "Ctrl+Shift+P")
   * @param callback Callback to execute when the shortcut is triggered
   * @returns The registered shortcut
   */
  registerShortcut(id: string, shortcutStr: string, callback: ShortcutCallback): RegisteredShortcut {
    const shortcut = parseShortcut(shortcutStr);
    const registeredShortcut = { id, shortcut, callback };
    
    // Remove any existing shortcut with the same ID
    this.unregisterShortcut(id);
    
    this.shortcuts.push(registeredShortcut);
    return registeredShortcut;
  }
  
  /**
   * Unregister a shortcut
   * @param id ID of the shortcut to unregister
   * @returns Whether the shortcut was found and removed
   */
  unregisterShortcut(id: string): boolean {
    const initialLength = this.shortcuts.length;
    this.shortcuts = this.shortcuts.filter(s => s.id !== id);
    return initialLength !== this.shortcuts.length;
  }
  
  /**
   * Get all registered shortcuts
   * @returns Array of registered shortcuts
   */
  getShortcuts(): RegisteredShortcut[] {
    return [...this.shortcuts];
  }
  
  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = normalizeKey(event.key);
    this.activeKeys.add(key);
    
    // Check if any registered shortcuts match
    for (const { shortcut, callback } of this.shortcuts) {
      if (matchesShortcut(event, shortcut)) {
        // Prevent default browser behavior for this shortcut
        event.preventDefault();
        
        // Execute the callback
        callback({
          shortcut,
          event,
        });
        
        break;
      }
    }
  };
  
  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = normalizeKey(event.key);
    this.activeKeys.delete(key);
  };
  
  /**
   * Handle window blur events (clear active keys)
   */
  private handleBlur = (): void => {
    this.activeKeys.clear();
  };
  
  /**
   * Check if a key is currently pressed
   * @param key Key to check
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
}

// Export a singleton instance
export const shortcutDetector = new ShortcutDetector(); 
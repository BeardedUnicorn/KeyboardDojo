/**
 * Keyboard Service for Desktop App
 * 
 * This service provides desktop-specific keyboard functionality using Tauri API.
 * It allows capturing global keyboard shortcuts and handling key combinations
 * that might be intercepted by the browser.
 */

import { shortcutDetector, ShortcutCallback, ShortcutEvent, KeyMapping } from '../utils/shortcutDetector';
import { osDetectionService, OperatingSystem } from './osDetectionService';
import { invoke } from '@tauri-apps/api/core';
import { Window } from '@tauri-apps/api/window';

// Platform-specific key mappings
const macKeyMappings: KeyMapping[] = [
  { from: 'Command', to: 'Meta' },
  { from: 'Cmd', to: 'Meta' },
  { from: '⌘', to: 'Meta' },
  { from: 'Option', to: 'Alt' },
  { from: '⌥', to: 'Alt' },
];

const windowsKeyMappings: KeyMapping[] = [
  { from: 'Windows', to: 'Meta' },
  { from: 'Win', to: 'Meta' },
];

const linuxKeyMappings: KeyMapping[] = [
  { from: 'Super', to: 'Meta' },
];

class KeyboardService {
  private globalShortcuts: Map<string, (event: any) => void> = new Map();
  private platformSpecificMappings: Map<OperatingSystem, KeyMapping[]> = new Map([
    ['macos', macKeyMappings],
    ['windows', windowsKeyMappings],
    ['linux', linuxKeyMappings],
  ]);
  private customKeyMappings: KeyMapping[] = [];
  private isInitialized: boolean = false;
  private appWindow: Window | null = null;
  
  /**
   * Register a global keyboard shortcut
   * @param shortcut The shortcut to register (e.g., 'Ctrl+Shift+P')
   * @param callback The callback to execute when the shortcut is triggered
   */
  registerGlobalShortcut(shortcut: string, callback: (event: any) => void): void {
    // In a real implementation, we would use Tauri API to register global shortcuts
    // For now, we'll just store the callback in a map
    this.globalShortcuts.set(shortcut, callback);
    
    // Register with the shortcut detector
    shortcutDetector.registerShortcut(
      shortcut, 
      shortcut, 
      (event: ShortcutEvent) => {
        const callback = this.globalShortcuts.get(shortcut);
        if (callback) {
          callback(event);
        }
      }
    );
    
    console.log(`Registered global shortcut: ${shortcut}`);
    
    // Example of how this would be implemented with Tauri:
    /*
    invoke('register_global_shortcut', { shortcut })
      .then(() => {
        this.globalShortcuts.set(shortcut, callback);
        console.log(`Registered global shortcut: ${shortcut}`);
      })
      .catch((error) => {
        console.error(`Failed to register global shortcut: ${shortcut}`, error);
      });
    */
  }
  
  /**
   * Register a global keyboard shortcut with a debounced callback
   * @param shortcut The shortcut to register (e.g., 'Ctrl+Shift+P')
   * @param callback The callback to execute when the shortcut is triggered
   * @param debounceTime The debounce time in milliseconds
   */
  registerDebouncedShortcut(shortcut: string, callback: (event: any) => void, debounceTime: number = 300): void {
    const debouncedCallback = shortcutDetector.debounceCallback((event: ShortcutEvent) => {
      callback(event);
    });
    
    this.registerGlobalShortcut(shortcut, debouncedCallback);
  }
  
  /**
   * Register a global keyboard shortcut with a throttled callback
   * @param shortcut The shortcut to register (e.g., 'Ctrl+Shift+P')
   * @param callback The callback to execute when the shortcut is triggered
   * @param throttleTime The throttle time in milliseconds
   */
  registerThrottledShortcut(shortcut: string, callback: (event: any) => void, throttleTime: number = 100): void {
    const throttledCallback = shortcutDetector.throttleCallback((event: ShortcutEvent) => {
      callback(event);
    });
    
    this.registerGlobalShortcut(shortcut, throttledCallback);
  }
  
  /**
   * Unregister a global keyboard shortcut
   * @param shortcut The shortcut to unregister
   */
  unregisterGlobalShortcut(shortcut: string): void {
    // In a real implementation, we would use Tauri API to unregister global shortcuts
    this.globalShortcuts.delete(shortcut);
    
    // Unregister from the shortcut detector
    shortcutDetector.unregisterShortcut(shortcut);
    
    console.log(`Unregistered global shortcut: ${shortcut}`);
    
    // Example of how this would be implemented with Tauri:
    /*
    invoke('unregister_global_shortcut', { shortcut })
      .then(() => {
        this.globalShortcuts.delete(shortcut);
        console.log(`Unregistered global shortcut: ${shortcut}`);
      })
      .catch((error) => {
        console.error(`Failed to unregister global shortcut: ${shortcut}`, error);
      });
    */
  }
  
  /**
   * Add a custom key mapping
   * @param from Key to map from
   * @param to Key to map to
   */
  addKeyMapping(from: string, to: string): void {
    this.customKeyMappings.push({ from, to });
    shortcutDetector.addKeyMapping(from, to);
  }
  
  /**
   * Remove a custom key mapping
   * @param from Key to remove mapping for
   * @returns Whether the mapping was removed
   */
  removeKeyMapping(from: string): boolean {
    const index = this.customKeyMappings.findIndex(m => m.from === from);
    
    if (index !== -1) {
      this.customKeyMappings.splice(index, 1);
      return shortcutDetector.removeKeyMapping(from);
    }
    
    return false;
  }
  
  /**
   * Clear all custom key mappings
   */
  clearKeyMappings(): void {
    this.customKeyMappings = [];
    shortcutDetector.clearKeyMappings();
  }
  
  /**
   * Apply platform-specific key mappings based on the detected OS
   */
  private applyPlatformSpecificMappings(): void {
    // Clear existing mappings first
    shortcutDetector.clearKeyMappings();
    
    // Get the current OS
    const osInfo = osDetectionService.getOSInfo();
    
    // Apply platform-specific mappings
    const mappings = this.platformSpecificMappings.get(osInfo.os) || [];
    
    for (const mapping of mappings) {
      shortcutDetector.addKeyMapping(mapping.from, mapping.to);
    }
    
    // Re-apply custom mappings
    for (const mapping of this.customKeyMappings) {
      shortcutDetector.addKeyMapping(mapping.from, mapping.to);
    }
    
    console.log(`Applied ${mappings.length} platform-specific key mappings for ${osInfo.os}`);
  }
  
  /**
   * Set the throttle time for keyboard events
   * @param time Throttle time in milliseconds
   */
  setThrottleTime(time: number): void {
    shortcutDetector.setThrottleTime(time);
  }
  
  /**
   * Set the debounce time for keyboard events
   * @param time Debounce time in milliseconds
   */
  setDebounceTime(time: number): void {
    shortcutDetector.setDebounceTime(time);
  }
  
  /**
   * Initialize the keyboard service
   * This sets up event listeners and other necessary initialization
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    // Initialize the OS detection service first
    await osDetectionService.initialize();
    
    // Initialize the shortcut detector
    shortcutDetector.initialize();
    
    // Apply platform-specific key mappings
    this.applyPlatformSpecificMappings();
    
    // Listen for OS detection service changes
    osDetectionService.addOSChangeListener(() => {
      this.applyPlatformSpecificMappings();
    });
    
    // Initialize the app window
    try {
      this.appWindow = Window.getCurrent();
    } catch (error) {
      console.error('Failed to get current window:', error);
    }
    
    console.log('Initializing keyboard service');
    
    // Example of how this would be implemented with Tauri:
    /*
    if (this.appWindow) {
      this.appWindow.listen('tauri://global-shortcut', (event) => {
        const { shortcut } = event.payload as { shortcut: string };
        const callback = this.globalShortcuts.get(shortcut);
        
        if (callback) {
          // Parse the shortcut to extract key and modifiers
          const parts = shortcut.split('+');
          const key = parts[parts.length - 1];
          const modifiers = parts.slice(0, parts.length - 1);
          
          callback({ key, modifiers });
        }
      });
    }
    */
    
    this.isInitialized = true;
  }
  
  /**
   * Clean up the keyboard service
   * This removes event listeners and performs other cleanup
   */
  cleanup(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Clean up the shortcut detector
    shortcutDetector.cleanup();
    
    // Remove OS detection service listener
    osDetectionService.removeOSChangeListener(() => {
      this.applyPlatformSpecificMappings();
    });
    
    console.log('Cleaning up keyboard service');
    
    // Example of how this would be implemented with Tauri:
    /*
    // Unregister all global shortcuts
    this.globalShortcuts.forEach((_, shortcut) => {
      this.unregisterGlobalShortcut(shortcut);
    });
    
    // Remove event listeners
    if (this.appWindow) {
      this.appWindow.unlisten('tauri://global-shortcut');
    }
    */
    
    this.isInitialized = false;
  }
  
  /**
   * Format a keyboard shortcut for display based on the OS
   * @param shortcut The shortcut to format (e.g., 'Ctrl+Shift+P')
   * @returns Formatted shortcut for the current OS
   */
  formatShortcutForOS(shortcut: string): string {
    return osDetectionService.formatShortcutForOS(shortcut);
  }
  
  /**
   * Check if a key is currently pressed
   * @param key The key to check
   * @returns Whether the key is pressed
   */
  isKeyPressed(key: string): boolean {
    return shortcutDetector.isKeyPressed(key);
  }
  
  /**
   * Get all currently pressed keys
   * @returns Set of pressed keys
   */
  getPressedKeys(): Set<string> {
    return shortcutDetector.getPressedKeys();
  }
}

// Export a singleton instance
export const keyboardService = new KeyboardService(); 
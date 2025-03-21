/**
 * Keyboard Service for Desktop App
 *
 * This service provides desktop-specific keyboard functionality using Tauri API.
 * It allows capturing global keyboard shortcuts and handling key combinations
 * that might be intercepted by the browser.
 */

import { shortcutDetector } from '../utils/shortcutDetector';

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { osDetectionService } from './osDetectionService';
import { serviceFactory } from './ServiceFactory';

import type { OperatingSystem } from './osDetectionService';
import type { ShortcutEvent, KeyMapping } from '../utils/shortcutDetector';
import type { Window } from '@tauri-apps/api/window';

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

class KeyboardService extends BaseService {
  private globalShortcuts: Map<string, (event: any) => void> = new Map();
  private platformSpecificMappings: Map<OperatingSystem, KeyMapping[]> = new Map([
    ['macos', macKeyMappings],
    ['windows', windowsKeyMappings],
    ['linux', linuxKeyMappings],
  ]);
  private customKeyMappings: KeyMapping[] = [];
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
      },
    );

    loggerService.info(`Registered global shortcut: ${shortcut}`, {
      component: 'KeyboardService',
      shortcut,
    });
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

    loggerService.info(`Unregistered global shortcut: ${shortcut}`, {
      component: 'KeyboardService',
      shortcut,
    });

    // Example of how this would be implemented with Tauri:
    /*
    invoke('unregister_global_shortcut', { shortcut })
      .then(() => {
        this.globalShortcuts.delete(shortcut);
        loggerService.info(`Unregistered global shortcut: ${shortcut}`, {
          component: 'KeyboardService',
          shortcut
        });
      })
      .catch((error) => {
        loggerService.error(`Failed to unregister global shortcut: ${shortcut}`, error, {
          component: 'KeyboardService',
          shortcut
        });
      });
    */
  }

  /**
   * Apply platform-specific key mappings based on the current OS
   */
  private applyPlatformSpecificMappings(): void {
    const osInfo = osDetectionService.getOSInfo();
    const mappings = this.platformSpecificMappings.get(osInfo.os) || [];

    // Apply mappings to the shortcut detector
    mappings.forEach((mapping) => {
      shortcutDetector.addKeyMapping(mapping.from, mapping.to);
    });

    // Apply custom mappings
    this.customKeyMappings.forEach((mapping) => {
      shortcutDetector.addKeyMapping(mapping.from, mapping.to);
    });

    loggerService.info(`Applied ${mappings.length} platform-specific key mappings for ${osInfo.os}`, {
      component: 'KeyboardService',
      os: osInfo.os,
      mappingsCount: mappings.length,
      customMappingsCount: this.customKeyMappings.length,
    });
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
   */
  async initialize(): Promise<void> {
    // Don't proceed if already initialized
    if (this.isInitialized()) {
      return;
    }

    // Call parent initialize first
    await super.initialize();

    try {
      // Get the current window
      try {
        // In a real implementation, we would use Tauri API to get the current window
        // this.appWindow = getCurrent();
      } catch (error) {
        loggerService.error('Failed to get current window:', error, { component: 'KeyboardService' });
      }

      loggerService.info('Initializing keyboard service', { component: 'KeyboardService' });

      // Apply platform-specific key mappings
      this.applyPlatformSpecificMappings();

      // Initialize the shortcut detector
      shortcutDetector.initialize();

      // Set up event listeners for the window
      if (this.appWindow) {
        // In a real implementation, we would use Tauri API to listen for window events
        // this.appWindow.listen('tauri://focus', () => {
        //   shortcutDetector.resetState();
        // });
        //
        // this.appWindow.listen('tauri://blur', () => {
        //   shortcutDetector.resetState();
        // });
      }
    } catch (error) {
      loggerService.error('Failed to initialize keyboard service:', error, { component: 'KeyboardService' });
      // Update status to reflect failure
      this._status.initialized = false;
      this._status.error = error instanceof Error ? error : new Error(String(error));
      throw error;
    }
  }

  /**
   * Clean up the keyboard service
   */
  cleanup(): void {
    // Don't proceed if not initialized
    if (!this.isInitialized()) {
      return;
    }

    try {
      loggerService.info('Cleaning up keyboard service', { component: 'KeyboardService' });

      // Unregister all global shortcuts
      this.globalShortcuts.forEach((_, shortcut) => {
        this.unregisterGlobalShortcut(shortcut);
      });

      // Clean up the shortcut detector
      shortcutDetector.cleanup();

      // Remove event listeners from the window
      if (this.appWindow) {
        // In a real implementation, we would use Tauri API to remove window event listeners
        // this.appWindow.unlisten('tauri://focus');
        // this.appWindow.unlisten('tauri://blur');
      }

      // Call parent cleanup to update status
      super.cleanup();
    } catch (error) {
      loggerService.error('Error cleaning up keyboard service:', error, { component: 'KeyboardService' });
      throw error;
    }
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

// Create and register the service
const keyboardService = new KeyboardService();
serviceFactory.register('keyboardService', keyboardService);

// Export the singleton instance
export { keyboardService };

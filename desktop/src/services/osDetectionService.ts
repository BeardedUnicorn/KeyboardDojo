/**
 * OS Detection Service
 * 
 * This service provides utilities for detecting the user's operating system
 * and handling OS-specific features like keyboard shortcuts.
 */

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';

export interface OSInfo {
  os: OperatingSystem;
  version?: string;
  arch?: string;
}

type OSChangeListener = () => void;

class OSDetectionService extends BaseService {
  private _os: OperatingSystem = 'unknown';
  private _osChangeListeners: OSChangeListener[] = [];

  /**
   * Initialize the OS detection
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized()) return;

    try {
      // Detect OS using browser information
      if (navigator.userAgent.indexOf('Win') !== -1) {
        this._os = 'windows';
      } else if (navigator.userAgent.indexOf('Mac') !== -1) {
        this._os = 'macos';
      } else if (navigator.userAgent.indexOf('Linux') !== -1) {
        this._os = 'linux';
      }

      this._notifyOSChange();
      loggerService.info('Detected operating system:', { os: this._os });
      
      // Call parent initialize to update status
      await super.initialize();
    } catch (error) {
      loggerService.error('Error detecting operating system:', { error });
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  public override cleanup(): void {
    this._osChangeListeners = [];
    super.cleanup();
  }

  /**
   * Reset the service
   */
  public override reset(): void {
    this._os = 'unknown';
    this._osChangeListeners = [];
    super.reset();
  }

  /**
   * Get the detected operating system
   */
  public getOS(): OperatingSystem {
    if (!this.isInitialized()) {
      loggerService.warn('OS detection not initialized, initializing now...');
      this.initialize();
    }
    return this._os;
  }

  /**
   * Get detailed OS information
   */
  public getOSInfo(): OSInfo {
    return {
      os: this.getOS(),
      // Additional properties would be populated from Tauri in a real implementation
    };
  }

  /**
   * Check if the current OS is macOS
   */
  public isMacOS(): boolean {
    return this.getOS() === 'macos';
  }

  /**
   * Check if the current OS is Windows
   */
  public isWindows(): boolean {
    return this.getOS() === 'windows';
  }

  /**
   * Check if the current OS is Linux
   */
  public isLinux(): boolean {
    return this.getOS() === 'linux';
  }

  /**
   * Format a shortcut string based on the current OS
   * @param windowsShortcut The Windows version of the shortcut
   * @param macShortcut The macOS version of the shortcut
   * @param linuxShortcut The Linux version of the shortcut (defaults to Windows shortcut)
   */
  public formatShortcut(windowsShortcut: string, macShortcut: string, linuxShortcut?: string): string {
    const os = this.getOS();
    
    switch (os) {
      case 'macos':
        return macShortcut;
      case 'linux':
        return linuxShortcut || windowsShortcut;
      case 'windows':
      default:
        return windowsShortcut;
    }
  }

  /**
   * Format a keyboard shortcut for display based on the OS
   * @param shortcut The shortcut to format (e.g., 'Ctrl+Shift+P')
   * @returns Formatted shortcut for the current OS
   */
  public formatShortcutForOS(shortcut: string): string {
    return this.convertShortcut(shortcut);
  }

  /**
   * Get the appropriate modifier key name based on the current OS
   * @param windowsKey The Windows key name
   * @param macKey The macOS key name
   * @param linuxKey The Linux key name (defaults to Windows key)
   */
  public getModifierKeyName(windowsKey: string, macKey: string, linuxKey?: string): string {
    const os = this.getOS();
    
    switch (os) {
      case 'macos':
        return macKey;
      case 'linux':
        return linuxKey || windowsKey;
      case 'windows':
      default:
        return windowsKey;
    }
  }

  /**
   * Convert a shortcut string to the appropriate format for the current OS
   * @param shortcut The shortcut string to convert
   */
  public convertShortcut(shortcut: string): string {
    if (this.isMacOS()) {
      // Convert Windows/Linux format to macOS format
      return shortcut
        .replace(/Ctrl\+/g, '⌘+')
        .replace(/Alt\+/g, '⌥+')
        .replace(/Shift\+/g, '⇧+')
        .replace(/Win\+/g, '⌃+')
        .replace(/Meta\+/g, '⌘+')
        .replace(/Command\+/g, '⌘+')
        .replace(/Cmd\+/g, '⌘+');
    } else if (this.isLinux()) {
      // Linux typically uses the same format as Windows
      return shortcut
        .replace(/Meta\+/g, 'Super+')
        .replace(/Command\+/g, 'Super+')
        .replace(/Cmd\+/g, 'Super+');
    } else {
      // Windows format (default)
      return shortcut
        .replace(/Meta\+/g, 'Win+')
        .replace(/Command\+/g, 'Win+')
        .replace(/Cmd\+/g, 'Win+');
    }
  }

  /**
   * Add a listener for OS changes
   * @param listener The callback function to call when OS changes
   */
  public addOSChangeListener(listener: OSChangeListener): void {
    this._osChangeListeners.push(listener);
  }

  /**
   * Remove a listener for OS changes
   * @param listener The callback function to remove
   */
  public removeOSChangeListener(listener: OSChangeListener): void {
    const index = this._osChangeListeners.indexOf(listener);
    if (index !== -1) {
      this._osChangeListeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners about an OS change
   * @private
   */
  private _notifyOSChange(): void {
    for (const listener of this._osChangeListeners) {
      listener();
    }
  }
}

// Create the singleton instance
const osDetectionServiceInstance = new OSDetectionService();

// Register with the service factory
export const osDetectionService = serviceFactory.register('osDetectionService', osDetectionServiceInstance);

// Don't initialize here, let the service factory handle initialization

export default osDetectionService; 

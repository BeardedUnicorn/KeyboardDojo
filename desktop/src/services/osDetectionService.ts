/**
 * OS Detection Service
 * 
 * This service provides utilities for detecting the user's operating system
 * and handling OS-specific features like keyboard shortcuts.
 */

export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';

export interface OSInfo {
  os: OperatingSystem;
  version?: string;
  arch?: string;
}

type OSChangeListener = () => void;

class OSDetectionService {
  private _os: OperatingSystem = 'unknown';
  private _initialized: boolean = false;
  private _osChangeListeners: OSChangeListener[] = [];

  /**
   * Initialize the OS detection
   */
  public async initialize(): Promise<void> {
    if (this._initialized) return;

    try {
      // Detect OS
      const platform = navigator.platform.toLowerCase();
      
      if (platform.includes('win')) {
        this._os = 'windows';
      } else if (platform.includes('mac')) {
        this._os = 'macos';
      } else if (platform.includes('linux')) {
        this._os = 'linux';
      }

      // Alternative detection using user agent if platform is not reliable
      if (this._os === 'unknown') {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('windows')) {
          this._os = 'windows';
        } else if (userAgent.includes('mac os x') || userAgent.includes('macintosh')) {
          this._os = 'macos';
        } else if (userAgent.includes('linux')) {
          this._os = 'linux';
        }
      }

      // Try to get more accurate info from Tauri if available
      try {
        // This would be replaced with actual Tauri API call in a real implementation
        // const os = await invoke('get_os');
        // this._os = os as OperatingSystem;
      } catch (error) {
        console.warn('Could not get OS information from Tauri:', error);
      }

      this._initialized = true;
      console.log(`Detected operating system: ${this._os}`);
    } catch (error) {
      console.error('Error detecting operating system:', error);
    }
  }

  /**
   * Get the detected operating system
   */
  public getOS(): OperatingSystem {
    if (!this._initialized) {
      console.warn('OS detection not initialized, initializing now...');
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

// Create and export a singleton instance
export const osDetectionService = new OSDetectionService();

// Initialize the service
osDetectionService.initialize();

export default osDetectionService; 
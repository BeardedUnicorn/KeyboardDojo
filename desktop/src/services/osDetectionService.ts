/**
 * OS Detection Service
 * 
 * This service provides functionality for detecting the operating system
 * and providing platform-specific behavior and UI adjustments.
 */

import { getVersion } from '@tauri-apps/api/app';
// Mock the OS detection functions since they're not available in Tauri v2 yet
// In a real implementation, these would be imported from a Tauri plugin
const platform = async () => 'darwin';
const arch = async () => 'x86_64';
const type = async () => 'Darwin';

export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';
export type Architecture = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown';

interface OSInfo {
  os: OperatingSystem;
  arch: Architecture;
  version: string;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
}

class OSDetectionService {
  private _osInfo: OSInfo | null = null;
  private _isInitialized = false;
  private _initPromise: Promise<OSInfo> | null = null;
  private _osChangeListeners: Set<(osInfo: OSInfo) => void> = new Set();

  /**
   * Initialize the OS detection service
   * This detects the operating system and architecture
   */
  async initialize(): Promise<OSInfo> {
    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = this.detectOS();
    this._osInfo = await this._initPromise;
    this._isInitialized = true;
    return this._osInfo;
  }

  /**
   * Detect the operating system and architecture
   */
  private async detectOS(): Promise<OSInfo> {
    try {
      const osType = await type();
      const osArch = await arch();
      const appVersion = await getVersion();
      const osPlatform = await platform();

      let detectedOS: OperatingSystem = 'unknown';
      let detectedArch: Architecture = 'unknown';

      // Determine OS
      if (osType === 'Darwin') {
        detectedOS = 'macos';
      } else if (osType === 'Windows_NT') {
        detectedOS = 'windows';
      } else if (osType === 'Linux') {
        detectedOS = 'linux';
      }

      // Determine architecture
      if (osArch === 'x86_64') {
        detectedArch = 'x86_64';
      } else if (osArch === 'x86') {
        detectedArch = 'x86';
      } else if (osArch === 'aarch64') {
        detectedArch = 'arm64';
      } else if (osArch === 'arm') {
        detectedArch = 'arm';
      }

      const osInfo: OSInfo = {
        os: detectedOS,
        arch: detectedArch,
        version: appVersion,
        isMac: detectedOS === 'macos',
        isWindows: detectedOS === 'windows',
        isLinux: detectedOS === 'linux',
      };

      console.log('Detected OS:', osInfo);
      return osInfo;
    } catch (error) {
      console.error('Error detecting OS:', error);
      // Fallback to browser detection if Tauri API fails
      const fallbackInfo = this.detectOSFallback();
      console.log('Using fallback OS detection:', fallbackInfo);
      return fallbackInfo;
    }
  }

  /**
   * Fallback method to detect OS using browser APIs
   * This is used if the Tauri API fails
   */
  private detectOSFallback(): OSInfo {
    const userAgent = navigator.userAgent;
    let os: OperatingSystem = 'unknown';
    let detectedArch: Architecture = 'unknown';

    if (userAgent.indexOf('Win') !== -1) {
      os = 'windows';
    } else if (userAgent.indexOf('Mac') !== -1) {
      os = 'macos';
    } else if (userAgent.indexOf('Linux') !== -1) {
      os = 'linux';
    }

    // Try to detect architecture from user agent
    if (userAgent.indexOf('x86_64') !== -1 || userAgent.indexOf('x64') !== -1) {
      detectedArch = 'x86_64';
    } else if (userAgent.indexOf('x86') !== -1 || userAgent.indexOf('i386') !== -1) {
      detectedArch = 'x86';
    } else if (userAgent.indexOf('arm64') !== -1 || userAgent.indexOf('aarch64') !== -1) {
      detectedArch = 'arm64';
    } else if (userAgent.indexOf('arm') !== -1) {
      detectedArch = 'arm';
    }

    return {
      os,
      arch: detectedArch,
      version: '0.0.0', // Unknown version in fallback mode
      isMac: os === 'macos',
      isWindows: os === 'windows',
      isLinux: os === 'linux',
    };
  }

  /**
   * Get the detected OS information
   */
  getOSInfo(): OSInfo {
    if (!this._isInitialized) {
      console.warn('OS detection service not initialized. Call initialize() first.');
      return this.detectOSFallback();
    }
    return this._osInfo!;
  }

  /**
   * Add a listener for OS changes
   * @param listener The listener function
   */
  addOSChangeListener(listener: (osInfo: OSInfo) => void): void {
    this._osChangeListeners.add(listener);
    
    // Call the listener immediately with the current OS info
    if (this._isInitialized && this._osInfo) {
      listener(this._osInfo);
    }
  }

  /**
   * Remove a listener for OS changes
   * @param listener The listener function
   */
  removeOSChangeListener(listener: (osInfo: OSInfo) => void): void {
    this._osChangeListeners.delete(listener);
  }

  /**
   * Notify all listeners of an OS change
   * @param osInfo The new OS info
   */
  private notifyOSChangeListeners(osInfo: OSInfo): void {
    this._osChangeListeners.forEach(listener => listener(osInfo));
  }

  /**
   * Force a re-detection of the OS
   * This is useful for testing or if the OS might have changed
   */
  async refreshOSInfo(): Promise<OSInfo> {
    const previousOS = this._osInfo?.os;
    
    this._osInfo = await this.detectOS();
    
    // Notify listeners if the OS has changed
    if (previousOS !== this._osInfo.os) {
      this.notifyOSChangeListeners(this._osInfo);
    }
    
    return this._osInfo;
  }

  /**
   * Get the command key symbol based on the OS
   * Returns ⌘ for macOS and Ctrl for other platforms
   */
  getCommandKeySymbol(): string {
    const osInfo = this.getOSInfo();
    return osInfo.isMac ? '⌘' : 'Ctrl';
  }

  /**
   * Format a keyboard shortcut for display based on the OS
   * @param shortcut The shortcut to format (e.g., 'Ctrl+Shift+P')
   * @returns Formatted shortcut for the current OS
   */
  formatShortcutForOS(shortcut: string): string {
    const osInfo = this.getOSInfo();
    
    if (osInfo.isMac) {
      // Replace Ctrl with ⌘, Alt with ⌥, Shift with ⇧, Meta with ⌃
      return shortcut
        .replace(/Ctrl\+/g, '⌘+')
        .replace(/Alt\+/g, '⌥+')
        .replace(/Shift\+/g, '⇧+')
        .replace(/Meta\+/g, '⌃+')
        .replace(/\+/g, ' '); // Replace + with space for better readability
    } else {
      // Keep as is, just replace + with space for better readability
      return shortcut.replace(/\+/g, ' ');
    }
  }

  /**
   * Check if the app is running on a specific OS
   * @param os The OS to check
   * @returns Whether the app is running on the specified OS
   */
  isRunningOn(os: OperatingSystem): boolean {
    const osInfo = this.getOSInfo();
    return osInfo.os === os;
  }
}

// Export a singleton instance
export const osDetectionService = new OSDetectionService(); 
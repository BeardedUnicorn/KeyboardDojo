/**
 * Update Service
 * 
 * This service provides functionality for checking for updates,
 * downloading updates, and installing updates.
 */

// Mock the update functions since they're not available in Tauri v2 yet
// In a real implementation, these would be imported from Tauri plugins
const checkUpdate = async () => ({ 
  shouldUpdate: false, 
  manifest: {
    version: '0.0.0',
    body: '',
    date: new Date().toISOString()
  }
});
const installUpdate = async () => {};
const relaunch = async () => {};
import { getVersion } from '@tauri-apps/api/app';

export interface UpdateInfo {
  version: string;
  currentVersion: string;
  body: string;
  date: string;
  available: boolean;
}

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'error';

export interface UpdateProgress {
  status: UpdateStatus;
  progress: number;
  error?: string;
}

class UpdateService {
  private _updateInfo: UpdateInfo | null = null;
  private _updateProgress: UpdateProgress = {
    status: 'idle',
    progress: 0
  };
  private _progressListeners: Set<(progress: UpdateProgress) => void> = new Set();
  private _updateCheckInterval: number | null = null;
  private _currentVersion: string = '0.0.0';

  /**
   * Initialize the update service
   * This sets up automatic update checking
   */
  async initialize(): Promise<void> {
    try {
      // Get the current version
      this._currentVersion = await getVersion();
      console.log(`Current app version: ${this._currentVersion}`);
      
      // Check for updates immediately
      await this.checkForUpdates();
      
      // Set up automatic update checking every hour
      this._updateCheckInterval = window.setInterval(() => {
        this.checkForUpdates();
      }, 60 * 60 * 1000); // 1 hour
      
      console.log('Update service initialized');
    } catch (error) {
      console.error('Error initializing update service:', error);
    }
  }

  /**
   * Clean up the update service
   * This clears the update check interval
   */
  cleanup(): void {
    if (this._updateCheckInterval !== null) {
      clearInterval(this._updateCheckInterval);
      this._updateCheckInterval = null;
    }
    
    console.log('Update service cleaned up');
  }

  /**
   * Check for updates
   * @returns Promise that resolves with update info
   */
  async checkForUpdates(): Promise<UpdateInfo | null> {
    this.setProgress({ status: 'checking', progress: 0 });
    
    try {
      console.log('Checking for updates...');
      
      // In a real implementation, we would use Tauri API to check for updates
      const { shouldUpdate, manifest } = await checkUpdate();
      
      if (shouldUpdate) {
        console.log(`Update available: ${manifest?.version}`);
        
        this._updateInfo = {
          version: manifest?.version || 'unknown',
          currentVersion: this._currentVersion,
          body: manifest?.body || '',
          date: manifest?.date || new Date().toISOString(),
          available: true
        };
        
        this.setProgress({ status: 'idle', progress: 0 });
      } else {
        console.log('No updates available');
        
        this._updateInfo = {
          version: this._currentVersion,
          currentVersion: this._currentVersion,
          body: '',
          date: new Date().toISOString(),
          available: false
        };
        
        this.setProgress({ status: 'idle', progress: 0 });
      }
      
      return this._updateInfo;
    } catch (error) {
      console.error('Error checking for updates:', error);
      
      this.setProgress({ 
        status: 'error', 
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return null;
    }
  }

  /**
   * Download and install the update
   * @returns Promise that resolves when the update is installed
   */
  async downloadAndInstallUpdate(): Promise<boolean> {
    if (!this._updateInfo?.available) {
      console.warn('No update available to download');
      return false;
    }
    
    this.setProgress({ status: 'downloading', progress: 0 });
    
    try {
      console.log('Downloading and installing update...');
      
      // Simulate download progress
      const progressInterval = setInterval(() => {
        const newProgress = Math.min(this._updateProgress.progress + 0.1, 0.95);
        this.setProgress({ status: 'downloading', progress: newProgress });
      }, 500);
      
      // In a real implementation, we would use Tauri API to download and install the update
      await installUpdate();
      
      clearInterval(progressInterval);
      this.setProgress({ status: 'ready', progress: 1 });
      
      console.log('Update installed successfully');
      return true;
    } catch (error) {
      console.error('Error downloading and installing update:', error);
      
      this.setProgress({ 
        status: 'error', 
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return false;
    }
  }

  /**
   * Restart the app to apply the update
   */
  async restartApp(): Promise<void> {
    console.log('Restarting app to apply update...');
    
    try {
      // In a real implementation, we would use Tauri API to restart the app
      await relaunch();
    } catch (error) {
      console.error('Error restarting app:', error);
    }
  }

  /**
   * Set the update progress and notify listeners
   * @param progress The update progress
   */
  private setProgress(progress: Partial<UpdateProgress>): void {
    this._updateProgress = {
      ...this._updateProgress,
      ...progress
    };
    
    // Notify listeners
    this._progressListeners.forEach(listener => listener(this._updateProgress));
  }

  /**
   * Get the current update info
   * @returns The update info
   */
  getUpdateInfo(): UpdateInfo | null {
    return this._updateInfo;
  }

  /**
   * Get the current update progress
   * @returns The update progress
   */
  getUpdateProgress(): UpdateProgress {
    return this._updateProgress;
  }

  /**
   * Add a listener for update progress
   * @param listener The listener function
   */
  addProgressListener(listener: (progress: UpdateProgress) => void): void {
    this._progressListeners.add(listener);
  }

  /**
   * Remove a listener for update progress
   * @param listener The listener function
   */
  removeProgressListener(listener: (progress: UpdateProgress) => void): void {
    this._progressListeners.delete(listener);
  }

  /**
   * Check if an update is available
   * @returns Whether an update is available
   */
  isUpdateAvailable(): boolean {
    return this._updateInfo?.available || false;
  }

  /**
   * Get the current app version
   * @returns The current app version
   */
  getCurrentVersion(): string {
    return this._currentVersion;
  }
}

// Export a singleton instance
export const updateService = new UpdateService(); 
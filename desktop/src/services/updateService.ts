/**
 * Update Service
 * 
 * This service provides functionality for checking for updates,
 * downloading updates, and installing updates.
 */

import { getVersion } from '@tauri-apps/api/app';

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Mock the update functions since they're not available in Tauri v2 yet
// In a real implementation, these would be imported from Tauri plugins
const checkUpdate = async () => ({ 
  shouldUpdate: false, 
  manifest: {
    version: '0.0.0',
    body: '',
    date: new Date().toISOString(),
  },
});
const installUpdate = async () => {};
const relaunch = async () => {};

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

class UpdateService extends BaseService {
  private _updateInfo: UpdateInfo | null = null;
  private _updateProgress: UpdateProgress = {
    status: 'idle',
    progress: 0,
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
      // Call super.initialize first
      await super.initialize();
      
      try {
        // Get the current version
        this._currentVersion = await getVersion();
        loggerService.info(`Current app version: ${this._currentVersion}`, { 
          component: 'UpdateService',
          version: this._currentVersion,
        });
      } catch (versionError) {
        // Handle case where getVersion fails
        loggerService.warn('Failed to get app version, using default', { 
          component: 'UpdateService',
          error: versionError,
        });
        // Continue with default version
      }
      
      try {
        // Check for updates immediately
        await this.checkForUpdates();
      } catch (checkError) {
        // Handle case where initial update check fails
        loggerService.warn('Initial update check failed, will retry later', { 
          component: 'UpdateService',
          error: checkError,
        });
        // Continue with service initialization
      }
      
      // Set up automatic update checking every hour
      this._updateCheckInterval = window.setInterval(() => {
        this.checkForUpdates().catch((error) => {
          loggerService.warn('Scheduled update check failed', { 
            component: 'UpdateService',
            error,
          });
        });
      }, 60 * 60 * 1000); // 1 hour
      
      loggerService.info('Update service initialized', { component: 'UpdateService' });
      // Mark service as initialized even if some operations failed
      this._status.initialized = true;
    } catch (error) {
      loggerService.error('Error initializing update service:', error, { component: 'UpdateService' });
      // Set error status
      this._status.error = error instanceof Error ? error : new Error(String(error));
      this._status.initialized = false;
      // Don't throw the error to prevent app initialization failure
      // Just log it and continue
    }
  }

  /**
   * Clean up the update service
   * This clears the update check interval
   */
  cleanup(): void {
    try {
      if (this._updateCheckInterval !== null) {
        clearInterval(this._updateCheckInterval);
        this._updateCheckInterval = null;
      }
      
      loggerService.info('Update service cleaned up', { component: 'UpdateService' });
      
      // Call super.cleanup last
      super.cleanup();
    } catch (error) {
      loggerService.error('Error cleaning up update service:', error, { component: 'UpdateService' });
      // Don't throw the error to prevent app cleanup failure
    }
  }

  /**
   * Check for updates
   * @returns Promise that resolves with update info
   */
  async checkForUpdates(): Promise<UpdateInfo | null> {
    this.setProgress({ status: 'checking', progress: 0 });
    
    try {
      loggerService.info('Checking for updates...', { component: 'UpdateService' });
      
      // In a real implementation, we would use Tauri API to check for updates
      const { shouldUpdate, manifest } = await checkUpdate();
      
      if (shouldUpdate) {
        loggerService.info(`Update available: ${manifest?.version}`, { 
          component: 'UpdateService',
          newVersion: manifest?.version,
          currentVersion: this._currentVersion,
        });
        
        this._updateInfo = {
          version: manifest?.version || 'unknown',
          currentVersion: this._currentVersion,
          body: manifest?.body || '',
          date: manifest?.date || new Date().toISOString(),
          available: true,
        };
        
        this.setProgress({ status: 'idle', progress: 0 });
      } else {
        loggerService.info('No updates available', { 
          component: 'UpdateService',
          currentVersion: this._currentVersion,
        });
        
        this._updateInfo = {
          version: this._currentVersion,
          currentVersion: this._currentVersion,
          body: '',
          date: new Date().toISOString(),
          available: false,
        };
        
        this.setProgress({ status: 'idle', progress: 0 });
      }
      
      return this._updateInfo;
    } catch (error) {
      loggerService.error('Error checking for updates:', error, { component: 'UpdateService' });
      
      this.setProgress({ 
        status: 'error', 
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
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
      loggerService.warn('No update available to download', { 
        component: 'UpdateService',
        currentVersion: this._currentVersion,
      });
      return false;
    }
    
    this.setProgress({ status: 'downloading', progress: 0 });
    
    try {
      loggerService.info('Downloading and installing update...', { 
        component: 'UpdateService',
        version: this._updateInfo.version,
      });
      
      // Simulate download progress
      const progressInterval = setInterval(() => {
        const newProgress = Math.min(this._updateProgress.progress + 0.1, 0.95);
        this.setProgress({ status: 'downloading', progress: newProgress });
      }, 500);
      
      // In a real implementation, we would use Tauri API to download and install the update
      await installUpdate();
      
      clearInterval(progressInterval);
      this.setProgress({ status: 'ready', progress: 1 });
      
      loggerService.info('Update installed successfully', { 
        component: 'UpdateService',
        version: this._updateInfo.version,
      });
      return true;
    } catch (error) {
      loggerService.error('Error downloading and installing update:', error, { 
        component: 'UpdateService',
        version: this._updateInfo?.version,
      });
      
      this.setProgress({ 
        status: 'error', 
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return false;
    }
  }

  /**
   * Restart the app to apply the update
   */
  async restartApp(): Promise<void> {
    loggerService.info('Restarting app to apply update...', { 
      component: 'UpdateService',
      version: this._updateInfo?.version,
    });
    
    try {
      // In a real implementation, we would use Tauri API to restart the app
      await relaunch();
    } catch (error) {
      loggerService.error('Error restarting app:', error, { component: 'UpdateService' });
    }
  }

  /**
   * Set the update progress and notify listeners
   * @param progress The update progress
   */
  private setProgress(progress: Partial<UpdateProgress>): void {
    this._updateProgress = {
      ...this._updateProgress,
      ...progress,
    };
    
    // Notify listeners
    this._progressListeners.forEach((listener) => listener(this._updateProgress));
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

// Create and register service
const updateService = new UpdateService();
serviceFactory.register('updateService', updateService);

// Export the singleton instance
export { updateService }; 

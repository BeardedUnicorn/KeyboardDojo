import { runInEnvironment } from './environment';

/**
 * Update status type
 */
export type UpdateStatus = 
  | 'not-available' 
  | 'available' 
  | 'downloading' 
  | 'downloaded' 
  | 'error';

/**
 * Update info type
 */
export interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes?: string;
  downloadUrl?: string;
}

/**
 * Update progress type
 */
export interface UpdateProgress {
  bytesPerSecond: number;
  percent: number;
  total: number;
  transferred: number;
}

/**
 * Update event listener type
 */
export type UpdateEventListener = (status: UpdateStatus, info?: UpdateInfo | UpdateProgress | Error) => void;

/**
 * Environment-aware auto-update utility
 * This utility adapts its behavior based on whether it's running in desktop or web environment
 * In desktop environment, it uses Tauri's updater API
 * In web environment, it's a no-op
 */
class UpdaterService {
  private listeners: UpdateEventListener[] = [];
  private currentStatus: UpdateStatus = 'not-available';
  private updateInfo: UpdateInfo | null = null;
  private checkInterval: number | null = null;

  /**
   * Check for updates
   * @param url Optional URL to check for updates
   * @returns Promise that resolves to true if updates are available
   */
  async checkForUpdates(_url?: string): Promise<boolean> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's updater API
          // Example of how this would be implemented with Tauri:
          /*
          import { checkUpdate } from '@tauri-apps/api/updater';
          
          const { shouldUpdate, manifest } = await checkUpdate();
          
          if (shouldUpdate) {
            this.updateInfo = {
              version: manifest.version,
              releaseDate: manifest.date,
              releaseNotes: manifest.body,
              downloadUrl: manifest.url,
            };
            
            this.currentStatus = 'available';
            this.notifyListeners('available', this.updateInfo);
            return true;
          } else {
            this.currentStatus = 'not-available';
            this.notifyListeners('not-available');
            return false;
          }
          */
          
          // For demonstration purposes, we'll simulate an update
          const simulateUpdate = Math.random() > 0.5;
          
          if (simulateUpdate) {
            this.updateInfo = {
              version: '1.0.1',
              releaseDate: new Date().toISOString(),
              releaseNotes: 'Bug fixes and performance improvements',
              downloadUrl: 'https://example.com/update',
            };
            
            this.currentStatus = 'available';
            this.notifyListeners('available', this.updateInfo);
            return true;
          } else {
            this.currentStatus = 'not-available';
            this.notifyListeners('not-available');
            return false;
          }
        } catch (error) {
          console.error('Failed to check for updates:', error);
          this.currentStatus = 'error';
          this.notifyListeners('error', error instanceof Error ? error : new Error(String(error)));
          return false;
        }
      },
      web: async () => {
        // No-op in web environment
        return false;
      },
    });
  }

  /**
   * Download an update
   * @returns Promise that resolves when the update is downloaded
   */
  async downloadUpdate(): Promise<void> {
    if (this.currentStatus !== 'available') {
      throw new Error('No update available to download');
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's updater API
          // Example of how this would be implemented with Tauri:
          /*
          import { installUpdate } from '@tauri-apps/api/updater';
          
          this.currentStatus = 'downloading';
          this.notifyListeners('downloading');
          
          // The installUpdate function in Tauri handles both downloading and installing
          await installUpdate();
          
          this.currentStatus = 'downloaded';
          this.notifyListeners('downloaded');
          */
          
          // For demonstration purposes, we'll simulate downloading an update
          this.currentStatus = 'downloading';
          this.notifyListeners('downloading');
          
          // Simulate download progress
          let percent = 0;
          const interval = setInterval(() => {
            percent += 10;
            
            const progress: UpdateProgress = {
              bytesPerSecond: 1024 * 1024,
              percent,
              total: 1024 * 1024 * 10,
              transferred: 1024 * 1024 * (percent / 100) * 10,
            };
            
            this.notifyListeners('downloading', progress);
            
            if (percent >= 100) {
              clearInterval(interval);
              this.currentStatus = 'downloaded';
              this.notifyListeners('downloaded');
            }
          }, 500);
        } catch (error) {
          console.error('Failed to download update:', error);
          this.currentStatus = 'error';
          this.notifyListeners('error', error instanceof Error ? error : new Error(String(error)));
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Install an update
   * @returns Promise that resolves when the update is installed
   */
  async installUpdate(): Promise<void> {
    if (this.currentStatus !== 'downloaded') {
      throw new Error('No update downloaded to install');
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's updater API
          // Example of how this would be implemented with Tauri:
          /*
          import { relaunch } from '@tauri-apps/api/process';
          
          // The update is already installed by installUpdate(), so we just need to relaunch
          await relaunch();
          */
          
          // For demonstration purposes, we'll simulate installing an update
          console.log('Installing update...');
          
          // In a real implementation, this would restart the app
          setTimeout(() => {
            console.log('App would restart now');
          }, 1000);
        } catch (error) {
          console.error('Failed to install update:', error);
          this.currentStatus = 'error';
          this.notifyListeners('error', error instanceof Error ? error : new Error(String(error)));
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Enable automatic update checking
   * @param intervalInMinutes The interval in minutes to check for updates
   * @returns Promise that resolves when automatic update checking is enabled
   */
  async enableAutoUpdates(intervalInMinutes: number = 60): Promise<void> {
    if (this.checkInterval !== null) {
      this.disableAutoUpdates();
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // Check for updates immediately
          await this.checkForUpdates();
          
          // Set up interval to check for updates
          this.checkInterval = window.setInterval(() => {
            this.checkForUpdates().catch(error => {
              console.error('Failed to check for updates:', error);
            });
          }, intervalInMinutes * 60 * 1000);
        } catch (error) {
          console.error('Failed to enable auto updates:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Disable automatic update checking
   * @returns Promise that resolves when automatic update checking is disabled
   */
  async disableAutoUpdates(): Promise<void> {
    return runInEnvironment({
      desktop: async () => {
        try {
          if (this.checkInterval !== null) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
          }
        } catch (error) {
          console.error('Failed to disable auto updates:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Add an update event listener
   * @param listener The listener to add
   * @returns A function to remove the listener
   */
  addListener(listener: UpdateEventListener): () => void {
    this.listeners.push(listener);
    
    // Notify the listener of the current status
    if (this.currentStatus === 'available' && this.updateInfo) {
      listener('available', this.updateInfo);
    } else {
      listener(this.currentStatus);
    }
    
    return () => {
      this.removeListener(listener);
    };
  }

  /**
   * Remove an update event listener
   * @param listener The listener to remove
   */
  removeListener(listener: UpdateEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of an update event
   * @param status The update status
   * @param info The update info
   */
  private notifyListeners(status: UpdateStatus, info?: UpdateInfo | UpdateProgress | Error): void {
    for (const listener of this.listeners) {
      try {
        listener(status, info);
      } catch (error) {
        console.error('Error in update listener:', error);
      }
    }
  }
}

// Export a singleton instance
export const updaterService = new UpdaterService(); 
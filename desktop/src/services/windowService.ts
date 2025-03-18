/**
 * Window Service for Desktop App
 * 
 * This service provides desktop-specific window management functionality using Tauri API.
 * It allows controlling the window (minimize, maximize, close) and system tray integration.
 */

// Import Tauri API
import { getCurrentWindow } from '@tauri-apps/api/window';

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

class WindowService extends BaseService {
  private window: ReturnType<typeof getCurrentWindow>;

  constructor() {
    super();
    this.window = getCurrentWindow();
  }

  /**
   * Initialize the window service
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Additional initialization if needed
    loggerService.info('Window service initialized', { component: 'WindowService' });
  }

  /**
   * Clean up the window service
   */
  cleanup(): void {
    // No specific cleanup needed for window service
    super.cleanup();
  }

  /**
   * Set the window title
   * @param title The new window title
   */
  setTitle(title: string): void {
    this.window.setTitle(title)
      .catch((error) => {
        loggerService.error('Failed to set window title', error, { component: 'WindowService' });
      });
  }

  /**
   * Minimize the window
   */
  minimize(): void {
    this.window.minimize()
      .catch((error) => {
        loggerService.error('Failed to minimize window', error, { component: 'WindowService' });
      });
  }

  /**
   * Maximize the window
   */
  maximize(): void {
    this.window.maximize()
      .catch((error) => {
        loggerService.error('Failed to maximize window', error, { component: 'WindowService' });
      });
  }

  /**
   * Restore (unmaximize) the window
   */
  restore(): void {
    this.window.unmaximize()
      .catch((error) => {
        loggerService.error('Failed to restore window', error, { component: 'WindowService' });
      });
  }
  
  /**
   * Toggle maximize/restore state
   */
  toggleMaximize(): void {
    this.window.toggleMaximize()
      .catch((error) => {
        loggerService.error('Failed to toggle window maximize state', error, { component: 'WindowService' });
      });
  }
  
  /**
   * Close the window
   */
  close(): void {
    this.window.close()
      .catch((error) => {
        loggerService.error('Failed to close window', error, { component: 'WindowService' });
      });
  }
  
  /**
   * Check if the window is maximized
   * @returns Promise that resolves to true if the window is maximized, false otherwise
   */
  isMaximized(): Promise<boolean> {
    return this.window.isMaximized();
  }

  /**
   * Listen for window events
   * @param event The event to listen for
   * @param callback The callback to execute
   * @returns A function to remove the listener
   */
  listen(event: string, callback: () => void): () => void {
    try {
      const unlisten = this.window.listen(event, callback);
      return () => {
        unlisten.then((fn: () => void) => fn()).catch((err: Error) => {
          console.error(`Failed to remove listener for ${event}:`, err);
        });
      };
    } catch (error) {
      console.error(`Failed to add listener for ${event}:`, error);
      return () => {};
    }
  }
  
  /**
   * Set up system tray
   */
  setupSystemTray(): void {
    // System tray is configured in tauri.conf.json
    loggerService.info('System tray is configured in tauri.conf.json', { component: 'WindowService' });
  }
  
  /**
   * Show a desktop notification
   * @param title The notification title
   * @param body The notification body
   */
  showNotification(title: string, body: string): void {
    // Notification API is not used in this implementation
    loggerService.info(`Showing notification: ${title} - ${body}`, { 
      component: 'WindowService',
      title,
      body,
    });
  }

  /**
   * Start dragging the window
   */
  startDragging(): void {
    this.window.startDragging()
      .catch((error) => {
        loggerService.error('Failed to start window dragging', error, { component: 'WindowService' });
      });
  }
}

// Create and register the service
const windowService = new WindowService();
serviceFactory.register('windowService', windowService);

// Export the singleton instance
export { windowService }; 

/**
 * Window Service for Desktop App
 * 
 * This service provides desktop-specific window management functionality using Tauri API.
 * It allows controlling the window (minimize, maximize, close) and system tray integration.
 */

// Import Tauri API
import { Window } from '@tauri-apps/api/window';

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Check if we're running in Storybook
const isStorybook = () => {
  return typeof window !== 'undefined' && 
    (window.location.href.includes('localhost:6006') || 
     window.location.href.includes('localhost:6007') || 
     window.location.href.includes('storybook'));
};

// Mock window object for Storybook
const mockWindow = {
  setTitle: async () => {},
  minimize: async () => {},
  maximize: async () => {},
  unmaximize: async () => {},
  close: async () => {},
  isMaximized: async () => false,
  listen: async () => () => {},
  once: async () => () => {},
  show: async () => {},
  hide: async () => {},
  setFocus: async () => {},
  startDragging: async () => {},
};

class WindowService extends BaseService {
  private appWindow: Window;

  constructor() {
    super();
    
    try {
      // Use a mock window if running in Storybook
      if (isStorybook()) {
        this.appWindow = mockWindow as unknown as Window;
        loggerService.debug('Using mock window for Storybook', { component: 'WindowService' });
      } else {
        // In the actual app, use the real Tauri window
        this.appWindow = Window.getCurrent();
      }
    } catch (error) {
      // Fallback to mock window in case of errors
      loggerService.warn('Failed to get window, using mock window instead', { 
        component: 'WindowService',
        error,
      });
      this.appWindow = mockWindow as unknown as Window;
    }
  }

  /**
   * Initialize the window service
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    try {
      // Set initial window title
      await this.setTitle('Keyboard Dojo');
      
      loggerService.info('Window service initialized', { component: 'WindowService' });
      this._status.initialized = true;
    } catch (error) {
      // Log but don't fail initialization completely
      loggerService.warn('Window service initialization had issues, but continuing', { 
        component: 'WindowService',
        error,
      });
      // Still mark as initialized since this is recoverable
      this._status.initialized = true;
    }
  }

  /**
   * Clean up the window service
   */
  cleanup(): void {
    // No specific cleanup needed for window service
    try {
      super.cleanup();
    } catch (error) {
      loggerService.warn('Error cleaning up window service', { 
        component: 'WindowService',
        error,
      });
      // Don't rethrow to allow cleanup to continue
    }
  }

  /**
   * Set the window title
   * @param title The new window title
   */
  async setTitle(title: string): Promise<void> {
    if (!title) {
      loggerService.warn('Attempted to set empty window title, using default', { 
        component: 'WindowService', 
        title, 
      });
      title = 'Keyboard Dojo';
    }

    try {
      // Check if appWindow is available
      if (!this.appWindow) {
        throw new Error('Window not available');
      }

      // Ensure title is a string
      const titleStr = String(title);
      
      // Use appWindow to set the title
      await this.appWindow.setTitle(titleStr);
      
      // Also set document.title for web compatibility
      document.title = titleStr;
      
      loggerService.debug(`Window title set to: ${titleStr}`, { 
        component: 'WindowService',
        title: titleStr, 
      });
    } catch (error) {
      loggerService.error('Failed to set window title', error, { 
        component: 'WindowService',
        title,
        fallbackUsed: true,
      });
      
      // Fallback to document.title for web compatibility
      try {
        document.title = String(title);
      } catch (docError) {
        loggerService.error('Even fallback document.title failed', docError, { 
          component: 'WindowService',
          title, 
        });
      }
    }
  }

  /**
   * Minimize the window
   */
  async minimize(): Promise<void> {
    try {
      await this.appWindow.minimize();
    } catch (error) {
      loggerService.error('Failed to minimize window', error, { component: 'WindowService' });
    }
  }

  /**
   * Maximize the window
   */
  async maximize(): Promise<void> {
    try {
      await this.appWindow.maximize();
    } catch (error) {
      loggerService.error('Failed to maximize window', error, { component: 'WindowService' });
    }
  }

  /**
   * Restore (unmaximize) the window
   */
  async restore(): Promise<void> {
    try {
      await this.appWindow.unmaximize();
    } catch (error) {
      loggerService.error('Failed to restore window', error, { component: 'WindowService' });
    }
  }
  
  /**
   * Toggle maximize/restore state
   */
  async toggleMaximize(): Promise<void> {
    try {
      const isMaximized = await this.isMaximized();
      if (isMaximized) {
        await this.restore();
      } else {
        await this.maximize();
      }
    } catch (error) {
      loggerService.error('Failed to toggle window maximize state', error, { component: 'WindowService' });
    }
  }
  
  /**
   * Close the window
   */
  async close(): Promise<void> {
    try {
      await this.appWindow.close();
    } catch (error) {
      loggerService.error('Failed to close window', error, { component: 'WindowService' });
    }
  }
  
  /**
   * Check if the window is maximized
   * @returns Promise that resolves to true if the window is maximized, false otherwise
   */
  async isMaximized(): Promise<boolean> {
    try {
      return await this.appWindow.isMaximized();
    } catch (error) {
      loggerService.error('Failed to check if window is maximized', error, { component: 'WindowService' });
      return false;
    }
  }

  /**
   * Listen for window events
   * @param event The event to listen for
   * @param callback The callback to execute
   * @returns A function to remove the listener
   */
  listen(event: string, callback: () => void): () => void {
    let unlisten: Promise<() => void>;
    
    try {
      // Check if appWindow is available
      if (!this.appWindow) {
        loggerService.warn(`Window unavailable when trying to listen for ${event}`, { 
          component: 'WindowService',
          event,
        });
        // Return a no-op function
        return () => {};
      }
      
      // Store the unlisten promise
      unlisten = this.appWindow.listen(event, callback);

      // Return a cleanup function
      return () => {
        try {
          // Handle case where the window is no longer available
          if (!this.appWindow) {
            loggerService.warn(`Window unavailable when removing listener for ${event}`, { 
              component: 'WindowService',
              event,
            });
            return;
          }
          
          // Use Promise.resolve().then().catch() to handle case where unlisten promise is rejected
          Promise.resolve(unlisten)
            .then((fn: () => void) => {
              try {
                fn();
              } catch (unlistenError) {
                loggerService.error(`Failed to remove listener for ${event}`, unlistenError, { 
                  component: 'WindowService',
                });
              }
            })
            .catch((promiseError) => {
              loggerService.error(`Failed to resolve unlisten promise for ${event}`, promiseError, { 
                component: 'WindowService',
              });
            });
        } catch (cleanupError) {
          loggerService.error(`Failed to remove listener for ${event}`, cleanupError, { 
            component: 'WindowService',
          });
        }
      };
    } catch (error) {
      loggerService.error(`Failed to add listener for ${event}`, error, { 
        component: 'WindowService',
        event,
      });
      // Return a no-op function
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
  async startDragging(): Promise<void> {
    try {
      await this.appWindow.startDragging();
    } catch (error) {
      loggerService.error('Failed to start window dragging', error, { component: 'WindowService' });
    }
  }
}

// Create and register the service
const windowService = new WindowService();
serviceFactory.register('windowService', windowService);

// Export the singleton instance
export { windowService }; 

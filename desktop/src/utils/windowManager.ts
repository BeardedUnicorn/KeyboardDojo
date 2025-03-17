/**
 * Window Manager Utility
 * 
 * This utility provides functions for managing the application window
 * using Tauri APIs.
 */

import { Window } from '@tauri-apps/api/window';

type WindowEventCallback = () => void;
type WindowEventListener = () => void;

class WindowManager {
  private appWindow: Window;

  constructor() {
    this.appWindow = Window.getCurrent();
  }

  /**
   * Set the window title
   * @param title The title to set
   */
  async setTitle(title: string): Promise<void> {
    try {
      await this.appWindow.setTitle(title);
    } catch (error) {
      console.error('Failed to set window title:', error);
    }
  }

  /**
   * Minimize the window
   */
  async minimize(): Promise<void> {
    try {
      await this.appWindow.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  }

  /**
   * Maximize the window
   */
  async maximize(): Promise<void> {
    try {
      await this.appWindow.maximize();
    } catch (error) {
      console.error('Failed to maximize window:', error);
    }
  }

  /**
   * Restore the window (unmaximize)
   */
  async restore(): Promise<void> {
    try {
      await this.appWindow.unmaximize();
    } catch (error) {
      console.error('Failed to restore window:', error);
    }
  }

  /**
   * Close the window
   */
  async close(): Promise<void> {
    try {
      await this.appWindow.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  }

  /**
   * Check if the window is maximized
   * @returns Whether the window is maximized
   */
  async isMaximized(): Promise<boolean> {
    try {
      return await this.appWindow.isMaximized();
    } catch (error) {
      console.error('Failed to check if window is maximized:', error);
      return false;
    }
  }

  /**
   * Listen for window events
   * @param event The event to listen for
   * @param callback The callback to execute
   * @returns A function to remove the listener
   */
  listen(event: string, callback: WindowEventCallback): WindowEventListener {
    try {
      const unlisten = this.appWindow.listen(event, callback);
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
}

export const windowManager = new WindowManager(); 
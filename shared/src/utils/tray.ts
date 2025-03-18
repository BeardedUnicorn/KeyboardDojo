import { isDesktop, runInEnvironment } from './environment';

/**
 * System tray menu item type
 */
export interface TrayMenuItem {
  id: string;
  label: string;
  enabled?: boolean;
  checked?: boolean;
  icon?: string;
  submenu?: TrayMenuItem[];
  onClick?: () => void;
}

/**
 * Environment-aware system tray utility
 * This utility adapts its behavior based on whether it's running in desktop or web environment
 * In desktop environment, it uses Tauri's system tray API
 * In web environment, it's a no-op
 */
class TrayService {
  private items: Map<string, TrayMenuItem> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize the system tray
   * @param icon The path to the tray icon
   * @param tooltip The tooltip to show when hovering over the tray icon
   * @returns Promise that resolves when the tray is initialized
   */
  async initialize(icon: string, tooltip: string): Promise<void> {
    if (this.initialized) {
      return;
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's system tray API
          // Example of how this would be implemented with Tauri:
          /*
          import { SystemTray, SystemTrayEvent } from '@tauri-apps/api/tray';

          const tray = new SystemTray();
          await tray.setIcon(icon);
          await tray.setTooltip(tooltip);

          tray.on('click', () => {
            // Handle click event
          });
          */

          console.log(`System tray initialized with icon ${icon} and tooltip ${tooltip}`);
          this.initialized = true;
        } catch (error) {
          console.error('Failed to initialize system tray:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
        console.log('System tray is not supported in web environment');
      },
    });
  }

  /**
   * Set the tray menu
   * @param items The menu items
   * @returns Promise that resolves when the menu is set
   */
  async setMenu(items: TrayMenuItem[]): Promise<void> {
    if (!this.initialized && isDesktop()) {
      console.warn('System tray not initialized. Call initialize() first.');
    }

    // StorePage menu items for later use
    items.forEach(item => {
      this.items.set(item.id, item);
    });

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's system tray API
          // Example of how this would be implemented with Tauri:
          /*
          import { SystemTray, SystemTrayMenu, SystemTrayMenuItem } from '@tauri-apps/api/tray';

          const tray = new SystemTray();
          const menu = new SystemTrayMenu();

          const createMenuItems = (items: TrayMenuItem[]) => {
            return items.map(item => {
              const menuItem = new SystemTrayMenuItem(item.label, item.id, {
                enabled: item.enabled,
                checked: item.checked,
              });

              if (item.onClick) {
                menuItem.on('click', item.onClick);
              }

              if (item.submenu) {
                menuItem.submenu = createMenuItems(item.submenu);
              }

              return menuItem;
            });
          };

          menu.items = createMenuItems(items);
          await tray.setMenu(menu);
          */

          console.log('System tray menu set:', items);
        } catch (error) {
          console.error('Failed to set system tray menu:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Update a menu item
   * @param id The ID of the menu item to update
   * @param updates The updates to apply
   * @returns Promise that resolves when the menu item is updated
   */
  async updateMenuItem(id: string, updates: Partial<TrayMenuItem>): Promise<void> {
    if (!this.initialized && isDesktop()) {
      console.warn('System tray not initialized. Call initialize() first.');
    }

    // Update the stored menu item
    const item = this.items.get(id);
    if (item) {
      this.items.set(id, { ...item, ...updates });
    } else {
      console.warn(`Menu item with ID ${id} not found.`);
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's system tray API
          // Example of how this would be implemented with Tauri:
          /*
          import { SystemTray, SystemTrayMenuItem } from '@tauri-apps/api/tray';

          const tray = new SystemTray();
          const menu = await tray.getMenu();
          const menuItem = menu.getItem(id);

          if (menuItem) {
            if (updates.label !== undefined) {
              await menuItem.setLabel(updates.label);
            }

            if (updates.enabled !== undefined) {
              await menuItem.setEnabled(updates.enabled);
            }

            if (updates.checked !== undefined) {
              await menuItem.setChecked(updates.checked);
            }
          }
          */

          console.log(`System tray menu item ${id} updated:`, updates);
        } catch (error) {
          console.error('Failed to update system tray menu item:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }

  /**
   * Show a balloon notification
   * @param title The notification title
   * @param content The notification content
   * @param icon The notification icon
   * @returns Promise that resolves when the notification is shown
   */
  async showNotification(title: string, content: string, icon?: string): Promise<void> {
    if (!this.initialized && isDesktop()) {
      console.warn('System tray not initialized. Call initialize() first.');
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's notification API
          // Example of how this would be implemented with Tauri:
          /*
          import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

          let permissionGranted = await isPermissionGranted();
          if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
          }

          if (permissionGranted) {
            sendNotification({
              title,
              body: content,
              icon,
            });
          }
          */

          console.log(`System tray notification shown: ${title} - ${content}`);
        } catch (error) {
          console.error('Failed to show system tray notification:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          // Use the Web Notifications API in web environment
          if ('Notification' in window) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
              new Notification(title, {
                body: content,
                icon,
              });
            }
          }
        } catch (error) {
          console.error('Failed to show web notification:', error);
        }
      },
    });
  }

  /**
   * Destroy the system tray
   * @returns Promise that resolves when the tray is destroyed
   */
  async destroy(): Promise<void> {
    if (!this.initialized && isDesktop()) {
      console.warn('System tray not initialized. Call initialize() first.');
    }

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's system tray API
          // Example of how this would be implemented with Tauri:
          /*
          import { SystemTray } from '@tauri-apps/api/tray';

          const tray = new SystemTray();
          await tray.destroy();
          */

          console.log('System tray destroyed');
          this.initialized = false;
          this.items.clear();
        } catch (error) {
          console.error('Failed to destroy system tray:', error);
          throw error;
        }
      },
      web: async () => {
        // No-op in web environment
      },
    });
  }
}

// Export a singleton instance
export const trayService = new TrayService();

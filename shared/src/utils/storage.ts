import { runInEnvironment } from './environment';

/**
 * Environment-aware storage utility
 * This utility adapts its behavior based on whether it's running in desktop or web environment
 * In desktop environment, it uses Tauri's filesystem API for persistent storage
 * In web environment, it uses localStorage
 */
class StorageService {
  private prefix: string;

  constructor(prefix: string = 'keyboard-dojo-') {
    this.prefix = prefix;
  }

  /**
   * Set an item in storage
   * @param key The key to store the value under
   * @param value The value to store
   * @returns Promise that resolves when the value is stored
   */
  async setItem(key: string, value: unknown): Promise<void> {
    const prefixedKey = `${this.prefix}${key}`;
    const serializedValue = JSON.stringify(value);

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's filesystem API
          // For now, we'll use localStorage as a fallback
          localStorage.setItem(prefixedKey, serializedValue);
          
          // Example of how this would be implemented with Tauri:
          /*
          import { writeTextFile } from '@tauri-apps/api/fs';
          import { appDataDir } from '@tauri-apps/api/path';
          
          const appDataDirPath = await appDataDir();
          await writeTextFile(`${appDataDirPath}/${prefixedKey}.json`, serializedValue);
          */
        } catch (error) {
          console.error('Failed to set item in storage:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          localStorage.setItem(prefixedKey, serializedValue);
        } catch (error) {
          console.error('Failed to set item in storage:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Get an item from storage
   * @param key The key to retrieve the value for
   * @param defaultValue The default value to return if the key doesn't exist
   * @returns Promise that resolves to the value
   */
  async getItem<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    const prefixedKey = `${this.prefix}${key}`;

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's filesystem API
          // For now, we'll use localStorage as a fallback
          const value = localStorage.getItem(prefixedKey);
          
          if (value === null) {
            return defaultValue;
          }
          
          return JSON.parse(value) as T;
          
          // Example of how this would be implemented with Tauri:
          /*
          import { readTextFile } from '@tauri-apps/api/fs';
          import { appDataDir } from '@tauri-apps/api/path';
          import { exists } from '@tauri-apps/api/fs';
          
          const appDataDirPath = await appDataDir();
          const filePath = `${appDataDirPath}/${prefixedKey}.json`;
          
          const fileExists = await exists(filePath);
          if (!fileExists) {
            return defaultValue;
          }
          
          const value = await readTextFile(filePath);
          return JSON.parse(value) as T;
          */
        } catch (error) {
          console.error('Failed to get item from storage:', error);
          return defaultValue;
        }
      },
      web: async () => {
        try {
          const value = localStorage.getItem(prefixedKey);
          
          if (value === null) {
            return defaultValue;
          }
          
          return JSON.parse(value) as T;
        } catch (error) {
          console.error('Failed to get item from storage:', error);
          return defaultValue;
        }
      },
    });
  }

  /**
   * Remove an item from storage
   * @param key The key to remove
   * @returns Promise that resolves when the item is removed
   */
  async removeItem(key: string): Promise<void> {
    const prefixedKey = `${this.prefix}${key}`;

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's filesystem API
          // For now, we'll use localStorage as a fallback
          localStorage.removeItem(prefixedKey);
          
          // Example of how this would be implemented with Tauri:
          /*
          import { removeFile } from '@tauri-apps/api/fs';
          import { appDataDir } from '@tauri-apps/api/path';
          import { exists } from '@tauri-apps/api/fs';
          
          const appDataDirPath = await appDataDir();
          const filePath = `${appDataDirPath}/${prefixedKey}.json`;
          
          const fileExists = await exists(filePath);
          if (fileExists) {
            await removeFile(filePath);
          }
          */
        } catch (error) {
          console.error('Failed to remove item from storage:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          localStorage.removeItem(prefixedKey);
        } catch (error) {
          console.error('Failed to remove item from storage:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Clear all items from storage
   * @returns Promise that resolves when all items are cleared
   */
  async clear(): Promise<void> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's filesystem API
          // For now, we'll use localStorage as a fallback
          
          // Only clear items with our prefix
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
              localStorage.removeItem(key);
            }
          }
          
          // Example of how this would be implemented with Tauri:
          /*
          import { readDir, removeFile } from '@tauri-apps/api/fs';
          import { appDataDir } from '@tauri-apps/api/path';
          
          const appDataDirPath = await appDataDir();
          const entries = await readDir(appDataDirPath);
          
          for (const entry of entries) {
            if (entry.name && entry.name.startsWith(this.prefix) && entry.name.endsWith('.json')) {
              await removeFile(`${appDataDirPath}/${entry.name}`);
            }
          }
          */
        } catch (error) {
          console.error('Failed to clear storage:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          // Only clear items with our prefix
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error('Failed to clear storage:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Get all keys in storage
   * @returns Promise that resolves to an array of keys
   */
  async keys(): Promise<string[]> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's filesystem API
          // For now, we'll use localStorage as a fallback
          const keys: string[] = [];
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
              keys.push(key.slice(this.prefix.length));
            }
          }
          
          return keys;
          
          // Example of how this would be implemented with Tauri:
          /*
          import { readDir } from '@tauri-apps/api/fs';
          import { appDataDir } from '@tauri-apps/api/path';
          
          const appDataDirPath = await appDataDir();
          const entries = await readDir(appDataDirPath);
          
          const keys: string[] = [];
          for (const entry of entries) {
            if (entry.name && entry.name.startsWith(this.prefix) && entry.name.endsWith('.json')) {
              keys.push(entry.name.slice(this.prefix.length, -5)); // Remove prefix and .json
            }
          }
          
          return keys;
          */
        } catch (error) {
          console.error('Failed to get keys from storage:', error);
          return [];
        }
      },
      web: async () => {
        try {
          const keys: string[] = [];
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
              keys.push(key.slice(this.prefix.length));
            }
          }
          
          return keys;
        } catch (error) {
          console.error('Failed to get keys from storage:', error);
          return [];
        }
      },
    });
  }
}

// Export a singleton instance
export const storageService = new StorageService(); 
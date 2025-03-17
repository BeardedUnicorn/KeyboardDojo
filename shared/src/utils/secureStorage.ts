import { runInEnvironment } from './environment';

/**
 * Environment-aware secure storage utility
 * This utility adapts its behavior based on whether it's running in desktop or web environment
 * In desktop environment, it uses Tauri's secure storage API
 * In web environment, it uses localStorage with encryption
 */
class SecureStorageService {
  private prefix: string;
  private encryptionKey: string;

  constructor(prefix: string = 'keyboard-dojo-secure-', encryptionKey: string = 'default-key') {
    this.prefix = prefix;
    this.encryptionKey = encryptionKey;
  }

  /**
   * Set the encryption key
   * @param key The encryption key
   */
  setEncryptionKey(key: string): void {
    this.encryptionKey = key;
  }

  /**
   * Simple encryption for web environment
   * Note: This is not truly secure and is only used as a basic obfuscation
   * For production, use a proper encryption library
   */
  private encrypt(text: string): string {
    // Simple XOR encryption with the key
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Base64 encode
  }

  /**
   * Simple decryption for web environment
   */
  private decrypt(encryptedText: string): string {
    try {
      const text = atob(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('Failed to decrypt text:', error);
      return '';
    }
  }

  /**
   * Store a secure value
   * @param key The key to store the value under
   * @param value The value to store
   * @returns Promise that resolves when the value is stored
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    const prefixedKey = `${this.prefix}${key}`;

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's secure storage API
          // For now, we'll use localStorage with encryption as a fallback
          localStorage.setItem(prefixedKey, this.encrypt(value));
          
          // Example of how this would be implemented with Tauri:
          /*
          // Using the tauri-plugin-secure-storage
          import { SecureStorage } from 'tauri-plugin-secure-storage-api';
          const secureStorage = new SecureStorage();
          await secureStorage.set(prefixedKey, value);
          */
        } catch (error) {
          console.error('Failed to set secure item:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          // In web environment, we'll use localStorage with basic encryption
          localStorage.setItem(prefixedKey, this.encrypt(value));
        } catch (error) {
          console.error('Failed to set secure item:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Retrieve a secure value
   * @param key The key to retrieve the value for
   * @returns Promise that resolves to the value or null if not found
   */
  async getSecureItem(key: string): Promise<string | null> {
    const prefixedKey = `${this.prefix}${key}`;

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's secure storage API
          // For now, we'll use localStorage with encryption as a fallback
          const encryptedValue = localStorage.getItem(prefixedKey);
          
          if (encryptedValue === null) {
            return null;
          }
          
          return this.decrypt(encryptedValue);
          
          // Example of how this would be implemented with Tauri:
          /*
          // Using the tauri-plugin-secure-storage
          import { SecureStorage } from 'tauri-plugin-secure-storage-api';
          const secureStorage = new SecureStorage();
          return await secureStorage.get(prefixedKey);
          */
        } catch (error) {
          console.error('Failed to get secure item:', error);
          return null;
        }
      },
      web: async () => {
        try {
          const encryptedValue = localStorage.getItem(prefixedKey);
          
          if (encryptedValue === null) {
            return null;
          }
          
          return this.decrypt(encryptedValue);
        } catch (error) {
          console.error('Failed to get secure item:', error);
          return null;
        }
      },
    });
  }

  /**
   * Remove a secure value
   * @param key The key to remove
   * @returns Promise that resolves when the value is removed
   */
  async removeSecureItem(key: string): Promise<void> {
    const prefixedKey = `${this.prefix}${key}`;

    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's secure storage API
          // For now, we'll use localStorage as a fallback
          localStorage.removeItem(prefixedKey);
          
          // Example of how this would be implemented with Tauri:
          /*
          // Using the tauri-plugin-secure-storage
          import { SecureStorage } from 'tauri-plugin-secure-storage-api';
          const secureStorage = new SecureStorage();
          await secureStorage.delete(prefixedKey);
          */
        } catch (error) {
          console.error('Failed to remove secure item:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          localStorage.removeItem(prefixedKey);
        } catch (error) {
          console.error('Failed to remove secure item:', error);
          throw error;
        }
      },
    });
  }
}

// Export a singleton instance
export const secureStorage = new SecureStorageService(); 
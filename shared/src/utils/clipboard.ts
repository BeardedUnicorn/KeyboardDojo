import { runInEnvironment } from './environment';

/**
 * Environment-aware clipboard utility
 * This utility adapts its behavior based on whether it's running in desktop or web environment
 * In desktop environment, it uses Tauri's clipboard API
 * In web environment, it uses the browser's clipboard API
 */
class ClipboardService {
  /**
   * Write text to the clipboard
   * @param text The text to write to the clipboard
   * @returns Promise that resolves when the text is written
   */
  async writeText(text: string): Promise<void> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's clipboard API
          // Example of how this would be implemented with Tauri:
          /*
          import { writeText } from '@tauri-apps/api/clipboard';
          await writeText(text);
          */
          
          // For now, we'll use the browser's clipboard API as a fallback
          await navigator.clipboard.writeText(text);
        } catch (error) {
          console.error('Failed to write text to clipboard:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch (error) {
          console.error('Failed to write text to clipboard:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Read text from the clipboard
   * @returns Promise that resolves to the text from the clipboard
   */
  async readText(): Promise<string> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's clipboard API
          // Example of how this would be implemented with Tauri:
          /*
          import { readText } from '@tauri-apps/api/clipboard';
          return await readText();
          */
          
          // For now, we'll use the browser's clipboard API as a fallback
          return await navigator.clipboard.readText();
        } catch (error) {
          console.error('Failed to read text from clipboard:', error);
          throw error;
        }
      },
      web: async () => {
        try {
          return await navigator.clipboard.readText();
        } catch (error) {
          console.error('Failed to read text from clipboard:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Check if the clipboard contains text
   * @returns Promise that resolves to true if the clipboard contains text
   */
  async hasText(): Promise<boolean> {
    return runInEnvironment({
      desktop: async () => {
        try {
          // In a real implementation, we would use Tauri's clipboard API
          // Example of how this would be implemented with Tauri:
          /*
          import { readText } from '@tauri-apps/api/clipboard';
          const text = await readText();
          return text !== null && text !== '';
          */
          
          // For now, we'll use the browser's clipboard API as a fallback
          const text = await navigator.clipboard.readText();
          return text !== null && text !== '';
        } catch (error) {
          console.error('Failed to check if clipboard has text:', error);
          return false;
        }
      },
      web: async () => {
        try {
          const text = await navigator.clipboard.readText();
          return text !== null && text !== '';
        } catch (error) {
          console.error('Failed to check if clipboard has text:', error);
          return false;
        }
      },
    });
  }

  /**
   * Clear the clipboard
   * @returns Promise that resolves when the clipboard is cleared
   */
  async clear(): Promise<void> {
    return this.writeText('');
  }
}

// Export a singleton instance
export const clipboardService = new ClipboardService(); 
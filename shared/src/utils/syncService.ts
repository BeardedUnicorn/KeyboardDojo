// Remove unused imports
// import { isDesktop, runInEnvironment } from './environment';
import { apiClient } from './api';
import { storageService } from './storage';

// Interface for sync item
interface SyncItem {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  timestamp: number;
  synced: boolean;
}

/**
 * Environment-aware data synchronization service
 * This service handles data synchronization between local storage and the server
 * It queues operations when offline and syncs them when the app comes back online
 */
class SyncService {
  private syncQueue: SyncItem[] = [];
  private isInitialized = false;
  private isSyncing = false;
  private syncInterval: number | null = null;
  private readonly SYNC_QUEUE_KEY = 'sync-queue';
  private readonly SYNC_INTERVAL_MS = 60000; // 1 minute

  constructor() {
    // Initialize the service
    this.init();
  }

  /**
   * Initialize the sync service
   */
  private async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load the sync queue from storage
      await this.loadSyncQueue();

      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);

      // Start the sync interval
      this.startSyncInterval();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
    }
  }

  /**
   * Load the sync queue from storage
   */
  private async loadSyncQueue(): Promise<void> {
    try {
      const queue = await storageService.getItem<SyncItem[]>(this.SYNC_QUEUE_KEY, []);
      this.syncQueue = queue || [];
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  /**
   * Save the sync queue to storage
   */
  private async saveSyncQueue(): Promise<void> {
    try {
      await storageService.setItem(this.SYNC_QUEUE_KEY, this.syncQueue);
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = async (): Promise<void> => {
    console.log('App is online, starting sync');
    await this.syncData();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('App is offline, pausing sync');
  };

  /**
   * Start the sync interval
   */
  private startSyncInterval(): void {
    if (this.syncInterval !== null) return;

    this.syncInterval = window.setInterval(() => {
      if (navigator.onLine) {
        this.syncData().catch(error => {
          console.error('Failed to sync data:', error);
        });
      }
    }, this.SYNC_INTERVAL_MS);
  }

  /**
   * Stop the sync interval
   */
  private stopSyncInterval(): void {
    if (this.syncInterval === null) return;

    window.clearInterval(this.syncInterval);
    this.syncInterval = null;
  }

  /**
   * Add an item to the sync queue
   * @param item The item to add to the queue
   */
  async addToSyncQueue(item: Omit<SyncItem, 'timestamp' | 'synced'>): Promise<void> {
    const syncItem: SyncItem = {
      ...item,
      timestamp: Date.now(),
      synced: false,
    };

    this.syncQueue.push(syncItem);
    await this.saveSyncQueue();

    // Try to sync immediately if online
    if (navigator.onLine) {
      await this.syncData();
    }
  }

  /**
   * Sync data with the server
   */
  async syncData(): Promise<void> {
    if (this.isSyncing || !navigator.onLine || this.syncQueue.length === 0) return;

    this.isSyncing = true;

    try {
      // Process the API client's offline queue first
      await apiClient.processOfflineQueue();

      // Process our sync queue
      const itemsToSync = [...this.syncQueue].filter(item => !item.synced);

      for (const item of itemsToSync) {
        try {
          let response;

          switch (item.method) {
            case 'GET':
              response = await apiClient.get(item.endpoint);
              break;
            case 'POST':
              response = await apiClient.post(item.endpoint, item.data);
              break;
            case 'PUT':
              response = await apiClient.put(item.endpoint, item.data);
              break;
            case 'DELETE':
              response = await apiClient.delete(item.endpoint);
              break;
          }

          if (response.error === null) {
            // Mark the item as synced
            const index = this.syncQueue.findIndex(i => i.id === item.id);
            if (index !== -1) {
              this.syncQueue[index].synced = true;
            }
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }

      // Remove synced items that are older than 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      this.syncQueue = this.syncQueue.filter(
        item => !item.synced || item.timestamp > oneDayAgo
      );

      // Save the updated queue
      await this.saveSyncQueue();
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get the sync status
   * @returns Object containing sync status information
   */
  getSyncStatus(): {
    isOnline: boolean;
    pendingItems: number;
    isSyncing: boolean;
  } {
    return {
      isOnline: navigator.onLine,
      pendingItems: this.syncQueue.filter(item => !item.synced).length,
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Clean up the sync service
   */
  cleanup(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.stopSyncInterval();
  }
}

// Export a singleton instance
export const syncService = new SyncService(); 
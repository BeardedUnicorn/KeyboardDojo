/**
 * Offline Service
 *
 * This service provides functionality for handling offline mode,
 * including local storage, data synchronization, and offline indicators.
 */

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Define types for offline data
export interface OfflineData {
  lastSyncTimestamp: number;
  pendingChanges: PendingChange[];
  isOffline: boolean;
}

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
}

class OfflineService extends BaseService {
  private _isOffline: boolean = false;
  private _pendingChanges: PendingChange[] = [];
  private _lastSyncTimestamp: number = 0;
  private _offlineListeners: Set<(isOffline: boolean) => void> = new Set();
  private _syncListeners: Set<(success: boolean) => void> = new Set();

  /**
   * Initialize the offline service
   * This sets up event listeners for online/offline events
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Check initial connection status
    this._isOffline = !navigator.onLine;

    // Load offline data from local storage
    this.loadOfflineData();

    loggerService.info(`Offline service initialized. Current status: ${this._isOffline ? 'Offline' : 'Online'}`, {
      component: 'OfflineService',
      isOffline: this._isOffline,
    });
  }

  /**
   * Clean up the offline service
   * This removes event listeners and saves offline data
   */
  cleanup(): void {
    // Remove event listeners
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);

    // Save offline data to local storage
    this.saveOfflineData();

    loggerService.info('Offline service cleaned up', { component: 'OfflineService' });
    
    super.cleanup();
  }

  private handleOnline = async (): Promise<void> => {
    this._isOffline = false;
    
    // Notify listeners
    this._offlineListeners.forEach((listener) => listener(false));
    
    // Attempt to sync pending changes
    if (this._pendingChanges.length > 0) {
      await this.syncPendingChanges();
    }
    
    loggerService.info('Connection restored. Online mode activated.', { component: 'OfflineService' });
  };

  private handleOffline = (): void => {
    this._isOffline = true;
    
    // Notify listeners
    this._offlineListeners.forEach((listener) => listener(true));
    
    loggerService.warn('Connection lost. Offline mode activated.', { component: 'OfflineService' });
  };

  private loadOfflineData(): void {
    try {
      const storedData = localStorage.getItem('offline-data');
      
      if (storedData) {
        const parsedData: OfflineData = JSON.parse(storedData);
        this._pendingChanges = parsedData.pendingChanges || [];
        this._lastSyncTimestamp = parsedData.lastSyncTimestamp || 0;
        
        loggerService.info('Loaded offline data from storage', { 
          component: 'OfflineService',
          pendingChangesCount: this._pendingChanges.length,
          lastSyncTimestamp: this._lastSyncTimestamp,
        });
      }
    } catch (error) {
      loggerService.error('Failed to load offline data', error, { component: 'OfflineService' });
    }
  }

  private saveOfflineData(): void {
    try {
      const dataToStore: OfflineData = {
        lastSyncTimestamp: this._lastSyncTimestamp,
        pendingChanges: this._pendingChanges,
        isOffline: this._isOffline,
      };
      
      localStorage.setItem('offline-data', JSON.stringify(dataToStore));
      
      loggerService.info('Saved offline data to storage', { 
        component: 'OfflineService',
        pendingChangesCount: this._pendingChanges.length,
        lastSyncTimestamp: this._lastSyncTimestamp,
      });
    } catch (error) {
      loggerService.error('Failed to save offline data', error, { component: 'OfflineService' });
    }
  }

  addPendingChange(change: Omit<PendingChange, 'timestamp'>): void {
    // Add timestamp to the change
    const pendingChange: PendingChange = {
      ...change,
      timestamp: Date.now(),
    };
    
    // Add to pending changes
    this._pendingChanges.push(pendingChange);
    
    // Save to local storage
    this.saveOfflineData();
    
    loggerService.info('Added pending change', { 
      component: 'OfflineService',
      changeType: change.type,
      entity: change.entity,
      id: change.id,
      pendingChangesCount: this._pendingChanges.length,
    });
  }

  async syncPendingChanges(): Promise<boolean> {
    if (this._isOffline) {
      loggerService.warn('Cannot sync changes while offline', { component: 'OfflineService' });
      return false;
    }
    
    if (this._pendingChanges.length === 0) {
      loggerService.info('No pending changes to sync', { component: 'OfflineService' });
      return true;
    }
    
    loggerService.info(`Syncing ${this._pendingChanges.length} pending changes`, { 
      component: 'OfflineService',
      pendingChangesCount: this._pendingChanges.length,
    });
    
    try {
      // In a real implementation, this would send the changes to the server
      // For this example, we'll just simulate a successful sync
      
      // Sort changes by timestamp
      const sortedChanges = [...this._pendingChanges].sort((a, b) => a.timestamp - b.timestamp);
      
      // Process each change
      for (const change of sortedChanges) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        loggerService.info(`Synced change: ${change.type} ${change.entity} ${change.id}`, { 
          component: 'OfflineService',
          change,
        });
      }
      
      // Clear pending changes
      this._pendingChanges = [];
      
      // Update last sync timestamp
      this._lastSyncTimestamp = Date.now();
      
      // Save to local storage
      this.saveOfflineData();
      
      // Notify listeners
      this._syncListeners.forEach((listener) => listener(true));
      
      loggerService.info('Successfully synced all pending changes', { 
        component: 'OfflineService',
        lastSyncTimestamp: this._lastSyncTimestamp,
      });
      
      return true;
    } catch (error) {
      loggerService.error('Failed to sync pending changes', error, { component: 'OfflineService' });
      
      // Notify listeners
      this._syncListeners.forEach((listener) => listener(false));
      
      return false;
    }
  }

  isOffline(): boolean {
    return this._isOffline;
  }

  getPendingChangesCount(): number {
    return this._pendingChanges.length;
  }

  getPendingChanges(): PendingChange[] {
    return [...this._pendingChanges];
  }

  addOfflineListener(listener: (isOffline: boolean) => void): void {
    this._offlineListeners.add(listener);
  }

  removeOfflineListener(listener: (isOffline: boolean) => void): void {
    this._offlineListeners.delete(listener);
  }

  addSyncListener(listener: (success: boolean) => void): void {
    this._syncListeners.add(listener);
  }

  removeSyncListener(listener: (success: boolean) => void): void {
    this._syncListeners.delete(listener);
  }

  getLastSyncTimestamp(): number {
    return this._lastSyncTimestamp;
  }
}

// Create and register the service
const offlineService = new OfflineService();
serviceFactory.register('offlineService', offlineService);

// Export the singleton instance
export { offlineService };

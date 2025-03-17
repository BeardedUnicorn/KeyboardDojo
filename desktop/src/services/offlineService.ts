/**
 * Offline Service
 * 
 * This service provides functionality for handling offline mode,
 * including local storage, data synchronization, and offline indicators.
 */

import { invoke } from '@tauri-apps/api/core';

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

class OfflineService {
  private _isOffline: boolean = false;
  private _pendingChanges: PendingChange[] = [];
  private _lastSyncTimestamp: number = 0;
  private _offlineListeners: Set<(isOffline: boolean) => void> = new Set();
  private _syncListeners: Set<(success: boolean) => void> = new Set();

  /**
   * Initialize the offline service
   * This sets up event listeners for online/offline events
   */
  initialize(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Check initial connection status
    this._isOffline = !navigator.onLine;
    
    // Load offline data from local storage
    this.loadOfflineData();
    
    console.log(`Offline service initialized. Current status: ${this._isOffline ? 'Offline' : 'Online'}`);
  }

  /**
   * Clean up the offline service
   * This removes event listeners
   */
  cleanup(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    console.log('Offline service cleaned up');
  }

  /**
   * Handle online event
   */
  private handleOnline = async (): Promise<void> => {
    console.log('Device is now online');
    this._isOffline = false;
    
    // Notify listeners
    this._offlineListeners.forEach(listener => listener(false));
    
    // Attempt to sync pending changes
    await this.syncPendingChanges();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('Device is now offline');
    this._isOffline = true;
    
    // Notify listeners
    this._offlineListeners.forEach(listener => listener(true));
  };

  /**
   * Load offline data from local storage
   */
  private loadOfflineData(): void {
    try {
      const offlineDataStr = localStorage.getItem('offlineData');
      if (offlineDataStr) {
        const offlineData: OfflineData = JSON.parse(offlineDataStr);
        this._pendingChanges = offlineData.pendingChanges || [];
        this._lastSyncTimestamp = offlineData.lastSyncTimestamp || 0;
        this._isOffline = offlineData.isOffline || !navigator.onLine;
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  /**
   * Save offline data to local storage
   */
  private saveOfflineData(): void {
    try {
      const offlineData: OfflineData = {
        pendingChanges: this._pendingChanges,
        lastSyncTimestamp: this._lastSyncTimestamp,
        isOffline: this._isOffline
      };
      
      localStorage.setItem('offlineData', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  /**
   * Add a pending change to be synced when online
   * @param change The change to add
   */
  addPendingChange(change: Omit<PendingChange, 'timestamp'>): void {
    const fullChange: PendingChange = {
      ...change,
      timestamp: Date.now()
    };
    
    this._pendingChanges.push(fullChange);
    this.saveOfflineData();
    
    console.log(`Added pending change: ${change.type} ${change.entity} ${change.id}`);
  }

  /**
   * Sync pending changes with the server
   * @returns Promise that resolves when sync is complete
   */
  async syncPendingChanges(): Promise<boolean> {
    if (this._isOffline || this._pendingChanges.length === 0) {
      return false;
    }
    
    console.log(`Syncing ${this._pendingChanges.length} pending changes...`);
    
    try {
      // In a real implementation, we would use Tauri API to sync with the server
      // For now, we'll just simulate a successful sync
      
      // Example of how this would be implemented with Tauri:
      /*
      await invoke('sync_pending_changes', { 
        changes: this._pendingChanges,
        lastSyncTimestamp: this._lastSyncTimestamp
      });
      */
      
      // Update last sync timestamp
      this._lastSyncTimestamp = Date.now();
      
      // Clear pending changes
      this._pendingChanges = [];
      
      // Save updated offline data
      this.saveOfflineData();
      
      // Notify listeners
      this._syncListeners.forEach(listener => listener(true));
      
      console.log('Sync completed successfully');
      return true;
    } catch (error) {
      console.error('Error syncing pending changes:', error);
      
      // Notify listeners
      this._syncListeners.forEach(listener => listener(false));
      
      return false;
    }
  }

  /**
   * Check if the device is currently offline
   * @returns Whether the device is offline
   */
  isOffline(): boolean {
    return this._isOffline;
  }

  /**
   * Get the number of pending changes
   * @returns Number of pending changes
   */
  getPendingChangesCount(): number {
    return this._pendingChanges.length;
  }

  /**
   * Get all pending changes
   * @returns Array of pending changes
   */
  getPendingChanges(): PendingChange[] {
    return [...this._pendingChanges];
  }

  /**
   * Add a listener for offline status changes
   * @param listener The listener function
   */
  addOfflineListener(listener: (isOffline: boolean) => void): void {
    this._offlineListeners.add(listener);
  }

  /**
   * Remove a listener for offline status changes
   * @param listener The listener function
   */
  removeOfflineListener(listener: (isOffline: boolean) => void): void {
    this._offlineListeners.delete(listener);
  }

  /**
   * Add a listener for sync events
   * @param listener The listener function
   */
  addSyncListener(listener: (success: boolean) => void): void {
    this._syncListeners.add(listener);
  }

  /**
   * Remove a listener for sync events
   * @param listener The listener function
   */
  removeSyncListener(listener: (success: boolean) => void): void {
    this._syncListeners.delete(listener);
  }

  /**
   * Get the timestamp of the last successful sync
   * @returns Timestamp of the last sync
   */
  getLastSyncTimestamp(): number {
    return this._lastSyncTimestamp;
  }
}

// Export a singleton instance
export const offlineService = new OfflineService(); 
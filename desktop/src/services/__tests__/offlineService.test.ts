import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';
import { serviceFactory } from '../ServiceFactory';

// Mock dependencies
vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

vi.mock('../ServiceFactory', () => ({
  serviceFactory: {
    register: vi.fn()
  }
}));

// Create a mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Override global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.onLine
Object.defineProperty(window.navigator, 'onLine', {
  writable: true,
  value: true
});

// Create mock event listeners
const addEventListenerMock = vi.fn();
const removeEventListenerMock = vi.fn();

// Override addEventListener and removeEventListener
Object.defineProperty(window, 'addEventListener', {
  value: addEventListenerMock
});

Object.defineProperty(window, 'removeEventListener', {
  value: removeEventListenerMock
});

// Import service after mocking
import { offlineService, PendingChange } from '../offlineService';
import { loggerService } from '../loggerService';

describe('OfflineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset service status and properties
    (offlineService as any)._isOffline = false;
    (offlineService as any)._pendingChanges = [];
    (offlineService as any)._lastSyncTimestamp = 0;
    (offlineService as any)._offlineListeners = new Set();
    (offlineService as any)._syncListeners = new Set();
    (offlineService as any)._status = { initialized: false };
    
    // Reset mock localStorage
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend BaseService', () => {
    expect(offlineService).toBeInstanceOf(BaseService);
  });

  it('should initialize correctly when online', async () => {
    // Mock navigator.onLine to be true
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // Mock super.initialize
    const superInitialize = vi.spyOn(BaseService.prototype, 'initialize')
      .mockResolvedValueOnce();
    
    await offlineService.initialize();
    
    expect(superInitialize).toHaveBeenCalled();
    expect(addEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));
    expect(loggerService.info).toHaveBeenCalledWith(
      'Offline service initialized. Current status: Online',
      expect.any(Object)
    );
    expect((offlineService as any)._isOffline).toBe(false);
  });

  it('should initialize correctly when offline', async () => {
    // Mock navigator.onLine to be false
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    // Mock super.initialize
    const superInitialize = vi.spyOn(BaseService.prototype, 'initialize')
      .mockResolvedValueOnce();
    
    await offlineService.initialize();
    
    expect(superInitialize).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Offline service initialized. Current status: Offline',
      expect.any(Object)
    );
    expect((offlineService as any)._isOffline).toBe(true);
  });

  it('should load existing offline data during initialization', async () => {
    // Add some mock data to localStorage
    const mockOfflineData = {
      lastSyncTimestamp: 1234567890,
      pendingChanges: [
        {
          id: '123',
          type: 'create',
          entity: 'user',
          data: { name: 'Test User' },
          timestamp: 1234567890
        }
      ],
      isOffline: false
    };
    
    localStorageMock.setItem('offline-data', JSON.stringify(mockOfflineData));
    
    // Mock super.initialize
    vi.spyOn(BaseService.prototype, 'initialize').mockResolvedValueOnce();
    
    await offlineService.initialize();
    
    expect((offlineService as any)._lastSyncTimestamp).toBe(1234567890);
    expect((offlineService as any)._pendingChanges).toHaveLength(1);
    expect((offlineService as any)._pendingChanges[0].id).toBe('123');
  });

  it('should clean up correctly', () => {
    // Set up the service with some mock data
    (offlineService as any)._isOffline = false;
    (offlineService as any)._pendingChanges = [
      {
        id: '123',
        type: 'create',
        entity: 'user',
        data: { name: 'Test User' },
        timestamp: 1234567890
      }
    ];
    (offlineService as any)._lastSyncTimestamp = 1234567890;
    
    // Mock super.cleanup
    const superCleanup = vi.spyOn(BaseService.prototype, 'cleanup').mockImplementation();
    
    offlineService.cleanup();
    
    expect(removeEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('offline-data', expect.any(String));
    expect(superCleanup).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Offline service cleaned up',
      expect.any(Object)
    );
  });

  it('should handle going online', async () => {
    // Set up the service in offline mode with pending changes
    (offlineService as any)._isOffline = true;
    (offlineService as any)._pendingChanges = [
      {
        id: '123',
        type: 'create',
        entity: 'user',
        data: { name: 'Test User' },
        timestamp: 1234567890
      }
    ];
    
    // Mock syncPendingChanges
    const syncMock = vi.spyOn(offlineService, 'syncPendingChanges')
      .mockResolvedValueOnce(true);
    
    // Add a listener
    const listenerMock = vi.fn();
    offlineService.addOfflineListener(listenerMock);
    
    // Trigger online event handler
    await (offlineService as any).handleOnline();
    
    expect((offlineService as any)._isOffline).toBe(false);
    expect(listenerMock).toHaveBeenCalledWith(false);
    expect(syncMock).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Connection restored. Online mode activated.',
      expect.any(Object)
    );
  });

  it('should handle going offline', () => {
    // Set up the service in online mode
    (offlineService as any)._isOffline = false;
    
    // Add a listener
    const listenerMock = vi.fn();
    offlineService.addOfflineListener(listenerMock);
    
    // Trigger offline event handler
    (offlineService as any).handleOffline();
    
    expect((offlineService as any)._isOffline).toBe(true);
    expect(listenerMock).toHaveBeenCalledWith(true);
    expect(loggerService.warn).toHaveBeenCalledWith(
      'Connection lost. Offline mode activated.',
      expect.any(Object)
    );
  });

  it('should add pending changes correctly', () => {
    // Mock Date.now to return a consistent timestamp
    const mockNow = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Add a pending change
    const mockChange = {
      id: '123',
      type: 'create' as const,
      entity: 'user',
      data: { name: 'Test User' }
    };
    
    offlineService.addPendingChange(mockChange);
    
    // Check that the change was added with timestamp
    expect((offlineService as any)._pendingChanges).toHaveLength(1);
    expect((offlineService as any)._pendingChanges[0]).toEqual({
      ...mockChange,
      timestamp: mockNow
    });
    
    // Check that the changes were saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('offline-data', expect.any(String));
    expect(loggerService.info).toHaveBeenCalledWith(
      'Added pending change',
      expect.any(Object)
    );
  });

  it('should not sync changes while offline', async () => {
    // Set up the service in offline mode
    (offlineService as any)._isOffline = true;
    
    const result = await offlineService.syncPendingChanges();
    
    expect(result).toBe(false);
    expect(loggerService.warn).toHaveBeenCalledWith(
      'Cannot sync changes while offline',
      expect.any(Object)
    );
  });

  it('should sync pending changes successfully when online', async () => {
    // Set up the service in online mode with pending changes
    (offlineService as any)._isOffline = false;
    (offlineService as any)._pendingChanges = [
      {
        id: '123',
        type: 'create',
        entity: 'user',
        data: { name: 'Test User' },
        timestamp: 1234567890
      },
      {
        id: '456',
        type: 'update',
        entity: 'user',
        data: { name: 'Updated User' },
        timestamp: 1234567891
      }
    ];
    
    // Mock Date.now for lastSyncTimestamp
    const mockNow = 1234567999;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    
    // Add a sync listener
    const syncListenerMock = vi.fn();
    offlineService.addSyncListener(syncListenerMock);
    
    // Mock setTimeout to resolve immediately
    vi.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return 0 as any;
    });
    
    const result = await offlineService.syncPendingChanges();
    
    expect(result).toBe(true);
    expect((offlineService as any)._pendingChanges).toHaveLength(0);
    expect((offlineService as any)._lastSyncTimestamp).toBe(mockNow);
    expect(syncListenerMock).toHaveBeenCalledWith(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('offline-data', expect.any(String));
    expect(loggerService.info).toHaveBeenCalledWith(
      'Successfully synced all pending changes',
      expect.any(Object)
    );
  });

  it('should skip sync when no pending changes exist', async () => {
    // Set up the service in online mode with no pending changes
    (offlineService as any)._isOffline = false;
    (offlineService as any)._pendingChanges = [];
    
    const result = await offlineService.syncPendingChanges();
    
    expect(result).toBe(true);
    expect(loggerService.info).toHaveBeenCalledWith(
      'No pending changes to sync',
      expect.any(Object)
    );
  });

  it('should provide offline status and manage listeners', () => {
    // Test isOffline
    (offlineService as any)._isOffline = true;
    expect(offlineService.isOffline()).toBe(true);
    
    // Test getPendingChangesCount
    (offlineService as any)._pendingChanges = [{} as PendingChange, {} as PendingChange];
    expect(offlineService.getPendingChangesCount()).toBe(2);
    
    // Test getPendingChanges
    expect(offlineService.getPendingChanges()).toHaveLength(2);
    expect(offlineService.getPendingChanges()).not.toBe((offlineService as any)._pendingChanges); // Should be a copy
    
    // Test getLastSyncTimestamp
    (offlineService as any)._lastSyncTimestamp = 1234567890;
    expect(offlineService.getLastSyncTimestamp()).toBe(1234567890);
    
    // Test offline listeners
    const offlineListener = vi.fn();
    offlineService.addOfflineListener(offlineListener);
    (offlineService as any)._offlineListeners.forEach((listener: Function) => listener(true));
    expect(offlineListener).toHaveBeenCalledWith(true);
    
    offlineService.removeOfflineListener(offlineListener);
    offlineListener.mockClear();
    (offlineService as any)._offlineListeners.forEach((listener: Function) => listener(true));
    expect(offlineListener).not.toHaveBeenCalled();
    
    // Test sync listeners
    const syncListener = vi.fn();
    offlineService.addSyncListener(syncListener);
    (offlineService as any)._syncListeners.forEach((listener: Function) => listener(true));
    expect(syncListener).toHaveBeenCalledWith(true);
    
    offlineService.removeSyncListener(syncListener);
    syncListener.mockClear();
    (offlineService as any)._syncListeners.forEach((listener: Function) => listener(true));
    expect(syncListener).not.toHaveBeenCalled();
  });
}); 
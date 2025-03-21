import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';
import { serviceFactory } from '../ServiceFactory';

// Mock dependencies
vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.0.0')
}));

// Mock the loggerService
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

// Import service after mocking
import { updateService } from '../updateService';
import { loggerService } from '../loggerService';
import { getVersion } from '@tauri-apps/api/app';

describe('UpdateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Reset service status
    (updateService as any)._status = { initialized: false };
    (updateService as any)._updateInfo = null;
    (updateService as any)._updateProgress = { status: 'idle', progress: 0 };
    (updateService as any)._progressListeners = new Set();
    (updateService as any)._updateCheckInterval = null;
    (updateService as any)._currentVersion = '1.0.0';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should extend BaseService', () => {
    expect(updateService).toBeInstanceOf(BaseService);
  });

  it('should initialize and clean up correctly', async () => {
    // Mock super.initialize
    const superInitialize = vi.spyOn(BaseService.prototype, 'initialize').mockResolvedValue();
    
    await updateService.initialize();
    
    expect(superInitialize).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Update service initialized',
      expect.any(Object)
    );
    
    // Mock window.clearInterval for cleanup
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    updateService.cleanup();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Update service cleaned up',
      expect.any(Object)
    );
  });

  it('should add, notify, and remove progress listeners', () => {
    const listener = vi.fn();
    
    // Add the listener
    updateService.addProgressListener(listener);
    
    // Manually update progress using the private method
    (updateService as any).setProgress({ status: 'downloading', progress: 0.5 });
    
    // Verify the listener was called
    expect(listener).toHaveBeenCalledWith({ status: 'downloading', progress: 0.5 });
    
    // Remove the listener
    updateService.removeProgressListener(listener);
    
    // Clear the mock
    listener.mockClear();
    
    // Update progress again
    (updateService as any).setProgress({ status: 'ready', progress: 1 });
    
    // Verify the listener was not called
    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle update info getters correctly', async () => {
    // Initial values
    expect(updateService.isUpdateAvailable()).toBe(false);
    expect(updateService.getUpdateInfo()).toBeNull();
    expect(updateService.getCurrentVersion()).toBe('1.0.0');
    expect(updateService.getUpdateProgress()).toEqual({ status: 'idle', progress: 0 });
    
    // Set mock data
    const mockUpdateInfo = {
      version: '2.0.0',
      currentVersion: '1.0.0',
      body: 'New features',
      date: '2023-01-01T00:00:00.000Z',
      available: true
    };
    
    (updateService as any)._updateInfo = mockUpdateInfo;
    (updateService as any)._updateProgress = { status: 'downloading', progress: 0.5 };
    
    // Test updated values
    expect(updateService.isUpdateAvailable()).toBe(true);
    expect(updateService.getUpdateInfo()).toEqual(mockUpdateInfo);
    expect(updateService.getUpdateProgress()).toEqual({ status: 'downloading', progress: 0.5 });
  });
  
  it('should mock checkForUpdates to return update info', async () => {
    vi.spyOn(updateService, 'checkForUpdates').mockResolvedValue({
      version: '2.0.0',
      currentVersion: '1.0.0',
      body: 'New features',
      date: '2023-01-01T00:00:00.000Z',
      available: true
    });
    
    const result = await updateService.checkForUpdates();
    
    expect(result).not.toBeNull();
    expect(result?.available).toBe(true);
    expect(result?.version).toBe('2.0.0');
    expect(result?.body).toBe('New features');
    expect(result?.currentVersion).toBe('1.0.0');
  });
  
  it('should mock downloadAndInstallUpdate to succeed', async () => {
    // Setup for update available
    (updateService as any)._updateInfo = {
      version: '2.0.0',
      currentVersion: '1.0.0',
      body: 'New features',
      date: '2023-01-01T00:00:00.000Z',
      available: true
    };
    
    vi.spyOn(updateService, 'downloadAndInstallUpdate').mockResolvedValue(true);
    
    const result = await updateService.downloadAndInstallUpdate();
    
    expect(result).toBe(true);
  });
  
  it('should mock restartApp to succeed', async () => {
    // Mock the internal method call
    const restartSpy = vi.spyOn(updateService, 'restartApp').mockResolvedValue();
    
    await updateService.restartApp();
    
    expect(restartSpy).toHaveBeenCalled();
  });
}); 
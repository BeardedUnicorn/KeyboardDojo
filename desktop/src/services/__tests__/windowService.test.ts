import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock the Tauri window API
vi.mock('@tauri-apps/api/window', () => ({
  Window: {
    getCurrent: vi.fn().mockImplementation(() => ({
      setTitle: vi.fn().mockResolvedValue(undefined),
      minimize: vi.fn().mockResolvedValue(undefined),
      maximize: vi.fn().mockResolvedValue(undefined),
      unmaximize: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      isMaximized: vi.fn().mockResolvedValue(false),
      listen: vi.fn().mockResolvedValue(() => {}),
      startDragging: vi.fn().mockResolvedValue(undefined),
    }))
  }
}));

// Mock the logger
vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock ServiceFactory
vi.mock('../ServiceFactory', () => ({
  serviceFactory: {
    register: vi.fn()
  }
}));

// Mock document object
global.document = {
  ...global.document,
  title: ''
};

// Import service after mocking
import { windowService } from '../windowService';
import { loggerService } from '../loggerService';

describe('WindowService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend BaseService', () => {
    expect(windowService).toBeInstanceOf(BaseService);
  });

  it('should show notifications', () => {
    windowService.showNotification('Test Title', 'Test Body');
    
    expect(loggerService.info).toHaveBeenCalledWith(
      'Showing notification: Test Title - Test Body',
      expect.objectContaining({ 
        component: 'WindowService',
        title: 'Test Title',
        body: 'Test Body'
      })
    );
  });

  it('should set up system tray', () => {
    windowService.setupSystemTray();
    
    expect(loggerService.info).toHaveBeenCalledWith(
      'System tray is configured in tauri.conf.json',
      expect.objectContaining({ component: 'WindowService' })
    );
  });

  it('should clean up correctly', () => {
    // Add a spy on BaseService.cleanup
    const superCleanupSpy = vi.spyOn(BaseService.prototype, 'cleanup')
      .mockImplementation(() => {});

    windowService.cleanup();

    // Verify super.cleanup was called
    expect(superCleanupSpy).toHaveBeenCalled();
  });

  it('should handle cleanup errors gracefully', () => {
    // Mock required functions to simulate error
    vi.spyOn(BaseService.prototype, 'cleanup').mockImplementation(() => {
      throw new Error('Cleanup error');
    });

    // Call cleanup (should not throw)
    windowService.cleanup();

    // Verify warning was logged
    expect(loggerService.warn).toHaveBeenCalledWith(
      'Error cleaning up window service',
      expect.objectContaining({ 
        component: 'WindowService',
        error: expect.any(Error)
      })
    );
  });
}); 
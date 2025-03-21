import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

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
    register: vi.fn().mockImplementation((name, service) => service)
  }
}));

// Create a way to modify navigator.userAgent for testing different OSs
const mockUserAgent = (userAgent: string) => {
  const originalUserAgent = navigator.userAgent;
  
  // Mock navigator.userAgent
  Object.defineProperty(navigator, 'userAgent', {
    get: () => userAgent,
    configurable: true
  });
  
  return () => {
    // Reset to original value
    Object.defineProperty(navigator, 'userAgent', {
      get: () => originalUserAgent,
      configurable: true
    });
  };
};

// Import after mocking
import { osDetectionService, OSInfo, OperatingSystem } from '../osDetectionService';
import { loggerService } from '../loggerService';

describe('OSDetectionService', () => {
  // Save original userAgent to restore later
  const originalUserAgent = navigator.userAgent;
  
  beforeEach(() => {
    vi.clearAllMocks();
    osDetectionService.reset();
  });
  
  afterEach(() => {
    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      get: () => originalUserAgent,
      configurable: true
    });
    
    // Clear any mocks on osDetectionService methods
    vi.restoreAllMocks();
  });
  
  it('should extend BaseService', () => {
    expect(osDetectionService).toBeInstanceOf(BaseService);
  });
  
  it('should detect Windows OS correctly', async () => {
    const cleanup = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124');
    
    await osDetectionService.initialize();
    
    expect(osDetectionService.getOS()).toBe('windows');
    expect(osDetectionService.isWindows()).toBe(true);
    expect(osDetectionService.isMacOS()).toBe(false);
    expect(osDetectionService.isLinux()).toBe(false);
    
    cleanup();
  });
  
  it('should detect macOS correctly', async () => {
    const cleanup = mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/91.0.4472.124');
    
    await osDetectionService.initialize();
    
    expect(osDetectionService.getOS()).toBe('macos');
    expect(osDetectionService.isWindows()).toBe(false);
    expect(osDetectionService.isMacOS()).toBe(true);
    expect(osDetectionService.isLinux()).toBe(false);
    
    cleanup();
  });
  
  it('should detect Linux correctly', async () => {
    const cleanup = mockUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/91.0.4472.124');
    
    await osDetectionService.initialize();
    
    expect(osDetectionService.getOS()).toBe('linux');
    expect(osDetectionService.isWindows()).toBe(false);
    expect(osDetectionService.isMacOS()).toBe(false);
    expect(osDetectionService.isLinux()).toBe(true);
    
    cleanup();
  });
  
  it('should return unknown for unrecognized OS', async () => {
    const cleanup = mockUserAgent('Some unrecognized user agent string');
    
    await osDetectionService.initialize();
    
    expect(osDetectionService.getOS()).toBe('unknown');
    expect(osDetectionService.isWindows()).toBe(false);
    expect(osDetectionService.isMacOS()).toBe(false);
    expect(osDetectionService.isLinux()).toBe(false);
    
    cleanup();
  });
  
  it('should provide OS info including OS type', () => {
    const cleanup = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124');
    
    osDetectionService.initialize();
    
    const osInfo = osDetectionService.getOSInfo();
    expect(osInfo).toHaveProperty('os');
    expect(osInfo.os).toBe('windows');
    
    cleanup();
  });
  
  it('should format shortcuts based on OS', () => {
    // Test Windows format
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('windows');
    expect(osDetectionService.formatShortcut('Ctrl+C', '⌘+C')).toBe('Ctrl+C');
    
    // Test macOS format
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('macos');
    expect(osDetectionService.formatShortcut('Ctrl+C', '⌘+C')).toBe('⌘+C');
    
    // Test Linux format
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('linux');
    expect(osDetectionService.formatShortcut('Ctrl+C', '⌘+C', 'Ctrl+Shift+C')).toBe('Ctrl+Shift+C');
    expect(osDetectionService.formatShortcut('Ctrl+C', '⌘+C')).toBe('Ctrl+C'); // Falls back to Windows format
  });
  
  it('should return correct modifier key names based on OS', () => {
    // Test Windows modifiers
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('windows');
    expect(osDetectionService.getModifierKeyName('Ctrl', '⌘')).toBe('Ctrl');
    
    // Test macOS modifiers
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('macos');
    expect(osDetectionService.getModifierKeyName('Ctrl', '⌘')).toBe('⌘');
    
    // Test Linux modifiers
    vi.spyOn(osDetectionService, 'getOS').mockReturnValue('linux');
    expect(osDetectionService.getModifierKeyName('Ctrl', '⌘', 'Ctrl')).toBe('Ctrl');
    expect(osDetectionService.getModifierKeyName('Ctrl', '⌘')).toBe('Ctrl'); // Falls back to Windows format
  });
  
  it('should convert shortcuts to the current OS format', () => {
    // Test Windows format
    vi.spyOn(osDetectionService, 'isWindows').mockReturnValue(true);
    vi.spyOn(osDetectionService, 'isMacOS').mockReturnValue(false);
    vi.spyOn(osDetectionService, 'isLinux').mockReturnValue(false);
    
    expect(osDetectionService.convertShortcut('Ctrl+C')).toBe('Ctrl+C');
    expect(osDetectionService.convertShortcut('Command+C')).toBe('Win+C');
    expect(osDetectionService.convertShortcut('Meta+C')).toBe('Win+C');
    
    // Test macOS format
    vi.spyOn(osDetectionService, 'isWindows').mockReturnValue(false);
    vi.spyOn(osDetectionService, 'isMacOS').mockReturnValue(true);
    vi.spyOn(osDetectionService, 'isLinux').mockReturnValue(false);
    
    expect(osDetectionService.convertShortcut('Ctrl+C')).toBe('⌘+C');
    expect(osDetectionService.convertShortcut('Alt+C')).toBe('⌥+C');
    expect(osDetectionService.convertShortcut('Shift+C')).toBe('⇧+C');
    
    // Test Linux format
    vi.spyOn(osDetectionService, 'isWindows').mockReturnValue(false);
    vi.spyOn(osDetectionService, 'isMacOS').mockReturnValue(false);
    vi.spyOn(osDetectionService, 'isLinux').mockReturnValue(true);
    
    expect(osDetectionService.convertShortcut('Ctrl+C')).toBe('Ctrl+C');
    expect(osDetectionService.convertShortcut('Command+C')).toBe('Super+C');
    expect(osDetectionService.convertShortcut('Meta+C')).toBe('Super+C');
  });
  
  it('should format shortcuts for OS display', async () => {
    const formatSpy = vi.spyOn(osDetectionService, 'convertShortcut');
    
    osDetectionService.formatShortcutForOS('Ctrl+C');
    
    expect(formatSpy).toHaveBeenCalledWith('Ctrl+C');
  });
  
  it('should auto-initialize when getOS is called', () => {
    const initSpy = vi.spyOn(osDetectionService, 'initialize');
    
    // Reset to ensure it's not initialized
    osDetectionService.reset();
    
    // Method should auto-initialize
    osDetectionService.getOS();
    
    expect(initSpy).toHaveBeenCalled();
    expect(loggerService.warn).toHaveBeenCalledWith('OS detection not initialized, initializing now...');
  });
  
  it('should handle OS change listeners correctly', () => {
    const listener = vi.fn();
    
    // Add listener
    osDetectionService.addOSChangeListener(listener);
    
    // Trigger OS detection
    osDetectionService.initialize();
    
    // Should call listener when OS changes
    expect(listener).toHaveBeenCalled();
    
    // Reset mocks and remove listener
    vi.clearAllMocks();
    osDetectionService.removeOSChangeListener(listener);
    
    // Reinitialize - listener should not be called now
    osDetectionService.reset();
    osDetectionService.initialize();
    
    expect(listener).not.toHaveBeenCalled();
  });
  
  it('should log errors if initialization fails', async () => {
    // Cause an error by making initialize throw
    vi.spyOn(BaseService.prototype, 'initialize').mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Should log error
    await expect(osDetectionService.initialize()).rejects.toThrow('Test error');
    expect(loggerService.error).toHaveBeenCalledWith('Error detecting operating system:', expect.any(Object));
  });
}); 
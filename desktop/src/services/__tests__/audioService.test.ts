import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock dependencies first
vi.mock('../loggerService', () => ({
  loggerService: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock('../ServiceFactory', () => ({
  serviceFactory: {
    register: vi.fn()
  }
}));

// Create a very simple mock for the Audio constructor
vi.stubGlobal('Audio', vi.fn(() => ({
  play: vi.fn().mockImplementation(() => Promise.resolve()),
  volume: 0,
  currentTime: 0
})));

// Mock localStorage for the test
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Import after mocking
import { audioService } from '../audioService';
import { loggerService } from '../loggerService';

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should extend BaseService', () => {
    expect(audioService).toBeInstanceOf(BaseService);
  });
  
  it('should initialize and cleanup properly', async () => {
    // Test initialization
    await audioService.initialize();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Audio service initialized',
      expect.any(Object)
    );
    
    // Test cleanup
    audioService.cleanup();
    expect(loggerService.error).not.toHaveBeenCalled();
    expect(loggerService.info).toHaveBeenCalledWith(
      'Audio service cleaned up',
      expect.any(Object)
    );
  });
  
  it('should have required audio methods', () => {
    // Check that required methods exist
    expect(typeof audioService.playSound).toBe('function');
    expect(typeof audioService.setVolume).toBe('function');
    expect(typeof audioService.getVolume).toBe('function');
    expect(typeof audioService.setMuted).toBe('function');
    expect(typeof audioService.getMuted).toBe('function');
    expect(typeof audioService.toggleMute).toBe('function');
    expect(typeof audioService.preloadSounds).toBe('function');
  });
  
  it('should get volume in valid range', () => {
    const volume = audioService.getVolume();
    expect(volume).toBeGreaterThanOrEqual(0);
    expect(volume).toBeLessThanOrEqual(1);
  });
  
  it('should return boolean for muted status', () => {
    const muted = audioService.getMuted();
    expect(typeof muted).toBe('boolean');
  });
}); 
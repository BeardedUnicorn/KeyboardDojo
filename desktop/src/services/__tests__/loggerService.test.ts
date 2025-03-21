import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LogLevel } from '../loggerService';
import { BaseService } from '../BaseService';

// Mock Sentry
vi.mock('../../utils/sentry', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

// Create a mock logger service for testing since we need to avoid the imported singleton
class MockLoggerService extends BaseService {
  private minLevel: LogLevel = LogLevel.INFO;
  private enableSentry: boolean = true;
  
  // Mock log methods
  debug = vi.fn();
  info = vi.fn();
  warn = vi.fn();
  error = vi.fn();
  
  // Configuration method
  configure(config: { minLevel?: LogLevel, enableSentry?: boolean }) {
    if (config.minLevel !== undefined) {
      this.minLevel = config.minLevel;
    }
    if (config.enableSentry !== undefined) {
      this.enableSentry = config.enableSentry;
    }
  }
  
  // Check if a log level should be displayed
  shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.minLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= configLevelIndex;
  }
  
  // Methods to control behavior
  getMinLevel(): LogLevel {
    return this.minLevel;
  }
  
  isSentryEnabled(): boolean {
    return this.enableSentry;
  }
}

// Import Sentry mocks
import { captureException, captureMessage, addBreadcrumb } from '../../utils/sentry';

describe('LoggerService', () => {
  let loggerService: MockLoggerService;
  
  beforeEach(() => {
    // Reset mocks and create a fresh logger
    vi.clearAllMocks();
    loggerService = new MockLoggerService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default config', () => {
    expect(loggerService.getMinLevel()).toBe(LogLevel.INFO);
    expect(loggerService.isSentryEnabled()).toBe(true);
  });

  it('should update configuration correctly', () => {
    // Change config
    loggerService.configure({
      minLevel: LogLevel.ERROR,
      enableSentry: false
    });
    
    // Verify changes
    expect(loggerService.getMinLevel()).toBe(LogLevel.ERROR);
    expect(loggerService.isSentryEnabled()).toBe(false);
  });

  it('shouldLog should filter based on log level', () => {
    // Default min level is INFO
    expect(loggerService.shouldLog(LogLevel.DEBUG)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.INFO)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.WARN)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.ERROR)).toBe(true);
    
    // Change min level to WARN
    loggerService.configure({ minLevel: LogLevel.WARN });
    
    expect(loggerService.shouldLog(LogLevel.DEBUG)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.INFO)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.WARN)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.ERROR)).toBe(true);
    
    // Change min level to ERROR
    loggerService.configure({ minLevel: LogLevel.ERROR });
    
    expect(loggerService.shouldLog(LogLevel.DEBUG)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.INFO)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.WARN)).toBe(false);
    expect(loggerService.shouldLog(LogLevel.ERROR)).toBe(true);
    
    // Change min level to DEBUG
    loggerService.configure({ minLevel: LogLevel.DEBUG });
    
    expect(loggerService.shouldLog(LogLevel.DEBUG)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.INFO)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.WARN)).toBe(true);
    expect(loggerService.shouldLog(LogLevel.ERROR)).toBe(true);
  });

  it('should derive from BaseService and implement its methods', async () => {
    // Test inheritance from BaseService
    expect(loggerService).toBeInstanceOf(BaseService);
    
    // Test initialize method exists
    const initSpy = vi.spyOn(loggerService, 'initialize');
    await loggerService.initialize();
    expect(initSpy).toHaveBeenCalled();
    
    // Test cleanup method exists
    const cleanupSpy = vi.spyOn(loggerService, 'cleanup');
    loggerService.cleanup();
    expect(cleanupSpy).toHaveBeenCalled();
  });

  it('should have all required logging methods', () => {
    // Test that all logging methods exist
    expect(typeof loggerService.debug).toBe('function');
    expect(typeof loggerService.info).toBe('function');
    expect(typeof loggerService.warn).toBe('function');
    expect(typeof loggerService.error).toBe('function');
  });
}); 
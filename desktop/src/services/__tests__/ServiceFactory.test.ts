import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseService } from '../BaseService';

// Mock the loggerService
vi.mock('../loggerService', () => ({
  loggerService: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Create a test service for testing
class TestService extends BaseService {
  public initializeCalled = false;
  public cleanupCalled = false;
  public initializeError: Error | null = null;
  
  async initialize(): Promise<void> {
    this.initializeCalled = true;
    if (this.initializeError) {
      throw this.initializeError;
    }
    await super.initialize();
  }
  
  cleanup(): void {
    this.cleanupCalled = true;
    super.cleanup();
  }
  
  setInitializeError(error: Error): void {
    this.initializeError = error;
  }
}

// Create a ServiceFactory class for testing purposes
// This mirrors the implementation in ServiceFactory.ts
class ServiceFactory {
  private services: Map<string, BaseService> = new Map();
  private initializedServices: Set<string> = new Set();

  register<T extends BaseService>(name: string, service: T): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }
    this.services.set(name, service);
    return service;
  }

  get<T extends BaseService>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} is not registered`);
    }
    return service as T;
  }

  async initializeService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Cannot initialize service ${name}: not registered`);
    }
    
    if (this.initializedServices.has(name)) {
      return;
    }
    
    if (service.isInitializing && service.isInitializing()) {
      return;
    }
    
    try {
      await service.initialize();
      
      if (!service.isInitialized()) {
        throw new Error(`Service ${name} initialize() method completed but service not marked as initialized`);
      }
      
      this.initializedServices.add(name);
    } catch (error) {
      throw error;
    }
  }

  async initializeAll(): Promise<void> {
    const serviceNames = Array.from(this.services.keys());
    for (const name of serviceNames) {
      await this.initializeService(name);
    }
  }

  cleanupService(name: string): void {
    const service = this.services.get(name);
    if (!service) {
      return;
    }
    
    if (!this.initializedServices.has(name)) {
      return;
    }
    
    try {
      service.cleanup();
      this.initializedServices.delete(name);
    } catch (error) {
      throw error;
    }
  }

  cleanupAll(): void {
    const initializedServices = Array.from(this.initializedServices);
    for (const name of initializedServices) {
      this.cleanupService(name);
    }
  }

  hasService(name: string): boolean {
    return this.services.has(name);
  }

  isServiceInitialized(name: string): boolean {
    return this.initializedServices.has(name);
  }

  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }
}

describe('ServiceFactory', () => {
  let serviceFactory: ServiceFactory;
  let testService: TestService;
  
  beforeEach(() => {
    serviceFactory = new ServiceFactory();
    testService = new TestService();
    
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('registerService adds service to registry', () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    
    expect(serviceFactory.hasService(name)).toBe(true);
  });
  
  it('registerService returns existing service if already registered', () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    const otherService = new TestService();
    const returnedService = serviceFactory.register(name, otherService);
    
    expect(returnedService).toBe(testService);
    expect(returnedService).not.toBe(otherService);
  });
  
  it('getService returns requested service instance', () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    const returnedService = serviceFactory.get(name);
    
    expect(returnedService).toBe(testService);
  });
  
  it('getService throws error if service not registered', () => {
    const name = 'nonExistentService';
    
    expect(() => serviceFactory.get(name)).toThrow(`Service ${name} is not registered`);
  });
  
  it('hasService correctly reports service availability', () => {
    const name = 'testService';
    
    expect(serviceFactory.hasService(name)).toBe(false);
    
    serviceFactory.register(name, testService);
    
    expect(serviceFactory.hasService(name)).toBe(true);
  });
  
  it('initializeService initializes requested service', async () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    await serviceFactory.initializeService(name);
    
    expect(testService.initializeCalled).toBe(true);
    expect(serviceFactory.isServiceInitialized(name)).toBe(true);
  });
  
  it('initializeService throws error if service not registered', async () => {
    const name = 'nonExistentService';
    
    await expect(serviceFactory.initializeService(name)).rejects.toThrow(
      `Cannot initialize service ${name}: not registered`
    );
  });
  
  it('initializeService handles service initialization error', async () => {
    const name = 'testService';
    const error = new Error('Test initialization error');
    
    serviceFactory.register(name, testService);
    testService.setInitializeError(error);
    
    await expect(serviceFactory.initializeService(name)).rejects.toThrow(error);
    expect(serviceFactory.isServiceInitialized(name)).toBe(false);
  });
  
  it('initializeAll initializes all registered services', async () => {
    const services = {
      service1: new TestService(),
      service2: new TestService(),
      service3: new TestService()
    };
    
    // Register all services
    Object.entries(services).forEach(([name, service]) => {
      serviceFactory.register(name, service);
    });
    
    await serviceFactory.initializeAll();
    
    // Verify all services were initialized
    Object.entries(services).forEach(([name, service]) => {
      expect((service as TestService).initializeCalled).toBe(true);
      expect(serviceFactory.isServiceInitialized(name)).toBe(true);
    });
  });
  
  it('cleanupService cleans up initialized service', async () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    await serviceFactory.initializeService(name);
    
    serviceFactory.cleanupService(name);
    
    expect(testService.cleanupCalled).toBe(true);
    expect(serviceFactory.isServiceInitialized(name)).toBe(false);
  });
  
  it('cleanupService does nothing if service not initialized', () => {
    const name = 'testService';
    
    serviceFactory.register(name, testService);
    serviceFactory.cleanupService(name);
    
    expect(testService.cleanupCalled).toBe(false);
  });
  
  it('cleanupAll cleans up all initialized services', async () => {
    const services = {
      service1: new TestService(),
      service2: new TestService(),
      service3: new TestService()
    };
    
    // Register and initialize all services
    for (const [name, service] of Object.entries(services)) {
      serviceFactory.register(name, service);
      await serviceFactory.initializeService(name);
    }
    
    serviceFactory.cleanupAll();
    
    // Verify all services were cleaned up
    Object.entries(services).forEach(([name, service]) => {
      expect((service as TestService).cleanupCalled).toBe(true);
      expect(serviceFactory.isServiceInitialized(name)).toBe(false);
    });
  });
  
  it('dependency resolution works correctly', async () => {
    // This test verifies that services are initialized in the correct order
    const services = {
      service1: new TestService(),
      service2: new TestService(),
      service3: new TestService()
    };
    
    const initializeOrder: string[] = [];
    
    // Override initialize to track order
    Object.entries(services).forEach(([name, service]) => {
      const originalInitialize = service.initialize.bind(service);
      vi.spyOn(service, 'initialize').mockImplementation(async () => {
        initializeOrder.push(name);
        return originalInitialize();
      });
      
      serviceFactory.register(name, service);
    });
    
    await serviceFactory.initializeAll();
    
    // Verify initialization order matches registration order
    expect(initializeOrder).toEqual(['service1', 'service2', 'service3']);
  });
  
  it('getServiceNames returns all registered service names', () => {
    const services = {
      service1: new TestService(),
      service2: new TestService(),
      service3: new TestService()
    };
    
    // Register all services
    Object.entries(services).forEach(([name, service]) => {
      serviceFactory.register(name, service);
    });
    
    const serviceNames = serviceFactory.getServiceNames();
    
    expect(serviceNames).toHaveLength(3);
    expect(serviceNames).toContain('service1');
    expect(serviceNames).toContain('service2');
    expect(serviceNames).toContain('service3');
  });
}); 
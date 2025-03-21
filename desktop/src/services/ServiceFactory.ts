/**
 * ServiceFactory
 * 
 * A factory for creating and managing service instances.
 * Ensures services are properly initialized and cleaned up.
 */

import { loggerService } from './loggerService';

import type { BaseService } from './BaseService';

class ServiceFactory {
  private services: Map<string, BaseService> = new Map();
  private initializedServices: Set<string> = new Set();

  /**
   * Register a service with the factory
   * @param name The name of the service
   * @param service The service instance
   */
  register<T extends BaseService>(name: string, service: T): T {
    if (this.services.has(name)) {
      loggerService.debug(`Service ${name} is already registered. Returning existing instance.`, {
        component: 'ServiceFactory',
        action: 'register',
        serviceName: name,
      });
      return this.services.get(name) as T;
    }

    this.services.set(name, service);
    loggerService.info(`Service ${name} registered`, {
      component: 'ServiceFactory',
      action: 'register',
      serviceName: name,
    });
    
    return service;
  }

  /**
   * Get a service by name
   * @param name The name of the service
   * @returns The service instance
   * @throws Error if the service is not registered
   */
  get<T extends BaseService>(name: string): T {
    const service = this.services.get(name);
    
    if (!service) {
      const error = new Error(`Service ${name} is not registered`);
      loggerService.error(`Failed to get service ${name}`, error, {
        component: 'ServiceFactory',
        action: 'get',
        serviceName: name,
      });
      throw error;
    }
    
    return service as T;
  }

  /**
   * Initialize a service
   * @param name The name of the service
   * @returns A promise that resolves when the service is initialized
   * @throws Error if the service initialization fails
   */
  async initializeService(name: string): Promise<void> {
    const service = this.services.get(name);
    
    if (!service) {
      const error = new Error(`Cannot initialize service ${name}: not registered`);
      loggerService.error(`Failed to initialize service ${name}`, error, {
        component: 'ServiceFactory',
        action: 'initializeService',
        serviceName: name,
      });
      throw error; // Throw to properly signal failure
    }
    
    if (this.initializedServices.has(name)) {
      loggerService.debug(`Service ${name} is already initialized`, {
        component: 'ServiceFactory',
        action: 'initializeService',
        serviceName: name,
      });
      return;
    }
    
    // Check if the service is already initializing to prevent duplicate initialization
    if (service.isInitializing && service.isInitializing()) {
      loggerService.debug(`Service ${name} is already initializing, waiting for completion`, {
        component: 'ServiceFactory',
        action: 'initializeService',
        serviceName: name,
      });
      return;
    }
    
    try {
      await service.initialize();
      
      // Verify service is actually initialized
      if (!service.isInitialized()) {
        const error = new Error(`Service ${name} initialize() method completed but service not marked as initialized`);
        loggerService.error(`Failed to initialize service ${name}`, error, {
          component: 'ServiceFactory',
          action: 'initializeService',
          serviceName: name,
        });
        throw error; // Throw to properly signal failure
      }
      
      this.initializedServices.add(name);
      
      loggerService.info(`Service ${name} initialized`, {
        component: 'ServiceFactory',
        action: 'initializeService',
        serviceName: name,
      });
    } catch (error) {
      loggerService.error(`Failed to initialize service ${name}`, error, {
        component: 'ServiceFactory',
        action: 'initializeService',
        serviceName: name,
      });
      
      throw error; // Always throw to properly signal failures
    }
  }

  /**
   * Initialize all registered services
   * @returns A promise that resolves when all services are initialized
   */
  async initializeAll(): Promise<void> {
    const serviceNames = Array.from(this.services.keys());
    
    loggerService.info(`Initializing all services: ${serviceNames.join(', ')}`, {
      component: 'ServiceFactory',
      action: 'initializeAll',
      serviceCount: serviceNames.length,
    });
    
    for (const name of serviceNames) {
      await this.initializeService(name);
    }
    
    loggerService.info('All services initialized', {
      component: 'ServiceFactory',
      action: 'initializeAll',
      initializedCount: this.initializedServices.size,
    });
  }

  /**
   * Clean up a service
   * @param name The name of the service
   */
  cleanupService(name: string): void {
    const service = this.services.get(name);
    
    if (!service) {
      loggerService.debug(`Cannot clean up service ${name}: not registered`, {
        component: 'ServiceFactory',
        action: 'cleanupService',
        serviceName: name,
      });
      return;
    }
    
    if (!this.initializedServices.has(name)) {
      loggerService.debug(`Service ${name} is not initialized, no cleanup needed`, {
        component: 'ServiceFactory',
        action: 'cleanupService',
        serviceName: name,
      });
      return;
    }
    
    try {
      service.cleanup();
      this.initializedServices.delete(name);
      
      loggerService.info(`Service ${name} cleaned up`, {
        component: 'ServiceFactory',
        action: 'cleanupService',
        serviceName: name,
      });
    } catch (error) {
      loggerService.error(`Failed to clean up service ${name}`, error, {
        component: 'ServiceFactory',
        action: 'cleanupService',
        serviceName: name,
      });
    }
  }

  /**
   * Clean up all initialized services
   */
  cleanupAll(): void {
    const initializedServices = Array.from(this.initializedServices);
    
    loggerService.info(`Cleaning up all services: ${initializedServices.join(', ')}`, {
      component: 'ServiceFactory',
      action: 'cleanupAll',
      serviceCount: initializedServices.length,
    });
    
    for (const name of initializedServices) {
      this.cleanupService(name);
    }
    
    loggerService.info('All services cleaned up', {
      component: 'ServiceFactory',
      action: 'cleanupAll',
    });
  }

  /**
   * Check if a service is registered
   * @param name The name of the service
   * @returns True if the service is registered, false otherwise
   */
  hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Check if a service is initialized
   * @param name The name of the service
   * @returns True if the service is initialized, false otherwise
   */
  isServiceInitialized(name: string): boolean {
    return this.initializedServices.has(name);
  }

  /**
   * Get all registered service names
   * @returns An array of service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get all initialized service names
   * @returns An array of initialized service names
   */
  getInitializedServiceNames(): string[] {
    return Array.from(this.initializedServices);
  }
}

// Export a singleton instance
export const serviceFactory = new ServiceFactory(); 

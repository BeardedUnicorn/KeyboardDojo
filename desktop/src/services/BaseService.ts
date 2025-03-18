/**
 * BaseService
 * 
 * A base class for all services in the application.
 * Provides common functionality and standardized patterns for service lifecycle management.
 */

import { loggerService } from './loggerService';

export interface ServiceStatus {
  initialized: boolean;
  error?: Error | null;
}

export abstract class BaseService {
  protected _status: ServiceStatus = {
    initialized: false,
    error: null,
  };

  /**
   * Initialize the service
   * This method should be overridden by child classes
   */
  async initialize(): Promise<void> {
    try {
      // Child classes should override this method
      this._status.initialized = true;
      this._status.error = null;
      
      loggerService.info(`${this.constructor.name} initialized successfully`, {
        component: this.constructor.name,
        action: 'initialize',
      });
    } catch (error) {
      this._status.error = error instanceof Error ? error : new Error(String(error));
      this._status.initialized = false;
      
      loggerService.error(`Failed to initialize ${this.constructor.name}`, error, {
        component: this.constructor.name,
        action: 'initialize',
      });
      
      throw error;
    }
  }

  /**
   * Clean up the service
   * This method should be overridden by child classes
   */
  cleanup(): void {
    try {
      // Child classes should override this method
      this._status.initialized = false;
      
      loggerService.info(`${this.constructor.name} cleaned up successfully`, {
        component: this.constructor.name,
        action: 'cleanup',
      });
    } catch (error) {
      loggerService.error(`Failed to clean up ${this.constructor.name}`, error, {
        component: this.constructor.name,
        action: 'cleanup',
      });
      
      throw error;
    }
  }

  /**
   * Get the current status of the service
   */
  getStatus(): ServiceStatus {
    return { ...this._status };
  }

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean {
    return this._status.initialized;
  }

  /**
   * Reset the service to its initial state
   * This method can be overridden by child classes
   */
  reset(): void {
    this._status.initialized = false;
    this._status.error = null;
    
    loggerService.info(`${this.constructor.name} reset`, {
      component: this.constructor.name,
      action: 'reset',
    });
  }
} 

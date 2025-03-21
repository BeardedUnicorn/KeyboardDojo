/**
 * BaseService
 * 
 * A base class for all services in the application.
 * Provides common functionality and standardized patterns for service lifecycle management.
 */

export interface ServiceStatus {
  initialized: boolean;
  initializing?: boolean;
  error?: Error | null;
}

export abstract class BaseService {
  protected _status: ServiceStatus = {
    initialized: false,
    initializing: false,
    error: null,
  };

  /**
   * Initialize the service
   * This method should be overridden by child classes
   */
  async initialize(): Promise<void> {
    try {
      // Set initializing flag
      this._status.initializing = true;
      
      // Child classes should override this method
      this._status.initialized = true;
      this._status.error = null;
      
      // Using console.info instead of loggerService to avoid circular dependency
      console.info(`[BaseService] ${this.constructor.name} initialized successfully`);
    } catch (error) {
      this._status.error = error instanceof Error ? error : new Error(String(error));
      this._status.initialized = false;
      
      // Using console.error instead of loggerService to avoid circular dependency
      console.error(`[BaseService] Failed to initialize ${this.constructor.name}`, error);
      
      throw error;
    } finally {
      // Clear initializing flag
      this._status.initializing = false;
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
      
      // Using console.info instead of loggerService to avoid circular dependency
      console.info(`[BaseService] ${this.constructor.name} cleaned up successfully`);
    } catch (error) {
      // Using console.error instead of loggerService to avoid circular dependency
      console.error(`[BaseService] Failed to clean up ${this.constructor.name}`, error);
      
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
   * Check if the service is currently initializing
   */
  isInitializing(): boolean {
    return !!this._status.initializing;
  }

  /**
   * Reset the service to its initial state
   * This method can be overridden by child classes
   */
  reset(): void {
    this._status.initialized = false;
    this._status.initializing = false;
    this._status.error = null;
    
    // Using console.info instead of loggerService to avoid circular dependency
    console.info(`[BaseService] ${this.constructor.name} reset`);
  }
} 

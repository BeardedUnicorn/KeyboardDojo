import { runInEnvironment } from './environment';
import { secureStorage } from './secureStorage';

// API configuration
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseUrl: 'https://api.keyboarddojo.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API response interface
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

// Offline request interface
interface OfflineRequest {
  id: string;
  method: string;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
}

/**
 * Environment-aware API client
 * This client adapts its behavior based on whether it's running in desktop or web environment
 */
class ApiClient {
  private config: ApiConfig;
  private authToken: string | null = null;
  private offlineQueue: OfflineRequest[] = [];
  private readonly AUTH_TOKEN_KEY = 'auth-token';
  private readonly OFFLINE_QUEUE_KEY = 'offline-queue';
  private isInitialized = false;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.init();
  }

  /**
   * Initialize the API client
   */
  private async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load the auth token from secure storage
      const token = await secureStorage.getSecureItem(this.AUTH_TOKEN_KEY);
      if (token) {
        this.authToken = token;
      }

      // Load offline queue from storage
      const queueData = await secureStorage.getSecureItem(this.OFFLINE_QUEUE_KEY);
      if (queueData) {
        try {
          this.offlineQueue = JSON.parse(queueData) as OfflineRequest[];
        } catch (e) {
          console.error('Failed to parse offline queue data:', e);
        }
      }

      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnline);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize API client:', error);
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = async (): Promise<void> => {
    console.log('App is online, processing offline queue');
    await this.processOfflineQueue();
  };

  /**
   * Set the authentication token
   * @param token The authentication token
   */
  async setAuthToken(token: string | null): Promise<void> {
    this.authToken = token;

    // StorePage the token in secure storage
    if (token) {
      await secureStorage.setSecureItem(this.AUTH_TOKEN_KEY, token);
    } else {
      await secureStorage.removeSecureItem(this.AUTH_TOKEN_KEY);
    }
  }

  /**
   * Get the current authentication token
   * @returns The current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Check if the user is authenticated
   * @returns True if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  /**
   * Make an API request
   * @param method The HTTP method
   * @param endpoint The API endpoint
   * @param data The request data
   * @param headers Additional headers
   * @returns Promise that resolves to the API response
   */
  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const requestHeaders = {
      ...this.config.headers,
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      ...headers,
    };

    // Different implementation for desktop and web
    return runInEnvironment({
      desktop: async () => {
        try {
          // Check if we're offline
          if (!navigator.onLine) {
            // Queue the request for later
            const offlineRequest: OfflineRequest = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              method,
              url,
              data,
              headers: requestHeaders,
              timestamp: Date.now(),
            };

            this.offlineQueue.push(offlineRequest);

            return {
              data: null,
              error: new Error('Offline mode: Request queued for later'),
              status: 0,
            };
          }

          // In a real implementation, we might use Tauri's HTTP client or other desktop-specific APIs
          // For now, we'll use the standard fetch API
          const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: data ? JSON.stringify(data) : undefined,
            signal: AbortSignal.timeout(this.config.timeout),
          });

          // Check if the response is unauthorized
          if (response.status === 401) {
            // Clear the auth token
            await this.setAuthToken(null);

            return {
              data: null,
              error: new Error('Unauthorized: Please log in again'),
              status: response.status,
            };
          }

          const responseData = await response.json();

          return {
            data: responseData as T,
            error: null,
            status: response.status,
          };
        } catch (error) {
          return {
            data: null,
            error: error as Error,
            status: 0,
          };
        }
      },
      web: async () => {
        try {
          // Check if we're offline
          if (!navigator.onLine) {
            // Queue the request for later
            const offlineRequest: OfflineRequest = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              method,
              url,
              data,
              headers: requestHeaders,
              timestamp: Date.now(),
            };

            this.offlineQueue.push(offlineRequest);

            return {
              data: null,
              error: new Error('Offline mode: Request queued for later'),
              status: 0,
            };
          }

          const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: data ? JSON.stringify(data) : undefined,
            signal: AbortSignal.timeout(this.config.timeout),
          });

          // Check if the response is unauthorized
          if (response.status === 401) {
            // Clear the auth token
            await this.setAuthToken(null);

            return {
              data: null,
              error: new Error('Unauthorized: Please log in again'),
              status: response.status,
            };
          }

          const responseData = await response.json();

          return {
            data: responseData as T,
            error: null,
            status: response.status,
          };
        } catch (error) {
          return {
            data: null,
            error: error as Error,
            status: 0,
          };
        }
      },
    });
  }

  /**
   * Make a GET request
   * @param endpoint The API endpoint
   * @param headers Additional headers
   * @returns Promise that resolves to the API response
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  /**
   * Make a POST request
   * @param endpoint The API endpoint
   * @param data The request data
   * @param headers Additional headers
   * @returns Promise that resolves to the API response
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  /**
   * Make a PUT request
   * @param endpoint The API endpoint
   * @param data The request data
   * @param headers Additional headers
   * @returns Promise that resolves to the API response
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  /**
   * Make a DELETE request
   * @param endpoint The API endpoint
   * @param headers Additional headers
   * @returns Promise that resolves to the API response
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  /**
   * Process the offline queue
   * This method attempts to send all queued requests when the app comes back online
   * @returns Promise that resolves when all queued requests have been processed
   */
  async processOfflineQueue(): Promise<void> {
    if (!navigator.onLine || this.offlineQueue.length === 0) {
      return;
    }

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queue) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.data ? JSON.stringify(request.data) : undefined,
          signal: AbortSignal.timeout(this.config.timeout),
        });
      } catch (error) {
        console.error('Failed to process offline request:', error);
        // Re-queue the request if it's less than 24 hours old
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        if (request.timestamp > oneDayAgo) {
          this.offlineQueue.push(request);
        }
      }
    }
  }

  /**
   * Get the offline queue status
   * @returns Object containing offline queue status information
   */
  getOfflineQueueStatus(): {
    isOnline: boolean;
    queueLength: number;
  } {
    return {
      isOnline: navigator.onLine,
      queueLength: this.offlineQueue.length,
    };
  }

  /**
   * Clean up the API client
   */
  cleanup(): void {
    window.removeEventListener('online', this.handleOnline);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

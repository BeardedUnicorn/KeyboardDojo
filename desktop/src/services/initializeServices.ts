/**
 * Service Initialization Utility
 * 
 * This utility provides functions to initialize and clean up all services in the application.
 * It ensures services are initialized in the correct order and handles dependencies.
 */

import { gamificationService } from './GamificationService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

// Import all services to ensure they are registered
import './windowService';
import './offlineService';
import './updateService';
import './audioService';
import './keyboardService';
import './osDetectionService';
import './curriculumService';
import './userProgressService';
import './spacedRepetitionService';
import './streakService';
import './xpService';
import './heartsService';
import './currencyService';
import './achievementsService';
import './subscriptionService';

// Flag to track initialization to prevent multiple initialization in StrictMode
let hasInitialized = false;
let hasCleanedUp = false;

// Define essential services that must be initialized for the app to function
const ESSENTIAL_SERVICES = [
  'windowService',
  'offlineService',
  'osDetectionService',
  'audioService',
  'keyboardService',
  'updateService',
];

// Define non-essential services that can fail without breaking the app
const NON_ESSENTIAL_SERVICES = [
  'curriculumService',
  'userProgressService',
  'spacedRepetitionService',
  'streakService',
  'xpService',
  'heartsService',
  'currencyService',
  'achievementsService',
  'subscriptionService',
];

/**
 * Initialize all services in the correct order
 * @returns A promise that resolves when all services are initialized
 */
export async function initializeAllServices(): Promise<void> {
  // Prevent multiple initialization in StrictMode
  if (hasInitialized) {
    loggerService.info('Services already initialized, skipping initialization', {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
    });
    return;
  }

  const initializationResults: Record<string, boolean> = {};
  const failedServices: string[] = [];
  
  try {
    loggerService.info('Starting service initialization', {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
    });

    // Helper function to initialize a service and catch errors
    const initService = async (name: string, isEssential: boolean): Promise<boolean> => {
      try {
        await serviceFactory.initializeService(name);
        
        // Only mark as successful if the service's isInitialized() method returns true
        const service = serviceFactory.get(name);
        const initialized = service.isInitialized();
        
        initializationResults[name] = initialized;
        
        if (!initialized) {
          failedServices.push(name);
          loggerService.warn(
            `Service ${name} initialize() completed but service not marked as initialized`,
            {
              component: 'ServiceInitializer',
              action: 'initializeService',
              serviceName: name,
              isEssential,
            },
          );
          return false;
        }
        
        return true;
      } catch (error) {
        initializationResults[name] = false;
        failedServices.push(name);
        
        if (isEssential) {
          loggerService.error(
            `Failed to initialize essential service: ${name}`,
            error,
            {
              component: 'ServiceInitializer',
              action: 'initializeService',
              serviceName: name,
              isEssential,
            },
          );
          throw error; // Re-throw for essential services
        } else {
          loggerService.warn(
            `Failed to initialize non-essential service: ${name}`,
            {
              component: 'ServiceInitializer',
              action: 'initializeService',
              serviceName: name,
              isEssential,
              error: String(error),
            },
          );
          return false; // Don't re-throw for non-essential services
        }
      }
    };

    // First, initialize essential services
    for (const serviceName of ESSENTIAL_SERVICES) {
      await initService(serviceName, true);
    }
    
    // Then, initialize non-essential services
    const nonEssentialPromises = NON_ESSENTIAL_SERVICES.map((serviceName) => 
      initService(serviceName, false),
    );
    
    // Wait for all non-essential services to attempt initialization
    await Promise.allSettled(nonEssentialPromises);
    
    // Initialize gamification service last
    try {
      await serviceFactory.register('gamification', gamificationService).initialize();
      initializationResults['gamification'] = true;
    } catch (error) {
      initializationResults['gamification'] = false;
      failedServices.push('gamification');
      loggerService.warn(
        'Failed to initialize gamification service',
        {
          component: 'ServiceInitializer',
          action: 'initializeService',
          serviceName: 'gamification',
          error: String(error),
        },
      );
    }

    // Mark initialization as complete
    hasInitialized = true;
    
    const initializedServices = Object.keys(initializationResults).filter((key) => initializationResults[key]);
    
    if (failedServices.length > 0) {
      loggerService.warn('Some services failed to initialize', {
        component: 'ServiceInitializer',
        action: 'initializeAllServices',
        failedServices,
        initializedServices,
      });
    } else {
      loggerService.info('All services initialized successfully', {
        component: 'ServiceInitializer',
        action: 'initializeAllServices',
        initializedServices,
      });
    }
  } catch (error) {
    // This will only be reached if an essential service fails
    loggerService.error('Failed to initialize essential services', error, {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
      failedServices,
      initializationResults,
    });
    throw error; // Re-throw since essential services are required
  }
}

/**
 * Clean up all services in the reverse order of initialization
 */
export function cleanupAllServices(): void {
  // Skip if services haven't been initialized or already cleaned up
  if (!hasInitialized || hasCleanedUp) {
    loggerService.info('Services not initialized or already cleaned up, skipping cleanup', {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });
    return;
  }

  try {
    loggerService.info('Starting service cleanup', {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });

    // Clean up services in reverse order
    // First, clean up gamification services
    serviceFactory.cleanupService('subscriptionService');
    serviceFactory.cleanupService('achievementsService');
    serviceFactory.cleanupService('currencyService');
    serviceFactory.cleanupService('heartsService');
    serviceFactory.cleanupService('xpService');
    serviceFactory.cleanupService('streakService');
    
    // Then, clean up feature services
    serviceFactory.cleanupService('spacedRepetitionService');
    serviceFactory.cleanupService('userProgressService');
    serviceFactory.cleanupService('curriculumService');
    serviceFactory.cleanupService('updateService');
    
    // Finally, clean up core services
    serviceFactory.cleanupService('keyboardService');
    serviceFactory.cleanupService('audioService');
    serviceFactory.cleanupService('osDetectionService');
    serviceFactory.cleanupService('offlineService');
    serviceFactory.cleanupService('windowService');

    // Mark as cleaned up
    hasCleanedUp = true;
    
    loggerService.info('All services cleaned up successfully', {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });
  } catch (error) {
    loggerService.error('Failed to clean up all services', error instanceof Error ? error : new Error(String(error)), {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });
  }
} 

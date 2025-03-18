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

/**
 * Initialize all services in the correct order
 * @returns A promise that resolves when all services are initialized
 */
export async function initializeAllServices(): Promise<void> {
  try {
    loggerService.info('Starting service initialization', {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
    });

    // Initialize services in the correct order
    // First, initialize core services
    await serviceFactory.initializeService('windowService');
    await serviceFactory.initializeService('offlineService');
    await serviceFactory.initializeService('osDetectionService');
    await serviceFactory.initializeService('audioService');
    await serviceFactory.initializeService('keyboardService');
    
    // Then, initialize feature services
    await serviceFactory.initializeService('updateService');
    await serviceFactory.initializeService('curriculumService');
    await serviceFactory.initializeService('userProgressService');
    await serviceFactory.initializeService('spacedRepetitionService');
    
    // Finally, initialize gamification services
    await serviceFactory.initializeService('streakService');
    await serviceFactory.initializeService('xpService');
    await serviceFactory.initializeService('heartsService');
    await serviceFactory.initializeService('currencyService');
    await serviceFactory.initializeService('achievementsService');
    await serviceFactory.initializeService('subscriptionService');
    await serviceFactory.register('gamification', gamificationService).initialize();

    loggerService.info('All services initialized successfully', {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
      initializedServices: serviceFactory.getInitializedServiceNames(),
    });
  } catch (error) {
    loggerService.error('Failed to initialize all services', error, {
      component: 'ServiceInitializer',
      action: 'initializeAllServices',
    });
    throw error;
  }
}

/**
 * Clean up all services in the reverse order of initialization
 */
export function cleanupAllServices(): void {
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

    loggerService.info('All services cleaned up successfully', {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });
  } catch (error) {
    loggerService.error('Failed to clean up all services', error, {
      component: 'ServiceInitializer',
      action: 'cleanupAllServices',
    });
  }
} 

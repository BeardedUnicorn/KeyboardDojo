/**
 * Services Index
 * 
 * This file serves as the entry point for all services.
 * It exports the service instances that should be used throughout the application.
 */

// Import all services
import { achievementsService } from './achievementsService';
import { audioService } from './audioService';
import { currencyService, STORE_ITEMS, CURRENCY_REWARDS } from './currencyService';
import { curriculumService } from './curriculumService';
import { gamificationService } from './GamificationService';
import { heartsService, HEARTS_CONFIG } from './heartsService';
import { keyboardService } from './keyboardService';
import { loggerService, useLogger } from './loggerService';
import { offlineService } from './offlineService';
import { osDetectionService } from './osDetectionService';
import { serviceFactory } from './ServiceFactory';
import { spacedRepetitionService } from './spacedRepetitionService';
import { streakService } from './streakService';
import { subscriptionService, SubscriptionTier } from './subscriptionService';
import { updateService } from './updateService';
import { userProgressService } from './userProgressService';
import { windowService } from './windowService';
import { xpService } from './xpService';

// Ensure all services are registered with ServiceFactory
// This helps with tracking initialization status
const SERVICES = {
  // Core services
  audioService,
  keyboardService,
  loggerService,
  offlineService,
  osDetectionService,
  updateService,
  windowService,

  // Feature services
  curriculumService,
  userProgressService,
  spacedRepetitionService,

  // Gamification services
  achievementsService,
  currencyService,
  heartsService,
  streakService,
  xpService,
  subscriptionService,
  gamificationService,
};

// Export all services
export {
  // Core services
  audioService,
  keyboardService,
  loggerService,
  useLogger,
  offlineService,
  osDetectionService,
  serviceFactory,
  updateService,
  windowService,
  
  // Feature services
  curriculumService,
  userProgressService,
  spacedRepetitionService,
  
  // Gamification services
  achievementsService,
  currencyService,
  heartsService,
  streakService,
  xpService,
  subscriptionService,
  SubscriptionTier,
  gamificationService,
  
  // Constants and types
  STORE_ITEMS,
  CURRENCY_REWARDS,
  HEARTS_CONFIG,
};

// Re-export BaseService for convenience
export { BaseService } from './BaseService';
export type { ServiceStatus } from './BaseService';

// Initialize services on demand through initializeServices.ts
export { initializeAllServices, cleanupAllServices } from './initializeServices';

// Export some service types
export type { XPData, LevelUpEvent } from './xpService';
export { XP_REWARDS as XP_SERVICE_REWARDS } from './xpService';
export { XP_REWARDS as USER_PROGRESS_XP_REWARDS } from './userProgressService';
export type { StoreItem, PowerUpItem, BoostItem, CosmeticItem, CurrencyData } from './currencyService';
export type { HeartsData, HeartsChangeEvent } from './heartsService'; 

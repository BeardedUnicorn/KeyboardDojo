// Base service and factory
export * from './BaseService';
export * from './ServiceFactory';

// Service initialization utility
export * from './initializeServices';

// Service exports
export * from './windowService';
export * from './keyboardService';
export * from './osDetectionService';
export * from './offlineService';
export * from './updateService';
export * from './audioService';
export * from './streakService';

// Export xpService with explicit re-exports to avoid conflicts
export { xpService } from './xpService';
export type { XPData, LevelUpEvent } from './xpService';
export { XP_REWARDS as XP_SERVICE_REWARDS } from './xpService';

export * from './heartsService';
export * from './currencyService';
export * from './spacedRepetitionService';
export * from './loggerService';
export * from './curriculumService';

// Export userProgressService with explicit re-exports to avoid conflicts
export { userProgressService } from './userProgressService';
export { XP_REWARDS as USER_PROGRESS_XP_REWARDS } from './userProgressService';

export * from './achievementsService';
export * from './subscriptionService';
export { gamificationService } from './GamificationService'; 

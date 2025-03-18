/**
 * Hooks Index
 *
 * This file exports all custom hooks from the hooks directory
 */

// User progress related hooks
export * from './useXP';
export * from './useCurrency';

// Service and interaction hooks
export { useServiceSubscription } from './useServiceSubscription';
export { useShortcutDetection } from './useShortcutDetection';
export { useQuizState } from './useQuizState';

// Animation hooks
export { useAnimation } from './useAnimation';
export { useAnimatedValue } from './useAnimatedValue';
export { useFeedbackAnimation } from './useFeedbackAnimation';

// Responsive hooks
export * from './useResponsiveProps';

// Keyboard hooks
export { useKeyboardShortcut } from './useKeyboardShortcut';

// Export all Redux hooks
export { useAppRedux } from './useAppRedux';
export { useGamificationRedux } from './useGamificationRedux';
export { useCurriculumRedux } from './useCurriculumRedux';
export { useSettingsRedux } from './useSettingsRedux';
export { useAchievementsRedux } from './useAchievementsRedux';

export { usePrefetch } from './usePrefetch';

// Re-export other hooks as needed
// For example:
// export { useAuth } from './useAuth';
// export { useLocalStorage } from './useLocalStorage';

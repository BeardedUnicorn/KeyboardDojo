// Import reducers
import achievementsReducer from './achievementsSlice';
import appReducer from './appSlice';
import curriculumReducer from './curriculumSlice';
import gamificationReducer from './gamificationSlice';
import settingsReducer from './settingsSlice';
import subscriptionReducer from './subscriptionSlice';
import themeReducer from './themeSlice';
import userProgressReducer from './userProgressSlice';

// Export reducers
export {
  userProgressReducer,
  themeReducer,
  achievementsReducer,
  subscriptionReducer,
  gamificationReducer,
  curriculumReducer,
  settingsReducer,
  appReducer,
};

// Export slices
export * from './appSlice';
export * from './settingsSlice';
export * from './themeSlice';
export * from './achievementsSlice';
export * from './subscriptionSlice';

// Export gamification selectors with explicit names
export {
  selectGamification,
  selectXP as selectGamificationXP,
  selectLevel as selectGamificationLevel,
  selectHearts as selectGamificationHearts,
  selectCurrency as selectGamificationCurrency,
  selectStreak,
  selectCurrentStreak,
  selectLongestStreak,
  selectIsGamificationLoading,
} from './gamificationSlice';

// Export curriculum selectors
export * from './curriculumSlice';

// Export user progress selectors with explicit names
export {
  selectUserProgress,
  selectCompletedLessons,
  selectXp as selectUserXP,
  selectLevel as selectUserLevel,
  selectStreakDays,
  selectHearts as selectUserHearts,
  selectCurrency as selectUserCurrency,
  selectIsLessonCompleted,
  selectIsModuleCompleted,
  selectIsNodeCompleted,
  selectCurrentLesson,
} from './userProgressSlice';

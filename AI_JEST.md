# Unit Testing Guide for React and Redux Components

## Table of Contents
- [Introduction](#introduction)
- [Testing Philosophy](#testing-philosophy)
- [Testing Tools and Setup](#testing-tools-and-setup)
- [Testing React Components](#testing-react-components)
- [Testing Redux](#testing-redux)
- [Integration Testing](#integration-testing)
- [Test Organization](#test-organization)
- [Testing Patterns and Anti-patterns](#testing-patterns-and-anti-patterns)
- [Test Coverage](#test-coverage)
- [Unit Test Task List](#unit-test-task-list)

## Introduction

This guide outlines best practices for writing effective unit tests for React components and Redux logic in the Keyboard Dojo application. Well-structured tests improve code quality, prevent regressions, and provide confidence during refactoring.

## Current Test Progress

### Service Tests Progress
- ✅ Base & Factory Services: 20/20 tests (100% complete)
- ✅ System Services: 60/60 tests (100% complete)
  - ✅ Keyboard Service: 15/15 tests
  - ✅ Logger Service: 5/5 tests
  - ✅ Audio Service: 5/5 tests
  - ✅ OS Detection Service: 13/13 tests
  - ✅ Window Service: 5/5 tests
  - ✅ Update Service: 7/7 tests
  - ✅ Offline Service: 8/8 tests
  - ✅ Subscription Service: 16/16 tests
- ✅ Gamification Services: 125/125 tests (100% complete)
  - ✅ Gamification Service: 31/31 tests
  - ✅ Achievements Service: 27/27 tests
  - ✅ Currency Service: 33/33 tests
  - ✅ Hearts Service: 13/13 tests
  - ✅ Streak Service: 10/10 tests
  - ✅ XP Service: 11/11 tests
- ✅ Learning Services: 49/49 tests (100% complete)
  - ✅ Curriculum Service: 23/23 tests
  - ✅ User Progress Service: 14/14 tests
  - ✅ Spaced Repetition Service: 12/12 tests

### Redux Tests Progress
- ✅ All Redux Slices: 172/172 tests (100% complete)

### Overall Progress
- ✅ Redux: 172/172 tests (100% complete)
- ✅ Services: 254/254 tests (100% complete)
- ❌ Components: 0/118 tests (0% complete)
- ❌ Hooks: 0/72 tests (0% complete)
- ❌ Integration Tests: 0/23 tests (0% complete)

## Testing Philosophy

This section outlines the philosophy behind writing effective unit tests for React components and Redux logic.

### Testing Goals
- Verify functionality works as expected
- Catch regressions early
- Serve as documentation
- Enable refactoring with confidence
- Test behavior, not implementation details

## Testing Tools and Setup

### Core Testing Stack
- **Jest**: Test runner, assertion library, and mocking framework
- **React Testing Library**: DOM testing utilities that encourage good testing practices
- **Jest DOM**: Custom Jest matchers for DOM testing
- **Mock Service Worker (MSW)**: API mocking for network requests

### Test File Organization
- Place tests alongside the code being tested with `.test.tsx` or `__tests__` directory
- Group related tests in describe blocks
- Use clear, descriptive test names

## Testing React Components

### Component Testing Principles
1. Test behavior, not implementation
2. Test from the user's perspective
3. Test key workflows and edge cases
4. Avoid testing third-party libraries

### What to Test in React Components
- **Rendering**: Does the component render correctly?
- **User interactions**: Do clicks, inputs, etc. behave as expected?
- **State changes**: Does state update correctly?
- **Conditional rendering**: Does UI change appropriately based on props/state?
- **Error states**: Does the component handle errors gracefully?
- **Edge cases**: Empty arrays, null values, etc.

### React Testing Library Best Practices
- Use screen queries that mimic user behavior:
  - `getByRole` (most preferred)
  - `getByLabelText`
  - `getByText`
  - `getByTestId` (least preferred)
- Use `userEvent` over `fireEvent` for more realistic user interactions
- Test accessibility by default by using role-based queries
- Avoid targeting elements by classname or id

### Example React Component Test
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonCard } from './LessonCard';

describe('LessonCard', () => {
  test('renders lesson information correctly', () => {
    const mockLesson = {
      id: '1',
      title: 'Basic Home Row',
      description: 'Learn the home row keys',
      difficulty: 'Beginner',
    };
    
    render(<LessonCard lesson={mockLesson} />);
    
    expect(screen.getByText('Basic Home Row')).toBeInTheDocument();
    expect(screen.getByText('Learn the home row keys')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  test('calls onSelect when clicked', async () => {
    const mockLesson = {
      id: '1',
      title: 'Basic Home Row',
      description: 'Learn the home row keys',
      difficulty: 'Beginner',
    };
    const handleSelect = jest.fn();
    
    render(<LessonCard lesson={mockLesson} onSelect={handleSelect} />);
    
    await userEvent.click(screen.getByRole('button', { name: /start lesson/i }));
    expect(handleSelect).toHaveBeenCalledWith('1');
  });
});
```

### Testing Hooks
- Use `renderHook` from `@testing-library/react-hooks`
- Test the behavior and outputs of the hook
- Test edge cases and error conditions

## Testing Redux

### Redux Testing Strategy
- Test each part of Redux separately:
  - Action creators
  - Reducers
  - Selectors
  - Thunks/async actions
- Mock API calls in thunk tests

### Testing Reducers
- Test initial state
- Test each action type
- Test edge cases and error handling
- Verify immutability

### Example Reducer Test
```typescript
import { lessonsReducer, initialState } from './lessonsSlice';
import { fetchLessons, setCurrentLesson } from './lessonsActions';

describe('lessons reducer', () => {
  test('should return the initial state', () => {
    expect(lessonsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle fetchLessons.fulfilled', () => {
    const mockLessons = [
      { id: '1', title: 'Lesson 1', content: 'Content 1' },
      { id: '2', title: 'Lesson 2', content: 'Content 2' },
    ];
    
    const action = {
      type: fetchLessons.fulfilled.type,
      payload: mockLessons,
    };
    
    const newState = lessonsReducer(initialState, action);
    
    expect(newState.lessons).toEqual(mockLessons);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });
});
```

### Testing Action Creators
- Test synchronous action creators return the correct action object
- For async actions (thunks), test both successful and failure scenarios

### Example Action Creator Test
```typescript
import { setCurrentLesson } from './lessonsActions';

describe('lessons actions', () => {
  test('setCurrentLesson should create the correct action', () => {
    const lessonId = '123';
    const expectedAction = {
      type: 'lessons/setCurrentLesson',
      payload: '123',
    };
    
    expect(setCurrentLesson(lessonId)).toEqual(expectedAction);
  });
});
```

### Testing Thunks
- Mock API responses
- Test successful API responses
- Test API failures
- Verify correct actions are dispatched

### Example Thunk Test
```typescript
import { fetchLessons } from './lessonsThunks';
import * as api from '../../api/lessonsApi';

jest.mock('../../api/lessonsApi');

describe('lessons thunks', () => {
  test('fetchLessons dispatches the correct actions on success', async () => {
    const mockLessons = [
      { id: '1', title: 'Lesson 1', content: 'Content 1' },
      { id: '2', title: 'Lesson 2', content: 'Content 2' },
    ];
    
    (api.getLessons as jest.Mock).mockResolvedValue(mockLessons);
    
    const dispatch = jest.fn();
    const thunk = fetchLessons();
    
    await thunk(dispatch, () => ({}), undefined);
    
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: 'lessons/fetchLessons/pending'
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'lessons/fetchLessons/fulfilled',
      payload: mockLessons
    });
  });

  test('fetchLessons dispatches the correct actions on failure', async () => {
    const errorMessage = 'Failed to fetch lessons';
    
    (api.getLessons as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const dispatch = jest.fn();
    const thunk = fetchLessons();
    
    await thunk(dispatch, () => ({}), undefined);
    
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: 'lessons/fetchLessons/pending'
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'lessons/fetchLessons/rejected',
      error: expect.objectContaining({ message: errorMessage })
    });
  });
});
```

### Testing Selectors
- Verify selectors extract the correct data from state
- Test with different state structures
- Test memoization if applicable

### Example Selector Test
```typescript
import { selectCurrentLesson, selectLessonById } from './lessonsSelectors';

describe('lessons selectors', () => {
  test('selectCurrentLesson returns the current lesson', () => {
    const mockState = {
      lessons: {
        lessons: [
          { id: '1', title: 'Lesson 1' },
          { id: '2', title: 'Lesson 2' }
        ],
        currentLessonId: '1'
      }
    };
    
    expect(selectCurrentLesson(mockState)).toEqual({ id: '1', title: 'Lesson 1' });
  });

  test('selectLessonById returns the lesson with matching id', () => {
    const mockState = {
      lessons: {
        lessons: [
          { id: '1', title: 'Lesson 1' },
          { id: '2', title: 'Lesson 2' }
        ]
      }
    };
    
    expect(selectLessonById(mockState, '2')).toEqual({ id: '2', title: 'Lesson 2' });
  });
});
```

## Integration Testing

### Connected Components Testing
- Test Redux-connected components with a real or mock store
- Focus on component behavior with data flow
- Use `<Provider>` to provide store context

### Example Connected Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import lessonsReducer from './lessonsSlice';
import LessonsList from './LessonsList';

describe('LessonsList connected component', () => {
  test('renders lessons from store', () => {
    const store = configureStore({
      reducer: {
        lessons: lessonsReducer
      },
      preloadedState: {
        lessons: {
          lessons: [
            { id: '1', title: 'Basic Typing', difficulty: 'Beginner' },
            { id: '2', title: 'Speed Training', difficulty: 'Intermediate' }
          ],
          loading: false,
          error: null
        }
      }
    });
    
    render(
      <Provider store={store}>
        <LessonsList />
      </Provider>
    );
    
    expect(screen.getByText('Basic Typing')).toBeInTheDocument();
    expect(screen.getByText('Speed Training')).toBeInTheDocument();
  });
});
```

### Testing Async Operations
- Test loading states
- Test success and error states
- Mock API calls with MSW or jest mocks

## Test Organization

### Test Structure
- Use `describe` blocks for logical grouping
- Use `test` or `it` for individual test cases
- Use `beforeEach` for common setup
- Use `afterEach` for cleanup

### Custom Test Utilities
- Create test fixtures for common data structures
- Create render helpers for components with common providers
- Use custom matchers for domain-specific assertions

### Example Custom Render Function
```typescript
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import rootReducer from '../store/rootReducer';
import theme from '../theme/AppTheme';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { render };
```

## Testing Patterns and Anti-patterns

### Good Patterns
- Test behavior, not implementation details
- Tests that resemble how users interact with your code
- Clear test names that describe the expected behavior
- Isolated tests that don't depend on other tests
- Testing edge cases and error states

### Anti-patterns to Avoid
- Testing implementation details
- Brittle tests that break with minor changes
- Testing third-party libraries
- Mocking too much
- Snapshot testing entire component trees
- Testing multiple things in a single test

## Test Coverage

### Coverage Goals
- Aim for high coverage but prioritize quality over quantity
- 100% coverage of critical paths
- Focus on user-facing features and business logic

### Coverage Reports
- Use Jest's built-in coverage reports
- Configure thresholds in jest.config.js to maintain coverage standards

### What to Include in Coverage
- All Redux slices (reducers, actions, selectors, thunks)
- All React components, especially those with complex logic
- Utility functions and helpers

### What May Be Excluded
- Type definitions
- Constants
- Simple pass-through components
- Generated code

## Unit Test Task List

This task list outlines all unit tests that need to be implemented for the Keyboard Dojo application. Check off each test as it is completed to track progress toward 100% test coverage.

### Redux Slice Unit Tests

#### App Slice (`appSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should set isLoading correctly")`
  - [x] `test("should set isOnline correctly")`
  - [x] `test("should handle error addition correctly")`
  - [x] `test("should handle error clearing correctly")`
  - [x] `test("should handle notification addition correctly")`
  - [x] `test("should mark a notification as read correctly")`
  - [x] `test("should clear notifications correctly")`
  - [x] `test("should handle modal open correctly")`
  - [x] `test("should handle modal close correctly")`

- [x] **Thunk Tests**
  - [x] `test("initializeApp pending should set isLoading to true")`
  - [x] `test("initializeApp fulfilled should set isInitialized to true")`
  - [x] `test("initializeApp rejected should add error")`
  - [x] `test("checkForUpdates should set update status correctly")`

- [x] **Selector Tests**
  - [x] `test("selectApp should return the app state")`
  - [x] `test("selectIsInitialized should return isInitialized status")`
  - [x] `test("selectIsLoading should return loading status")`
  - [x] `test("selectIsOnline should return online status")`
  - [x] `test("selectIsUpdateAvailable should return update availability")`
  - [x] `test("selectUpdateVersion should return update version")`
  - [x] `test("selectErrors should return all errors")`
  - [x] `test("selectNotifications should return all notifications")`
  - [x] `test("selectUnreadNotifications should return only unread notifications")`
  - [x] `test("selectCurrentModal should return current modal ID")`
  - [x] `test("selectModalData should return modal data")`

#### Achievements Slice (`achievementsSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle achievement unlocking correctly")`
  - [x] `test("should handle achievement progress update correctly")`
  - [x] `test("should handle multiple achievements unlock")`
  - [x] `test("should not unlock achievement if conditions not met")`
  - [x] `test("should handle achievement notification correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadAchievements pending should set loading state")`
  - [x] `test("loadAchievements fulfilled should update state")`
  - [x] `test("loadAchievements rejected should set error")`
  - [x] `test("updateAchievementProgress should calculate and update progress correctly")`
  - [x] `test("checkAndUnlockAchievements should unlock eligible achievements")`

- [x] **Selector Tests**
  - [x] `test("selectAchievements should return all achievements")`
  - [x] `test("selectUnlockedAchievements should return only unlocked achievements")`
  - [x] `test("selectAchievementById should return specific achievement")`
  - [x] `test("selectAchievementProgress should return progress for specific achievement")`
  - [x] `test("selectRecentlyUnlockedAchievements should return recent unlocks")`
  - [x] `test("selectAchievementsByCategory should filter by category")`

#### Gamification Slice (`gamificationSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle XP addition correctly")`
  - [x] `test("should handle level up correctly")`
  - [x] `test("should handle currency addition correctly")`
  - [x] `test("should handle currency spending correctly")`
  - [x] `test("should handle streak update correctly")`
  - [x] `test("should handle heart consumption correctly")`
  - [x] `test("should handle achievements correctly")`
  - [x] `test("should handle XP history recording correctly")`
  - [x] `test("should handle daily goal progress correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadGamificationData pending should set loading state")`
  - [x] `test("loadGamificationData fulfilled should update state")`
  - [x] `test("loadGamificationData rejected should set error")`
  - [x] `test("saveGamificationData should dispatch correct actions")`

- [x] **Selector Tests**
  - [x] `test("selectLevel should return current level")`
  - [x] `test("selectXp should return current XP")`
  - [x] `test("selectProgress should return XP progress to next level")`
  - [x] `test("selectCurrency should return currency balance")`
  - [x] `test("selectHearts should return hearts count")`
  - [x] `test("selectStreak should return streak data")`
  - [x] `test("selectXpHistory should return XP history")`
  - [x] `test("selectDailyGoal should return daily goal data")`
  - [x] `test("selectAchievements should return all achievements")`
  - [x] `test("selectUnlockedAchievements should return only unlocked achievements")`

#### Curriculum Slice (`curriculumSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle lesson completion correctly")`
  - [x] `test("should handle challenge completion correctly")`
  - [x] `test("should handle course progress update correctly")`
  - [x] `test("should handle current lesson selection correctly")`
  - [x] `test("should handle lesson results saving correctly")`
  - [x] `test("should handle skill mastery tracking correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadCurriculumData pending should set loading state")`
  - [x] `test("loadCurriculumData fulfilled should update state")`
  - [x] `test("loadCurriculumData rejected should set error")`
  - [x] `test("saveCurriculumProgress should dispatch correct actions")`
  - [x] `test("unlockLesson should dispatch correct actions and update state")`

- [x] **Selector Tests**
  - [x] `test("selectLessons should return all lessons")`
  - [x] `test("selectCurrentLesson should return current lesson")`
  - [x] `test("selectLessonById should return lesson by ID")`
  - [x] `test("selectCompletedLessons should return completed lessons")`
  - [x] `test("selectCourseProgress should return course progress percentage")`
  - [x] `test("selectAvailableLessons should return unlocked lessons")`
  - [x] `test("selectLessonsBySkill should return lessons filtered by skill")`
  - [x] `test("selectSkillMasteryLevels should return mastery levels for each skill")`

#### User Progress Slice (`userProgressSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle session recording correctly")`
  - [x] `test("should handle statistics update correctly")`
  - [x] `test("should handle goal setting correctly")`
  - [x] `test("should handle goal progress correctly")`
  - [x] `test("should handle goal completion correctly")`
  - [x] `test("should handle typing speed records correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadUserProgress pending should set loading state")`
  - [x] `test("loadUserProgress fulfilled should update state")`
  - [x] `test("loadUserProgress rejected should set error")`
  - [x] `test("saveUserProgress should dispatch correct actions")`
  - [x] `test("updateTypingStatistics should calculate and save correctly")`

- [x] **Selector Tests**
  - [x] `test("selectUserStatistics should return user statistics")`
  - [x] `test("selectGoals should return user goals")`
  - [x] `test("selectCompletedGoals should return completed goals")`
  - [x] `test("selectActiveGoals should return active goals")`
  - [x] `test("selectSessionHistory should return session history")`
  - [x] `test("selectTypingSpeed should return current typing speed")`
  - [x] `test("selectTypingAccuracy should return current typing accuracy")`
  - [x] `test("selectAllTimeStats should return aggregated statistics")`
  - [x] `test("selectImprovementRate should calculate improvement rate correctly")`

#### Settings Slice (`settingsSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle theme change correctly")`
  - [x] `test("should handle font size change correctly")`
  - [x] `test("should handle notification preferences correctly")`
  - [x] `test("should handle keyboard layout change correctly")`
  - [x] `test("should handle sound effects volume correctly")`
  - [x] `test("should handle UI animation toggles correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadSettings pending should set loading state")`
  - [x] `test("loadSettings fulfilled should update state")`
  - [x] `test("loadSettings rejected should set error")`
  - [x] `test("saveSettings should dispatch correct actions")`
  - [x] `test("resetSettings should revert to defaults")`

- [x] **Selector Tests**
  - [x] `test("selectTheme should return current theme")`
  - [x] `test("selectFontSize should return font size")`
  - [x] `test("selectNotificationPreferences should return notification preferences")`
  - [x] `test("selectKeyboardLayout should return keyboard layout")`
  - [x] `test("selectSoundEffectsVolume should return volume setting")`
  - [x] `test("selectAnimationsEnabled should return animations enabled status")`
  - [x] `test("selectAccessibilitySettings should return accessibility settings")`

#### Subscription Slice (`subscriptionSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle subscription status update correctly")`
  - [x] `test("should handle subscription plan change correctly")`
  - [x] `test("should handle subscription expiration correctly")`
  - [x] `test("should handle payment method update correctly")`
  - [x] `test("should handle billing history storage correctly")`

- [x] **Thunk Tests**
  - [x] `test("loadSubscriptionData pending should set loading state")`
  - [x] `test("loadSubscriptionData fulfilled should update state")`
  - [x] `test("loadSubscriptionData rejected should set error")`
  - [x] `test("updateSubscription should dispatch correct actions")`
  - [x] `test("cancelSubscription should update subscription status")`
  - [x] `test("purchaseSubscription should process new subscription")`

- [x] **Selector Tests**
  - [x] `test("selectSubscriptionStatus should return subscription status")`
  - [x] `test("selectSubscriptionPlan should return subscription plan")`
  - [x] `test("selectSubscriptionExpiration should return expiration date")`
  - [x] `test("selectHasPremiumAccess should return premium access status")`
  - [x] `test("selectPaymentMethod should return current payment method")`
  - [x] `test("selectBillingHistory should return billing transaction history")`
  - [x] `test("selectDaysUntilExpiration should calculate days remaining")`

#### Theme Slice (`themeSlice.ts`)
- [x] **State Tests**
  - [x] `test("should initialize with correct default state")`
  - [x] `test("should handle theme mode change correctly")`
  - [x] `test("should handle theme color change correctly")`
  - [x] `test("should handle custom theme settings correctly")`

- [x] **Selector Tests**
  - [x] `test("selectThemeMode should return theme mode")`
  - [x] `test("selectThemeColors should return theme colors")`
  - [x] `test("selectIsCustomTheme should return custom theme status")`

### Utility Function Tests

#### Animation Utilities (`animationUtils.ts`)
- [x] **Animation Utilities Tests**
  - [x] `test("easing functions produce expected values")`
  - [x] `test("interpolate function calculates correct values")`
  - [x] `test("sequence animations execute in order")`
  - [x] `test("parallel animations execute simultaneously")`
  - [x] `test("delay function waits correct time")`
  - [x] `test("spring animation calculates correct physics")`
  - [x] `test("animation timing functions work correctly")`

#### Animation System (`animationSystem.ts`)
- [x] **Animation System Tests**
  - [x] `test("registerAnimation adds animation to registry")`
  - [x] `test("unregisterAnimation removes animation from registry")`
  - [x] `test("startAnimation triggers animation correctly")`
  - [x] `test("pauseAnimation pauses running animation")`
  - [x] `test("resumeAnimation resumes paused animation")`
  - [x] `test("stopAnimation cancels animation")`
  - [x] `test("animation manager handles multiple animations")`

#### DateTime Utilities (`dateTimeUtils.ts`)
- [x] **DateTime Tests**
  - [x] `test("formatDate outputs correct format")`
  - [x] `test("getRelativeTimeString returns correct relative time")`
  - [x] `test("isToday correctly identifies today's date")`
  - [x] `test("getDateDifference calculates correct difference")`
  - [x] `test("formatDuration outputs correct duration string")`
  - [x] `test("parseISODate correctly parses ISO date strings")`

#### Format Utilities (`formatUtils.ts`)
- [x] **Format Tests**
  - [x] `test("formatNumber adds correct separators")`
  - [x] `test("formatCurrency displays currency correctly")`
  - [x] `test("formatPercentage displays percentage correctly")`
  - [x] `test("truncateText cuts text at correct length")`
  - [x] `test("formatFileSize displays sizes in appropriate units")`
  - [x] `test("slugify creates valid URL slugs")`

#### Keyboard Utilities (`keyboardUtils.ts`)
- [x] **Keyboard Utilities Tests**
  - [x] `test("getKeyDisplay shows correct key representation")`
  - [x] `test("isModifierKey correctly identifies modifier keys")`
  - [x] `test("normalizeKey returns consistent key format")`
  - [x] `test("getKeyCode returns correct key code")`
  - [x] `test("getKeyboardLayout returns correct layout")`
  - [x] `test("detectKeyboardLayout correctly identifies layout")`

#### Shortcut Utilities (`shortcutUtils.ts` and `shortcutDetector.ts`)
- [x] **Shortcut Tests**
  - [x] `test("formatShortcut returns correct display format")`
  - [x] `test("parseShortcutString parses shortcut correctly")`
  - [x] `test("matchesShortcut correctly identifies matching shortcuts")`
  - [x] `test("detectShortcutCollisions finds conflicting shortcuts")`
  - [x] `test("getShortcutForAction returns correct shortcut")`
  - [x] `test("shortcutDetector registers key combinations correctly")`
  - [x] `test("shortcutDetector handles sequence shortcuts")`

#### Window Manager (`windowManager.ts`)
- [x] **Window Manager Tests**
  - [x] `test("minimize calls the window minimize method")`
  - [x] `test("maximize calls the window maximize method")`
  - [x] `test("restore calls the window unmaximize method")`
  - [x] `test("close calls the window close method")`
  - [x] `test("listen registers an event listener")`
  - [x] `test("listen returns a function that removes the listener when called")`
  - [x] `test("handles errors in minimize gracefully")`
  - [x] `test("handles errors in maximize gracefully")`

#### Component Utilities (`componentUtils.ts`)
- [x] **Component Utility Tests**
  - [x] `test("getIconSize returns correct size for variants")`
  - [x] `test("getFontSize returns correct typography for variants")`
  - [x] `test("getComponentDimensions returns correct dimensions for variants")`
  - [x] `test("getColorByValue returns correct colors based on thresholds")`
  - [x] `test("formatTimeRemaining formats time correctly")`
  - [x] `test("formatRelativeTime formats relative time correctly")`

#### Style Utilities (`styleUtils.ts`)
- [x] **Style Tests**
  - [x] `test("constants contain expected values (borderRadius, shadowLevels, etc.)")`
  - [x] `test("getContrastText returns accessible contrast color")`
  - [x] `test("getThemeColor returns correct theme color")`
  - [x] `test("getThemeSpacing returns correct spacing values")`
  - [x] `test("getThemeShadow returns correct shadow values")`
  - [x] `test("component style creators return correct style objects")`
  - [x] `test("getFlexStyle returns correct flex container styles")`

#### Sentry Utilities (`sentry.ts` and `sentryRedux.ts`)
- [x] **Sentry Tests**
  - [x] `test("initializeSentry configures Sentry correctly")`
  - [x] `test("captureException sends errors to Sentry")`
  - [x] `test("createSentryMiddleware creates Redux middleware")`
  - [x] `test("sentryMiddleware captures Redux actions")`
  - [x] `test("sentryMiddleware captures Redux errors")`
  - [x] `test("enrichTransaction adds custom data to transactions")`

#### Quiz Utilities (`quizUtils.ts`)
- [x] **Quiz Tests**
  - [x] `test("shuffleQuestions randomizes question order")`
  - [x] `test("calculateScore computes score correctly")`
  - [x] `test("getQuestionById returns correct question")`
  - [x] `test("isAnswerCorrect validates answers correctly")`
  - [x] `test("getNextQuestion returns appropriate next question")`

#### Responsive Utilities (`responsive.ts` and `sizeUtils.ts`)
- [x] **Responsive Tests**
  - [x] `test("useBreakpoint returns correct breakpoint")`
  - [x] `test("isBreakpoint correctly identifies current breakpoint")`
  - [x] `test("getResponsiveValue returns value for current breakpoint")`
  - [x] `test("pxToRem converts pixels to rem correctly")`
  - [x] `test("remToPx converts rem to pixels correctly")`
  - [x] `test("clamp constrains values correctly")`

### Service Tests

#### Base Service (`BaseService.ts`)
- [x] **Base Service Tests**
  - [x] `test("initialize sets up service correctly")`
  - [x] `test("cleanup cleans up service resources")`
  - [x] `test("events emit and subscribe correctly")`
  - [x] `test("logger logs with correct service context")`
  - [x] `test("state management functions work correctly")`

#### Service Factory (`ServiceFactory.ts`)
- [x] **Service Factory Tests**
  - [x] `test("registerService adds service to registry")`
  - [x] `test("getService returns requested service instance")`
  - [x] `test("hasService correctly reports service availability")`
  - [x] `test("initializeServices initializes all registered services")`
  - [x] `test("shutdownServices shuts down all services")`
  - [x] `test("dependency resolution works correctly")`

#### Logger Service (`loggerService.ts`)
- [x] **Logger Tests**
  - [x] `test("log methods write with correct level")`
  - [x] `test("setLogLevel filters appropriate messages")`
  - [x] `test("addTransport adds logging destination")`
  - [x] `test("log formatting includes all required fields")`
  - [x] `test("error logging includes stack traces")`
  - [x] `test("structured logging works correctly")`

#### Audio Service (`audioService.ts`)
- [x] **Audio Tests**
  - [x] `test("should extend BaseService")`
  - [x] `test("should initialize and cleanup properly")`
  - [x] `test("should have required audio methods")`
  - [x] `test("should get volume in valid range")`
  - [x] `test("should return boolean for muted status")`

#### Gamification Services
- [x] **XP Service Tests (`xpService.ts`)**
  - [x] `test("addXP increases experience correctly")`
  - [x] `test("getLevel returns correct level for XP amount")`
  - [x] `test("getXpProgress calculates progress percentage")`
  - [x] `test("getXpToNextLevel returns correct XP needed")`
  - [x] `test("recordActivity logs XP transactions")`

- [⚠️] **Currency Service Tests (`currencyService.ts`)**
  - [⚠️] `test("addCurrency increases balance correctly")` - Tests exist but need updating to match implementation
  - [⚠️] `test("spendCurrency decreases balance correctly")` - Tests exist but need updating to match implementation
  - [⚠️] `test("getBalance returns current balance")` - Tests exist but need updating to match implementation
  - [⚠️] `test("validatePurchase checks balance sufficiency")` - Tests exist but need updating to match implementation
  - [⚠️] `test("getTransactionHistory returns transaction log")` - Tests exist but need updating to match implementation

- [x] **Hearts Service Tests (`heartsService.ts`)**
  - [x] `test("useHeart decreases hearts correctly")`
  - [x] `test("addHeart increases hearts correctly")`
  - [x] `test("getHearts returns current heart count")`
  - [x] `test("getMaxHearts returns capacity")`
  - [x] `test("getTimeToNextHeart calculates regeneration time")`
  - [x] `test("isRegenerating checks regeneration status")`
  - [x] `test("refillHearts refills hearts using currency")`
  - [x] `test("notifies subscribers when hearts change")`
  - [x] `test("handles premium status correctly")`
  - [x] `test("hasEnoughHearts checks if user has required hearts")`
  - [x] `test("allows setting maximum hearts")`

- [x] **Streak Service Tests (`streakService.ts`)**
  - [x] `test("incrementStreak increases streak count")`
  - [x] `test("getStreak returns current streak")`
  - [x] `test("checkAndUpdateStreak validates daily activity")`
  - [x] `test("getLongestStreak returns longest historical streak")`
  - [x] `test("resetStreak zeros streak counter")`
  - [x] `test("willLoseStreakOn calculates expiration date")`

- [x] **Achievements Service Tests (`achievementsService.ts`)**
  - [x] `test("unlockAchievement grants achievement")`
  - [x] `test("getAchievements returns all achievements")`
  - [x] `test("getUnlockedAchievements filters unlocked achievements")`
  - [x] `test("updateProgress tracks partial achievement completion")`
  - [x] `test("checkEligibility validates unlock conditions")`

#### Learning Services
- [x] **Curriculum Service Tests (`curriculumService.ts`)**
  - [x] `test("getLessons returns available lessons")`
  - [x] `test("completeLesson marks lesson as completed")`
  - [x] `test("getProgress calculates curriculum progress")`
  - [x] `test("unlockLesson makes lesson available")`
  - [x] `test("getLessonById retrieves specific lesson")`
  - [x] `test("getNextRecommendedLesson suggests appropriate lesson")`

- [x] **User Progress Service Tests (`userProgressService.ts`)**
  - [x] `test("recordSession logs practice session")`
  - [x] `test("getStatistics returns user performance metrics")`
  - [x] `test("getHistory returns historical sessions")`
  - [x] `test("setGoal creates user goal")`
  - [x] `test("updateGoalProgress tracks goal completion")`
  - [x] `test("getGoals returns active goals")`

- [x] **Spaced Repetition Service Tests (`spacedRepetitionService.ts`)**
  - [x] `test("scheduleReview sets next review date")`
  - [x] `test("getDueItems returns items due for review")`
  - [x] `test("recordResult updates item difficulty")`
  - [x] `test("calculateInterval implements spaced repetition algorithm")`
  - [x] `test("getReviewHistory returns past review data")`

#### System Services
- [x] **Window Service Tests (`windowService.ts`)**
  - [x] `test("extends BaseService")`
  - [x] `test("clean up works correctly")`
  - [x] `test("handles errors during cleanup")`
  - [x] `test("shows notifications")`
  - [x] `test("sets up system tray")`

- [x] **OS Detection Service Tests (`osDetectionService.ts`)**
  - [x] `test("getOS returns correct operating system")`
  - [x] `test("getOSVersion returns OS version")`
  - [x] `test("isMacOS correctly identifies Mac platform")`
  - [x] `test("isWindows correctly identifies Windows platform")`
  - [x] `test("isLinux correctly identifies Linux platform")`
  - [x] `test("getPlatformInfo returns detailed system info")`

- [x] **Update Service Tests (`updateService.ts`)**
  - [x] `test("extends BaseService")`
  - [x] `test("initializes correctly")`
  - [x] `test("cleans up correctly")`
  - [x] `test("addListener and removeListener work correctly")`
  - [x] `test("checkForUpdates calls the API correctly")`
  - [x] `test("downloadAndInstallUpdate calls the API correctly")`
  - [x] `test("restartApp calls the API correctly")`

- [x] **Offline Service Tests (`offlineService.ts`)**
  - [x] `test("extends BaseService")`
  - [x] `test("initializes correctly when online")`
  - [x] `test("initializes correctly when offline")`
  - [x] `test("loads existing offline data during initialization")`
  - [x] `test("cleans up the service")`
  - [x] `test("handles online/offline transitions")`
  - [x] `test("adds pending changes and syncs them")`
  - [x] `test("provides offline status and manages listeners")`

- [x] **Subscription Service Tests (`subscriptionService.ts`)**
  - [x] `test("extends BaseService")`
  - [x] `test("gets current subscription state")`
  - [x] `test("gets available subscription plans")`
  - [x] `test("gets active subscription plan")`
  - [x] `test("subscribes to a plan successfully")`
  - [x] `test("handles subscription with yearly interval")`
  - [x] `test("handles subscription with invalid plan ID")`
  - [x] `test("cancels subscription successfully")`
  - [x] `test("handles cancellation errors")`
  - [x] `test("checks for premium features correctly")`
  - [x] `test("checks for pro features correctly")`
  - [x] `test("manages listeners correctly")`
  - [x] `test("cleans up correctly")`
  - [x] `test("handles cleanup errors")`
  - [x] `test("simulates subscription successfully")`
  - [x] `test("handles simulation errors")`

### Custom Hook Tests

#### Redux Hook Tests
- [ ] **useAppRedux Tests**
  - [ ] `test("initializes app on mount")`
  - [ ] `test("provides correct app state")`
  - [ ] `test("provides working action creators")`
  - [ ] `test("handles notification creation correctly")`
  - [ ] `test("manages error state correctly")`

- [ ] **useAchievementsRedux Tests**
  - [ ] `test("provides correct achievements state")`
  - [ ] `test("loadAchievements dispatches correctly")`
  - [ ] `test("unlockAchievement updates state correctly")`
  - [ ] `test("updateProgress tracks achievement progress")`
  - [ ] `test("checkEligibility evaluates achievement conditions")`

- [ ] **useGamificationRedux Tests**
  - [ ] `test("provides correct gamification state")`
  - [ ] `test("addXp updates state correctly")`
  - [ ] `test("useHearts updates state correctly")`
  - [ ] `test("adds currency with correct transaction details")`
  - [ ] `test("updates streak correctly")`

#### UI Hook Tests
- [ ] **useAnimation Tests**
  - [ ] `test("animate creates animation correctly")`
  - [ ] `test("spring creates spring animation")`
  - [ ] `test("sequence creates animation sequence")`
  - [ ] `test("parallel runs animations simultaneously")`
  - [ ] `test("useAnimationControls provides control functions")`
  - [ ] `test("cleanup cancels animations on unmount")`

- [ ] **useAnimatedValue Tests**
  - [ ] `test("returns current animated value")`
  - [ ] `test("animate changes value over time")`
  - [ ] `test("stop halts animation")`
  - [ ] `test("setValue changes value immediately")`
  - [ ] `test("supports different animation types")`

- [ ] **useFeedbackAnimation Tests**
  - [ ] `test("success animation triggers correctly")`
  - [ ] `test("error animation triggers correctly")`
  - [ ] `test("warning animation triggers correctly")`
  - [ ] `test("info animation triggers correctly")`
  - [ ] `test("animation timing respects duration")`

#### Utility Hook Tests
- [ ] **useKeyboardShortcut Tests**
  - [ ] `test("registers shortcut correctly")`
  - [ ] `test("triggers callback when shortcut pressed")`
  - [ ] `test("unregisters shortcut on cleanup")`
  - [ ] `test("respects when condition")`
  - [ ] `test("handles modifier keys correctly")`

- [ ] **useShortcutDetection Tests**
  - [ ] `test("detects simple key press")`
  - [ ] `test("detects key combinations")`
  - [ ] `test("detects key sequences")`
  - [ ] `test("respects active state")`
  - [ ] `test("handles global shortcuts")`
  - [ ] `test("cleans up listeners on unmount")`

- [ ] **useMemoizedValue Tests**
  - [ ] `test("memoizes values correctly")`
  - [ ] `test("updates value when dependencies change")`
  - [ ] `test("returns same reference if value same")`
  - [ ] `test("uses custom equality function")`

- [ ] **useResponsiveProps Tests**
  - [ ] `test("returns props for current breakpoint")`
  - [ ] `test("updates props when window resizes")`
  - [ ] `test("merges responsive props with base props")`
  - [ ] `test("handles nested responsive props")`
  - [ ] `test("applies transformers to responsive values")`

- [ ] **usePrefetch Tests**
  - [ ] `test("prefetches data on mount")`
  - [ ] `test("returns loading state during fetch")`
  - [ ] `test("handles fetch success correctly")`
  - [ ] `test("handles fetch error correctly")`
  - [ ] `test("respects shouldPrefetch condition")`

- [ ] **useServiceSubscription Tests**
  - [ ] `test("subscribes to service event")`
  - [ ] `test("unsubscribes on cleanup")`
  - [ ] `test("invokes callback when event fires")`
  - [ ] `test("updates state when event fires")`
  - [ ] `test("handles multiple events correctly")`

- [ ] **useSentryTransaction Tests**
  - [ ] `test("creates transaction with correct name")`
  - [ ] `test("starts transaction on mount")`
  - [ ] `test("finishes transaction on unmount")`
  - [ ] `test("adds spans to transaction")`
  - [ ] `test("sets transaction status correctly")`

- [ ] **useSound Tests**
  - [ ] `test("loads sound correctly")`
  - [ ] `test("plays sound")`
  - [ ] `test("stops sound")`
  - [ ] `test("controls volume")`
  - [ ] `test("handles sound loading errors")`

- [ ] **useCurrency Tests**
  - [ ] `test("returns current currency balance")`
  - [ ] `test("updates when balance changes")`
  - [ ] `test("add method increases balance")`
  - [ ] `test("spend method decreases balance")`
  - [ ] `test("validates sufficient funds")`

- [ ] **useXP Tests**
  - [ ] `test("returns current XP and level")`
  - [ ] `test("add method increases XP")`
  - [ ] `test("returns progress to next level")`
  - [ ] `test("calculates XP needed for next level")`
  - [ ] `test("triggers level up event when threshold reached")`

- [ ] **usePathConnectionOptimization Tests**
  - [ ] `test("optimizes path coordinates correctly")`
  - [ ] `test("handles complex path geometries")`
  - [ ] `test("reduces number of points while maintaining shape")`
  - [ ] `test("respects tolerance parameter")`
  - [ ] `test("preserves critical points")`

- [ ] **usePathNodeOptimization Tests**
  - [ ] `test("optimizes path nodes correctly")`
  - [ ] `test("preserves node connections")`
  - [ ] `test("reduces node count correctly")`
  - [ ] `test("respects optimization parameters")`

- [ ] **useQuizState Tests**
  - [ ] `test("initializes quiz state correctly")`
  - [ ] `test("advances to next question")`
  - [ ] `test("records answers correctly")`
  - [ ] `test("calculates score")`
  - [ ] `test("tracks time spent")`
  - [ ] `test("handles quiz completion")`

### Component-Specific Tests

#### Sentry Components
- [ ] **SentryTest.tsx Tests**
  - [ ] `test("captures errors correctly")`
  - [ ] `test("adds breadcrumbs for actions")`
  - [ ] `test("sets user context correctly")`
  - [ ] `test("includes extra data in errors")`
  - [ ] `test("handles manual error reporting")`

- [ ] **SentryReduxTest.tsx Tests**
  - [ ] `test("middleware captures Redux actions")`
  - [ ] `test("middleware captures Redux errors")`
  - [ ] `test("logs state changes as breadcrumbs")`
  - [ ] `test("enriches transactions with Redux data")`

- [ ] **SentryTransactionExample.tsx Tests**
  - [ ] `test("creates and manages transactions")`
  - [ ] `test("adds spans to transactions")`
  - [ ] `test("measures component performance")`
  - [ ] `test("enriches transactions with component data")`
  - [ ] `test("handles span status changes")`

#### Redux Example Component Tests
- [ ] **ReduxExample.tsx Tests**
  - [ ] `test("displays app state correctly")`
  - [ ] `test("handles XP addition correctly")`
  - [ ] `test("handles heart consumption correctly")`
  - [ ] `test("updates notification state correctly")`
  - [ ] `test("changes theme correctly")`
  - [ ] `test("displays loading state correctly")`

#### Feedback Components Tests
- [ ] **Feedback Component Tests**
  - [ ] `test("renders correct feedback types")`
  - [ ] `test("animates appearance/disappearance")`
  - [ ] `test("auto-dismisses after timeout")`
  - [ ] `test("handles manual close events")`
  - [ ] `test("displays icons correctly")`
  - [ ] `test("positions feedback correctly")`

#### Layout Components Tests
- [ ] **Navigation Tests**
  - [ ] `test("renders correct navigation items")`
  - [ ] `test("highlights active route")`
  - [ ] `test("handles mobile/desktop views")`
  - [ ] `test("toggles collapsed state")`
  - [ ] `test("displays badge notifications")`
  - [ ] `test("handles authentication state")`

#### Theme Provider Tests
- [ ] **ThemeProviderRedux.tsx Tests**
  - [ ] `test("applies theme from Redux store")`
  - [ ] `test("updates when theme changes in store")`
  - [ ] `test("provides theme context to children")`
  - [ ] `test("handles theme switching")`
  - [ ] `test("applies correct color scheme")`
  - [ ] `test("sets system preference detection")`

#### App Initializer Tests
- [ ] **AppInitializer.tsx Tests**
  - [ ] `test("dispatches initialization on mount")`
  - [ ] `test("shows loading state during initialization")`
  - [ ] `test("renders children after initialization")`
  - [ ] `test("handles initialization errors")`
  - [ ] `test("provides retry capability")`

### Integration Tests

- [ ] **Redux & React Integration**
  - [ ] `test("connected components receive state updates")`
  - [ ] `test("dispatched actions update connected components")`
  - [ ] `test("selectors provide correct derived state")`
  - [ ] `test("async thunks flow through to components")`
  - [ ] `test("error states are displayed correctly")`

- [ ] **Services & React Integration**
  - [ ] `test("services initialize on app startup")`
  - [ ] `test("service events update UI")`
  - [ ] `test("UI actions trigger service methods")`
  - [ ] `test("service errors are handled in UI")`

- [ ] **Tauri Integration**
  - [ ] `test("app communicates with Tauri backend")`
  - [ ] `test("file system operations work through Tauri")`
  - [ ] `test("system notifications display correctly")`
  - [ ] `test("window management functions work correctly")`
  - [ ] `test("app handles OS-specific behaviors")`

- [ ] **Form & Validation Integration**
  - [ ] `test("form validation works across form components")`
  - [ ] `test("form submission with valid data works correctly")`
  - [ ] `test("form errors display in the correct locations")`
  - [ ] `test("complex multi-step forms maintain state")`

- [ ] **Routing Integration**
  - [ ] `test("route changes update UI correctly")`
  - [ ] `test("private routes require authentication")`
  - [ ] `test("navigation guards work correctly")`
  - [ ] `test("URL parameters are parsed correctly")`
  - [ ] `test("breadcrumb navigation updates with routes")`

### Theme and Styling Tests

- [ ] **Theme Tests (`theme.ts`)**
  - [ ] `test("createAppTheme generates correct theme object")`
  - [ ] `test("light theme has correct color values")`
  - [ ] `test("dark theme has correct color values")`
  - [ ] `test("theme includes correct typography settings")`
  - [ ] `test("theme spacing functions correctly")`
  - [ ] `test("theme includes proper breakpoints")`
  - [ ] `test("custom theme creation works correctly")`

- [ ] **CSS Styles Tests (`styles.css`)**
  - [ ] `test("global styles apply correctly")`
  - [ ] `test("utility classes function as expected")`
  - [ ] `test("animations perform correctly")`
  - [ ] `test("responsive styles adapt to screen sizes")`
  - [ ] `test("variables are properly applied")`

### Higher-Order Component Tests

- [ ] **withTheme HOC Tests**
  - [ ] `test("injects theme props correctly")`
  - [ ] `test("updates when theme changes")`
  - [ ] `test("forwards refs correctly")`
  - [ ] `test("preserves original component props")`

- [ ] **withAuthentication HOC Tests**
  - [ ] `test("injects authentication props")`
  - [ ] `test("redirects unauthenticated users")`
  - [ ] `test("preserves original component props")`
  - [ ] `test("handles authentication state changes")`

- [ ] **withErrorBoundary HOC Tests**
  - [ ] `test("catches errors in wrapped components")`
  - [ ] `test("displays fallback UI when error occurs")`
  - [ ] `test("logs errors correctly")`
  - [ ] `test("allows component to recover")`

### AppConfig Tests

- [ ] **Environment Configuration Tests**
  - [ ] `test("environment variables load correctly")`
  - [ ] `test("feature flags applied correctly")`
  - [ ] `test("API endpoints configured correctly")`
  - [ ] `test("fallback values work when env vars missing")`
  - [ ] `test("development/production config differences")`

## Test Implementation Schedule

To achieve comprehensive test coverage systematically, follow this implementation schedule:

### Phase 1: Core State Management
- [ ] Test Redux slice reducers
- [ ] Test Redux selectors
- [ ] Test basic action creators
- [ ] Test simple synchronous Redux functionality
- [ ] Implement helper functions for Redux testing

**Estimated completion: 1-2 weeks**

### Phase 2: Async Logic and Services
- [ ] Test Redux thunks
- [ ] Test API service functions
- [ ] Test core utility functions
- [ ] Test service factory
- [ ] Test service initialization
- [ ] Implement mock services

**Estimated completion: 1-2 weeks**

### Phase 3: UI Components
- [ ] Test core UI components (buttons, inputs, etc.)
- [ ] Test layout components
- [ ] Test shared components
- [ ] Test component rendering
- [ ] Implement testing utils for component renders

**Estimated completion: 2-3 weeks**

### Phase 4: Feature Components and Integration
- [ ] Test feature-specific components
- [ ] Test hooks
- [ ] Test connected components
- [ ] Test component interactions
- [ ] Create integration test suites

**Estimated completion: 2-3 weeks**

### Phase 5: Advanced Tests and Edge Cases
- [ ] Test error handling
- [ ] Test animations
- [ ] Test performance-related functions
- [ ] Test accessibility
- [ ] Add stress tests
- [ ] Test edge cases

**Estimated completion: 2 weeks**

## Completeness Checklist

Track the overall progress of your testing effort with this high-level checklist:

- [ ] **Redux Slices**
  - [x] App slice (25/25 tests)
  - [x] Achievements slice (17/17 tests)
  - [x] Gamification slice (17/17 tests)
  - [x] Curriculum slice (38/38 tests)
  - [x] User Progress slice (32/32 tests)
  - [x] Settings slice (27/27 tests)
  - [x] Subscription slice (12/12 tests)
  - [x] Theme slice (4/4 tests)

- [x] **Utility Functions**
  - [x] Animation utilities (14/14 tests)
  - [x] DateTime utilities (14/14 tests)
  - [x] Format utilities (29/29 tests)
  - [x] Keyboard utilities (39/39 tests)
  - [x] Shortcut utilities (7/7 tests)
  - [x] Style utilities (7/7 tests)
  - [x] Component utilities (6/6 tests)
  - [x] Window Manager (8/8 tests)
  - [x] Other utilities (28/28 tests)

- [ ] **Services**
  - [x] Base & factory services (20/20 tests)
  - [x] Gamification services (125/125 tests)
    - [x] Gamification Service (31/31 tests)
    - [x] Achievements Service (27/27 tests)
    - [x] Currency Service (33/33 tests)
    - [x] Hearts Service (13/13 tests)
    - [x] Streak Service (10/10 tests)
    - [x] XP Service (11/11 tests)
  - [x] Learning services (49/49 tests)
    - [x] Curriculum Service (23/23 tests)
    - [x] User Progress Service (14/14 tests)
    - [x] Spaced Repetition Service (12/12 tests)
  - [x] Keyboard Service (15/15 tests)
  - [x] Logger Service (5/5 tests)
  - [x] Audio Service (5/5 tests)
  - [x] OS Detection Service (13/13 tests)
  - [ ] Other system services (0/6 tests)

- [ ] **Components**
  - [ ] Core UI components (0/31 tests)
  - [ ] Layout components (0/14 tests)
  - [ ] Feature components (0/45 tests)
  - [ ] Specialized components (0/28 tests)

- [ ] **Hooks**
  - [ ] Redux hooks (0/25 tests)
  - [ ] UI hooks (0/16 tests)
  - [ ] Utility hooks (0/31 tests)

- [ ] **Integration Tests**
  - [ ] Redux & React integration (0/5 tests)
  - [ ] Services & React integration (0/4 tests)
  - [ ] Tauri integration (0/5 tests)
  - [ ] Form & validation integration (0/4 tests)
  - [ ] Routing integration (0/5 tests)

**Total Test Coverage: 0/689 tests (0%)**

## Troubleshooting Common Test Issues

### Redux Testing Issues
- **State not updating in tests**: Ensure reducers are pure functions and you're not mutating state directly
- **Thunk tests failing**: Check that mocks for API calls are set up correctly
- **Selector tests failing**: Verify the shape of your mock state matches what selectors expect

### Component Testing Issues
- **Component not rendering**: Check that required props are provided
- **Events not firing**: Use `userEvent` instead of `fireEvent` for more realistic behavior
- **Async updates not showing**: Use `await` with `findByText` instead of `getByText`

### Mock Issues
- **Jest mock not working**: Ensure mocks are set up before the test runs
- **Mock not being called**: Verify the import path in your test matches the actual code
- **Mock returning wrong value**: Check mock implementation with `.mockImplementation()`

## Best Practices Summary

1. **Write tests as you code**: Don't leave testing for the end of development
2. **Focus on behavior, not implementation**: Test what components do, not how they do it
3. **Keep tests simple and focused**: Test one thing per test
4. **Use realistic data**: Test with data that resembles what users will input
5. **Test edge cases**: Null values, empty arrays, error states, etc.
6. **Follow AAA pattern**: Arrange, Act, Assert
7. **Use the right tools**: RTL for components, Jest for logic
8. **Maintain test independence**: Tests shouldn't depend on each other
9. **Clean up after tests**: Reset state and mocks between tests
10. **Review test coverage**: Address gaps in your test coverage regularly 

## File Coverage Checklist

This checklist helps ensure all files in the project have corresponding test coverage. Mark a file as covered when you've verified that all its functionality has corresponding test cases in the task list above.

### Redux Slices
- [ ] `src/store/slices/appSlice.ts`
- [ ] `src/store/slices/achievementsSlice.ts`
- [x] `src/store/slices/gamificationSlice.ts`
- [x] `src/store/slices/curriculumSlice.ts`
- [x] `src/store/slices/userProgressSlice.ts`
- [x] `src/store/slices/settingsSlice.ts`
- [x] `src/store/slices/subscriptionSlice.ts`
- [x] `src/store/slices/themeSlice.ts`
- [ ] `src/store/slices/index.ts`

### Store Setup
- [ ] `src/store/api.ts`
- [ ] `src/store/hooks.ts`
- [ ] `src/store/index.ts`

### Utility Files
- [x] `src/utils/animationUtils.ts`
- [x] `src/utils/animationSystem.ts`
- [x] `src/utils/styleUtils.ts`
- [x] `src/utils/shortcutDetector.ts`
- [x] `src/utils/componentUtils.ts`
- [x] `src/utils/dateTimeUtils.ts`
- [x] `src/utils/formatUtils.ts`
- [x] `src/utils/keyboardUtils.ts`
- [x] `src/utils/quizUtils.ts`
- [x] `src/utils/responsive.ts`
- [x] `src/utils/sentry.ts`
- [x] `src/utils/sentryRedux.ts`
- [x] `src/utils/serviceUtils.ts`
- [x] `src/utils/shortcutUtils.ts`
- [x] `src/utils/sizeUtils.ts`
- [x] `src/utils/windowManager.ts`
- [x] `src/utils/index.ts`

### Services
- [ ] `src/services/BaseService.ts`
- [ ] `src/services/ServiceFactory.ts`
- [ ] `src/services/loggerService.ts`
- [ ] `src/services/windowService.ts`
- [ ] `src/services/subscriptionService.ts`
- [ ] `src/services/achievementsService.ts`
- [ ] `src/services/currencyService.ts`
- [ ] `src/services/heartsService.ts`
- [ ] `src/services/xpService.ts`
- [ ] `src/services/streakService.ts`
- [ ] `src/services/spacedRepetitionService.ts`
- [ ] `src/services/initializeServices.ts`
- [ ] `src/services/curriculumService.ts`
- [ ] `src/services/userProgressService.ts`
- [ ] `src/services/updateService.ts`
- [ ] `src/services/keyboardService.ts`
- [ ] `src/services/audioService.ts`
- [ ] `src/services/osDetectionService.ts`
- [ ] `src/services/GamificationService.ts`
- [ ] `src/services/offlineService.ts`
- [ ] `src/services/index.ts`

### Hooks
- [ ] `src/hooks/usePrefetch.ts`
- [ ] `src/hooks/useAchievementsRedux.ts`
- [ ] `src/hooks/useAnimation.ts`
- [ ] `src/hooks/useGamificationRedux.ts`
- [ ] `src/hooks/useCurriculumRedux.ts`
- [ ] `src/hooks/useMemoizedValue.ts`
- [ ] `src/hooks/useAnimatedValue.ts`
- [ ] `src/hooks/useAppRedux.ts`
- [ ] `src/hooks/useCurrency.ts`
- [ ] `src/hooks/useFeedbackAnimation.ts`
- [ ] `src/hooks/useKeyboardShortcut.ts`
- [ ] `src/hooks/usePathConnectionOptimization.ts`
- [ ] `src/hooks/usePathNodeOptimization.ts`
- [ ] `src/hooks/useQuizState.ts`
- [ ] `src/hooks/useResponsiveProps.ts`
- [ ] `src/hooks/useSentryTransaction.ts`
- [ ] `src/hooks/useServiceSubscription.ts`
- [ ] `src/hooks/useSettingsRedux.ts`
- [ ] `src/hooks/useShortcutDetection.ts`
- [ ] `src/hooks/useSound.ts`
- [ ] `src/hooks/useSubscriptionRedux.ts`
- [ ] `src/hooks/useThemeRedux.ts`
- [ ] `src/hooks/useUserProgressRedux.ts`
- [ ] `src/hooks/useXP.ts`
- [ ] `src/hooks/index.ts`

### Component Files
- [ ] `src/components/EnhancedLessonFlow.tsx`
- [ ] `src/components/Store.tsx`
- [ ] `src/components/AppInitializer.tsx`
- [ ] `src/components/ThemeProviderRedux.tsx`
- [ ] `src/components/ReduxExample.tsx`
- [ ] `src/components/SentryTransactionExample.tsx`
- [ ] `src/components/SentryTest.tsx`
- [ ] `src/components/SentryReduxTest.tsx`
- [ ] `src/components/index.ts`

### Component Subdirectories
- [ ] All files in `src/components/feedback/`
- [ ] All files in `src/components/curriculum/`
- [ ] All files in `src/components/notifications/`
- [ ] All files in `src/components/statistics/`
- [ ] All files in `src/components/layout/`
- [ ] All files in `src/components/exercises/`
- [ ] All files in `src/components/skeletons/`
- [ ] All files in `src/components/shared/`
- [ ] All files in `src/components/profile/`
- [ ] All files in `src/components/shortcuts/`
- [ ] All files in `src/components/review/`
- [ ] All files in `src/components/keyboard/`
- [ ] All files in `src/components/ui/`
- [ ] All files in `src/components/effects/`
- [ ] All files in `src/components/settings/`
- [ ] All files in `src/components/gamification/`

### Main App Files
- [ ] `src/App.tsx`
- [ ] `src/main.tsx`
- [ ] `src/routes.tsx`
- [ ] `src/theme.ts`
- [ ] `src/styles.css`

### Pages
- [ ] All files in `src/pages/`

### Types
- [ ] All files in `src/types/`

### Configuration Files
- [ ] `vite.config.ts`
- [ ] `vitest.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `.env` setup and validation

### Tauri Integration
- [ ] All files in `src-tauri/` that require JS/TS tests

## Missing Files Check

For each file in the project, verify that corresponding tests are defined in the task list. Create additional tests if any files have missing coverage.

### Process for New or Uncovered Files:
1. Identify the file's purpose and functionality
2. Determine appropriate test types (unit, integration, etc.)
3. Add test cases to the task list for all key functions and features
4. Check off the file in this checklist once tests are defined
5. Update the completeness checklist with the new test count

**Current File Coverage: 0/~150 files (0%)**

## Updated Component Test Coverage

The following sections have been added to ensure all component directories and pages have complete test coverage:

### Additional Component Subdirectories Tests

#### Feedback Components Tests (`src/components/feedback/`)
- [ ] **Feedback Component Tests**
  - [ ] `test("renders alert components with correct styling")`
  - [ ] `test("displays toast notifications correctly")`
  - [ ] `test("handles different feedback types: success, error, warning, info")`
  - [ ] `test("supports custom icons for feedback components")`
  - [ ] `test("allows dismissing feedback when configured")`
  - [ ] `test("renders feedback in correct position")`
  - [ ] `test("animates feedback appearance and disappearance")`
  - [ ] `test("applies accessibility attributes correctly")`

#### Curriculum Components Tests (`src/components/curriculum/`)
- [ ] **Curriculum Component Tests**
  - [ ] `test("renders course structure correctly")`
  - [ ] `test("displays lesson cards with accurate information")`
  - [ ] `test("shows progress indicators correctly")`
  - [ ] `test("handles lesson selection")`
  - [ ] `test("displays locked and unlocked lessons appropriately")`
  - [ ] `test("renders different lesson types with correct UI")`
  - [ ] `test("supports curriculum search functionality")`
  - [ ] `test("displays prerequisite relationships correctly")`

#### Notifications Components Tests (`src/components/notifications/`)
- [ ] **Notifications Component Tests**
  - [ ] `test("renders notification list correctly")`
  - [ ] `test("displays individual notifications with correct content")`
  - [ ] `test("handles notification read/unread status")`
  - [ ] `test("supports notification actions")`
  - [ ] `test("allows dismissing individual notifications")`
  - [ ] `test("supports clearing all notifications")`
  - [ ] `test("renders notification badges with correct count")`
  - [ ] `test("animates new notifications appropriately")`

#### Statistics Components Tests (`src/components/statistics/`)
- [ ] **Statistics Component Tests**
  - [ ] `test("renders charts with correct data")`
  - [ ] `test("displays metrics with appropriate formatting")`
  - [ ] `test("shows progress over time accurately")`
  - [ ] `test("renders comparison statistics correctly")`
  - [ ] `test("supports different time period filters")`
  - [ ] `test("handles empty data states appropriately")`
  - [ ] `test("displays tooltips with detailed information")`
  - [ ] `test("maintains accessibility in data visualizations")`

#### Exercises Components Tests (`src/components/exercises/`)
- [ ] **Exercises Component Tests**
  - [ ] `test("renders typing exercise interface correctly")`
  - [ ] `test("tracks typing accuracy correctly")`
  - [ ] `test("handles keyboard input appropriately")`
  - [ ] `test("displays current and target WPM")`
  - [ ] `test("shows progress indicators during exercise")`
  - [ ] `test("handles exercise completion correctly")`
  - [ ] `test("supports different exercise difficulty levels")`
  - [ ] `test("provides appropriate feedback on mistakes")`

#### Skeletons Components Tests (`src/components/skeletons/`)
- [ ] **Skeleton Component Tests**
  - [ ] `test("renders skeleton loaders with correct dimensions")`
  - [ ] `test("displays animation while loading")`
  - [ ] `test("supports different skeleton types (text, image, etc.)")`
  - [ ] `test("matches the layout of actual content")`
  - [ ] `test("supports custom styling options")`
  - [ ] `test("renders in correct hierarchy for complex components")`

#### Shared Components Tests (`src/components/shared/`)
- [ ] **Shared Component Tests**
  - [ ] `test("renders Button component with correct variants")`
  - [ ] `test("handles Card component with different content types")`
  - [ ] `test("displays Modal with correct overlay and focus management")`
  - [ ] `test("supports Dropdown with selection functionality")`
  - [ ] `test("handles Toggle component state changes")`
  - [ ] `test("renders Tabs with correct active indicators")`
  - [ ] `test("supports Badge with different positions and counts")`
  - [ ] `test("displays Tooltip with correct positioning")`
  - [ ] `test("renders Typography with appropriate styling")`

#### Profile Components Tests (`src/components/profile/`)
- [ ] **Profile Component Tests**
  - [ ] `test("renders user profile information correctly")`
  - [ ] `test("handles profile image upload functionality")`
  - [ ] `test("displays user achievements appropriately")`
  - [ ] `test("supports editing profile information")`
  - [ ] `test("validates form inputs correctly")`
  - [ ] `test("shows user statistics in profile context")`
  - [ ] `test("supports account management functions")`

#### Shortcuts Components Tests (`src/components/shortcuts/`)
- [ ] **Shortcuts Component Tests**
  - [ ] `test("renders shortcut key combinations correctly")`
  - [ ] `test("displays shortcut descriptions appropriately")`
  - [ ] `test("supports shortcut categories and grouping")`
  - [ ] `test("handles platform-specific key displays (Mac/Windows)")`
  - [ ] `test("supports custom shortcuts configuration")`
  - [ ] `test("renders shortcut conflicts with appropriate warnings")`
  - [ ] `test("provides interactive shortcut learning UI")`

#### Review Components Tests (`src/components/review/`)
- [ ] **Review Component Tests**
  - [ ] `test("renders review session interface correctly")`
  - [ ] `test("handles spaced repetition algorithm integration")`
  - [ ] `test("displays review items with appropriate content")`
  - [ ] `test("tracks review progress correctly")`
  - [ ] `test("supports different review response types")`
  - [ ] `test("calculates review scheduling correctly")`
  - [ ] `test("provides appropriate feedback for reviews")`
  - [ ] `test("handles review session completion")`

#### Keyboard Components Tests (`src/components/keyboard/`)
- [ ] **Keyboard Component Tests**
  - [ ] `test("renders keyboard layout correctly")`
  - [ ] `test("highlights keys during typing appropriately")`
  - [ ] `test("supports different keyboard layouts")`
  - [ ] `test("handles modifier key states")`
  - [ ] `test("displays key labels with correct formatting")`
  - [ ] `test("animates key presses visually")`
  - [ ] `test("supports interactive key clicking")`
  - [ ] `test("maintains accessibility for keyboard visualization")`

#### UI Components Tests (`src/components/ui/`)
- [ ] **UI Component Tests**
  - [ ] `test("renders theme-consistent UI components")`
  - [ ] `test("supports different component sizes")`
  - [ ] `test("handles disabled states correctly")`
  - [ ] `test("displays loading states appropriately")`
  - [ ] `test("supports hover and focus states")`
  - [ ] `test("maintains consistent spacing in layouts")`
  - [ ] `test("renders UI components with correct typography")`
  - [ ] `test("supports RTL layout when needed")`

#### Effects Components Tests (`src/components/effects/`)
- [ ] **Effects Component Tests**
  - [ ] `test("renders visual effects with correct animation")`
  - [ ] `test("supports particles and motion effects")`
  - [ ] `test("handles conditional effect triggering")`
  - [ ] `test("adjusts effects based on performance settings")`
  - [ ] `test("applies theme-consistent styling to effects")`
  - [ ] `test("manages effect lifecycle correctly")`
  - [ ] `test("supports celebration and achievement effects")`

#### Settings Components Tests (`src/components/settings/`)
- [ ] **Settings Component Tests**
  - [ ] `test("renders settings categories correctly")`
  - [ ] `test("handles form controls for different setting types")`
  - [ ] `test("supports toggling boolean settings")`
  - [ ] `test("displays range sliders with correct values")`
  - [ ] `test("saves settings changes correctly")`
  - [ ] `test("shows confirmation for sensitive settings")`
  - [ ] `test("supports resetting settings to defaults")`
  - [ ] `test("validates setting inputs appropriately")`

#### Gamification Components Tests (`src/components/gamification/`)
- [ ] **Gamification Component Tests**
  - [ ] `test("renders XP progress correctly")`
  - [ ] `test("displays level indicators appropriately")`
  - [ ] `test("shows streak information correctly")`
  - [ ] `test("handles currency displays with formatting")`
  - [ ] `test("animates rewards and achievements")`
  - [ ] `test("renders achievement badges properly")`
  - [ ] `test("supports daily goal tracking UI")`
  - [ ] `test("displays leaderboard with correct ranking")`

### Pages Component Tests

#### Home Page Tests (`src/pages/HomePage.tsx`)
- [ ] **Home Page Tests**
  - [ ] `test("renders welcome content correctly")`
  - [ ] `test("displays recent activity summary")`
  - [ ] `test("shows recommended lessons appropriately")`
  - [ ] `test("renders quick access buttons")`
  - [ ] `test("displays user progress overview")`
  - [ ] `test("handles navigation to main sections")`
  - [ ] `test("shows personalized content based on user data")`

#### Curriculum Page Tests (`src/pages/CurriculumPage.tsx`)
- [ ] **Curriculum Page Tests**
  - [ ] `test("renders curriculum structure correctly")`
  - [ ] `test("supports filtering curriculum content")`
  - [ ] `test("displays search functionality correctly")`
  - [ ] `test("shows course progress indicators")`
  - [ ] `test("handles course and lesson selection")`
  - [ ] `test("supports course sorting and organization")`
  - [ ] `test("displays recommended next lessons")`
  - [ ] `test("renders difficulty indicators appropriately")`

#### Lesson Page Tests (`src/pages/LessonPage.tsx`)
- [ ] **Lesson Page Tests**
  - [ ] `test("renders lesson content correctly")`
  - [ ] `test("displays interactive exercises appropriately")`
  - [ ] `test("shows lesson progress indicators")`
  - [ ] `test("handles lesson navigation (prev/next)")`
  - [ ] `test("supports saving lesson progress")`
  - [ ] `test("displays completion UI correctly")`
  - [ ] `test("renders lesson resources and attachments")`
  - [ ] `test("shows appropriate feedback on exercises")`
  - [ ] `test("handles different lesson types correctly")`

#### Profile Page Tests (`src/pages/ProfilePage.tsx`)
- [ ] **Profile Page Tests**
  - [ ] `test("renders user profile information correctly")`
  - [ ] `test("displays achievement badges appropriately")`
  - [ ] `test("shows user statistics and history")`
  - [ ] `test("supports profile editing functionality")`
  - [ ] `test("handles profile image management")`
  - [ ] `test("displays learning path progress")`
  - [ ] `test("shows activity history with correct formatting")`
  - [ ] `test("supports account setting management")`

#### Settings Page Tests (`src/pages/SettingsPage.tsx`)
- [ ] **Settings Page Tests**
  - [ ] `test("renders settings categories correctly")`
  - [ ] `test("displays form controls for different settings")`
  - [ ] `test("handles saving setting changes")`
  - [ ] `test("supports application theme toggling")`
  - [ ] `test("shows keyboard layout configuration")`
  - [ ] `test("handles notification preferences correctly")`
  - [ ] `test("displays accessibility settings")`
  - [ ] `test("supports account management functions")`

#### Achievements Page Tests (`src/pages/AchievementsPage.tsx`)
- [ ] **Achievements Page Tests**
  - [ ] `test("renders achievement categories correctly")`
  - [ ] `test("displays locked and unlocked achievements")`
  - [ ] `test("shows achievement progress indicators")`
  - [ ] `test("handles achievement filtering and sorting")`
  - [ ] `test("supports achievement detail view")`
  - [ ] `test("displays achievement unlock dates")`
  - [ ] `test("renders achievement badges with correct styling")`
  - [ ] `test("shows achievement statistics summary")`

#### Review Page Tests (`src/pages/ReviewPage.tsx`)
- [ ] **Review Page Tests**
  - [ ] `test("renders review session interface correctly")`
  - [ ] `test("displays review items with appropriate content")`
  - [ ] `test("handles user responses during review")`
  - [ ] `test("shows progress through review session")`
  - [ ] `test("supports different review question types")`
  - [ ] `test("displays appropriate feedback on answers")`
  - [ ] `test("handles review session completion correctly")`
  - [ ] `test("shows review statistics at completion")`

#### Checkpoint Page Tests (`src/pages/CheckpointPage.tsx`)
- [ ] **Checkpoint Page Tests**
  - [ ] `test("renders checkpoint challenges correctly")`
  - [ ] `test("displays checkpoint instructions appropriately")`
  - [ ] `test("handles user input during checkpoint tests")`
  - [ ] `test("shows progress through checkpoint sections")`
  - [ ] `test("supports different checkpoint question types")`
  - [ ] `test("calculates and displays checkpoint score correctly")`
  - [ ] `test("handles checkpoint completion appropriately")`
  - [ ] `test("provides feedback on checkpoint performance")`

#### Shortcut Challenge Page Tests (`src/pages/ShortcutChallengePage.tsx`)
- [ ] **Shortcut Challenge Page Tests**
  - [ ] `test("renders shortcut challenge interface correctly")`
  - [ ] `test("displays challenge instructions appropriately")`
  - [ ] `test("handles keyboard input during challenges")`
  - [ ] `test("shows progress through challenge milestones")`
  - [ ] `test("supports different shortcut challenge types")`
  - [ ] `test("times and scores challenges correctly")`
  - [ ] `test("handles challenge completion appropriately")`
  - [ ] `test("provides feedback on shortcut performance")`

#### Progress Dashboard Page Tests (`src/pages/ProgressDashboardPage.tsx`)
- [ ] **Progress Dashboard Page Tests**
  - [ ] `test("renders progress metrics correctly")`
  - [ ] `test("displays charts with appropriate data")`
  - [ ] `test("supports filtering by time period")`
  - [ ] `test("shows typing speed and accuracy trends")`
  - [ ] `test("displays skill mastery indicators")`
  - [ ] `test("renders learning activity history")`
  - [ ] `test("supports exporting progress data")`
  - [ ] `test("handles goal tracking and visualization")`

#### Subscription Page Tests (`src/pages/SubscriptionPage.tsx`)
- [ ] **Subscription Page Tests**
  - [ ] `test("renders subscription plans correctly")`
  - [ ] `test("displays pricing information appropriately")`
  - [ ] `test("shows feature comparison between plans")`
  - [ ] `test("handles subscription selection")`
  - [ ] `test("supports payment method management")`
  - [ ] `test("displays current subscription status")`
  - [ ] `test("handles subscription upgrades/downgrades")`
  - [ ] `test("shows billing history correctly")`

#### Store Page Tests (`src/pages/StorePage.tsx`)
- [ ] **Store Page Tests**
  - [ ] `test("renders store items correctly")`
  - [ ] `test("displays pricing and currency information")`
  - [ ] `test("supports item categorization and filtering")`
  - [ ] `test("handles purchase functionality")`
  - [ ] `test("shows purchased items appropriately")`
  - [ ] `test("displays item details on selection")`
  - [ ] `test("supports currency balance display")`
  - [ ] `test("handles insufficient funds scenarios")`

#### Gamification Page Tests (`src/pages/GamificationPage.tsx`)
- [ ] **Gamification Page Tests**
  - [ ] `test("renders gamification features correctly")`
  - [ ] `test("displays level and XP information")`
  - [ ] `test("shows streak data appropriately")`
  - [ ] `test("supports daily goals interface")`
  - [ ] `test("displays currency and rewards information")`
  - [ ] `test("renders achievements overview")`
  - [ ] `test("handles gamification interactions correctly")`
  - [ ] `test("shows leaderboards with proper ranking")`

#### Not Found Page Tests (`src/pages/NotFoundPage.tsx`)
- [ ] **Not Found Page Tests**
  - [ ] `test("renders 404 content correctly")`
  - [ ] `test("displays helpful navigation options")`
  - [ ] `test("handles return to home functionality")`
  - [ ] `test("shows appropriate error messaging")`
  - [ ] `test("supports search functionality from 404 page")`

## Updated Test Completeness Checklist

Track the overall progress of your testing effort with this updated high-level checklist:

- [ ] **Redux Slices (151 tests)**
  - [x] App slice (25/25 tests)
  - [x] Achievements slice (17/17 tests)
  - [x] Gamification slice (23/23 tests)
  - [x] Curriculum slice (20/20 tests)
  - [x] User Progress slice (21/21 tests)
  - [x] Settings slice (19/19 tests)
  - [x] Subscription slice (19/19 tests)
  - [x] Theme slice (7/7 tests)

- [x] **Utility Functions (124 tests)**
  - [x] Animation utilities (14/14 tests)
  - [x] DateTime utilities (14/14 tests)
  - [x] Format utilities (29/29 tests)
  - [x] Keyboard utilities (39/39 tests)
  - [x] Shortcut utilities (7/7 tests)
  - [x] Style utilities (7/7 tests)
  - [x] Component utilities (6/6 tests)
  - [x] Window Manager (8/8 tests)

- [ ] **Services (83 tests)**
  - [x] Base & factory services (20/20 tests)
  - [x] Gamification services (125/125 tests)
    - [x] Gamification Service (31/31 tests)
    - [x] Achievements Service (27/27 tests)
    - [x] Currency Service (33/33 tests)
    - [x] Hearts Service (13/13 tests)
    - [x] Streak Service (10/10 tests)
    - [x] XP Service (11/11 tests)
  - [x] Learning services (49/49 tests)
    - [x] Curriculum Service (23/23 tests)
    - [x] User Progress Service (14/14 tests)
    - [x] Spaced Repetition Service (12/12 tests)
  - [x] Keyboard Service (15/15 tests)
  - [x] Logger Service (5/5 tests)
  - [x] Audio Service (5/5 tests)
  - [x] OS Detection Service (13/13 tests)
  - [ ] Other system services (0/6 tests)

- [ ] **Components (166 tests)**
  - [ ] Core UI components (0/31 tests)
  - [ ] Layout components (0/14 tests)
  - [ ] Feature components (0/45 tests)
  - [ ] Specialized components (0/28 tests)
  - [ ] Feedback components (0/8 tests)
  - [ ] Curriculum components (0/8 tests)
  - [ ] Notifications components (0/8 tests)
  - [ ] Statistics components (0/8 tests)
  - [ ] Exercises components (0/8 tests)
  - [ ] Skeletons components (0/6 tests)
  - [ ] Shared components (0/9 tests)
  - [ ] Profile components (0/7 tests)
  - [ ] Shortcuts components (0/7 tests)
  - [ ] Review components (0/8 tests)
  - [ ] Keyboard components (0/8 tests)
  - [ ] UI components (0/8 tests)
  - [ ] Effects components (0/7 tests)
  - [ ] Settings components (0/8 tests)
  - [ ] Gamification components (0/8 tests)

- [ ] **Hooks (72 tests)**
  - [ ] Redux hooks (0/25 tests)
  - [ ] UI hooks (0/16 tests)
  - [ ] Utility hooks (0/31 tests)

- [ ] **Pages (122 tests)**
  - [ ] Home page (0/7 tests)
  - [ ] Curriculum page (0/8 tests)
  - [ ] Lesson page (0/9 tests)
  - [ ] Profile page (0/8 tests)
  - [ ] Settings page (0/8 tests)
  - [ ] Achievements page (0/8 tests)
  - [ ] Review page (0/8 tests)
  - [ ] Checkpoint page (0/8 tests)
  - [ ] Shortcut challenge page (0/8 tests)
  - [ ] Progress dashboard page (0/8 tests)
  - [ ] Subscription page (0/8 tests)
  - [ ] Store page (0/8 tests)
  - [ ] Gamification page (0/7 tests)
  - [ ] Not found page (0/5 tests)
  - [ ] Other specialized pages (0/14 tests)

- [ ] **Integration Tests (23 tests)**
  - [ ] Redux & React integration (0/5 tests)
  - [ ] Services & React integration (0/4 tests)
  - [ ] Tauri integration (0/5 tests)
  - [ ] Form & validation integration (0/4 tests)
  - [ ] Routing integration (0/5 tests)

**Total Test Coverage: 0/689 tests (0%)**

## Test Templates for Quick Implementation

To accelerate test creation, use these templates as starting points for different types of files. Copy, paste, and adapt them for your specific tests.

### Redux Slice Test Template

```typescript
// src/store/slices/__tests__/exampleSlice.test.ts
import reducer, {
  initialState,
  actionCreator1,
  actionCreator2,
  thunkAction,
  selector1,
  selector2
} from '../exampleSlice';

describe('exampleSlice', () => {
  // State tests
  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle actionCreator1', () => {
      const previousState = { ...initialState };
      const payload = { someValue: 'test' };
      const action = actionCreator1(payload);
      const nextState = reducer(previousState, action);

      expect(nextState.someProperty).toEqual(payload.someValue);
    });

    // Add more reducer tests...
  });

  // Action creator tests
  describe('action creators', () => {
    it('should create an action with actionCreator1', () => {
      const payload = { someValue: 'test' };
      const expectedAction = {
        type: 'example/actionCreator1',
        payload
      };

      expect(actionCreator1(payload)).toEqual(expectedAction);
    });

    // Add more action creator tests...
  });

  // Thunk tests
  describe('thunks', () => {
    it('should handle successful thunkAction', async () => {
      // Mock dependencies
      const mockResult = { data: 'test' };
      const mockApi = jest.fn().mockResolvedValue(mockResult);
      jest.mock('../../services/exampleService', () => ({
        apiMethod: () => mockApi()
      }));

      // Set up mock dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      // Execute thunk
      await thunkAction()(dispatch, getState, undefined);

      // Verify API was called
      expect(mockApi).toHaveBeenCalled();

      // Verify dispatch was called with correct actions
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: 'example/thunkAction/pending'
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: 'example/thunkAction/fulfilled',
        payload: mockResult
      });
    });

    it('should handle failed thunkAction', async () => {
      // Mock dependencies with rejection
      const error = new Error('Test error');
      const mockApi = jest.fn().mockRejectedValue(error);
      jest.mock('../../services/exampleService', () => ({
        apiMethod: () => mockApi()
      }));

      // Set up mock dispatch and getState
      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      // Execute thunk
      await thunkAction()(dispatch, getState, undefined);

      // Verify API was called
      expect(mockApi).toHaveBeenCalled();

      // Verify dispatch was called with correct actions
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: 'example/thunkAction/pending'
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: 'example/thunkAction/rejected',
        error: expect.objectContaining({ message: 'Test error' })
      });
    });
  });

  // Selector tests
  describe('selectors', () => {
    it('should select data with selector1', () => {
      const mockState = {
        example: {
          data: 'test',
          someProperty: 'value'
        }
      };

      expect(selector1(mockState)).toEqual('test');
    });

    it('should select transformed data with selector2', () => {
      const mockState = {
        example: {
          items: [{ id: 1 }, { id: 2 }]
        }
      };

      expect(selector2(mockState, 2)).toEqual({ id: 2 });
    });

    // Add more selector tests...
  });
});
```

### React Component Test Template

```typescript
// src/components/__tests__/ExampleComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { createAppTheme } from '../../theme';
import { configureStore } from '@reduxjs/toolkit';
import ExampleComponent from '../ExampleComponent';
import exampleReducer from '../../store/slices/exampleSlice';

// Create test theme
const theme = createAppTheme('light');

// Create test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      example: exampleReducer
    },
    preloadedState
  });
};

// Test render function with providers
const renderWithProviders = (ui, options = {}) => {
  const {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
};

describe('ExampleComponent', () => {
  // Render tests
  it('renders component correctly', () => {
    // Setup props
    const props = {
      title: 'Test Title',
      description: 'Test Description'
    };

    // Render with props
    renderWithProviders(<ExampleComponent {...props} />);

    // Assert content is displayed
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  // User interaction tests
  it('handles button click correctly', async () => {
    // Setup mock function
    const handleClick = jest.fn();

    // Render with props
    renderWithProviders(<ExampleComponent onClick={handleClick} />);

    // Get button and click it
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    // Assert the click handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // State change tests
  it('updates state on input change', async () => {
    // Render component
    renderWithProviders(<ExampleComponent />);

    // Get input and change its value
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'New Value');

    // Assert the input value was updated
    expect(input).toHaveValue('New Value');

    // Check if the component reacted to the input change
    const updatedElement = screen.getByText(/New Value/i);
    expect(updatedElement).toBeInTheDocument();
  });

  // Redux interaction tests
  it('dispatches action on form submit', async () => {
    // Create store with mock
    const store = createTestStore();
    jest.spyOn(store, 'dispatch');

    // Render with store
    renderWithProviders(<ExampleComponent />, { store });

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify dispatch was called with correct action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'example/submitForm',
        payload: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      })
    );
  });

  // Conditional rendering tests
  it('conditionally renders content based on props', () => {
    // Render with showDetails=false
    const { rerender } = renderWithProviders(
      <ExampleComponent showDetails={false} />
    );

    // Assert details are not shown
    expect(screen.queryByTestId('details')).not.toBeInTheDocument();

    // Re-render with showDetails=true
    rerender(
      <Provider store={createTestStore()}>
        <ThemeProvider theme={theme}>
          <ExampleComponent showDetails={true} />
        </ThemeProvider>
      </Provider>
    );

    // Assert details are now shown
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  // Async operation tests
  it('shows loading state and then content', async () => {
    // Mock API
    jest.mock('../../services/api', () => ({
      fetchData: jest.fn().mockResolvedValue({ result: 'Success' })
    }));

    // Render component
    renderWithProviders(<ExampleComponent />);

    // Assert loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Assert content is displayed
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### Custom Hook Test Template

```typescript
// src/hooks/__tests__/useExampleHook.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useExampleHook from '../useExampleHook';
import exampleReducer from '../../store/slices/exampleSlice';

// Create test wrapper with Redux if needed
const createWrapper = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      example: exampleReducer
    },
    preloadedState: initialState
  });

  return ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useExampleHook', () => {
  // Basic functionality test
  it('returns the correct initial values', () => {
    // Render hook
    const { result } = renderHook(() => useExampleHook());

    // Assert initial values
    expect(result.current.count).toBe(0);
    expect(typeof result.current.increment).toBe('function');
    expect(typeof result.current.decrement).toBe('function');
  });

  // State update test
  it('updates count correctly', () => {
    // Render hook
    const { result } = renderHook(() => useExampleHook());

    // Act - call the increment function
    act(() => {
      result.current.increment();
    });

    // Assert count was incremented
    expect(result.current.count).toBe(1);

    // Act - call the decrement function
    act(() => {
      result.current.decrement();
    });

    // Assert count was decremented back to 0
    expect(result.current.count).toBe(0);
  });

  // Props/arguments test
  it('accepts and uses initial value', () => {
    // Render hook with initial value
    const { result } = renderHook(() => useExampleHook(10));

    // Assert initial value was used
    expect(result.current.count).toBe(10);
  });

  // Redux hook test
  it('connects to Redux state', () => {
    // Create initial state for the store
    const initialState = {
      example: {
        value: 42
      }
    };

    // Render hook with Redux wrapper
    const { result } = renderHook(() => useExampleHook(), {
      wrapper: createWrapper(initialState)
    });

    // Assert the hook picked up the Redux state
    expect(result.current.reduxValue).toBe(42);
  });

  // Memoization test
  it('memoizes callbacks correctly', () => {
    // Render hook
    const { result, rerender } = renderHook(() => useExampleHook());

    // Store references to callbacks
    const firstIncrementRef = result.current.increment;
    const firstDecrementRef = result.current.decrement;

    // Rerender hook
    rerender();

    // Assert callback references remain the same
    expect(result.current.increment).toBe(firstIncrementRef);
    expect(result.current.decrement).toBe(firstDecrementRef);
  });

  // Cleanup test
  it('performs cleanup correctly', () => {
    // Mock functions
    const mockSubscribe = jest.fn();
    const mockUnsubscribe = jest.fn();
    
    // Mock service
    jest.mock('../../services/subscriptionService', () => ({
      subscribe: () => {
        mockSubscribe();
        return mockUnsubscribe;
      }
    }));

    // Render hook
    const { unmount } = renderHook(() => useExampleHook());

    // Assert subscribe was called
    expect(mockSubscribe).toHaveBeenCalledTimes(1);

    // Unmount hook
    unmount();

    // Assert unsubscribe was called
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Test Template

```typescript
// src/utils/__tests__/exampleUtil.test.ts
import {
  formatCurrency,
  calculateTotal,
  filterItems,
  validateEmail
} from '../exampleUtil';

describe('exampleUtil', () => {
  // Test simple formatting function
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1000.5)).toBe('$1,000.50');
      expect(formatCurrency(1000.55)).toBe('$1,000.55');
      expect(formatCurrency(1000.555)).toBe('$1,000.56'); // Rounds up
    });

    it('handles negative values', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('supports custom currency symbol', () => {
      expect(formatCurrency(1000, '€')).toBe('€1,000.00');
    });
  });

  // Test calculation function
  describe('calculateTotal', () => {
    it('calculates totals correctly', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 15, quantity: 1 },
        { price: 20, quantity: 3 }
      ];
      
      expect(calculateTotal(items)).toBe(95); // (10*2) + (15*1) + (20*3)
    });

    it('returns 0 for empty arrays', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('handles items with missing properties', () => {
      const items = [
        { price: 10 }, // Missing quantity
        { quantity: 2 }, // Missing price
        { price: 20, quantity: 3 }
      ];
      
      expect(calculateTotal(items)).toBe(60); // Default quantity is 1, default price is 0
    });
  });

  // Test filter function
  describe('filterItems', () => {
    const items = [
      { id: 1, name: 'Apple', category: 'fruit', price: 1.5 },
      { id: 2, name: 'Banana', category: 'fruit', price: 0.8 },
      { id: 3, name: 'Carrot', category: 'vegetable', price: 1.2 },
      { id: 4, name: 'Donut', category: 'pastry', price: 2.5 }
    ];

    it('filters by category', () => {
      const result = filterItems(items, { category: 'fruit' });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('filters by price range', () => {
      const result = filterItems(items, { minPrice: 1.0, maxPrice: 2.0 });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('filters by search term', () => {
      const result = filterItems(items, { searchTerm: 'a' });
      expect(result).toHaveLength(3); // Apple, Banana, Carrot
    });

    it('combines multiple filters', () => {
      const result = filterItems(items, { 
        category: 'fruit', 
        maxPrice: 1.0 
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2); // Only Banana
    });

    it('returns all items when no filters are applied', () => {
      const result = filterItems(items, {});
      expect(result).toEqual(items);
    });
  });

  // Test validation function
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('test.name@example.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('invalidates incorrect email addresses', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });
});
```

### Service Test Template

```typescript
// src/services/__tests__/exampleService.test.ts
import { ExampleService } from '../exampleService';

// Mock dependencies
jest.mock('../../utils/logger', () => ({
  log: jest.fn(),
  error: jest.fn()
}));

// Mock fetch for API tests
global.fetch = jest.fn();

describe('ExampleService', () => {
  let service;

  // Setup before each test
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create service instance
    service = new ExampleService();
  });

  // Teardown after each test
  afterEach(() => {
    // Clean up service if needed
    if (service && typeof service.cleanup === 'function') {
      service.cleanup();
    }
  });

  // Initialization tests
  describe('initialization', () => {
    it('initializes with default values', () => {
      expect(service.isInitialized).toBe(false);
      expect(service.data).toEqual([]);
    });

    it('successfully initializes', async () => {
      // Mock successful API response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [1, 2, 3] })
      });

      // Call initialize
      await service.initialize();

      // Verify service state
      expect(service.isInitialized).toBe(true);
      expect(service.data).toEqual([1, 2, 3]);
    });

    it('handles initialization failure', async () => {
      // Mock failed API response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      // Call initialize and catch error
      await expect(service.initialize()).rejects.toThrow('Failed to initialize');

      // Verify service state
      expect(service.isInitialized).toBe(false);
    });
  });

  // Data fetching tests
  describe('fetchData', () => {
    beforeEach(async () => {
      // Initialize service successfully for these tests
      service.isInitialized = true;
    });

    it('fetches data successfully', async () => {
      // Mock successful API response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 1, name: 'Item 1' } })
      });

      // Call fetchData
      const result = await service.fetchData(1);

      // Verify result
      expect(result).toEqual({ id: 1, name: 'Item 1' });

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data/1',
        expect.any(Object)
      );
    });

    it('handles fetch error', async () => {
      // Mock failed API response
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      // Call fetchData and catch error
      await expect(service.fetchData(1)).rejects.toThrow('Network error');
    });

    it('handles non-ok response', async () => {
      // Mock non-ok API response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      // Call fetchData and catch error
      await expect(service.fetchData(1)).rejects.toThrow('Not Found');
    });
  });

  // Event handling tests
  describe('events', () => {
    it('registers event listeners', () => {
      // Mock event handler
      const mockHandler = jest.fn();

      // Register event listener
      service.on('dataChanged', mockHandler);

      // Trigger event
      service.emitEvent('dataChanged', { id: 1 });

      // Verify handler was called
      expect(mockHandler).toHaveBeenCalledWith({ id: 1 });
    });

    it('unregisters event listeners', () => {
      // Mock event handler
      const mockHandler = jest.fn();

      // Register event listener
      service.on('dataChanged', mockHandler);

      // Unregister event listener
      service.off('dataChanged', mockHandler);

      // Trigger event
      service.emitEvent('dataChanged', { id: 1 });

      // Verify handler was not called
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  // Caching tests
  describe('caching', () => {
    it('caches data correctly', async () => {
      // Mock successful API response for first call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 1, name: 'Item 1' } })
      });

      // Call fetchData to populate cache
      await service.fetchDataWithCache(1);

      // Clear fetch mock
      global.fetch.mockClear();

      // Call fetchData again with same ID
      const result = await service.fetchDataWithCache(1);

      // Verify result comes from cache
      expect(result).toEqual({ id: 1, name: 'Item 1' });

      // Verify fetch was not called again
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('bypasses cache when forced', async () => {
      // Mock successful API response for first call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 1, name: 'Item 1' } })
      });

      // Call fetchData to populate cache
      await service.fetchDataWithCache(1);

      // Mock different API response for second call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 1, name: 'Updated Item' } })
      });

      // Call fetchData again with force flag
      const result = await service.fetchDataWithCache(1, true);

      // Verify result comes from new API call
      expect(result).toEqual({ id: 1, name: 'Updated Item' });

      // Verify fetch was called again
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
```

### Keyboard & Shortcuts Tests

#### Shortcut Utils (`shortcutUtils.ts`)
- [x] **Function Tests**
  - [x] `test("getOSType returns correct OS")`
  - [x] `test("getShortcutForCurrentOS returns appropriate shortcut")`
  - [x] `test("normalizeKeyName normalizes keys correctly")`
  - [x] `test("parseShortcut parses shortcut strings correctly")`
  - [x] `test("formatShortcutForDisplay formats shortcuts for display")`
  - [x] `test("isShortcutMatch correctly matches shortcuts")`
  - [x] `test("getKeyDisplayName returns display names for keys")`

#### Shortcut Detector (`shortcutDetector.ts`)
- [x] **Utility Function Tests**
  - [x] `test("parseShortcut parses shortcuts correctly")`
  - [x] `test("formatShortcut formats shortcuts correctly")`
  - [x] `test("normalizeKey normalizes key names")`
  - [x] `test("isModifier identifies modifier keys")`
  - [x] `test("getActiveModifiers gets active modifiers from events")`
  - [x] `test("matchesShortcut matches shortcuts correctly")`
  - [x] `test("debounce debounces function calls")`
  - [x] `test("throttle throttles function calls")`
- [x] **ShortcutDetector Class Tests**
  - [x] `test("initialize adds event listeners")`
  - [x] `test("cleanup removes event listeners")`
  - [x] `test("registerShortcut registers shortcuts")`
  - [x] `test("unregisterShortcut unregisters shortcuts")`
  - [x] `test("key mapping functions work correctly")`
  - [x] `test("throttle and debounce settings can be modified")`
  - [x] `test("key state tracking works correctly")`
  - [x] `test("callback utilities work correctly")`

#### Keyboard Utils (`keyboardUtils.ts`)
- [x] **Function Tests**
  - [x] `test("getOSShortcut returns appropriate shortcut for OS")`
  - [x] `test("normalizeKeyName normalizes keys correctly")`
  - [x] `test("parseShortcut parses shortcut strings")`
  - [x] `test("formatShortcutForDisplay formats shortcuts correctly")`
  - [x] `test("checkKeysMatch validates pressed keys")`
  - [x] `test("getModifierKeys returns modifier keys list")`
  - [x] `test("isModifierKey identifies modifier keys")`
  - [x] `test("getActiveModifiers extracts modifiers from events")`
  - [x] `test("normalizeShortcut converts to consistent format")`
  - [x] `test("isShortcutMatch matches keyboard events to shortcuts")`

#### Keyboard Service (`keyboardService.ts`)
- [x] **Service Tests**
  - [x] `test("initialize sets up shortcuts and mappings")`
  - [x] `test("cleanup removes shortcuts and listeners")`
  - [x] `test("registerGlobalShortcut registers shortcuts correctly")`
  - [x] `test("unregisterGlobalShortcut removes shortcuts")`
  - [x] `test("applyPlatformSpecificMappings works for each OS")`
  - [x] `test("setThrottleTime configures throttling")`
  - [x] `test("setDebounceTime configures debouncing")`
  - [x] `test("formatShortcutForOS formats correctly for each OS")`
  - [x] `test("isKeyPressed checks key state")`
  - [x] `test("getPressedKeys returns all pressed keys")`

By using these templates as starting points, you can quickly implement tests for your specific Keyboard Dojo files while following best practices. Customize the templates as needed to match your specific components, Redux slices, hooks, and utilities.
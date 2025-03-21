---
title: Testing Guidelines
---

# Testing Guidelines

> **IMPORTANT**: This project uses **Vitest** as its testing framework. All test files should use Vitest APIs and imports.
> Jest configurations in the project are **only** for Storybook test-runner compatibility.

## Overview

This document outlines the testing approach for the Keyboard Dojo application. We use a combination of unit, integration, and end-to-end tests to ensure code quality and reliability.

## Testing Stack

- **Vitest**: Primary test runner for unit and integration tests (replaced Jest)
- **React Testing Library**: Testing React components
- **@testing-library/jest-dom**: DOM testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/user-event**: Simulating user interactions
- **Playwright**: End-to-end testing

## Directory Structure

```
src/
├── test/            # Global test utilities and setup
├── components/
│   └── __tests__/   # Component tests
├── hooks/
│   └── __tests__/   # Hook tests
├── pages/
│   └── __tests__/   # Page component tests
├── services/
│   └── __tests__/   # Service tests
├── store/
│   └── __tests__/   # Redux store tests
└── utils/
    └── __tests__/   # Utility function tests
```

## Test Types

### Unit Tests

Unit tests focus on testing individual functions, hooks, or small components in isolation:

```typescript
// Example unit test for a utility function
import { describe, it, expect } from 'vitest';
import { formatShortcutForDisplay } from '@utils/shortcutUtils';

describe('formatShortcutForDisplay', () => {
  it('formats shortcuts correctly for macOS', () => {
    const shortcut = { modifiers: ['meta', 'shift'], key: 'p' };
    const result = formatShortcutForDisplay(shortcut, 'darwin');
    expect(result).toBe('⌘⇧P');
  });

  it('formats shortcuts correctly for Windows', () => {
    const shortcut = { modifiers: ['ctrl', 'shift'], key: 'p' };
    const result = formatShortcutForDisplay(shortcut, 'win32');
    expect(result).toBe('Ctrl+Shift+P');
  });
});
```

### Component Tests

Component tests verify that components render correctly and respond appropriately to user interactions:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortcutDisplay } from '@components/keyboard/ShortcutDisplay';

describe('ShortcutDisplay', () => {
  it('renders the shortcut correctly', () => {
    render(<ShortcutDisplay shortcut={{ modifiers: ['meta'], key: 'a' }} />);
    expect(screen.getByText('⌘A')).toBeInTheDocument();
  });

  it('highlights keys when the highlight prop is true', () => {
    render(<ShortcutDisplay shortcut={{ modifiers: ['meta'], key: 'a' }} highlight />);
    const keyElements = screen.getAllByTestId('key');
    keyElements.forEach(element => {
      expect(element).toHaveClass('highlighted');
    });
  });
});
```

### Integration Tests

Integration tests verify that multiple components or services work together correctly:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createTestStore } from '@tests/utils/createTestStore';
import { ShortcutChallenge } from '@components/exercises/ShortcutChallenge';

describe('ShortcutChallenge', () => {
  it('registers correct shortcut input and updates progress', async () => {
    const store = createTestStore({
      // Initial state
    });
    
    render(
      <Provider store={store}>
        <ShortcutChallenge challengeId="1" />
      </Provider>
    );
    
    // Simulate keyboard shortcut
    await userEvent.keyboard('{meta}A');
    
    await waitFor(() => {
      // Verify state changes
      const state = store.getState();
      expect(state.userProgress.completedChallenges).toContain('1');
    });
    
    // Verify UI updates
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });
});
```

### Redux Tests

Tests for Redux slices verify that reducers, actions, and selectors work correctly:

```typescript
import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { achievementsReducer, unlockAchievement } from '@slices/achievementsSlice';

describe('achievements slice', () => {
  it('should handle unlockAchievement', () => {
    const initialState = {
      achievements: [
        { id: 'test1', completed: false, progress: 0, totalRequired: 1 }
      ],
      isLoading: false,
      error: null
    };
    
    const store = configureStore({
      reducer: { achievements: achievementsReducer },
      preloadedState: { achievements: initialState }
    });
    
    store.dispatch(unlockAchievement('test1'));
    
    const state = store.getState().achievements;
    expect(state.achievements[0].completed).toBe(true);
    expect(state.achievements[0].progress).toBe(1);
  });
});
```

## Mocking

### Service Mocks

Services should be mocked in tests that don't need to test the service implementation:

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock implementation
vi.mock('@services/keyboardService', () => ({
  keyboardService: {
    registerShortcut: vi.fn(),
    unregisterShortcut: vi.fn(),
    checkShortcutMatch: vi.fn(),
  },
}));

// In test
import { keyboardService } from '@services/keyboardService';

it('registers shortcuts on mount', () => {
  render(<ShortcutListener shortcut={{ modifiers: ['ctrl'], key: 'a' }} />);
  expect(keyboardService.registerShortcut).toHaveBeenCalledWith(
    expect.objectContaining({ modifiers: ['ctrl'], key: 'a' })
  );
});
```

### API Mocks

Use MSW to mock API requests:

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/lessons', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: 'Lesson 1' },
        { id: '2', title: 'Lesson 2' },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Test Utilities

### Render Helpers

Create utility functions to simplify test setup:

```typescript
// src/test/utils/renderWithProviders.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '@src/theme';
import { createTestStore } from './createTestStore';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    theme = createAppTheme('light'),
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

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

### Time Manipulation

For tests involving animations or timers:

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('animation completes after duration', () => {
  render(<AnimatedComponent duration={1000} />);
  // Assert initial state
  
  vi.advanceTimersByTime(500);
  // Assert intermediate state
  
  vi.advanceTimersByTime(500);
  // Assert final state
});
```

## Coverage Requirements

We maintain the following minimum test coverage requirements:

- **Utilities**: 90% line coverage
- **Hooks**: 85% line coverage
- **Redux Slices**: 90% line coverage
- **UI Components**: 70% line coverage
- **Services**: 80% line coverage

## Running Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test src/path/to/file.test.ts

# Run tests with coverage
yarn test --coverage

# Run tests in watch mode
yarn test --watch
```

## Migrating from Jest to Vitest

We've migrated our test suite from Jest to Vitest. Key differences include:

1. **Import statements**: Replace Jest imports with Vitest
   ```typescript
   // Before
   import { jest } from '@jest/globals';
   // After
   import { vi, describe, it, expect } from 'vitest';
   ```

2. **Mocking**: Use Vitest's mocking utilities
   ```typescript
   // Before
   jest.mock('./module');
   jest.fn().mockImplementation(() => 'mock');
   // After
   vi.mock('./module');
   vi.fn().mockImplementation(() => 'mock');
   ```

3. **Timers**: Use Vitest's timer utilities
   ```typescript
   // Before
   jest.useFakeTimers();
   jest.advanceTimersByTime(1000);
   // After
   vi.useFakeTimers();
   vi.advanceTimersByTime(1000);
   ```

4. **Configuration**: Test configuration is now in `vitest.config.ts`

## Common Testing Patterns

### Testing Asynchronous Code

```typescript
import { describe, it, expect } from 'vitest';

// Using waitFor
it('loads data after fetch', async () => {
  render(<DataComponent />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});

// Using findBy
it('displays user data', async () => {
  render(<UserProfile userId="123" />);
  
  // findBy methods return a promise and have built-in waiting
  const userName = await screen.findByText('John Doe');
  
  expect(userName).toBeInTheDocument();
});
```

### Testing Error States

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

it('shows error message when API fails', async () => {
  // Override the default mock for this specific test
  server.use(
    rest.get('/api/user', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: 'Server error' }));
    })
  );
  
  render(<UserProfile userId="123" />);
  
  const errorMessage = await screen.findByText('Failed to load user data');
  expect(errorMessage).toBeInTheDocument();
});
```

### Testing Redux-Connected Components

```typescript
import { describe, it, expect } from 'vitest';

it('component updates when state changes', () => {
  const { store } = renderWithProviders(<ConnectedComponent />);
  
  // Initial assertion
  expect(screen.getByText('Initial')).toBeInTheDocument();
  
  // Dispatch action to update state
  act(() => {
    store.dispatch(updateSomething('Updated'));
  });
  
  // Assert component updated
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

## Testing Complex UI Interactions

For testing complex interactions like drag-and-drop, keyboard shortcuts, or multi-step forms:

```typescript
import { describe, it, expect } from 'vitest';

it('completes multi-step form', async () => {
  const user = userEvent.setup();
  render(<MultiStepForm />);
  
  // Step 1
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByText('Next'));
  
  // Step 2
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByText('Next'));
  
  // Step 3
  await user.click(screen.getByLabelText('Accept terms'));
  await user.click(screen.getByText('Submit'));
  
  // Verify completion
  expect(screen.getByText('Form submitted successfully')).toBeInTheDocument();
});
``` 
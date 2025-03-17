import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { RootState } from '../store/store';
import lessonsReducer from '../features/lessons/lessonsSlice';
import authReducer from '../features/auth/authSlice';
import progressReducer from '../features/progress/progressSlice';

interface ExtendedRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        lessons: lessonsReducer,
        auth: authReducer,
        progress: progressReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
        progress: {
          data: {
            completedLessons: {},
            completedShortcuts: {},
          },
          isLoading: false,
          error: null,
        },
        ...preloadedState,
      },
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
} 
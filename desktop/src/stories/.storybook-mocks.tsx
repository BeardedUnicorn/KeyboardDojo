/**
 * Common mocks for Storybook stories
 *
 * This file contains React components and utilities to mock
 * various dependencies like React Router, Redux, etc.
 */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme';

// Create theme for stories
const theme = createAppTheme('light');

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: (state = { data: null, loading: false, error: null }, action) => state,
      gamification: (state = { balance: 1250, level: 5, xp: 500 }, action) => state,
      settings: (state = { darkMode: false }, action) => state,
      ...initialState,
    },
  });
};

const mockStore = createMockStore();

// Mock hooks
export const mockHooks = {
  useGamificationRedux: () => ({ balance: 1250, level: 5, xp: 500 }),
};

// Mock currencyService
export const createMockCurrencyService = (mockData: any) => ({
  getCurrencyData: () => mockData,
  useItem: () => true,
  isBoostActive: (boostId: string) => mockData.activeBoosts && mockData.activeBoosts[boostId],
  getBoostRemainingTime: () => 30 * 60 * 1000,
  getBalance: () => mockData.balance || 0,
  hasItem: () => true,
  getItemQuantity: () => 1,
  subscribe: () => {},
  unsubscribe: () => {},
});

// StoryWrapper with both Router and Redux
export const StoryWrapper: React.FC<{
  children: React.ReactNode;
  store?: any;
  initialRoute?: string;
}> = ({ children, store = mockStore, initialRoute = '/' }) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </MemoryRouter>
  </Provider>
);

// RouterWrapper for components that only need routing
export const RouterWrapper: React.FC<{
  children: React.ReactNode;
  initialRoute?: string;
}> = ({ children, initialRoute = '/' }) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </MemoryRouter>
);

// ReduxWrapper for components that only need Redux
export const ReduxWrapper: React.FC<{
  children: React.ReactNode;
  store?: any;
}> = ({ children, store = mockStore }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </Provider>
);

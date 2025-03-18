import { ThemeProvider } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';

import LessonPage from '@pages/LessonPage.tsx';

import achievementsReducer from '../../store/slices/achievementsSlice';
import settingsReducer from '../../store/slices/settingsSlice';
import userProgressReducer from '../../store/slices/userProgressSlice';
import { darkTheme } from '../../theme';

import type { ReactNode } from 'react';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    userProgress: userProgressReducer,
    achievements: achievementsReducer,
    settings: settingsReducer,
  },
});

const renderWithProviders = (component: ReactNode) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider theme={darkTheme}>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={component} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
};

describe('LessonPage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    (useParams as jest.Mock).mockReturnValue({ lessonId: '1' });
  });

  it('should load and display lesson content', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByText(/Lesson 1:/)).toBeInTheDocument();
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Verify navigation controls
    expect(screen.getByTestId('prev-lesson')).toBeInTheDocument();
    expect(screen.getByTestId('next-lesson')).toBeInTheDocument();
  });

  it('should handle keyboard shortcuts', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Test left arrow navigation
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(useParams().lessonId).toBe('0');
    });

    // Test right arrow navigation
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(useParams().lessonId).toBe('1');
    });

    // Test escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(window.location.pathname).toBe('/curriculum');
    });
  });

  it('should track exercise progress', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Complete exercise
    const exerciseInput = screen.getByTestId('shortcut-input');
    fireEvent.keyDown(exerciseInput, { key: 'Control' });
    fireEvent.keyDown(exerciseInput, { key: 'c' });

    await waitFor(() => {
      expect(screen.getByText(/Success!/i)).toBeInTheDocument();
    });

    // Verify progress is updated
    const progressBar = screen.getByTestId('lesson-progress');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('should handle heart requirements', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Try lesson with insufficient hearts
    const startButton = screen.getByText('Start Lesson');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Not enough hearts/i)).toBeInTheDocument();
    });

    // Add hearts and try again
    mockStore.dispatch({ type: 'userProgress/addHearts', payload: 5 });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.queryByText(/Not enough hearts/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('shortcut-exercise')).toBeInTheDocument();
    });
  });

  it('should sync progress with other tabs', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Simulate progress update from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'userProgress',
      newValue: JSON.stringify({
        completedLessons: ['1'],
        hearts: 10,
      }),
    });
    window.dispatchEvent(storageEvent);

    // Verify UI is updated
    await waitFor(() => {
      expect(screen.getByTestId('hearts-counter')).toHaveTextContent('10');
      expect(screen.getByTestId('lesson-status')).toHaveTextContent('Completed');
    });
  });

  it('should handle network errors gracefully', async () => {
    // Mock API error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

    renderWithProviders(<LessonPage />);

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading lesson/i)).toBeInTheDocument();
    });

    // Test retry functionality
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Restore fetch
    window.fetch = originalFetch;
  });

  it('should save and restore lesson progress', async () => {
    renderWithProviders(<LessonPage />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
    });

    // Complete part of the lesson
    const exerciseInput = screen.getByTestId('shortcut-input');
    fireEvent.keyDown(exerciseInput, { key: 'Control' });
    fireEvent.keyDown(exerciseInput, { key: 'c' });

    // Navigate away
    fireEvent.keyDown(window, { key: 'Escape' });

    // Return to lesson
    (useParams as jest.Mock).mockReturnValue({ lessonId: '1' });
    renderWithProviders(<LessonPage />);

    // Verify progress is restored
    await waitFor(() => {
      const progressBar = screen.getByTestId('lesson-progress');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });
  });
});

import { ThemeProvider } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import achievementsReducer from '../../store/slices/achievementsSlice';
import settingsReducer from '../../store/slices/settingsSlice';
import userProgressReducer from '../../store/slices/userProgressSlice';
import { darkTheme } from '../../theme';
import CurriculumPage from '../CurriculumPage';

import type { ReactNode } from 'react';

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

describe('CurriculumPage Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should load and display curriculum tracks', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for tracks to load
    await waitFor(() => {
      expect(screen.getByText('Beginner Track')).toBeInTheDocument();
      expect(screen.getByText('Advanced Track')).toBeInTheDocument();
    });

    // Verify track descriptions are present
    expect(screen.getByText(/Learn the basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Master advanced techniques/i)).toBeInTheDocument();
  });

  it('should switch between tracks and maintain state', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beginner Track')).toBeInTheDocument();
    });

    // Switch to Advanced track
    fireEvent.click(screen.getByText('Advanced Track'));

    // Verify advanced track content is displayed
    await waitFor(() => {
      expect(screen.getByText(/Master advanced techniques/i)).toBeInTheDocument();
    });

    // Switch back to Beginner track
    fireEvent.click(screen.getByText('Beginner Track'));

    // Verify beginner track content is displayed
    await waitFor(() => {
      expect(screen.getByText(/Learn the basics/i)).toBeInTheDocument();
    });
  });

  it('should update progress when completing lessons', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beginner Track')).toBeInTheDocument();
    });

    // Find and click first lesson
    const firstLesson = screen.getByTestId('lesson-node-1');
    fireEvent.click(firstLesson);

    // Complete lesson
    await waitFor(() => {
      const completeButton = screen.getByText('Complete');
      fireEvent.click(completeButton);
    });

    // Verify progress is updated
    await waitFor(() => {
      const progressIndicator = screen.getByTestId('track-progress');
      expect(progressIndicator).toHaveTextContent('1/10');
    });
  });

  it('should handle path dependencies correctly', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beginner Track')).toBeInTheDocument();
    });

    // Try to access locked lesson
    const lockedLesson = screen.getByTestId('lesson-node-3');
    fireEvent.click(lockedLesson);

    // Verify lock message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Complete previous lessons/i)).toBeInTheDocument();
    });

    // Complete prerequisite lesson
    const prerequisiteLesson = screen.getByTestId('lesson-node-2');
    fireEvent.click(prerequisiteLesson);

    await waitFor(() => {
      const completeButton = screen.getByText('Complete');
      fireEvent.click(completeButton);
    });

    // Verify locked lesson is now accessible
    fireEvent.click(lockedLesson);
    await waitFor(() => {
      expect(screen.queryByText(/Complete previous lessons/i)).not.toBeInTheDocument();
    });
  });

  it('should sync progress across tabs', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Beginner Track')).toBeInTheDocument();
    });

    // Complete a lesson
    const lesson = screen.getByTestId('lesson-node-1');
    fireEvent.click(lesson);

    await waitFor(() => {
      const completeButton = screen.getByText('Complete');
      fireEvent.click(completeButton);
    });

    // Simulate storage event from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'userProgress',
      newValue: JSON.stringify({ completedLessons: ['1', '2'] }),
    });
    window.dispatchEvent(storageEvent);

    // Verify progress is updated
    await waitFor(() => {
      const progressIndicator = screen.getByTestId('track-progress');
      expect(progressIndicator).toHaveTextContent('2/10');
    });
  });

  it('should handle error states gracefully', async () => {
    // Mock API error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

    renderWithProviders(<CurriculumPage />);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Error loading curriculum/i)).toBeInTheDocument();
    });

    // Verify retry button works
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Restore fetch
    window.fetch = originalFetch;
  });
});

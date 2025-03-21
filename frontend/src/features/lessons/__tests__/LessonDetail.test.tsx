import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import LessonDetail from '../LessonDetail';
import { mockLesson, mockPremiumLesson } from '../../../mocks/mockLessons';

describe('LessonDetail Component', () => {
  const mockLessonsState = {
    lessons: [mockLesson, mockPremiumLesson],
    currentLesson: mockLesson,
    filteredLessons: [mockLesson, mockPremiumLesson],
    categories: ['Basics', 'Advanced'],
    error: null,
    isLoading: false,
  };

  const mockProgressState = {
    data: {
      completedLessons: {},
      completedShortcuts: {},
    },
    isLoading: false,
    error: null,
  };

  it('should start practice mode when clicking practice button', async () => {
    renderWithProviders(<LessonDetail />, {
      preloadedState: {
        lessons: mockLessonsState,
        progress: mockProgressState,
      },
    });

    const practiceButton = screen.getByTestId('start-practice-button');
    fireEvent.click(practiceButton);

    // Check if progress indicator is visible
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
  });

  it('should show completion message when lesson is completed', async () => {
    renderWithProviders(<LessonDetail />, {
      preloadedState: {
        lessons: mockLessonsState,
        progress: mockProgressState,
      },
    });

    const practiceButton = screen.getByTestId('start-practice-button');
    fireEvent.click(practiceButton);

    // Simulate correct keyboard input
    fireEvent.keyDown(document, { key: 'Meta', code: 'MetaLeft' });
    fireEvent.keyDown(document, { key: 'c', code: 'KeyC' });
    fireEvent.keyUp(document, { key: 'c', code: 'KeyC' });
    fireEvent.keyUp(document, { key: 'Meta', code: 'MetaLeft' });

    // Wait for feedback and completion message
    await waitFor(() => {
      expect(screen.getByTestId('completion-message')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show error message for incorrect input', async () => {
    renderWithProviders(<LessonDetail />, {
      preloadedState: {
        lessons: mockLessonsState,
        progress: mockProgressState,
      },
    });

    const practiceButton = screen.getByTestId('start-practice-button');
    fireEvent.click(practiceButton);

    // Simulate incorrect keyboard input
    fireEvent.keyDown(document, { key: 'x', code: 'KeyX' });
    fireEvent.keyUp(document, { key: 'x', code: 'KeyX' });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

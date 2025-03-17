import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import Lessons from '../Lessons';
import { mockLesson, mockPremiumLesson } from '../../../mocks/mockLessons';

describe('Lessons Component', () => {
  const mockProgressState = {
    data: {
      completedLessons: {},
      completedShortcuts: {},
    },
    isLoading: false,
    error: null,
  };

  it('should show loading state', () => {
    renderWithProviders(<Lessons />, {
      preloadedState: {
        lessons: {
          lessons: [],
          filteredLessons: [],
          categories: [],
          error: null,
          isLoading: true,
        },
        progress: mockProgressState,
      },
    });

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should show error state', () => {
    renderWithProviders(<Lessons />, {
      preloadedState: {
        lessons: {
          lessons: [],
          filteredLessons: [],
          categories: [],
          error: 'Failed to load lessons',
          isLoading: false,
        },
        progress: mockProgressState,
      },
    });

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load lessons');
  });

  it('should display lesson categories and lessons', () => {
    renderWithProviders(<Lessons />, {
      preloadedState: {
        lessons: {
          lessons: [mockLesson, mockPremiumLesson],
          filteredLessons: [mockLesson, mockPremiumLesson],
          categories: ['Basics', 'Advanced'],
          error: null,
          isLoading: false,
        },
        progress: mockProgressState,
      },
    });

    // Check if categories are displayed
    expect(screen.getByRole('tab', { name: /basics/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /advanced/i })).toBeInTheDocument();

    // Check if lessons are displayed
    expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
    expect(screen.getByText(mockPremiumLesson.title)).toBeInTheDocument();
  });
}); 
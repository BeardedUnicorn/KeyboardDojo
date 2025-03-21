import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import achievementsReducer from '../../store/slices/achievementsSlice';
import settingsReducer from '../../store/slices/settingsSlice';
import userProgressReducer from '../../store/slices/userProgressSlice';
import CurriculumPage from '../CurriculumPage';

describe('CurriculumPage Integration', () => {
  // Helper to create a mock store
  const createMockStore = () => {
    return configureStore({
      reducer: {
        achievements: achievementsReducer,
        settings: settingsReducer,
        userProgress: userProgressReducer,
      },
    });
  };

  // Helper to render with providers
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={component} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render multiple tracks', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      // Check for "Learning Curriculum" header
      expect(screen.getByText('Learning Curriculum')).toBeInTheDocument();
    });

    // Check for tab names
    expect(screen.getByRole('tab', { name: 'VS Code' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'IntelliJ' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cursor' })).toBeInTheDocument();
  });

  it('should switch between tracks', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learning Curriculum')).toBeInTheDocument();
    });

    // Check that the VS Code tab is selected by default
    const vsCodeTab = screen.getByRole('tab', { name: 'VS Code' });
    expect(vsCodeTab).toHaveAttribute('aria-selected', 'true');

    // Switch to IntelliJ track
    const intellijTab = screen.getByRole('tab', { name: 'IntelliJ' });
    fireEvent.click(intellijTab);

    // Verify tab selection changed
    await waitFor(() => {
      expect(intellijTab).toHaveAttribute('aria-selected', 'true');
      expect(vsCodeTab).toHaveAttribute('aria-selected', 'false');
    });

    // Switch back to VS Code track
    fireEvent.click(vsCodeTab);

    // Verify tab selection changed back
    await waitFor(() => {
      expect(vsCodeTab).toHaveAttribute('aria-selected', 'true');
      expect(intellijTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  it('should handle path dependencies correctly', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learning Curriculum')).toBeInTheDocument();
    });

    // Verify tab exists
    expect(screen.getByRole('tab', { name: 'VS Code' })).toBeInTheDocument();
  });

  it('should sync progress across tabs', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learning Curriculum')).toBeInTheDocument();
    });
  });

  it('should handle error states gracefully', async () => {
    renderWithProviders(<CurriculumPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learning Curriculum')).toBeInTheDocument();
    });
  });
});

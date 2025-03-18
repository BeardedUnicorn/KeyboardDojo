import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CurriculumPage from '@pages/CurriculumPage';
import SubscriptionPage from '@pages/SubscriptionPage';

import { FeedbackProvider } from '../../components/feedback/FeedbackProvider';
import { useSubscription , SubscriptionProvider } from '../../contexts/SubscriptionContext';
import { store } from '../../store';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../contexts/SubscriptionContext', () => {
  const actual = vi.importActual('../../contexts/SubscriptionContext');
  return {
    ...actual,
    useSubscription: vi.fn(),
  };
});

// Mock curriculum service
vi.mock('../../services/curriculumService', () => ({
  curriculumService: {
    getAllTracks: vi.fn().mockReturnValue([
      {
        id: 'vscode',
        name: 'VS Code',
        description: 'Learn VS Code shortcuts',
        isPremium: true,
      },
      {
        id: 'cursor',
        name: 'Cursor',
        description: 'Learn Cursor shortcuts',
        isPremium: false,
      },
    ]),
  },
}));

// Mock payment service
vi.mock('../../services/paymentService', () => ({
  paymentService: {
    processPayment: vi.fn().mockResolvedValue({ success: true }),
    cancelSubscription: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('Subscription Flow Integration Tests', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigate
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('shows premium content as locked for free users', async () => {
    // Mock free subscription
    (useSubscription as any).mockReturnValue({
      hasPremium: false,
      isPremiumLoading: false,
      updateSubscription: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/curriculum']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/curriculum" element={<CurriculumPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check if premium track is shown as locked
    const premiumTrack = screen.getByText('VS Code');
    const premiumTrackCard = premiumTrack.closest('.MuiCard-root');

    expect(premiumTrackCard).toHaveTextContent(/Premium/i);
    expect(premiumTrackCard).toHaveTextContent(/Locked/i);

    // Check if free track is not locked
    const freeTrack = screen.getByText('Cursor');
    const freeTrackCard = freeTrack.closest('.MuiCard-root');

    expect(freeTrackCard).not.toHaveTextContent(/Premium/i);
    expect(freeTrackCard).not.toHaveTextContent(/Locked/i);
  });

  it('unlocks premium content after subscription purchase', async () => {
    const user = userEvent.setup();
    let subscriptionCallback: ((hasPremium: boolean) => void) = vi.fn();

    // Mock subscription hook with ability to update premium status
    (useSubscription as any).mockImplementation(() => {
      const [hasPremium, setHasPremium] = useState(false);

      const updateSubscription = (newValue: boolean) => {
        setHasPremium(newValue);
      };

      // StorePage callback for later use
      subscriptionCallback = updateSubscription;

      return {
        hasPremium,
        isPremiumLoading: false,
        updateSubscription,
      };
    });

    // Render subscription page first
    const { rerender } = render(
      <MemoryRouter initialEntries={['/subscription']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/curriculum" element={<CurriculumPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for subscription page to load
    await waitFor(() => {
      expect(screen.getByText(/Subscription Plans/i)).toBeInTheDocument();
    });

    // Click subscribe button for premium plan
    const subscribeButton = screen.getByRole('button', { name: /Subscribe/i });
    await user.click(subscribeButton);

    // Confirm subscription in dialog
    const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    // Simulate successful subscription
    if (subscriptionCallback) {
      subscriptionCallback(true);
    }

    // Navigate to curriculum page
    mockNavigate.mockImplementation((path) => {
      rerender(
        <MemoryRouter initialEntries={[path]}>
          <Provider store={store}>
            <FeedbackProvider>
              <SubscriptionProvider>
                <Routes>
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/curriculum" element={<CurriculumPage />} />
                </Routes>
              </SubscriptionProvider>
            </FeedbackProvider>
          </Provider>
        </MemoryRouter>,
      );
    });

    // Check if navigate was called with curriculum path
    expect(mockNavigate).toHaveBeenCalledWith('/curriculum');

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check if premium track is now unlocked
    const premiumTrack = screen.getByText('VS Code');
    const premiumTrackCard = premiumTrack.closest('.MuiCard-root');

    expect(premiumTrackCard).toHaveTextContent(/Premium/i);
    expect(premiumTrackCard).not.toHaveTextContent(/Locked/i);
  });

  it('shows current subscription status on subscription page', async () => {
    // Mock premium subscription
    (useSubscription as any).mockReturnValue({
      hasPremium: true,
      isPremiumLoading: false,
      updateSubscription: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/subscription']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for subscription page to load
    await waitFor(() => {
      expect(screen.getByText(/Subscription Plans/i)).toBeInTheDocument();
    });

    // Check if current plan is shown as premium
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();

    // Check if cancel button is available instead of subscribe
    expect(screen.getByRole('button', { name: /Cancel Subscription/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Subscribe/i })).not.toBeInTheDocument();
  });

  it('reverts to free plan after cancellation', async () => {
    const user = userEvent.setup();
    let subscriptionCallback: ((hasPremium: boolean) => void) = vi.fn();

    // Mock subscription hook with ability to update premium status
    (useSubscription as any).mockImplementation(() => {
      const [hasPremium, setHasPremium] = useState(true);

      const updateSubscription = (newValue: boolean) => {
        setHasPremium(newValue);
      };

      // StorePage callback for later use
      subscriptionCallback = updateSubscription;

      return {
        hasPremium,
        isPremiumLoading: false,
        updateSubscription,
      };
    });

    render(
      <MemoryRouter initialEntries={['/subscription']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for subscription page to load
    await waitFor(() => {
      expect(screen.getByText(/Subscription Plans/i)).toBeInTheDocument();
    });

    // Click cancel subscription button
    const cancelButton = screen.getByRole('button', { name: /Cancel Subscription/i });
    await user.click(cancelButton);

    // Confirm cancellation in dialog
    const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    // Simulate successful cancellation
    if (subscriptionCallback) {
      subscriptionCallback(false);
    }

    // Wait for UI to update
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Cancel Subscription/i })).not.toBeInTheDocument();
    });

    // Check if current plan is now free
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Free/i)).toBeInTheDocument();

    // Check if subscribe button is available
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
  });

  it('allows cancellation of subscription', async () => {
    const user = userEvent.setup();
    let subscriptionCallback: ((hasPremium: boolean) => void) = vi.fn();

    // Mock subscription hook with premium already active
    (useSubscription as any).mockImplementation(() => {
      const [hasPremium, setHasPremium] = useState(true);

      const updateSubscription = (newValue: boolean) => {
        setHasPremium(newValue);
      };

      // StorePage callback for later use
      subscriptionCallback = updateSubscription;

      return {
        hasPremium,
        isPremiumLoading: false,
        updateSubscription,
      };
    });

    render(
      <MemoryRouter initialEntries={['/subscription']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for subscription page to load
    await waitFor(() => {
      expect(screen.getByText(/Subscription Plans/i)).toBeInTheDocument();
    });

    // Click cancel subscription button
    const cancelButton = screen.getByRole('button', { name: /Cancel Subscription/i });
    await user.click(cancelButton);

    // Confirm cancellation in dialog
    const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    // Simulate successful cancellation
    if (subscriptionCallback) {
      subscriptionCallback(false);
    }

    // Wait for UI to update
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Cancel Subscription/i })).not.toBeInTheDocument();
    });

    // Check if current plan is now free
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Free/i)).toBeInTheDocument();

    // Check if subscribe button is available
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
  });
});

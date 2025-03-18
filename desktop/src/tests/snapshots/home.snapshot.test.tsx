import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import HomePage from '@pages/HomePage';

import { FeedbackProvider } from '../../components/feedback/FeedbackProvider';
import { SubscriptionProvider } from '../../contexts/SubscriptionContext';
import { store } from '../../store';

import type { ReactNode } from 'react';

// Mock Redux store
vi.mock('react-redux', () => ({
  ...vi.importActual('react-redux'),
  useSelector: vi.fn((selector) => {
    // Mock user progress state
    if (selector.name === 'selectUserProgress') {
      return {
        xp: 100,
        level: 2,
        streakDays: 5,
        hearts: { current: 5, max: 5 },
        completedLessons: [{ id: 'lesson-1', completedAt: new Date().toISOString() }],
      };
    }
    // Mock achievements state
    if (selector.name === 'selectAchievements') {
      return {
        achievements: [
          { id: 'achievement-1', title: 'First Lesson', unlockedAt: new Date().toISOString() },
        ],
        completedAchievements: [],
      };
    }
    // Mock theme state
    if (selector.name === 'selectTheme') {
      return 'light';
    }
    return undefined;
  }),
  useDispatch: () => vi.fn(),
}));

vi.mock('../../contexts/SubscriptionContext', () => ({
  SubscriptionProvider: ({ children }: { children: ReactNode }) => <div data-testid="subscription-provider">{children}</div>,
  useSubscription: () => ({
    hasPremium: false,
    isPremiumLoading: false,
  }),
}));

// Mock components
vi.mock('../../components/DailyGoal', () => ({
  default: () => <div data-testid="daily-goal">Daily Goal Component</div>,
}));

vi.mock('../../components/StreakDisplay', () => ({
  default: () => <div data-testid="streak-display">Streak Display Component</div>,
}));

vi.mock('../../components/LevelProgress', () => ({
  default: () => <div data-testid="level-progress">Level Progress Component</div>,
}));

vi.mock('../../components/RecentActivity', () => ({
  default: () => <div data-testid="recent-activity">Recent Activity Component</div>,
}));

vi.mock('../../components/QuickActions', () => ({
  default: () => <div data-testid="quick-actions">Quick Actions Component</div>,
}));

describe('HomePage Snapshot', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <HomePage />
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});

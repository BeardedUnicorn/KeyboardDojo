import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { curriculumService } from '@/services';
import { store } from '@/store';
import { FeedbackProvider } from '@components/feedback/FeedbackProvider';
import { SubscriptionProvider } from '@contexts/SubscriptionContext.tsx';
import LessonPage from '@pages/LessonPage.tsx';
import { selectAchievements , selectUserProgress, selectIsLessonCompleted } from '@store/slices';

import type { ReactNode } from 'react';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useParams: vi.fn().mockReturnValue({ trackId: 'vscode', nodeId: 'node-1' }),
    useNavigate: vi.fn(),
  };
});

vi.mock('../../services/curriculumService', () => ({
  curriculumService: {
    getLesson: vi.fn(),
    getModule: vi.fn(),
    isLessonCompleted: vi.fn(),
    markLessonCompleted: vi.fn(),
    getUserProgress: vi.fn(),
    saveUserProgress: vi.fn(),
    getApplicationTrack: vi.fn(),
  },
}));

vi.mock('../../contexts/UserProgressContext', () => ({
  useUserProgress: vi.fn(),
  UserProgressProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('../../contexts/AchievementsContext', () => ({
  useAchievements: vi.fn(),
  AchievementsProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// Mock components
vi.mock('../../components', () => ({
  ShortcutExercise: ({ onComplete }: any) => (
    <div data-testid="shortcut-exercise">
      <button onClick={onComplete} data-testid="complete-exercise">Complete Exercise</button>
    </div>
  ),
  HeartRequirement: ({ onContinue }: any) => (
    <div data-testid="heart-requirement">
      <button onClick={onContinue} data-testid="continue-with-hearts">Continue with Hearts</button>
    </div>
  ),
}));

// Mock path data
vi.mock('../../data/paths/vscode-path', () => ({
  vscodePath: {
    id: 'vscode',
    name: 'VS Code',
    nodes: [
      {
        id: 'node-1',
        title: 'VS Code Basics',
        description: 'Learn the basics of VS Code',
        difficulty: 'beginner',
        category: 'navigation',
      },
    ],
  },
}));

vi.mock('../../data/paths/cursor-path', () => ({
  cursorPath: {
    id: 'cursor',
    name: 'Cursor',
    nodes: [],
  },
}));

// Mock Redux store
vi.mock('react-redux', () => ({
  ...vi.importActual('react-redux'),
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe('User Progress Flow Integration Tests', () => {
  const mockMarkLessonCompleted = vi.fn();
  const mockAwardAchievement = vi.fn();
  const mockUpdateUserProgress = vi.fn();

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock Redux selectors
    const mockDispatch = vi.fn();
    (useDispatch as any).mockReturnValue(mockDispatch);

    (useSelector as any).mockImplementation((selector: any) => {
      if (selector === selectUserProgress) {
        return {
          xp: 100,
          level: 1,
          streakDays: 3,
          completedLessons: [],
        };
      }
      if (selector === selectIsLessonCompleted) {
        return false;
      }
      if (selector === selectAchievements) {
        return {
          achievements: [],
          completedAchievements: [],
        };
      }
      return undefined;
    });

    // Mock curriculum service
    (curriculumService.getLesson as any).mockResolvedValue({
      id: 'node-1',
      title: 'VS Code Basics',
      description: 'Learn the basics of VS Code',
      difficulty: 'beginner',
      category: 'navigation',
      content: '<p>This is the lesson content</p>',
    });

    (curriculumService.getModule as any).mockResolvedValue({
      id: 'module-1',
      title: 'VS Code Fundamentals',
      lessons: [
        { id: 'node-1', title: 'VS Code Basics' },
        { id: 'node-2', title: 'VS Code Advanced' },
      ],
    });
  });

  it('awards achievement when lesson is completed', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/track/vscode/node-1']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/track/:trackId/:nodeId" element={<LessonPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for lesson to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Complete the exercise
    const completeButton = screen.getByTestId('complete-exercise');
    await user.click(completeButton);

    // Check if markLessonCompleted was called
    expect(mockMarkLessonCompleted).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'node-1' }),
    );

    // Check if achievement was awarded
    expect(mockAwardAchievement).toHaveBeenCalled();

    // Check if user progress was updated
    expect(mockUpdateUserProgress).toHaveBeenCalled();
  });

  it('updates user progress stats when lesson is completed', async () => {
    const user = userEvent.setup();

    // Mock implementation to capture progress updates
    let capturedProgress: any = null;
    mockUpdateUserProgress.mockImplementation((progress) => {
      capturedProgress = progress;
    });

    render(
      <MemoryRouter initialEntries={['/track/vscode/node-1']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/track/:trackId/:nodeId" element={<LessonPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for lesson to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Complete the exercise
    const completeButton = screen.getByTestId('complete-exercise');
    await user.click(completeButton);

    // Check if user progress was updated with XP
    expect(mockUpdateUserProgress).toHaveBeenCalled();
    expect(capturedProgress).not.toBeNull();

    // Verify that XP was increased
    if (capturedProgress) {
      expect(capturedProgress.xp).toBeGreaterThan(100);
    }
  });

  it('shows completion state when returning to a completed lesson', async () => {
    // Mock lesson already completed
    (useSelector as any).mockImplementation((selector: any) => {
      if (selector === selectUserProgress) {
        return {
          hearts: { current: 5, max: 5 },
          completedLessons: [{ id: 'node-1', completedAt: new Date().toISOString() }],
          xp: 150,
          level: 1,
        };
      }
      if (selector === selectIsLessonCompleted) {
        return true;
      }
      if (selector === selectAchievements) {
        return {
          achievements: [],
          completedAchievements: [],
        };
      }
      return undefined;
    });

    render(
      <MemoryRouter initialEntries={['/track/vscode/node-1']}>
        <Provider store={store}>
          <FeedbackProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/track/:trackId/:nodeId" element={<LessonPage />} />
              </Routes>
            </SubscriptionProvider>
          </FeedbackProvider>
        </Provider>
      </MemoryRouter>,
    );

    // Wait for lesson to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check if completed indicator is shown
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();

    // markLessonCompleted should not be called again
    expect(mockMarkLessonCompleted).not.toHaveBeenCalled();
  });
});

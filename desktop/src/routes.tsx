import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components directly instead of using lazy loading
import SentryReduxTest from '@components/SentryReduxTest';
import SentryTest from '@components/SentryTest';
import SentryTransactionExample from '@components/SentryTransactionExample';
import Achievements from '@pages/AchievementsPage.tsx';
import Checkpoint from '@pages/CheckpointPage.tsx';
import Curriculum from '@pages/CurriculumPage.tsx';
import GamificationPage from '@pages/GamificationPage.tsx';
import Home from '@pages/HomePage.tsx';
import Lesson from '@pages/LessonPage.tsx';
import NotFound from '@pages/NotFoundPage.tsx';
import Profile from '@pages/ProfilePage.tsx';
import ProgressDashboard from '@pages/ProgressDashboardPage.tsx';
import Settings from '@pages/SettingsPage.tsx';
import ShortcutChallenge from '@pages/ShortcutChallengePage.tsx';
import Store from '@pages/StorePage.tsx';
import Subscription from '@pages/SubscriptionPage.tsx';

import Review from './pages/ReviewPage';

// Loading component
const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    }}
  >
    <CircularProgress />
  </Box>
);

/**
 * Desktop app routes
 * This component defines the routes for the desktop app
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shortcuts" element={<ShortcutChallenge />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/lesson/:trackId/:nodeId" element={<Lesson />} />
        <Route path="/checkpoint/:trackId/:nodeId" element={<Checkpoint />} />
        <Route path="/challenge/:trackId/:nodeId" element={<ShortcutChallenge />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/store" element={<Store />} />
        <Route path="/review" element={<Review />} />
        <Route path="/progress-dashboard" element={<ProgressDashboard />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/gamification" element={<GamificationPage />} />
        <Route path="/sentry-test" element={<SentryTest />} />
        <Route path="/sentry-redux-test" element={<SentryReduxTest />} />
        <Route path="/sentry-transaction-test" element={<SentryTransactionExample />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

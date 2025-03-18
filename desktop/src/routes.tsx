import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import GamificationPage from '@pages/GamificationPage.tsx';

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

// Lazy-loaded components with explicit chunk names
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@pages/HomePage.tsx'));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ '@pages/SettingsPage.tsx'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ '@pages/ProfilePage.tsx'));
const ShortcutChallenge = lazy(() => import(/* webpackChunkName: "shortcuts" */ '@pages/ShortcutChallengePage.tsx'));
const Curriculum = lazy(() => import(/* webpackChunkName: "curriculum" */ '@pages/CurriculumPage.tsx'));
const Lesson = lazy(() => import(/* webpackChunkName: "lesson" */ '@pages/LessonPage.tsx'));
const Checkpoint = lazy(() => import(/* webpackChunkName: "checkpoint" */ '@pages/CheckpointPage.tsx'));
const Subscription = lazy(() => import(/* webpackChunkName: "subscription" */ '@pages/SubscriptionPage.tsx'));
const Store = lazy(() => import(/* webpackChunkName: "store" */ '@pages/StorePage.tsx'));
const Review = lazy(() => import(/* webpackChunkName: "review" */ './pages/ReviewPage'));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ '@pages/NotFoundPage.tsx'));
const SentryTest = lazy(() => import('@components/SentryTest'));
const SentryReduxTest = lazy(() => import('@components/SentryReduxTest'));
const SentryTransactionExample = lazy(() => import('@components/SentryTransactionExample'));
const Achievements = lazy(() => import(/* webpackChunkName: "achievements" */ '@pages/AchievementsPage.tsx'));
const ProgressDashboard = lazy(() => import(/* webpackChunkName: "progress" */ '@pages/ProgressDashboardPage.tsx'));

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

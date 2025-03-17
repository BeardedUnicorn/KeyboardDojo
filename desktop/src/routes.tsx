import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Lazy-loaded components
const Home = lazy(() => import('./pages/home'));
const Practice = lazy(() => import('./pages/practice'));
const Settings = lazy(() => import('./pages/settings'));
const Profile = lazy(() => import('./pages/profile'));
const ShortcutChallenge = lazy(() => import('./pages/shortcut-challenge'));
const Curriculum = lazy(() => import('./pages/curriculum'));
const Lesson = lazy(() => import('./pages/lesson'));
const Achievements = lazy(() => import('./pages/achievements'));
const Subscription = lazy(() => import('./pages/subscription'));
const NotFound = lazy(() => import('./pages/not-found'));

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
        <Route path="/practice" element={<Practice />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shortcuts" element={<ShortcutChallenge />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/lesson/:trackId/:moduleId/:lessonId" element={<Lesson />} />
        <Route path="/challenge/:trackId/:challengeId" element={<ShortcutChallenge />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/subscription" element={<Subscription />} />
        
        {/* Redirect /index.html to / */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 
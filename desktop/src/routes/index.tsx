import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import LoadingScreen from '../components/LoadingScreen';

// Lazy load page components
const Home = lazy(() => import('../pages/home'));
const Practice = lazy(() => import('../pages/practice'));
const ShortcutChallenge = lazy(() => import('../pages/shortcut-challenge'));
const Settings = lazy(() => import('../pages/settings'));
const Subscription = lazy(() => import('../pages/subscription'));
const ProgressDashboard = lazy(() => import('../pages/progress-dashboard'));
const Profile = lazy(() => import('../pages/profile'));
const NotFound = lazy(() => import('../pages/not-found'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 64px)'
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/shortcut-challenge" element={<ShortcutChallenge />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/progress-dashboard" element={<ProgressDashboard />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 
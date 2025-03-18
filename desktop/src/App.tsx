import { Box, CssBaseline, CircularProgress, Typography, Button } from '@mui/material';
import { ErrorBoundary } from '@sentry/react';
import React, { lazy, Suspense } from 'react';
import { HashRouter } from 'react-router-dom';

import { PathSkeleton } from '@components/skeletons/ContentSkeletons';
import { ThemeProviderRedux } from '@components/ThemeProviderRedux';

import { FeedbackProvider } from './components/feedback/FeedbackProvider';

import type { FallbackRender } from '@sentry/react';
import type { FC } from 'react';

// Lazy load main components
const AppRoutes = lazy(() => import('./routes'));
const MainLayout = lazy(() => import('@components/layout/MainLayout'));

// Loading states
const AppLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

const ContentLoader = () => (
  <Box
    sx={{
      p: 3,
      height: '100%',
      width: '100%',
      bgcolor: 'background.default',
    }}
  >
    <PathSkeleton />
  </Box>
);

// Error fallback component
const ErrorFallback: FallbackRender = ({ error, resetError }) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const isContextError = error instanceof Error && error.message.includes('UserProgressProvider');

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <h1>Something went wrong</h1>
      <pre>{errorMessage}</pre>
      {isContextError && (
        <Typography color="error">
          Context error: Please refresh the page. If the error persists, clear your browser cache.
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={resetError} sx={{ mt: 2 }}>
        Try again
      </Button>
    </Box>
  );
};

const App: FC = () => {
  return (
    <ThemeProviderRedux>
      <CssBaseline />
      <ErrorBoundary fallback={ErrorFallback}>
        <FeedbackProvider>
          <HashRouter>
            <Suspense fallback={<AppLoader />}>
              <MainLayout>
                <Suspense fallback={<ContentLoader />}>
                  <AppRoutes />
                </Suspense>
              </MainLayout>
            </Suspense>
          </HashRouter>
        </FeedbackProvider>
      </ErrorBoundary>
    </ThemeProviderRedux>
  );
};

export default App;

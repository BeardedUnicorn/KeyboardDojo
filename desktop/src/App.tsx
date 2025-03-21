import { Box, CssBaseline, CircularProgress, Typography, Button } from '@mui/material';
import React, { lazy, Suspense } from 'react';
import { 
  HashRouter, 
  createHashRouter, 
  RouterProvider,
  createRoutesFromChildren,
} from 'react-router-dom';

import AppInitializer from '@components/AppInitializer';
import { PathSkeleton } from '@components/skeletons/ContentSkeletons';
import { ThemeProviderRedux } from '@components/ThemeProviderRedux';
import { ErrorBoundary, ErrorBoundaryProvider } from '@components/ui/ErrorBoundary';

import { FeedbackProvider } from './components/feedback/FeedbackProvider';

import type { FC } from 'react';

// Configure React Router future flags
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

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
const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const isContextError = error instanceof Error && error.message.includes('UserProgressProvider');
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" color="error.main" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" paragraph>
        {errorMessage}
      </Typography>
      <Button variant="contained" onClick={resetError}>
        Try Again
      </Button>
    </Box>
  );
};

const App: FC = () => {
  return (
    <ErrorBoundaryProvider 
      defaultFallback={ErrorFallback}
      showErrorUI
      reportToSentry={process.env.NODE_ENV === 'production'}
      globalErrorHandler={(error, errorInfo, componentName) => {
        console.error(`Error in ${componentName || 'App'}:`, error);
      }}
    >
      <ThemeProviderRedux>
        <CssBaseline />
        <FeedbackProvider>
          <AppInitializer>
            <Suspense fallback={<AppLoader />}>
              <HashRouter future={routerFutureConfig}>
                <ErrorBoundary componentName="MainLayout">
                  <MainLayout>
                    <Suspense fallback={<ContentLoader />}>
                      <ErrorBoundary componentName="AppRoutes">
                        <AppRoutes />
                      </ErrorBoundary>
                    </Suspense>
                  </MainLayout>
                </ErrorBoundary>
              </HashRouter>
            </Suspense>
          </AppInitializer>
        </FeedbackProvider>
      </ThemeProviderRedux>
    </ErrorBoundaryProvider>
  );
};

export default App;

import { Box, CircularProgress, Typography, Button } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';

import { useAppRedux } from '@hooks/useAppRedux';

import type { FC, ReactNode } from 'react';

interface AppInitializerProps {
  children: ReactNode;
  // Maximum time to wait for initialization before showing UI anyway (ms)
  initTimeout?: number;
}

/**
 * App Initializer Component
 * 
 * This component ensures that the app is properly initialized before
 * rendering its children. It shows a loading spinner while initialization
 * is in progress.
 */
const AppInitializer: FC<AppInitializerProps> = ({ 
  children,
  initTimeout = 5000, // Default 5 second timeout
}) => {
  const { isInitialized, isLoading, initialize, errors, reportError } = useAppRedux();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Initialize app on component mount
  useEffect(() => {
    let timeoutId: number;
    
    if (!isInitialized) {
      // Start timeout to prevent infinite loading
      timeoutId = window.setTimeout(() => {
        console.warn('App initialization timed out, continuing anyway');
        setHasTimedOut(true);
      }, initTimeout);
      
      // Call initialize but handle any errors directly
      try {
        initialize();
      } catch (err) {
        console.error('Failed to initialize app:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setInitError(errorMessage);
        // Report error to Redux store
        reportError({ 
          message: errorMessage, 
          code: 'INIT_ERROR',
          context: { 
            stack: err instanceof Error ? err.stack : 'Unknown error',
            component: 'AppInitializer',
          },
        });
      }
    } else {
      setIsFirstLoad(false);
    }
    
    // Clear timeout on cleanup
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isInitialized, initialize, initTimeout, reportError]);

  // Once initialization is complete, mark first load as done
  useEffect(() => {
    if (isInitialized && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [isInitialized, isFirstLoad]);

  // Check for initialization errors
  useEffect(() => {
    if (errors.length > 0) {
      // Use the most recent error message
      const latestError = errors[errors.length - 1];
      setInitError(latestError.message);
    }
  }, [errors]);

  // Retry initialization
  const handleRetry = useCallback(() => {
    setInitError(null);
    setHasTimedOut(false);
    setIsFirstLoad(true);
    try {
      initialize();
    } catch (err) {
      console.error('Failed to initialize app on retry:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setInitError(errorMessage);
      // Report error to Redux store
      reportError({ 
        message: errorMessage, 
        code: 'INIT_RETRY_ERROR',
        context: { 
          stack: err instanceof Error ? err.stack : 'Unknown error',
          component: 'AppInitializer',
          action: 'retry',
        },
      });
    }
  }, [initialize, reportError]);

  // Continue anyway
  const handleContinue = useCallback(() => {
    setIsFirstLoad(false);
  }, []);

  // Show loading indicator during initialization
  if ((isLoading || (!isInitialized && isFirstLoad)) && !hasTimedOut) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 4 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Initializing application...
        </Typography>
        
        {initError && (
          <Box sx={{ mt: 2, textAlign: 'center', maxWidth: '80%' }}>
            <Typography color="error" sx={{ mb: 2 }}>
              {initError}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleRetry}>
                Retry
              </Button>
              <Button variant="outlined" onClick={handleContinue}>
                Continue Anyway
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  // Render children once initialized or timed out
  return <>{children}</>;
};

export default AppInitializer;


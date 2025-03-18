import { Button, Stack, Typography, Box, Paper } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@store/index';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { FC } from 'react';

// Create a test slice for demonstration purposes
const testSlice = createSlice({
  name: 'test',
  initialState: {
    counter: 0,
    lastError: null as string | null,
  },
  reducers: {
    increment: (state) => {
      state.counter += 1;
    },
    decrement: (state) => {
      state.counter -= 1;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.lastError = action.payload;
    },
    throwError: () => {
      // This will be caught by the middleware
      throw new Error('Test error from Redux action');
    },
  },
});

// Export actions
export const { increment, decrement, setError, throwError } = testSlice.actions;

// Export reducer
export const testReducer = testSlice.reducer;

/**
 * Component to test Sentry Redux integration
 */
const SentryReduxTest: FC = () => {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.test?.counter || 0);
  const lastError = useAppSelector((state) => state.test?.lastError || null);

  const handleIncrement = () => {
    dispatch(increment());
    Sentry.addBreadcrumb({
      category: 'ui.action',
      message: 'User clicked increment button',
      level: 'info',
    });
  };

  const handleDecrement = () => {
    dispatch(decrement());
    Sentry.addBreadcrumb({
      category: 'ui.action',
      message: 'User clicked decrement button',
      level: 'info',
    });
  };

  const handleCaptureMessage = () => {
    Sentry.captureMessage('Test message from SentryReduxTest component');
    dispatch(setError('Test message sent to Sentry'));
  };

  const handleCaptureException = () => {
    try {
      throw new Error('Test exception from SentryReduxTest component');
    } catch (error) {
      Sentry.captureException(error);
      dispatch(setError('Test exception sent to Sentry'));
    }
  };

  const handleThrowReduxError = () => {
    try {
      dispatch(throwError());
    } catch (error) {
      dispatch(setError('Redux error thrown and captured by Sentry'));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sentry Redux Integration Test
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          This component demonstrates the integration between Sentry and Redux.
          Each action is tracked as a breadcrumb, and errors are automatically captured.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Counter: {counter}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleIncrement}>
            Increment
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDecrement}>
            Decrement
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sentry Actions
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" color="info" onClick={handleCaptureMessage}>
            Capture Message
          </Button>
          <Button variant="outlined" color="warning" onClick={handleCaptureException}>
            Capture Exception
          </Button>
          <Button variant="outlined" color="error" onClick={handleThrowReduxError}>
            Throw Redux Error
          </Button>
        </Stack>
      </Box>

      {lastError && (
        <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography variant="body2">
            Last Action: {lastError}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          Note: Check the Sentry dashboard to see captured events and breadcrumbs.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SentryReduxTest;

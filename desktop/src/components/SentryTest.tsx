import { Button, Box, Typography, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loggerService } from '../services/loggerService';
import { captureException, captureMessage } from '../utils/sentry';

import type { FC } from 'react';

const SentryTest: FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTestError = () => {
    try {
      // Deliberately throw an error
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      if (error instanceof Error) {
        captureException(error);
        setTestResult('Error captured and sent to Sentry');
      }
    }
  };

  const handleTestMessage = () => {
    captureMessage('This is a test message for Sentry', 'info');
    setTestResult('Message captured and sent to Sentry');
  };

  const handleTestBoundary = () => {
    // This will trigger the error boundary
    throw new Error('This is a test error boundary for Sentry');
  };

  const handleTestNullObject = () => {
    try {
      // Deliberately cause a null reference error
      const obj: any = null;
      const title = obj.title;
      loggerService.debug('Attempting to access property:', { title });
      setTestResult('This should not be displayed');
    } catch (error) {
      if (error instanceof Error) {
        captureException(error);
        setTestResult('Null reference error captured and sent to Sentry');
      }
    }
  };

  const handleTestCurriculumPage = () => {
    // Navigate to a specific lesson page to test our fix
    navigate('/lesson/vscode/vscode-node-1');
    setTestResult('Navigated to specific lesson page to test fix');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Sentry Integration Test
      </Typography>

      <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleTestError}>
          Test Capture Exception
        </Button>

        <Button variant="contained" color="secondary" onClick={handleTestMessage}>
          Test Capture Message
        </Button>

        <Button variant="contained" color="error" onClick={handleTestBoundary}>
          Test Error Boundary
        </Button>

        <Button variant="contained" color="warning" onClick={handleTestNullObject}>
          Test Null Object Error
        </Button>

        <Button variant="contained" color="info" onClick={handleTestCurriculumPage}>
          Test Curriculum Page Fix
        </Button>
      </Stack>

      {testResult && (
        <Typography sx={{ mt: 2 }} color="success.main">
          {testResult}
        </Typography>
      )}
    </Box>
  );
};

export default SentryTest;

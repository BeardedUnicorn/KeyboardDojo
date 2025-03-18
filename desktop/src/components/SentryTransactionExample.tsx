import { Button, Stack, Typography, Box, Paper, TextField, CircularProgress, Alert } from '@mui/material';
import React, { useState } from 'react';

import useSentryTransaction from '@hooks/useSentryTransaction';

import type { ChangeEvent, FC } from 'react';

/**
 * Example component that demonstrates how to use the Sentry transaction tracking hook
 */
const SentryTransactionExample: FC = () => {
  const { startTransaction, trackUserFlow } = useSentryTransaction();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate a successful API call
  const simulateSuccessfulSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Start a transaction for the form submission
      const transaction = startTransaction({
        name: 'form_submission',
        op: 'user-interaction',
        description: 'User submits a form',
        tags: {
          'form.type': 'example',
          'user.email': '[REDACTED]', // Never include actual PII in tags
        },
      });

      // Add form data to the transaction (sanitized)
      transaction.setData('form.fields', {
        username: formData.username ? 'provided' : 'empty',
        email: 'provided', // Never include actual email in transaction data
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set success status and data
      transaction.setStatus('ok');
      transaction.setData('response.status', 200);

      // Finish the transaction
      transaction.finish();

      // Update UI
      setResult('Form submitted successfully!');
    } catch (err) {
      setError('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate a failed API call
  const simulateFailedSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use the trackUserFlow helper to automatically handle the transaction
      await trackUserFlow(
        {
          name: 'form_submission_error',
          op: 'user-interaction',
          description: 'User submits a form that fails',
        },
        async (transaction) => {
          // Add form data to the transaction (sanitized)
          transaction.setData('form.fields', {
            username: formData.username ? 'provided' : 'empty',
            email: 'provided', // Never include actual email in transaction data
          });

          // Simulate API call that fails
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Simulate an error
          throw new Error('API call failed with status 500');
        },
      );
    } catch (err) {
      // The trackUserFlow method will automatically handle the error status
      // and finish the transaction, so we just need to update the UI
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Simulate a multi-step flow
  const simulateMultiStepFlow = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      await trackUserFlow(
        {
          name: 'multi_step_flow',
          op: 'user-flow',
          description: 'User completes a multi-step process',
        },
        async (transaction) => {
          // Step 1: Validation
          transaction.setData('step', 'validation');
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Step 2: Processing
          transaction.setData('step', 'processing');
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Step 3: Completion
          transaction.setData('step', 'completion');
          await new Promise((resolve) => setTimeout(resolve, 1000));

          return 'Multi-step flow completed successfully!';
        },
      );

      setResult('Multi-step flow completed successfully!');
    } catch (err) {
      setError('An error occurred during the multi-step flow.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sentry Transaction Tracking
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          This component demonstrates how to use the useSentryTransaction hook to track user flows
          and important interactions in your application.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Example Form
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={simulateSuccessfulSubmit}
            disabled={loading}
          >
            Submit Successfully
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={simulateFailedSubmit}
            disabled={loading}
          >
            Submit with Error
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Multi-Step Flow Example
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          onClick={simulateMultiStepFlow}
          disabled={loading}
          fullWidth
        >
          Start Multi-Step Flow
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="caption" color="text.secondary">
          Note: Check the Sentry dashboard to see captured transactions and breadcrumbs.
          All sensitive information is automatically redacted before being sent to Sentry.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SentryTransactionExample;

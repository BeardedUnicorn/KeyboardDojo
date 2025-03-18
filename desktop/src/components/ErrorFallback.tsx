import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import type { FC } from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" gutterBottom>
        We've been notified about this issue and are working to fix it.
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
          {error.message}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={resetErrorBoundary || (() => window.location.reload())}
        sx={{ mt: 2 }}
      >
        Reload Application
      </Button>
    </Box>
  );
};

export default ErrorFallback;

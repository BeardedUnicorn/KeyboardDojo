import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

import type { FC } from 'react';

/**
 * Loading screen component displayed during route transitions
 */
const LoadingScreen: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;

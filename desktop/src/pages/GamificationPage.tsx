import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import GamificationDashboard from '../components/GamificationDashboard';

import type { FC } from 'react';

const GamificationPage: FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gamification Center
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your progress, earn rewards, and manage your inventory in the Gamification Center.
        </Typography>

        <GamificationDashboard />
      </Box>
    </Container>
  );
};

export default GamificationPage;

import { Box, Typography, Link, Divider } from '@mui/material';
import React from 'react';

import type { FC } from 'react';
// Create a simple isDesktop function
const isDesktop = () => true; // Since this is the desktop app, always return true

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = '1.0.0'; // This could be fetched from a config file or environment variable

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      }}
    >
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {currentYear} Keyboard Dojo. All rights reserved.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="#" color="inherit" underline="hover">
            <Typography variant="body2">Privacy</Typography>
          </Link>
          <Link href="#" color="inherit" underline="hover">
            <Typography variant="body2">Terms</Typography>
          </Link>
          <Link href="#" color="inherit" underline="hover">
            <Typography variant="body2">Help</Typography>
          </Link>
        </Box>

        {isDesktop() && (
          <Typography variant="body2" color="text.secondary">
            Version {appVersion}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Footer;

/* eslint-disable no-undef */
import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import { Box, Typography, Fade, IconButton, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { currencyService } from '../../../services';

import type { CurrencyChangeEvent } from '../../../services';

/**
 * Component to display notifications when the user earns or spends currency
 */
export const CurrencyNotification: FC = () => {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<CurrencyChangeEvent | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subscribe to currency changes
    const handleCurrencyChange = (changeEvent: CurrencyChangeEvent) => {
      // Only show notification for significant changes (more than 1 gem)
      if (Math.abs(changeEvent.change) > 1) {
        setEvent(changeEvent);
        setOpen(true);

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Auto-close after 3 seconds
        const id = setTimeout(() => {
          setOpen(false);
        }, 3000);

        setTimeoutId(id);
      }
    };

    currencyService.subscribe(handleCurrencyChange);

    // Cleanup on unmount
    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleClose = () => {
    setOpen(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  if (!event) {
    return null;
  }

  const isPositive = event.change > 0;

  return (
    <Fade in={open}>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1500,
          width: { xs: 'calc(100% - 48px)', sm: 320 },
          borderRadius: 2,
          overflow: 'hidden',
          borderLeft: 6,
          borderColor: isPositive ? 'success.main' : 'error.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.background.default,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: 40,
              height: 40,
              backgroundColor: isPositive ? 'success.main' : 'error.main',
              color: 'white',
              mr: 2,
            }}
          >
            <DiamondIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {isPositive ? 'Gems Earned!' : 'Gems Spent'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isPositive
                ? `+${event.change} gems from ${event.source}`
                : `${event.change} gems for ${event.source}`}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              New balance: {event.newBalance} gems
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

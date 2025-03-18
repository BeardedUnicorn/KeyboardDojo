import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Fade,
  Backdrop,
  useTheme,
  Button,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { xpService } from '../../../services';

import { FeedbackAnimation } from './index';

import type { FC } from 'react';

interface LevelUpNotificationProps {
  level: number;
  title?: string;
  onClose: () => void;
  autoHideDuration?: number;
}

const LevelUpNotification: FC<LevelUpNotificationProps> = ({
  level,
  title,
  onClose,
  autoHideDuration = 5000,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);
  const levelTitle = title || xpService.getLevelTitle(level);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose]);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      open={open}
      onClick={() => {
        setOpen(false);
        setTimeout(onClose, 500);
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: `0 0 40px ${theme.palette.primary.main}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {/* Celebration animation */}
          {showAnimation && (
            <FeedbackAnimation
              type="fireworks"
              isVisible
              intensity="high"
              duration={3000}
              onComplete={() => setShowAnimation(false)}
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              top: -20,
              left: -20,
              width: 100,
              height: 100,
              backgroundColor: theme.palette.primary.main,
              transform: 'rotate(45deg)',
              opacity: 0.1,
            }}
          />

          <TrophyIcon
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom>
            Level Up!
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            Level {level} Achieved
          </Typography>

          <Typography variant="body1" paragraph>
            Congratulations! You've reached a new level.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            {levelTitle}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Keep practicing to unlock more shortcuts and features!
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setTimeout(onClose, 500);
              }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Backdrop>
  );
};

export default LevelUpNotification;

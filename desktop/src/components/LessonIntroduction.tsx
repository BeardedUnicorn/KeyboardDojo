import KeyboardIcon from '@mui/icons-material/Keyboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Grow,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import type { FC } from 'react';

interface LessonIntroductionProps {
  title: string;
  description: string;
  animation?: string; // Path to animation asset
  shortcuts: Array<{
    name: string;
    description: string;
    shortcutWindows: string;
    shortcutMac: string;
  }>;
  onContinue: () => void;
}

const LessonIntroduction: FC<LessonIntroductionProps> = ({
  title,
  description,
  animation,
  shortcuts,
  onContinue,
}) => {
  const theme = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentShortcutIndex, setCurrentShortcutIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Determine OS for shortcut display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  useEffect(() => {
    // Show shortcuts after a delay
    const timer = setTimeout(() => {
      setShowShortcuts(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showShortcuts && shortcuts.length > 0) {
      // Cycle through shortcuts
      const interval = setInterval(() => {
        setCurrentShortcutIndex((prevIndex) =>
          prevIndex < shortcuts.length - 1 ? prevIndex + 1 : prevIndex,
        );
      }, 3000);

      // Mark animation as complete after showing all shortcuts
      const completeTimer = setTimeout(() => {
        setAnimationComplete(true);
      }, shortcuts.length * 3000 + 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(completeTimer);
      };
    }
  }, [showShortcuts, shortcuts.length]);

  const formatShortcut = (shortcut: string) => {
    return shortcut.split('+').map((key) => (
      <span
        key={key}
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          padding: '2px 6px',
          borderRadius: '4px',
          margin: '0 2px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
          fontFamily: 'monospace',
        }}
      >
        {key.trim()}
      </span>
    ));
  };

  const renderShortcutAnimation = () => {
    if (!showShortcuts || shortcuts.length === 0) return null;

    const currentShortcut = shortcuts[currentShortcutIndex];
    const shortcutDisplay = isMac ? currentShortcut.shortcutMac : currentShortcut.shortcutWindows;

    return (
      <Fade in={showShortcuts} timeout={500}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {currentShortcut.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentShortcut.description}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {formatShortcut(shortcutDisplay)}
                  </Typography>
                </motion.div>
              </Box>
            </CardContent>
            {animation && (
              <CardMedia
                component="img"
                height="200"
                image={animation}
                alt={`${currentShortcut.name} animation`}
                sx={{ objectFit: 'contain', p: 2 }}
              />
            )}
          </Card>
        </Box>
      </Fade>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grow in timeout={800}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : theme.palette.primary.light + '20',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <KeyboardIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {description}
          </Typography>

          {renderShortcutAnimation()}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onContinue}
              startIcon={<PlayArrowIcon />}
              disabled={!animationComplete && shortcuts.length > 0}
              sx={{
                minWidth: 200,
                borderRadius: 8,
                py: 1.5,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {animationComplete || shortcuts.length === 0 ? 'Start Lesson' : 'Please Wait...'}
            </Button>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default LessonIntroduction;

import {
  Keyboard as KeyboardIcon,
  Code as CodeIcon,
  Lightbulb as LightbulbIcon,
  Help as HelpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Card,
  Chip,
  useTheme,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import React, { useState, useEffect, useCallback, useMemo, memo, Fragment } from 'react';

import { useShortcutDetection } from '../hooks';
import { formatShortcutForDisplay, getKeyDisplayName } from '../utils/shortcutUtils';

import { FeedbackAnimation } from './index';

import type { ShortcutDefinition } from '../utils/shortcutUtils';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { FC } from 'react';

interface CodeContext {
  beforeCode: string;
  afterCode: string;
  highlightLines?: number[];
}

interface FeedbackMessage {
  message: string;
  mascotReaction?: string;
  hint?: string;
}

interface EnhancedShortcutExerciseProps {
  title: string;
  description: string;
  context: string;
  shortcut: IShortcut;
  difficulty: DifficultyLevel;
  codeContext?: CodeContext;
  feedbackSuccess: FeedbackMessage;
  feedbackFailure: FeedbackMessage;
  onSuccess: () => void;
  onFailure: () => void;
}

const EnhancedShortcutExercise: FC<EnhancedShortcutExerciseProps> = memo(({
  title,
  description,
  context,
  shortcut,
  difficulty,
  codeContext,
  feedbackSuccess,
  feedbackFailure,
  onSuccess,
  onFailure,
}) => {
  const theme = useTheme();
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Convert the Shortcut type to ShortcutDefinition for our hook
  const shortcutDefinition: ShortcutDefinition = useMemo(() => ({
    windows: shortcut.shortcutWindows,
    mac: shortcut.shortcutMac || shortcut.shortcutWindows,
    linux: shortcut.shortcutLinux,
  }), [shortcut.shortcutWindows, shortcut.shortcutMac, shortcut.shortcutLinux]);

  // Handle successful shortcut execution
  const handleSuccess = useCallback(() => {
    // Show success feedback
    setFeedback({
      message: feedbackSuccess.message,
      isSuccess: true,
    });

    // Show success animation
    setShowAnimation(true);

    // Show mascot reaction if available
    if (feedbackSuccess.mascotReaction) {
      setMascotMessage(feedbackSuccess.mascotReaction);
      setShowMascot(true);
    }

    // Call onSuccess callback after a delay
    const timer = setTimeout(() => {
      onSuccess();
      setFeedback(null);
      setShowAnimation(false);
      setShowMascot(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [feedbackSuccess.message, feedbackSuccess.mascotReaction, onSuccess]);

  // Handle failed attempt
  const handleFailure = useCallback(() => {
    // Show failure feedback
    setFeedback({
      message: feedbackFailure.message,
      isSuccess: false,
    });

    // Show mascot reaction if available
    if (feedbackFailure.mascotReaction) {
      setMascotMessage(feedbackFailure.mascotReaction);
      setShowMascot(true);
    }

    // Call onFailure callback
    onFailure();

    // Clear feedback after a delay
    const timer = setTimeout(() => {
      setFeedback(null);
      setShowMascot(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [feedbackFailure.message, feedbackFailure.mascotReaction, onFailure]);

  // Use our custom hook for shortcut detection
  const {
    pressedKeys,
    lastAttempt: _lastAttempt,
    isSuccess: _isSuccess,
    expectedKeys,
    shortcutString,
  } = useShortcutDetection(shortcutDefinition, useMemo(() => ({
    playSounds: true,
    autoClearOnMatch: true,
    autoClearOnFailure: false,
    onSuccess: handleSuccess,
    onFailure: () => {
      setAttempts((prev) => prev + 1);
      handleFailure();
    },
  }), [handleSuccess, handleFailure]));

  // Show hint after 3 failed attempts
  useEffect(() => {
    if (attempts >= 3 && !showHint && feedbackFailure.hint) {
      setShowHint(true);
    }
  }, [attempts, showHint, feedbackFailure.hint]);

  // Toggle hint visibility
  const handleToggleHint = useCallback(() => {
    setShowHint((prev) => !prev);
  }, []);

  // Get difficulty color
  const difficultyColor = useMemo(() => {
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.info.main;
      case 'advanced':
        return theme.palette.warning.main;
      case 'expert':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  }, [difficulty, theme.palette]);

  // Memoize difficulty label
  const difficultyLabel = useMemo(() =>
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    [difficulty],
  );

  // Memoize dark mode background color
  const paperBgColor = useMemo(() =>
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    [theme.palette.mode],
  );

  // Memoize feedback styles
  const feedbackStyles = useMemo(() => ({
    success: {
      bgcolor: theme.palette.success.light,
      color: theme.palette.success.contrastText,
      borderColor: theme.palette.success.main,
    },
    error: {
      bgcolor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
      borderColor: theme.palette.error.main,
    },
  }), [theme.palette]);

  // Memoize card styles
  const cardStyles = useMemo(() => ({
    root: {
      p: 3,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      mb: 4,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    },
    context: {
      p: 2,
      mb: 3,
      backgroundColor: paperBgColor,
      borderRadius: 1,
    },
    exercise: {
      p: 3,
      mb: 3,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
    },
    keyContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 1,
      mb: 3,
    },
    hint: {
      p: 2,
      mt: 2,
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.02)',
      borderRadius: 1,
    },
  }), [theme.palette, paperBgColor]);

  // Memoize key chip styles
  const keyChipStyles = useMemo(() => ({
    expected: {
      fontWeight: 'bold',
      fontSize: '1rem',
      height: 36,
      borderRadius: 1,
    },
    pressed: {
      fontWeight: 'bold',
      fontSize: '0.9rem',
      height: 32,
      borderRadius: 1,
    },
  }), []);

  // Memoize feedback message component
  const FeedbackMessage = useMemo(() => {
    if (!feedback) return null;

    const styles = feedback.isSuccess ? feedbackStyles.success : feedbackStyles.error;
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          ...styles,
        }}
      >
        <Typography variant="body1" fontWeight="medium">
          {feedback.message}
        </Typography>
      </Paper>
    );
  }, [feedback, feedbackStyles]);

  // Memoize mascot message component
  const MascotMessage = useMemo(() => {
    if (!showMascot || !mascotMessage) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" fontStyle="italic">
          {mascotMessage}
        </Typography>
      </Box>
    );
  }, [showMascot, mascotMessage, theme.palette]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Success animation */}
      {showAnimation && (
        <FeedbackAnimation
          type="confetti"
          isVisible
          duration={2000}
          intensity="medium"
        />
      )}

      {/* Exercise Card */}
      <Card
        elevation={3}
        sx={cardStyles.root}
      >
        {/* Header with title and difficulty */}
        <Box sx={cardStyles.header}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Chip
            label={difficultyLabel}
            size="small"
            sx={{
              backgroundColor: difficultyColor,
              color: '#fff',
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* Description */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {/* Context */}
        <Paper variant="outlined" sx={cardStyles.context}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
            <Typography variant="subtitle2" fontWeight="bold">
              Context
            </Typography>
          </Box>
          <Typography variant="body2">
            {context}
          </Typography>
        </Paper>

        {/* Code Context if available */}
        {codeContext && (
          <Paper variant="outlined" sx={cardStyles.context}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CodeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
              <Typography variant="subtitle2" fontWeight="bold">
                Code Example
              </Typography>
            </Box>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1,
                fontSize: '0.9rem',
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              <code>{codeContext.beforeCode}</code>
            </Box>
          </Paper>
        )}

        {/* Shortcut Exercise */}
        <Paper elevation={2} sx={cardStyles.exercise}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <KeyboardIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Practice the Shortcut
            </Typography>
          </Box>

          {/* Expected Shortcut */}
          <Box sx={cardStyles.keyContainer}>
            {expectedKeys.map((key, index) => (
              <Fragment key={key}>
                <Chip
                  label={getKeyDisplayName(key)}
                  color="primary"
                  sx={keyChipStyles.expected}
                />
                {index < expectedKeys.length - 1 && (
                  <Typography variant="h6" color="text.secondary">
                    +
                  </Typography>
                )}
              </Fragment>
            ))}
          </Box>

          {/* Currently pressed keys */}
          <Box sx={cardStyles.keyContainer}>
            {pressedKeys.length > 0 ? (
              pressedKeys.map((key, index) => (
                <Fragment key={key}>
                  <Chip
                    label={getKeyDisplayName(key)}
                    color="default"
                    sx={keyChipStyles.pressed}
                  />
                  {index < pressedKeys.length - 1 && (
                    <Typography variant="body1" color="text.secondary">
                      +
                    </Typography>
                  )}
                </Fragment>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Press keys to see them here
              </Typography>
            )}
          </Box>

          {/* Hint button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Tooltip title={showHint ? 'Hide hint' : 'Show hint'}>
              <IconButton
                color="secondary"
                onClick={handleToggleHint}
                size="small"
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Hint */}
          <Collapse in={showHint}>
            <Paper variant="outlined" sx={cardStyles.hint}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LightbulbIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Hint
                </Typography>
              </Box>
              <Typography variant="body2">
                {feedbackFailure.hint || `Try pressing ${formatShortcutForDisplay(shortcutString)}`}
              </Typography>
            </Paper>
          </Collapse>
        </Paper>

        {FeedbackMessage}
        {MascotMessage}
      </Card>
    </Box>
  );
});

EnhancedShortcutExercise.displayName = 'EnhancedShortcutExercise';

export default EnhancedShortcutExercise;

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
import React, { useState, useEffect, Fragment } from 'react';

import { useShortcutDetection } from '../../hooks';
import { formatShortcutForDisplay, getKeyDisplayName } from '../../utils/shortcutUtils';
import { FeedbackAnimation } from '../gamification';

import type { ShortcutDefinition } from '../../utils/shortcutUtils';
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

const EnhancedShortcutExercise: FC<EnhancedShortcutExerciseProps> = ({
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
  const shortcutDefinition: ShortcutDefinition = {
    windows: shortcut.shortcutWindows,
    mac: shortcut.shortcutMac || shortcut.shortcutWindows,
    linux: shortcut.shortcutLinux,
  };

  // Use our custom hook for shortcut detection
  const {
    pressedKeys,
    lastAttempt: _lastAttempt,
    isSuccess: _isSuccess,
    expectedKeys,
    shortcutString,
  } = useShortcutDetection(shortcutDefinition, {
    playSounds: true,
    autoClearOnMatch: true,
    autoClearOnFailure: false,
    onSuccess: () => {
      // Play success sound
      handleSuccess();
    },
    onFailure: () => {
      // Increment attempts
      setAttempts((prev) => prev + 1);
      handleFailure();
    },
  });

  // Handle successful shortcut execution
  const handleSuccess = () => {
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
    setTimeout(() => {
      onSuccess();
      setFeedback(null);
      setShowAnimation(false);
      setShowMascot(false);
    }, 2000);
  };

  // Handle failed attempt
  const handleFailure = () => {
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
    setTimeout(() => {
      setFeedback(null);
      setShowMascot(false);
    }, 3000);
  };

  // Show hint after 3 failed attempts
  useEffect(() => {
    if (attempts >= 3 && !showHint && feedbackFailure.hint) {
      setShowHint(true);
    }
  }, [attempts, showHint, feedbackFailure.hint]);

  // Toggle hint visibility
  const handleToggleHint = () => {
    setShowHint((prev) => !prev);
  };

  // Get difficulty color
  const getDifficultyColor = () => {
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
  };

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
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        {/* Header with title and difficulty */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Chip
            label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            size="small"
            sx={{
              backgroundColor: getDifficultyColor(),
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
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.02)',
            borderRadius: 1,
          }}
        >
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
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(30,30,30,0.9)'
                : 'rgba(240,240,240,0.9)',
              borderRadius: 1,
              fontFamily: 'monospace',
              overflow: 'auto',
            }}
          >
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
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <KeyboardIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Practice the Shortcut
            </Typography>
          </Box>

          {/* Expected Shortcut */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
          }}>
            {expectedKeys.map((key, index) => (
              <Fragment key={key}>
                <Chip
                  label={getKeyDisplayName(key)}
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    height: 36,
                    borderRadius: 1,
                  }}
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
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            minHeight: 40,
            mb: 2,
          }}>
            {pressedKeys.length > 0 ? (
              pressedKeys.map((key, index) => (
                <Fragment key={key}>
                  <Chip
                    label={getKeyDisplayName(key)}
                    color="default"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      height: 32,
                      borderRadius: 1,
                    }}
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
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
                borderRadius: 1,
              }}
            >
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

        {/* Feedback */}
        {feedback && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: feedback.isSuccess
                ? theme.palette.success.light
                : theme.palette.error.light,
              color: feedback.isSuccess
                ? theme.palette.success.contrastText
                : theme.palette.error.contrastText,
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" fontWeight="medium">
              {feedback.message}
            </Typography>
          </Paper>
        )}

        {/* Mascot message */}
        {showMascot && mascotMessage && (
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
        )}
      </Card>
    </Box>
  );
};

export default EnhancedShortcutExercise;

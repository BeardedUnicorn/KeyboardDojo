import {
  CheckCircleOutline as CheckIcon,
  HighlightOff as ErrorIcon,
  Refresh as RefreshIcon,
  Lightbulb as HintIcon,
} from '@mui/icons-material';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

import { useCurrency } from '../../hooks';
import { useXP } from '../../hooks/useXP';
import { CURRENCY_REWARDS } from '../../services';
import { osDetectionService } from '../../services/osDetectionService';
import { XP_REWARDS } from '../../services/xpService';
import { shortcutDetector, formatShortcut, parseShortcut, matchesShortcut, getActiveModifiers } from '../../utils/shortcutDetector';

import type { FC } from 'react';

/**
 * Constants for component styles
 * Extracted for better performance and maintainability
 */
const STYLES = {
  root: {
    p: 3,
    borderRadius: 2,
    border: 1,
    borderColor: 'divider',
  },
  context: {
    p: 2,
    mb: 3,
    borderRadius: 1,
  },
  shortcutBox: {
    my: 3,
    textAlign: 'center',
  },
  progressBox: {
    mb: 3,
  },
  statusBox: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  messageBox: {
    p: 2,
    mb: 3,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
  },
  messageIcon: {
    mr: 1,
  },
  keyChip: {
    mr: 0.5,
  },
  buttonStack: {
    direction: 'row',
    spacing: 2,
    justifyContent: 'center',
    mb: 3,
  },
};

/**
 * Props interface for the ShortcutChallenge component
 *
 * @interface ShortcutChallengeProps
 * @property {string} shortcut - The shortcut to be pressed (Windows/Linux format)
 * @property {string} [shortcutMac] - Mac-specific shortcut format (optional)
 * @property {string} [shortcutLinux] - Linux-specific shortcut format (optional)
 * @property {string} description - Description of what the shortcut does
 * @property {string} [context] - Optional context where the shortcut is used (e.g., code snippet)
 * @property {'vscode' | 'intellij' | 'cursor'} [application] - The application context for styling
 * @property {() => void} [onSuccess] - Callback function when shortcut is correctly pressed
 * @property {() => void} [onSkip] - Callback function when user skips the challenge
 * @property {() => void} [onHint] - Callback function when user requests a hint
 * @property {boolean} [showKeyboard] - Whether to show keyboard visualization
 */
export interface ShortcutChallengeProps {
  shortcut: string;
  shortcutMac?: string;
  shortcutLinux?: string;
  description: string;
  context?: string;
  application?: 'vscode' | 'intellij' | 'cursor';
  onSuccess?: () => void;
  onSkip?: () => void;
  onHint?: () => void;
  showKeyboard?: boolean;
}

/**
 * ShortcutChallenge Component
 *
 * A component that challenges users to input a specific keyboard shortcut.
 * It provides visual feedback, tracks attempts, and awards XP and currency for correct answers.
 *
 * @example
 * ```tsx
 * <ShortcutChallenge
 *   shortcut="Ctrl+C"
 *   shortcutMac="⌘+C"
 *   description="Copy selected text"
 *   application="vscode"
 *   onSuccess={() => logger.info('Shortcut completed successfully!')}
 * />
 * ```
 */
const ShortcutChallenge: FC<ShortcutChallengeProps> = memo(({
  shortcut,
  shortcutMac,
  shortcutLinux,
  description,
  context = '',
  application = 'vscode',
  onSuccess,
  onSkip,
  onHint,
  showKeyboard = true,
}) => {
  const [status, setStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [startTime] = useState(Date.now());
  const successHandled = useRef(false);
  const { addXP } = useXP();
  const { addCurrency } = useCurrency();

  // Memoize OS-specific shortcut
  const osSpecificShortcut = useMemo(() =>
    osDetectionService.formatShortcut(
      shortcut,
      shortcutMac || shortcut.replace(/Ctrl\+/g, '⌘+').replace(/Alt\+/g, '⌥+'),
      shortcutLinux,
    ),
    [shortcut, shortcutMac, shortcutLinux],
  );

  // Memoize parsed shortcut
  const parsedShortcut = useMemo(() =>
    parseShortcut(osSpecificShortcut),
    [osSpecificShortcut],
  );

  /**
   * Memoized application-specific styles based on the application prop
   * Different applications (VSCode, IntelliJ, Cursor) have different color schemes
   *
   * @returns {object} The style object for the specified application
   */
  const applicationStyle = useMemo(() => {
    switch (application) {
      case 'vscode':
        return {
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          borderColor: '#007acc',
        };
      case 'intellij':
        return {
          bgcolor: '#2b2b2b',
          color: '#a9b7c6',
          borderColor: '#ff5370',
        };
      case 'cursor':
        return {
          bgcolor: '#1a1a1a',
          color: '#e0e0e0',
          borderColor: '#6c38bb',
        };
      default:
        return {};
    }
  }, [application]);

  /**
   * Handles successful shortcut execution
   * Awards XP and currency to the user based on performance
   * Calls the onSuccess callback if provided
   * Uses a ref to prevent multiple executions
   */
  const handleShortcutSuccess = useCallback(() => {
    if (!successHandled.current) {
      successHandled.current = true;
      onSuccess?.();

      // Award XP for correct answer
      addXP(XP_REWARDS.CORRECT_ANSWER, 'shortcut_correct');

      // Award combo bonus if applicable
      if (consecutiveCorrect > 1) {
        addXP(XP_REWARDS.COMBO_BONUS * Math.min(consecutiveCorrect, 5), 'combo_bonus');
      }

      // Award currency for completing the challenge
      addCurrency(
        CURRENCY_REWARDS.CHALLENGE_COMPLETE,
        'challenge_complete',
        'Completed shortcut challenge',
      );

      // Award bonus currency for consecutive correct answers
      if (consecutiveCorrect > 1 && consecutiveCorrect % 5 === 0) {
        addCurrency(
          CURRENCY_REWARDS.CHALLENGE_COMPLETE * 2,
          'challenge_streak',
          `${consecutiveCorrect} shortcuts in a row!`,
        );
      }
    }
  }, [addXP, addCurrency, consecutiveCorrect, onSuccess]);

  /**
   * Checks if the pressed key is a modifier key
   * Used to avoid counting modifier key presses as attempts
   *
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {boolean} True if the key is a modifier key (Control, Alt, Shift, Meta)
   */
  const isModifierOnly = useCallback((event: KeyboardEvent) => {
    return ['Control', 'Alt', 'Shift', 'Meta'].includes(event.key);
  }, []);

  /**
   * Handles keyboard events to detect shortcut presses
   * Validates if the pressed keys match the expected shortcut
   * Updates state based on success or failure
   *
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if already successful and handled
    if (status === 'success' && successHandled.current) return;

    // Check if the shortcut matches
    if (matchesShortcut(event, parsedShortcut)) {
      setStatus('success');
      setAttempts((prev) => prev + 1);
      setConsecutiveCorrect((prev) => prev + 1);
      handleShortcutSuccess();
      event.preventDefault();
    } else if (!isModifierOnly(event)) {
      // Only count non-modifier keys as attempts
      setStatus('error');
      setAttempts((prev) => prev + 1);
      setConsecutiveCorrect(0); // Reset consecutive correct counter on error
      setLastAttempt(formatShortcut({
        key: event.key,
        modifiers: getActiveModifiers(event),
      }));

      // Reset status after a delay
      setTimeout(() => {
        setStatus('waiting');
      }, 1500);
    }
  }, [status, parsedShortcut, isModifierOnly, handleShortcutSuccess]);

  // Update time elapsed
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Reset state when shortcut changes
  useEffect(() => {
    setStatus('waiting');
    setAttempts(0);
    setLastAttempt('');
    setShowHint(false);
    successHandled.current = false;
  }, [shortcut, shortcutMac, shortcutLinux]);

  // Set up keyboard event listeners
  useEffect(() => {
    shortcutDetector.initialize();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      shortcutDetector.cleanup();
    };
  }, [handleKeyDown]);

  /**
   * Formats a shortcut string into a series of Chip components for display
   * Handles OS-specific key symbols (e.g., ⌘ for Command on Mac)
   *
   * @param {string} shortcutStr - The shortcut string to format (e.g., "Ctrl+C")
   * @returns {ReactNode[]} Array of Chip components representing each key
   */
  const formatShortcutForDisplay = useCallback((shortcutStr: string) => {
    const parts = shortcutStr.split('+');

    return parts.map((part) => {
      // Format special keys based on OS
      switch (part.toLowerCase()) {
        case 'ctrl':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌘' : 'Ctrl'} size="small" sx={STYLES.keyChip} />;
        case 'alt':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌥' : 'Alt'} size="small" sx={STYLES.keyChip} />;
        case 'shift':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⇧' : 'Shift'} size="small" sx={STYLES.keyChip} />;
        case 'meta':
        case 'command':
        case 'cmd':
        case '⌘':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌘' : 'Win'} size="small" sx={STYLES.keyChip} />;
        case '⌥':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌥' : 'Alt'} size="small" sx={STYLES.keyChip} />;
        case '⇧':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⇧' : 'Shift'} size="small" sx={STYLES.keyChip} />;
        default:
          return <Chip key={part} label={part} size="small" sx={STYLES.keyChip} />;
      }
    });
  }, []);

  /**
   * Handles the hint button click
   * Shows the hint and calls the onHint callback if provided
   */
  const handleHintClick = useCallback(() => {
    setShowHint(true);
    onHint?.();
  }, [onHint]);

  /**
   * Handles the skip button click
   * Calls the onSkip callback if provided
   */
  const handleSkipClick = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  // Memoize message components
  const SuccessMessage = useMemo(() => (
    status === 'success' && (
      <Fade in>
        <Box
          sx={{
            ...STYLES.messageBox,
            bgcolor: 'success.light',
            color: 'success.contrastText',
          }}
        >
          <CheckIcon sx={STYLES.messageIcon} />
          <Typography variant="body2">
            Great job! You pressed the correct shortcut.
          </Typography>
        </Box>
      </Fade>
    )
  ), [status]);

  const ErrorMessage = useMemo(() => (
    status === 'error' && (
      <Fade in>
        <Box
          sx={{
            ...STYLES.messageBox,
            bgcolor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <ErrorIcon sx={STYLES.messageIcon} />
          <Typography variant="body2">
            Not quite. You pressed: {lastAttempt}
          </Typography>
        </Box>
      </Fade>
    )
  ), [status, lastAttempt]);

  const HintMessage = useMemo(() => (
    showHint && (
      <Box
        sx={{
          ...STYLES.messageBox,
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
        }}
      >
        <HintIcon sx={STYLES.messageIcon} />
        <Typography variant="body2">
          Hint: Make sure to press {osSpecificShortcut.split('+').join(' + ')} exactly in that order.
        </Typography>
      </Box>
    )
  ), [showHint, osSpecificShortcut]);

  return (
    <Paper elevation={3} sx={STYLES.root}>
      {/* Challenge header */}
      <Typography variant="h6" gutterBottom>
        Shortcut Challenge
      </Typography>

      {/* Application context */}
      {context && (
        <Box sx={{ ...STYLES.context, ...applicationStyle }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {context}
          </Typography>
        </Box>
      )}

      {/* Challenge description */}
      <Typography variant="body1" gutterBottom>
        {description}
      </Typography>

      {/* Shortcut to press */}
      <Box sx={STYLES.shortcutBox}>
        <Typography variant="subtitle2" gutterBottom>
          Press the shortcut:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {formatShortcutForDisplay(osSpecificShortcut)}
        </Box>
      </Box>

      {/* Progress and status */}
      <Box sx={STYLES.progressBox}>
        <Box sx={STYLES.statusBox}>
          <Typography variant="caption" color="text.secondary">
            Attempts: {attempts}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Time: {timeElapsed}s
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={status === 'success' ? 100 : 0}
          color={status === 'error' ? 'error' : 'primary'}
          sx={STYLES.progressBar}
        />
      </Box>

      {/* Messages */}
      {SuccessMessage}
      {ErrorMessage}
      {HintMessage}

      {/* Action buttons */}
      <Stack sx={STYLES.buttonStack}>
        {!showHint && (
          <Button
            variant="outlined"
            startIcon={<HintIcon />}
            onClick={handleHintClick}
            color="warning"
          >
            Hint
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleSkipClick}
          color="secondary"
        >
          Skip
        </Button>
      </Stack>
    </Paper>
  );
});

ShortcutChallenge.displayName = 'ShortcutChallenge';

export default ShortcutChallenge;

import { Box, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { useCurrency, useXP } from '../../hooks';
import { CURRENCY_REWARDS, osDetectionService } from '../../services';
import { XP_REWARDS } from '../../services/xpService';

import type { KeyboardEvent , FC } from 'react';

interface LessonInfo {
  id?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  category?: string;
}

export interface IDESimulatorProps {
  code: string;
  targetShortcut: {
    windows: string;
    mac: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
  lesson: LessonInfo;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showControls?: boolean;
}

const IDESimulator: FC<IDESimulatorProps> = ({
  code,
  targetShortcut,
  onSuccess,
  onFailure,
  lesson,
  onComplete,
}) => {
  const theme = useTheme();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKeyCombo, setLastKeyCombo] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const { addXP } = useXP();
  const { addCurrency } = useCurrency();

  // Determine OS for shortcut display
  const isMac = osDetectionService.isMacOS();
  const currentShortcut = isMac ? targetShortcut.mac : targetShortcut.windows;

  // Parse shortcut into individual keys
  const parseShortcut = (shortcut: string): string[] => {
    // Normalize the shortcut string first
    const normalizedShortcut = shortcut
      .replace(/\s+/g, '') // Remove all whitespace
      .toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Split by '+' and handle special cases
    return normalizedShortcut.split('+').map((key) => {
      // Normalize key names for consistency
      switch (key) {
        case 'control':
        case 'ctrl':
          return 'ctrl';
        case 'option':
        case 'alt':
          return 'alt';
        case 'command':
        case 'cmd':
        case 'meta':
          return isMac ? 'cmd' : 'win';
        case 'shift':
          return 'shift';
        case 'escape':
        case 'esc':
          return 'esc';
        default:
          return key;
      }
    });
  };

  const expectedKeys = parseShortcut(currentShortcut);

  // Handle key down
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Add key to pressed keys
    const key = e.key.toLowerCase();
    const newPressedKeys = new Set(pressedKeys);

    // Map special keys to their names using the same logic as parseShortcut
    let keyName = key;
    switch (key) {
      case 'control':
        keyName = 'ctrl';
        break;
      case 'alt':
      case 'option':
        keyName = 'alt';
        break;
      case 'shift':
        keyName = 'shift';
        break;
      case 'meta':
      case 'command':
        keyName = isMac ? 'cmd' : 'win';
        break;
      case 'escape':
        keyName = 'esc';
        break;
      default:
        keyName = key;
    }

    newPressedKeys.add(keyName);
    setPressedKeys(newPressedKeys);

    // Check if the pressed keys match the expected shortcut
    const currentKeys = Array.from(newPressedKeys);
    setLastKeyCombo(currentKeys);

    // Check if all expected keys are pressed (case insensitive)
    const expectedLower = expectedKeys.map((k) => k.toLowerCase());
    const currentKeysLower = currentKeys.map((k) => k.toLowerCase());

    // Check if the shortcut is correct
    if (currentKeysLower.join('+') === expectedLower.join('+')) {
      setFeedback({
        message: 'Correct! Well done!',
        isSuccess: true,
      });

      // Award XP for completing the lesson
      addXP(XP_REWARDS.COMPLETE_LESSON, 'lesson_complete');

      // Award currency for completing the lesson
      addCurrency(
        CURRENCY_REWARDS.CHALLENGE_COMPLETE,
        'lesson_complete',
        `Completed lesson: ${lesson?.title || 'IDE Simulator'}`,
      );

      // Award bonus currency for perfect completion
      addCurrency(
        CURRENCY_REWARDS.PERFECT_LESSON,
        'perfect_lesson',
        `Perfect completion of lesson: ${lesson?.title || 'IDE Simulator'}`,
      );

      // Call the onComplete callback
      onComplete?.();

      // Call the onSuccess callback
      onSuccess();
    } else if (currentKeys.length >= expectedLower.length) {
      setFeedback({
        message: 'Incorrect shortcut. Try again!',
        isSuccess: false,
      });
      onFailure();
    }
  };

  // Handle key up
  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    // Remove key from pressed keys
    const key = e.key.toLowerCase();
    const newPressedKeys = new Set(pressedKeys);

    // Map special keys to their names using the same logic as parseShortcut
    let keyName = key;
    switch (key) {
      case 'control':
        keyName = 'ctrl';
        break;
      case 'alt':
      case 'option':
        keyName = 'alt';
        break;
      case 'shift':
        keyName = 'shift';
        break;
      case 'meta':
      case 'command':
        keyName = isMac ? 'cmd' : 'win';
        break;
      case 'escape':
        keyName = 'esc';
        break;
      default:
        keyName = key;
    }

    newPressedKeys.delete(keyName);
    setPressedKeys(newPressedKeys);
  };

  // Clear feedback after a delay
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
      className="ide-simulator"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {/* Code display */}
      <Box
        sx={{
          p: 2,
          height: '100%',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.5,
          whiteSpace: 'pre',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
        }}
      >
        {code}
      </Box>

      {/* Shortcut feedback */}
      {feedback && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            backgroundColor: feedback.isSuccess ? 'success.main' : 'error.main',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            {feedback.message}
          </Typography>
        </Box>
      )}

      {/* Current keys pressed */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          p: 1,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption">
          {lastKeyCombo.length > 0
            ? `Keys: ${lastKeyCombo.join(' + ')}`
            : 'Press the shortcut...'}
        </Typography>
      </Box>

      {/* Expected shortcut */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          p: 1,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption">
          Expected: {currentShortcut}
        </Typography>
      </Box>
    </Box>
  );
};

export default IDESimulator;

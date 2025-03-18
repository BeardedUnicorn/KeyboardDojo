import { Box, Typography, Button, Card, CardContent, Stack, LinearProgress, Container } from '@mui/material';
import React, { useState, useEffect } from 'react';

import ConfettiEffect from '../effects/ConfettiEffect';
import KeyboardListener from '../keyboard/KeyboardListener';
import ShortcutDisplay from '../shortcuts/ShortcutDisplay';

import type { PerformanceRating, ReviewSession as ReviewSessionType } from '../../services/spacedRepetitionService';
import type { FC } from 'react';

interface ReviewSessionProps {
  session: ReviewSessionType;
  onComplete: (
    results: Array<{
      shortcutId: string;
      performance: PerformanceRating;
      responseTime: number;
    }>
  ) => void;
}

const ReviewSession: FC<ReviewSessionProps> = ({ session, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<
    Array<{
      shortcutId: string;
      performance: PerformanceRating;
      responseTime: number;
    }>
  >([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentShortcut = session.shortcuts[currentIndex];
  const isLastShortcut = currentIndex === session.shortcuts.length - 1;
  const progress = (currentIndex / session.shortcuts.length) * 100;

  useEffect(() => {
    // Reset state when moving to a new shortcut
    setStartTime(Date.now());
    setIsCorrect(null);
    setShowAnswer(false);
  }, [currentIndex]);

  const handleShortcutAttempt = (success: boolean) => {
    if (isCorrect !== null) return; // Already answered

    const endTime = Date.now();
    const responseTime = startTime ? endTime - startTime : 0;

    setIsCorrect(success);

    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleRatePerformance = (performance: PerformanceRating) => {
    const responseTime = startTime ? Date.now() - startTime : 0;

    // Record the result
    const result = {
      shortcutId: currentShortcut.id,
      performance,
      responseTime,
    };

    setResults([...results, result]);

    // Move to the next shortcut or complete the session
    if (isLastShortcut) {
      onComplete([...results, result]);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyboardEvent = (event: KeyboardEvent) => {
    // Check if the pressed shortcut matches the current shortcut
    // This is a simplified version - in a real app, you'd need more complex matching logic
    const shortcutKey = currentShortcut.shortcutWindows.toLowerCase();
    const pressedKey = `${event.ctrlKey ? 'ctrl+' : ''}${event.shiftKey ? 'shift+' : ''}${event.altKey ? 'alt+' : ''}${event.key.toLowerCase()}`;

    if (pressedKey === shortcutKey) {
      handleShortcutAttempt(true);
    } else {
      handleShortcutAttempt(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsCorrect(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Review Session
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {currentIndex + 1} of {session.shortcuts.length} shortcuts
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {currentShortcut.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {currentShortcut.description || 'Try to recall this shortcut'}
          </Typography>

          {showAnswer && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <ShortcutDisplay shortcut={currentShortcut} />
            </Box>
          )}

          {isCorrect === true && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body1" color="success.contrastText">
                Correct! Well done.
              </Typography>
            </Box>
          )}

          {isCorrect === false && !showAnswer && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body1" color="error.contrastText">
                Not quite right. Try again or view the answer.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {!showAnswer && isCorrect === null && (
          <Button variant="outlined" onClick={handleShowAnswer}>
            Show Answer
          </Button>
        )}

        {(isCorrect !== null || showAnswer) && (
          <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRatePerformance('again')}
            >
              Again
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleRatePerformance('hard')}
            >
              Hard
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleRatePerformance('good')}
            >
              Good
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleRatePerformance('easy')}
            >
              Easy
            </Button>
          </Stack>
        )}
      </Box>

      {/* Keyboard listener to detect shortcut presses */}
      <KeyboardListener onKeyboardEvent={handleKeyboardEvent} />

      {/* Confetti effect for correct answers */}
      {showConfetti && <ConfettiEffect />}
    </Container>
  );
};

export default ReviewSession;

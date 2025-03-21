import { Box, Typography, Button, Card, CardContent, Stack, LinearProgress, Container } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

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
  /**
   * ID for the review session for accessibility purposes
   */
  sessionId?: string;
}

const ReviewSession: FC<ReviewSessionProps> = ({ 
  session, 
  onComplete,
  sessionId = `review-session-${session.id}`,
}) => {
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
  
  // Refs for managing focus
  const answerButtonRef = useRef<HTMLButtonElement>(null);
  const ratingButtonsRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const currentShortcut = session.shortcuts[currentIndex];
  const isLastShortcut = currentIndex === session.shortcuts.length - 1;
  const progress = (currentIndex / session.shortcuts.length) * 100;

  useEffect(() => {
    // Reset state when moving to a new shortcut
    setStartTime(Date.now());
    setIsCorrect(null);
    setShowAnswer(false);
    
    // Announce new shortcut for screen readers
    const shortcutName = currentShortcut.name || 'Next shortcut';
    const shortcutDescription = currentShortcut.description || 'Try to recall this shortcut';
    document.getElementById(`${sessionId}-sr-live`)?.setAttribute('aria-label', 
      `${shortcutName}. ${shortcutDescription}. ${currentIndex + 1} of ${session.shortcuts.length} shortcuts.`
    );
  }, [currentIndex, currentShortcut, session.shortcuts.length, sessionId]);

  // Focus management when feedback is shown
  useEffect(() => {
    if (isCorrect !== null && feedbackRef.current) {
      feedbackRef.current.focus();
    }
  }, [isCorrect]);

  // Focus management when answer is shown
  useEffect(() => {
    if (showAnswer && ratingButtonsRef.current) {
      // Focus the first rating button when the answer is shown
      const firstButton = ratingButtonsRef.current.querySelector('button');
      if (firstButton) {
        (firstButton as HTMLButtonElement).focus();
      }
    }
  }, [showAnswer]);

  const handleShortcutAttempt = (success: boolean) => {
    if (isCorrect !== null) return; // Already answered

    const endTime = Date.now();
    const responseTime = startTime ? endTime - startTime : 0;

    setIsCorrect(success);

    // Announce result for screen readers
    const feedbackMessage = success 
      ? 'Correct! Well done. Rate your performance.'
      : 'Not quite right. Try again or view the answer.';
    
    document.getElementById(`${sessionId}-sr-live`)?.setAttribute('aria-label', feedbackMessage);

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

    // Announce rating for screen readers
    document.getElementById(`${sessionId}-sr-live`)?.setAttribute('aria-label', 
      `Performance rated as ${performance}. ${isLastShortcut ? 'Session complete.' : 'Moving to next shortcut.'}`
    );

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
    
    // Announce showing answer for screen readers
    document.getElementById(`${sessionId}-sr-live`)?.setAttribute('aria-label', 
      `Answer shown. The correct shortcut is: ${currentShortcut.shortcutWindows}. Please rate your performance.`
    );
  };

  // Handle keyboard navigation for rating buttons
  const handleRatingKeyDown = (event: React.KeyboardEvent, rating: PerformanceRating) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      
      const buttons = ratingButtonsRef.current?.querySelectorAll('button');
      if (!buttons) return;
      
      const buttonsArray = Array.from(buttons);
      const currentIndex = buttonsArray.indexOf(event.currentTarget as HTMLButtonElement);
      
      let newIndex;
      if (event.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % buttonsArray.length;
      } else {
        newIndex = (currentIndex - 1 + buttonsArray.length) % buttonsArray.length;
      }
      
      (buttonsArray[newIndex] as HTMLButtonElement).focus();
    }
  };

  return (
    <Container maxWidth="md">
      {/* Screen reader only live region for announcements */}
      <div
        id={`${sessionId}-sr-live`}
        aria-live="assertive"
        className="visually-hidden"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {currentShortcut.name}: {currentShortcut.description} - {currentIndex + 1} of {session.shortcuts.length}
      </div>
      
      <Box sx={{ mb: 4 }} role="region" aria-labelledby={`${sessionId}-title`}>
        <Typography variant="h4" gutterBottom id={`${sessionId}-title`}>
          Review Session
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 2 }} 
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`${currentIndex + 1} of ${session.shortcuts.length} shortcuts completed`}
        />
        <Typography variant="body2" color="text.secondary">
          {currentIndex + 1} of {session.shortcuts.length} shortcuts
        </Typography>
      </Box>

      <Card 
        variant="outlined" 
        sx={{ mb: 4 }} 
        aria-labelledby={`${sessionId}-shortcut-name`}
        role="region"
      >
        <CardContent>
          <Typography variant="h5" gutterBottom id={`${sessionId}-shortcut-name`}>
            {currentShortcut.name}
          </Typography>
          <Typography variant="body1" paragraph id={`${sessionId}-shortcut-description`}>
            {currentShortcut.description || 'Try to recall this shortcut'}
          </Typography>

          {showAnswer && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <ShortcutDisplay 
                shortcut={currentShortcut} 
                shortcutId={`${sessionId}-shortcut-display`}
                accessibilityContext="This is the correct shortcut for this review session."
              />
            </Box>
          )}

          {isCorrect === true && (
            <Box 
              sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}
              ref={feedbackRef}
              tabIndex={-1}
              aria-live="polite"
              role="status"
            >
              <Typography variant="body1" color="success.contrastText">
                Correct! Well done.
              </Typography>
            </Box>
          )}

          {isCorrect === false && !showAnswer && (
            <Box 
              sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}
              ref={feedbackRef}
              tabIndex={-1}
              aria-live="polite"
              role="status"
            >
              <Typography variant="body1" color="error.contrastText">
                Not quite right. Try again or view the answer.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {!showAnswer && isCorrect === null && (
          <Button 
            variant="outlined" 
            onClick={handleShowAnswer}
            ref={answerButtonRef}
            aria-describedby={`${sessionId}-shortcut-description`}
          >
            Show Answer
          </Button>
        )}

        {(isCorrect !== null || showAnswer) && (
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ width: '100%', justifyContent: 'center' }}
            ref={ratingButtonsRef}
            role="toolbar"
            aria-label="Rate your performance"
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRatePerformance('again')}
              onKeyDown={(e) => handleRatingKeyDown(e, 'again')}
              aria-label="Rate as Again - I didn't remember this at all"
            >
              Again
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleRatePerformance('hard')}
              onKeyDown={(e) => handleRatingKeyDown(e, 'hard')}
              aria-label="Rate as Hard - I barely remembered this"
            >
              Hard
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleRatePerformance('good')}
              onKeyDown={(e) => handleRatingKeyDown(e, 'good')}
              aria-label="Rate as Good - I remembered this with some effort"
            >
              Good
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleRatePerformance('easy')}
              onKeyDown={(e) => handleRatingKeyDown(e, 'easy')}
              aria-label="Rate as Easy - I easily remembered this"
            >
              Easy
            </Button>
          </Stack>
        )}
      </Box>

      {/* Keyboard listener to detect shortcut presses */}
      <KeyboardListener 
        onKeyboardEvent={handleKeyboardEvent} 
        ariaDescription={`Current shortcut to practice: ${currentShortcut.name}. Try to recall and press the shortcut.`}
      />

      {/* Confetti effect for correct answers */}
      {showConfetti && <ConfettiEffect />}
    </Container>
  );
};

export default ReviewSession;

import {
  QuestionAnswer as QuestionIcon,
  Timer as TimerIcon,
  Lightbulb as LightbulbIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  useTheme,
  Collapse,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import React from 'react';

import { useQuizState } from '../hooks';
import {
  formatTime,
} from '../utils/quizUtils';

import { FeedbackAnimation } from './index';

import type {
  QuizOption,
  FeedbackMessage } from '../utils/quizUtils';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { FC } from 'react';

interface EnhancedQuizExerciseProps {
  title: string;
  question: string;
  options: QuizOption[];
  _difficulty: DifficultyLevel;
  timeLimit?: number; // in seconds
  explanation?: string;
  imageUrl?: string;
  feedbackSuccess: FeedbackMessage;
  feedbackFailure: FeedbackMessage;
  onSuccess: () => void;
  onFailure: () => void;
}

const EnhancedQuizExercise: FC<EnhancedQuizExerciseProps> = ({
  title,
  question,
  options,
  _difficulty,
  timeLimit = 0, // 0 means no time limit
  explanation,
  imageUrl,
  feedbackSuccess,
  feedbackFailure,
  onSuccess,
  onFailure,
}) => {
  const theme = useTheme();

  const {
    quizOptions,
    selectedOption,
    isSubmitted,
    isCorrect: _isCorrect,
    feedback,
    showExplanation,
    showAnimation,
    mascotMessage,
    showMascot,
    timeRemaining,
    isTimerActive: _isTimerActive,
    attempts: _attempts,
    handleOptionSelect,
    handleSubmit,
    setShowExplanation,
    setShowAnimation: _setShowAnimation,
    setShowMascot: _setShowMascot,
  } = useQuizState({
    options,
    timeLimit,
    playSounds: true,
    onSuccess,
    onFailure,
    feedbackSuccess,
    feedbackFailure,
  });

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

      {/* Exercise content */}
      <Card
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          {/* Timer display if time limit is set */}
          {timeLimit > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimerIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Time Remaining: {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(timeRemaining / timeLimit) * 100}
                color={
                  timeRemaining > timeLimit * 0.6 ? 'success' :
                  timeRemaining > timeLimit * 0.3 ? 'warning' :
                  'error'
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}
        </Box>

        {/* Question */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <QuestionIcon color="primary" sx={{ mt: 0.5 }} />
            <Typography variant="body1" fontWeight="medium">
              {question}
            </Typography>
          </Box>
        </Paper>

        {/* Image if available */}
        {imageUrl && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img
              src={imageUrl}
              alt="Question illustration"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>
        )}

        {/* Options */}
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <RadioGroup
            aria-label="quiz options"
            name="quiz-options"
            value={selectedOption || ''}
            onChange={(e) => handleOptionSelect(e.target.value)}
          >
            <Grid container spacing={2}>
              {quizOptions.map((option) => (
                <Grid item xs={12} key={option.id}>
                  <Paper
                    elevation={1}
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${
                        isSubmitted 
                          ? option.isCorrect 
                            ? theme.palette.success.main 
                            : selectedOption === option.id 
                              ? theme.palette.error.main 
                              : theme.palette.divider
                          : theme.palette.divider
                      }`,
                      backgroundColor: isSubmitted
                        ? option.isCorrect
                          ? theme.palette.success.light + '20'
                          : selectedOption === option.id
                            ? theme.palette.error.light + '20'
                            : theme.palette.background.paper
                        : theme.palette.background.paper,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: isSubmitted
                          ? option.isCorrect
                            ? theme.palette.success.light + '20'
                            : selectedOption === option.id
                              ? theme.palette.error.light + '20'
                              : theme.palette.action.hover
                          : theme.palette.action.hover,
                      },
                    }}
                  >
                    <FormControlLabel
                      value={option.id}
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body1">{option.text}</Typography>
                          {isSubmitted && (
                            option.isCorrect
                              ? <CheckCircleIcon color="success" />
                              : selectedOption === option.id
                                ? <CancelIcon color="error" />
                                : null
                          )}
                        </Box>
                      }
                      sx={{
                        width: '100%',
                        m: 0,
                        p: 2,
                        pointerEvents: isSubmitted ? 'none' : 'auto',
                      }}
                      disabled={isSubmitted}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        {/* Submit button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitted}
            sx={{ minWidth: 120 }}
          >
            Submit Answer
          </Button>
        </Box>

        {/* Feedback message */}
        <Collapse in={!!feedback}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: feedback?.isSuccess
                ? theme.palette.success.light + '20'
                : theme.palette.error.light + '20',
              borderLeft: `4px solid ${feedback?.isSuccess 
                ? theme.palette.success.main
                : theme.palette.error.main}`,
            }}
          >
            <Typography variant="body1" color={feedback?.isSuccess ? 'success' : 'error'}>
              {feedback?.message}
            </Typography>
          </Paper>
        </Collapse>

        {/* Explanation */}
        <Collapse in={showExplanation}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: theme.palette.info.light + '20',
              borderLeft: `4px solid ${theme.palette.info.main}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LightbulbIcon color="info" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Explanation:
                </Typography>
                <Typography variant="body2">
                  {explanation}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Mascot message */}
        <Collapse in={showMascot}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box
              component="img"
              src="/images/mascot.png"
              alt="Mascot"
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Typography variant="body1">
              {mascotMessage}
            </Typography>
          </Box>
        </Collapse>

        {/* Help button */}
        {!isSubmitted && !showExplanation && explanation && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Show explanation">
              <IconButton
                color="info"
                onClick={() => {
                  setShowExplanation(true);
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default EnhancedQuizExercise;

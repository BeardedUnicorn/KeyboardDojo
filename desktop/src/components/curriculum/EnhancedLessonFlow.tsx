import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Flag as FlagIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  useTheme,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// Import our enhanced components
import { audioService } from '@/services';
import { useAchievementsRedux } from '@hooks/useAchievementsRedux';
import { useUserProgressRedux } from '@hooks/useUserProgressRedux';

import { EnhancedQuizExercise, EnhancedShortcutExercise } from '../exercises';

import LessonIntroduction from './LessonIntroduction';
import LessonSummary from './LessonSummary';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ILessonStep } from '@/types/curriculum/lesson/ILessonStep';
import type { FC } from 'react';

interface EnhancedLessonFlowProps {
  lesson: ILesson;
  onComplete: (performance: LessonPerformance) => void;
  onExit: () => void;
}

export interface LessonPerformance {
  lessonId: string;
  completed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  xpEarned: number;
  gemsEarned: number;
  stars: number; // 1-3 stars based on performance
  shortcutsMastered: IShortcut[];
}

const EnhancedLessonFlow: FC<EnhancedLessonFlowProps> = ({
  lesson,
  onComplete,
  onExit,
}) => {
  const theme = useTheme();
  const { updateProgress } = useUserProgressRedux();
  const { awardAchievement } = useAchievementsRedux();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [performance, setPerformance] = useState<LessonPerformance>({
    lessonId: lesson.id,
    completed: false,
    correctAnswers: 0,
    totalQuestions: lesson.steps.length,
    timeSpent: 0,
    xpEarned: 0,
    gemsEarned: 0,
    stars: 0,
    shortcutsMastered: [],
  });

  // Start the timer when the intro is dismissed
  useEffect(() => {
    if (!showIntro && !startTime) {
      setStartTime(Date.now());
    }
  }, [showIntro, startTime]);

  // Calculate performance metrics when lesson is completed
  useEffect(() => {
    if (showSummary && startTime) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const correctAnswers = Object.values(completed).filter(Boolean).length;
      const accuracy = correctAnswers / lesson.steps.length;

      // Calculate XP based on accuracy and difficulty
      let baseXP = 0;
      switch (lesson.difficulty) {
        case 'beginner':
          baseXP = 10;
          break;
        case 'intermediate':
          baseXP = 20;
          break;
        case 'advanced':
          baseXP = 30;
          break;
        case 'expert':
          baseXP = 50;
          break;
      }

      const xpEarned = Math.round(baseXP * lesson.steps.length * accuracy);

      // Calculate gems based on accuracy and time
      const timeBonus = Math.max(0, 1 - (timeSpent / (lesson.steps.length * 60)));
      const gemsEarned = Math.round((baseXP / 10) * accuracy * (1 + timeBonus));

      // Calculate stars (1-3) based on performance
      let stars = 1; // At least 1 star for completion
      if (accuracy >= 0.8) stars = 2;
      if (accuracy >= 0.95) stars = 3;

      // Collect shortcuts mastered
      const shortcutsMastered = lesson.steps
        .filter((step, index) => completed[index])
        .map((step) => step.shortcut)
        .filter((shortcut): shortcut is NonNullable<typeof shortcut> => shortcut !== null);

      // Update performance state
      setPerformance({
        lessonId: lesson.id,
        completed: true,
        correctAnswers,
        totalQuestions: lesson.steps.length,
        timeSpent,
        xpEarned,
        gemsEarned,
        stars,
        shortcutsMastered,
      });

      // Play completion sound
      audioService.playSound('levelUp');

      // Check for achievements
      if (stars === 3) {
        awardAchievement('perfect_lesson');
      }
      if (shortcutsMastered.length >= 5) {
        awardAchievement('shortcut_master');
      }

      // Update progress
      updateProgress({
        lessonId: lesson.id,
        completed: true,
        stars,
        xpEarned,
        gemsEarned,
      });
    }
  }, [showSummary, startTime, lesson, completed, updateProgress, awardAchievement]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    audioService.playSound('success');
  };

  const handleNext = () => {
    setLoading(true);

    // Simulate loading for smoother transitions
    setTimeout(() => {
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);

      const newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep);
      setLoading(false);

      // Check if we've reached the end of the lesson
      if (newActiveStep === lesson.steps.length) {
        setShowSummary(true);
      }
    }, 500);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSuccess = () => {
    // Update completed steps
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    // Play success sound
    audioService.playSound('success');

    // Move to next step after a short delay
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleStepFailure = () => {
    // Play error sound
    audioService.playSound('error');
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setShowSummary(false);
    setStartTime(Date.now());
  };

  const handleExit = () => {
    onExit();
  };

  const handleComplete = () => {
    onComplete(performance);
  };

  const renderStepContent = (step: ILessonStep, index: number) => {
    switch (step.type) {
      case 'shortcut':
        return (
          <EnhancedShortcutExercise
            title={step.title || `Exercise ${index + 1}`}
            description={step.description || ''}
            context={step.context || 'Practice this shortcut to improve your efficiency.'}
            shortcut={step.shortcut && typeof step.shortcut === 'object' ? step.shortcut : undefined}
            difficulty={lesson.difficulty as DifficultyLevel}
            codeContext={step.codeContext}
            feedbackSuccess={{
              message: 'Great job! You executed the shortcut correctly.',
              mascotReaction: 'Excellent! Your keyboard skills are improving!',
            }}
            feedbackFailure={{
              message: 'Not quite right. Try again!',
              mascotReaction: "Keep trying! You'll get it soon.",
              hint: step.hint,
            }}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
          />
        );
      case 'quiz':
        return (
          <EnhancedQuizExercise
            title={step.title || `Quiz ${index + 1}`}
            question={step.question || ''}
            options={step.options || []}
            difficulty={lesson.difficulty as DifficultyLevel}
            timeLimit={step.timeLimit}
            explanation={step.explanation}
            imageUrl={step.imageUrl}
            feedbackSuccess={{
              message: 'Correct! Well done!',
              mascotReaction: "Great job! You're mastering this concept!",
            }}
            feedbackFailure={{
              message: "That's not correct. Try again!",
              mascotReaction: "Don't worry, learning takes practice!",
            }}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
          />
        );
      default:
        return (
          <Typography variant="body1">
            Unknown step type: {step.type}
          </Typography>
        );
    }
  };

  // If showing the introduction screen
  if (showIntro) {
    return (
      <Fade in={showIntro} timeout={500}>
        <Box>
          <LessonIntroduction
            title={lesson.title}
            description={lesson.description || ''}
            shortcuts={lesson.steps
              .filter((step) => step.type === 'shortcut' && step.shortcut)
              .map((step) => step.shortcut)
              .filter((shortcut): shortcut is NonNullable<typeof shortcut> => shortcut !== null)
              .map((shortcut) => ({
                name: shortcut.name,
                description: shortcut.description || '',
                shortcutWindows: shortcut.shortcutWindows,
                shortcutMac: shortcut.shortcutMac || shortcut.shortcutWindows,
              }))}
            onContinue={handleIntroComplete}
          />
        </Box>
      </Fade>
    );
  }

  // If showing the summary screen
  if (showSummary) {
    return (
      <Fade in={showSummary} timeout={500}>
        <Box>
          <LessonSummary
            title={lesson.title}
            description={lesson.description || ''}
            performance={performance}
            onNext={handleComplete}
            onReplay={handleReset}
            onHome={handleExit}
          />
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" component="h1">
              {lesson.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Exit lesson">
                <IconButton onClick={handleExit} color="inherit">
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Restart lesson">
                <IconButton onClick={handleReset} color="inherit">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Get help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {lesson.description}
          </Typography>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {lesson.steps.map((step, index) => {
              const stepProps: { completed?: boolean } = {};
              if (completed[index]) {
                stepProps.completed = true;
              }
              return (
                <Step key={index} {...stepProps}>
                  <StepLabel>{step.title || `Step ${index + 1}`}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>

        {/* Current step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {activeStep < lesson.steps.length ? (
                  renderStepContent(lesson.steps[activeStep], activeStep)
                ) : (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      All steps completed!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowSummary(true)}
                      startIcon={<FlagIcon />}
                    >
                      Complete Lesson
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={!completed[activeStep] || activeStep === lesson.steps.length}
          >
            {activeStep === lesson.steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EnhancedLessonFlow;

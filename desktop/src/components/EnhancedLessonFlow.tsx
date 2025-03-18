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
import { useDispatch } from 'react-redux';

import { audioService } from '@/services';

import { awardAchievement as awardAchievementAction } from '../store/slices/achievementsSlice';
import { markLessonCompleted as markLessonCompletedAction } from '../store/slices/userProgressSlice';

// Import our enhanced components
import EnhancedQuizExercise from './EnhancedQuizExercise';
import EnhancedShortcutExercise from './EnhancedShortcutExercise';
import LessonIntroduction from './LessonIntroduction';
import LessonSummary from './LessonSummary';

import type { AppDispatch } from '@/store';
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
  const dispatch = useDispatch<AppDispatch>();

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

  const updateProgress = (params: any) => {
    dispatch(markLessonCompletedAction(params));
  };

  const awardAchievement = (achievementId: string) => {
    dispatch(awardAchievementAction(achievementId));
  };

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

      const xpEarned = Math.round(
        baseXP * lesson.steps.length * accuracy,
      );

      // Calculate gems based on accuracy and time
      const timeBonus = Math.max(
        0, 
        1 - (timeSpent / (lesson.steps.length * 60)),
      );
      const gemsEarned = Math.round(
        (baseXP / 10) * accuracy * (1 + timeBonus),
      );

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
  }, [
    showSummary, 
    startTime, 
    lesson, 
    completed, 
    updateProgress, 
    awardAchievement,
  ]);

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
            shortcut={step.shortcut}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
            helpText={step.hint}
            _context={step.context || 'Practice this shortcut to improve your efficiency.'}
            _difficulty={lesson.difficulty as DifficultyLevel}
            _codeContext={step.codeContext}
          />
        );
      case 'quiz':
        return (
          <EnhancedQuizExercise
            title={step.title || `Quiz ${index + 1}`}
            question={step.question || ''}
            options={step.options || []}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
            _difficulty={lesson.difficulty as DifficultyLevel}
            _timeLimit={step.timeLimit}
            _explanation={step.explanation}
            _imageUrl={step.imageUrl}
          />
        );
      default:
        return (
          <Typography 
            variant="body1" 
            color="error"
          >
            Unknown step type: {step.type}
          </Typography>
        );
    }
  };

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1 }}
          >
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
              onExit={handleExit}
            />
          </motion.div>
        )}

        {!showIntro && !showSummary && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Navigation */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box>
                  <Tooltip title="Exit lesson">
                    <IconButton 
                      onClick={handleExit}
                      size="small"
                    >
                      <HomeIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Restart lesson">
                    <IconButton 
                      onClick={handleReset}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Previous step">
                    <span>
                      <IconButton
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        size="small"
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Typography 
                    variant="body2" 
                    component="span" 
                    sx={{ mx: 2 }}
                  >
                    Step {activeStep + 1} of {lesson.steps.length}
                  </Typography>
                  <Tooltip title="Next step">
                    <span>
                      <IconButton
                        onClick={handleNext}
                        disabled={!completed[activeStep]}
                        size="small"
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Help">
                    <IconButton 
                      size="small"
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Progress stepper */}
              <Stepper 
                activeStep={activeStep} 
                sx={{ mb: 3 }}
              >
                {lesson.steps.map((step, index) => (
                  <Step 
                    key={index} 
                    completed={completed[index]}
                  >
                    <StepLabel>
                      {step.type === 'shortcut' ? 'Shortcut' : 'Quiz'}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step content */}
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Fade in={!loading} timeout={300}>
                  <Box>
                    {renderStepContent(
                      lesson.steps[activeStep], 
                      activeStep,
                    )}
                  </Box>
                </Fade>
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        )}

        {showSummary && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1 }}
          >
            <LessonSummary
              title={lesson.title}
              description={lesson.description}
              performance={performance}
              onNext={handleComplete}
              onReplay={handleReset}
              onHome={handleExit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default EnhancedLessonFlow;

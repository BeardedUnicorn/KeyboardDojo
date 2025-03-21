import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Button, CircularProgress, Fade, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Flag as FlagIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

// Import the real component types, but we'll implement our own version
import type { LessonPerformance } from '@/components/curriculum/EnhancedLessonFlow';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ILessonStep } from '@/types/curriculum/lesson/ILessonStep';

// Define our own types for mocking
interface MockLessonStep extends Omit<ILessonStep, 'type'> {
  type: 'shortcut' | 'quiz' | 'info' | 'instruction';
  content?: string;
  shortcutId?: string;
}

interface MockLesson extends Omit<ILesson, 'steps'> {
  steps: MockLessonStep[];
}

// Mock components for the test version
const EnhancedQuizExercise = ({ 
  title, 
  question, 
  options, 
  onSuccess,
  onFailure
}: {
  title: string;
  question: string;
  options: string[];
  onSuccess: () => void;
  onFailure?: () => void;
}) => {
  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>{question}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        {options.map((option, index) => (
          <Button 
            key={index} 
            variant="outlined" 
            onClick={onSuccess}
            fullWidth
          >
            {option}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const EnhancedShortcutExercise = ({ 
  title, 
  description, 
  shortcut, 
  onSuccess,
  onFailure
}: {
  title: string;
  description: string;
  shortcut?: IShortcut;
  onSuccess: () => void;
  onFailure?: () => void;
}) => {
  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>{description}</Typography>
      {shortcut && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1">Shortcut: {shortcut.name}</Typography>
          <Typography variant="body2">Windows: {shortcut.shortcutWindows}</Typography>
          <Typography variant="body2">Mac: {shortcut.shortcutMac || shortcut.shortcutWindows}</Typography>
        </Box>
      )}
      <Button variant="contained" color="primary" onClick={onSuccess} sx={{ mt: 3 }}>
        Simulate Shortcut Success
      </Button>
    </Box>
  );
};

const LessonIntroduction = ({ 
  title, 
  description, 
  shortcuts, 
  onContinue 
}: {
  title: string;
  description: string;
  shortcuts: IShortcut[];
  onContinue: () => void;
}) => {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{title}</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>{description}</Typography>
      
      {shortcuts && shortcuts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Shortcuts You'll Learn:</Typography>
          {shortcuts.map((shortcut, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1">{shortcut.name}</Typography>
              <Typography variant="body2">{shortcut.description}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                <Typography variant="caption">Windows: {shortcut.shortcutWindows}</Typography>
                <Typography variant="caption">Mac: {shortcut.shortcutMac || shortcut.shortcutWindows}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      
      <Button variant="contained" color="primary" onClick={onContinue}>
        Start Lesson
      </Button>
    </Box>
  );
};

const LessonSummary = ({ 
  title, 
  description,
  performance, 
  onNext, 
  onReplay, 
  onHome 
}: {
  title: string;
  description: string;
  performance: LessonPerformance;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}) => {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Lesson Complete!</Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>{title}</Typography>
      
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Your Performance</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
          <Box>
            <Typography variant="h4">{performance.correctAnswers}/{performance.totalQuestions}</Typography>
            <Typography variant="body2">Correct Answers</Typography>
          </Box>
          <Box>
            <Typography variant="h4">{performance.xpEarned}</Typography>
            <Typography variant="body2">XP Earned</Typography>
          </Box>
          <Box>
            <Typography variant="h4">{performance.stars} ★</Typography>
            <Typography variant="body2">Stars</Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={onHome} startIcon={<HomeIcon />}>
          Home
        </Button>
        <Button variant="outlined" onClick={onReplay} startIcon={<RefreshIcon />}>
          Replay
        </Button>
        <Button variant="contained" color="primary" onClick={onNext} endIcon={<ArrowForwardIcon />}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

// Create a test-specific version of EnhancedLessonFlow that doesn't rely on external services
const TestEnhancedLessonFlow = ({
  lesson,
  onComplete,
  onExit,
}: {
  lesson: MockLesson;
  onComplete: (performance: LessonPerformance) => void;
  onExit: () => void;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [performance, setPerformance] = useState<LessonPerformance>({
    lessonId: lesson.id,
    completed: false,
    correctAnswers: 0,
    totalQuestions: lesson.steps.length,
    timeSpent: 0,
    xpEarned: lesson.xpReward,
    gemsEarned: Math.round(lesson.xpReward / 10),
    stars: 3,
    shortcutsMastered: lesson.steps
      .filter(step => step.type === 'shortcut' && step.shortcut)
      .map(step => step.shortcut)
      .filter((shortcut): shortcut is NonNullable<typeof shortcut> => shortcut !== null)
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    console.log('[Mock] Audio service - playing success sound');
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

    console.log('[Mock] Audio service - playing success sound');

    // Move to next step after a short delay
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleStepFailure = () => {
    console.log('[Mock] Audio service - playing error sound');
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setShowSummary(false);
  };

  const handleExit = () => {
    onExit();
  };

  const handleComplete = () => {
    onComplete(performance);
  };

  const renderStepContent = (step: MockLessonStep, index: number) => {
    switch (step.type) {
      case 'shortcut':
        return (
          <EnhancedShortcutExercise
            title={step.title || `Exercise ${index + 1}`}
            description={step.content || ''}
            shortcut={step.shortcut}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
          />
        );
      case 'quiz':
        return (
          <EnhancedQuizExercise
            title={step.title || `Quiz ${index + 1}`}
            question={step.question || ''}
            options={step.options?.map(o => typeof o === 'string' ? o : o.text) || []}
            onSuccess={handleStepSuccess}
            onFailure={handleStepFailure}
          />
        );
      case 'instruction':
        return (
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6">Instruction</Typography>
            <Typography variant="body1" sx={{ my: 2 }}>{step.content}</Typography>
            <Button variant="contained" color="primary" onClick={handleStepSuccess}>
              Continue
            </Button>
          </Box>
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
              .filter((shortcut): shortcut is NonNullable<typeof shortcut> => shortcut !== null)}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
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

// Create a mock Redux store with required state
const createMockStore = () => {
  return configureStore({
    reducer: {
      achievements: (state = {
        achievements: [
          { id: 'shortcut-master', progress: 15, totalRequired: 50, completed: false },
          { id: 'beginner-shortcuts', progress: 5, totalRequired: 10, completed: false }
        ],
        unlockedAchievements: [],
        completedAchievements: [],
        isLoading: false,
        isInitialized: true
      }) => state,
      userProgress: (state = {
        level: 5,
        xp: 1250,
        completedLessons: [],
        completedModules: [],
        completedNodes: [],
        currentLessons: [],
        totalLessonsCompleted: 15,
        streak: 7,
        streakDays: 7,
        hearts: { current: 5, max: 5 },
        currency: 100,
        lastActive: new Date().toISOString(),
        isLoading: false,
        isInitialized: true
      }) => state,
      app: (state = {
        isInitialized: true,
        isLoading: false,
        isOnline: true,
        errors: [],
        notifications: [],
        currentModal: null,
        modalData: null
      }) => state
    }
  });
};

// Mock shortcuts data
const mockShortcuts: IShortcut[] = [
  {
    id: 'goto-line',
    name: 'Go to Line',
    description: 'Jump to a specific line number',
    category: 'Navigation',
    shortcutWindows: 'Ctrl+G',
    shortcutMac: 'Cmd+G',
  },
  {
    id: 'find',
    name: 'Find',
    description: 'Search for text in current file',
    category: 'Search',
    shortcutWindows: 'Ctrl+F',
    shortcutMac: 'Cmd+F',
  },
  {
    id: 'save-file',
    name: 'Save File',
    description: 'Save the current file',
    category: 'File',
    shortcutWindows: 'Ctrl+S',
    shortcutMac: 'Cmd+S',
  },
  {
    id: 'format-document',
    name: 'Format Document',
    description: 'Format the current document',
    category: 'Editing',
    shortcutWindows: 'Shift+Alt+F',
    shortcutMac: 'Shift+Option+F',
  },
];

// Creates a base lesson with common properties
const createBaseLesson = (difficulty: DifficultyLevel): MockLesson => ({
  id: `lesson-${difficulty}`,
  title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Lesson`,
  description: `This is a ${difficulty} level lesson to help you learn keyboard shortcuts`,
  difficulty,
  estimatedTime: difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 10 : 15,
  xpReward: difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 100 : 150,
  steps: createLessonSteps(difficulty),
});

// Creates lesson steps based on difficulty
function createLessonSteps(difficulty: DifficultyLevel): MockLessonStep[] {
  const stepsMap: Record<DifficultyLevel, MockLessonStep[]> = {
    beginner: [
      {
        id: `beginner-intro`,
        type: 'instruction' as const,
        content: 'Welcome to this beginner lesson! In this lesson, you will learn basic keyboard shortcuts.',
      },
      {
        id: `beginner-save`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[2],
        content: 'Let\'s start with saving a file. Use the keyboard shortcut to save your work.',
      },
      {
        id: `beginner-quiz`,
        type: 'quiz' as const,
        question: 'What is the keyboard shortcut for saving a file on Windows?',
        options: ['Ctrl+S', 'Ctrl+F', 'Ctrl+W', 'Ctrl+O'],
        correctAnswer: 0,
      },
    ],
    intermediate: [
      {
        id: `intermediate-intro`,
        type: 'instruction' as const,
        content: 'Welcome to the intermediate lesson! You\'ll learn more advanced shortcuts in this lesson.',
      },
      {
        id: `intermediate-find`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[1],
        content: 'Let\'s practice searching in a file. Use the keyboard shortcut to open the search dialog.',
      },
      {
        id: `intermediate-format`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[3],
        content: 'Now, let\'s format the document. Use the keyboard shortcut to format the current file.',
      },
      {
        id: `intermediate-quiz`,
        type: 'quiz' as const,
        question: 'What is the keyboard shortcut for formatting a document on Mac?',
        options: ['Cmd+F', 'Shift+Option+F', 'Cmd+Shift+P', 'Option+F'],
        correctAnswer: 1,
      },
    ],
    advanced: [
      {
        id: `advanced-intro`,
        type: 'instruction' as const,
        content: 'Welcome to the advanced lesson! We\'ll cover complex shortcuts and combinations.',
      },
      {
        id: `advanced-goto`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[0],
        content: 'Let\'s practice navigation. Use the keyboard shortcut to go to a specific line number.',
      },
      {
        id: `advanced-find`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[1],
        content: 'Now let\'s search for text. Use the keyboard shortcut to find text in the current file.',
      },
      {
        id: `advanced-format`,
        type: 'shortcut' as const,
        shortcut: mockShortcuts[3],
        content: 'Format the document using the keyboard shortcut.',
      },
      {
        id: `advanced-quiz`,
        type: 'quiz' as const,
        question: 'Which of the following is NOT a valid keyboard shortcut in most code editors?',
        options: ['Ctrl+G', 'Alt+Shift+U', 'Ctrl+F', 'Ctrl+S'],
        correctAnswer: 1,
      },
    ],
    expert: []
  };

  return stepsMap[difficulty];
}

// Define component metadata
const meta = {
  title: 'Curriculum/EnhancedLessonFlow',
  component: TestEnhancedLessonFlow,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onComplete: { action: 'onComplete' },
    onExit: { action: 'onExit' },
  },
  decorators: [
    (Story) => {
      const store = createMockStore();
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} satisfies Meta<typeof TestEnhancedLessonFlow>;

export default meta;

// Create stories
type Story = StoryObj<typeof meta>;

export const BeginnerLesson: Story = {
  args: {
    lesson: createBaseLesson('beginner'),
    onComplete: (performance: LessonPerformance) => console.log('Lesson completed', performance),
    onExit: () => console.log('Exited lesson'),
  },
};

export const IntermediateLesson: Story = {
  args: {
    lesson: createBaseLesson('intermediate'),
    onComplete: (performance: LessonPerformance) => console.log('Lesson completed', performance),
    onExit: () => console.log('Exited lesson'),
  },
};

export const AdvancedLesson: Story = {
  args: {
    lesson: createBaseLesson('advanced'),
    onComplete: (performance: LessonPerformance) => console.log('Lesson completed', performance),
    onExit: () => console.log('Exited lesson'),
  },
}; 
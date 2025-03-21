import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel, Container, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider, Grid, LinearProgress, Chip } from '@mui/material';
import { Check as CheckIcon, Lock as LockIcon, PlayArrow as PlayIcon, School as SchoolIcon, Done as DoneIcon, Timer as TimerIcon, EmojiEvents as TrophyIcon, Lightbulb as LightbulbIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { 
  CurriculumView, 
  LessonIntroduction, 
  EnhancedLessonFlow,
  LessonSummary
} from '../../components/curriculum';

import {
  EnhancedQuizExercise,
  EnhancedShortcutExercise
} from '../../components/exercises';

// Mock Data
const mockTopics = [
  {
    id: 'basics',
    title: 'Keyboard Basics',
    description: 'Learn the fundamentals of keyboard usage',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Home Row Position',
        description: 'Learn the proper finger positioning on the home row',
        difficulty: 'beginner',
        estimatedTime: 10,
        status: 'completed',
        type: 'keyboard',
        prerequisites: []
      },
      {
        id: 'lesson-2',
        title: 'Common Shortcuts',
        description: 'Learn the most commonly used keyboard shortcuts',
        difficulty: 'beginner',
        estimatedTime: 15,
        status: 'available',
        type: 'shortcut',
        prerequisites: ['lesson-1']
      },
      {
        id: 'lesson-3',
        title: 'Text Selection',
        description: 'Master text selection techniques',
        difficulty: 'intermediate',
        estimatedTime: 20,
        status: 'locked',
        type: 'keyboard',
        prerequisites: ['lesson-2']
      }
    ]
  },
  {
    id: 'ide',
    title: 'IDE Navigation',
    description: 'Navigate your IDE efficiently',
    lessons: [
      {
        id: 'lesson-4',
        title: 'File Navigation',
        description: 'Navigate between files quickly',
        difficulty: 'intermediate',
        estimatedTime: 15,
        status: 'locked',
        type: 'shortcut',
        prerequisites: ['lesson-2']
      }
    ]
  }
];

const mockLesson = {
  id: 'lesson-2',
  title: 'Common Shortcuts',
  description: 'Learn the most commonly used keyboard shortcuts',
  difficulty: 'beginner',
  estimatedTime: 15,
  content: 'In this lesson, you will learn the most common keyboard shortcuts used in modern applications.',
  objectives: [
    'Understand copy, cut, paste shortcuts',
    'Learn undo and redo operations',
    'Master save and select all shortcuts'
  ],
  prerequisites: ['Home Row Position'],
  steps: [
    {
      type: 'introduction',
      content: 'Let\'s start by learning about copy, cut, and paste shortcuts.'
    },
    {
      type: 'shortcut-exercise',
      shortcut: 'Ctrl+C',
      description: 'Copy selected text',
      instruction: 'Press the shortcut for copying text'
    },
    {
      type: 'shortcut-exercise',
      shortcut: 'Ctrl+V',
      description: 'Paste copied text',
      instruction: 'Press the shortcut for pasting text'
    },
    {
      type: 'quiz',
      question: 'What shortcut is used to undo an action?',
      options: ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+U', 'Ctrl+A'],
      answer: 0
    },
    {
      type: 'quiz',
      question: 'What shortcut is used to save a file?',
      options: ['Ctrl+S', 'Ctrl+F', 'Ctrl+O', 'Ctrl+W'],
      answer: 0
    }
  ]
};

const mockShortcutExerciseData = {
  id: 'shortcut-1',
  shortcut: 'Ctrl+C',
  description: 'Copy selected text',
  instruction: 'Press the shortcut for copying text',
  attempts: 0,
  maxAttempts: 3
};

const mockQuizData = {
  id: 'quiz-1',
  question: 'What shortcut is used to undo an action?',
  options: ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+U', 'Ctrl+A'],
  answer: 0
};

const mockSummaryData = {
  lessonId: 'lesson-2',
  title: 'Common Shortcuts',
  score: 90,
  timeSpent: 720, // in seconds
  errors: 2,
  completedSteps: 5,
  totalSteps: 5,
  nextLessonId: 'lesson-3',
  nextLessonTitle: 'Text Selection',
  recommendations: [
    'Practice the Ctrl+X shortcut more',
    'Try the advanced shortcuts lesson next'
  ]
};

// Mock Redux Store for context only, not actual usage
const createMockStore = () => {
  return configureStore({
    reducer: {
      curriculum: (state = {
        topics: mockTopics,
        currentTopic: mockTopics[0],
        isLoading: false,
        error: null
      }, action) => state,
      userProgress: (state = {
        completedLessons: [
          { id: 'lesson-1', lessonId: 'lesson-1', score: 85, timeSpent: 300, errorsCount: 5, completedAt: new Date().toISOString() }
        ],
        currentLessonProgress: {
          lessonId: 'lesson-2',
          currentStep: 0,
          totalSteps: 5,
          score: 0,
          startedAt: new Date().toISOString()
        },
        achievements: [],
        isLoading: false,
        error: null
      }, action) => state
    }
  });
};

// ---- Mock Component Representations ---- //

// Mock CurriculumView
const MockCurriculumView = () => (
  <Box>
    {mockTopics.map((topic) => (
      <Card key={topic.id} sx={{ mb: 3, bgcolor: '#f9f9f9' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {topic.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {topic.description}
          </Typography>
          
          <List>
            {topic.lessons.map((lesson) => (
              <ListItem key={lesson.id} sx={{ 
                bgcolor: lesson.status === 'completed' ? '#e8f5e9' : 
                          lesson.status === 'available' ? '#fff8e1' : '#f5f5f5',
                borderRadius: 1,
                mb: 1
              }}>
                <ListItemIcon>
                  {lesson.status === 'completed' ? <CheckIcon color="success" /> : 
                   lesson.status === 'available' ? <PlayIcon color="primary" /> : 
                   <LockIcon color="disabled" />}
                </ListItemIcon>
                <ListItemText 
                  primary={lesson.title} 
                  secondary={`${lesson.difficulty} · ${lesson.estimatedTime} min`}
                />
                <Chip 
                  label={lesson.status} 
                  size="small"
                  color={lesson.status === 'completed' ? 'success' : 
                         lesson.status === 'available' ? 'primary' : 'default'}
                  variant={lesson.status === 'locked' ? 'outlined' : 'filled'}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    ))}
  </Box>
);

// Mock LessonIntroduction
const MockLessonIntroduction = ({ lesson }: { lesson: typeof mockLesson }) => (
  <Box>
    <Typography variant="h5" gutterBottom>{lesson.title}</Typography>
    <Chip 
      icon={<TimerIcon />} 
      label={`${lesson.estimatedTime} min`} 
      color="primary" 
      size="small" 
      sx={{ mb: 2, mr: 1 }} 
    />
    <Chip 
      label={lesson.difficulty} 
      color="secondary" 
      size="small"
      sx={{ mb: 2 }} 
    />
    
    <Typography variant="body1" paragraph>
      {lesson.description}
    </Typography>
    
    <Typography variant="subtitle1" gutterBottom>
      Objectives
    </Typography>
    <List dense>
      {lesson.objectives.map((objective, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <LightbulbIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary={objective} />
        </ListItem>
      ))}
    </List>
    
    <Divider sx={{ my: 2 }} />
    
    <Typography variant="subtitle1" gutterBottom>
      Prerequisites
    </Typography>
    <List dense>
      {lesson.prerequisites.map((prereq, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <CheckIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText primary={prereq} />
        </ListItem>
      ))}
    </List>
    
    <Button 
      variant="contained" 
      color="primary" 
      startIcon={<PlayIcon />}
      sx={{ mt: 2 }}
    >
      Start Lesson
    </Button>
  </Box>
);

// Mock ShortcutExercise
const MockShortcutExercise = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Shortcut Exercise</Typography>
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" gutterBottom>Press the shortcut for copying text:</Typography>
        <Typography variant="h4" sx={{ my: 2, fontFamily: 'monospace' }}>
          Ctrl + C
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          my: 3 
        }}>
          <Chip label="Ctrl" sx={{ fontSize: '1.2rem', px: 2, py: 3 }} />
          <Typography variant="h6" sx={{ lineHeight: '36px' }}>+</Typography>
          <Chip label="C" sx={{ fontSize: '1.2rem', px: 2, py: 3 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Attempts: 0/3
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Mock QuizExercise
const MockQuizExercise = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Quiz Question</Typography>
      <Box sx={{ py: 2 }}>
        <Typography variant="body1" paragraph>
          What shortcut is used to undo an action?
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {['Ctrl+Z', 'Ctrl+Y', 'Ctrl+U', 'Ctrl+A'].map((option, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Button 
                variant={i === 0 ? "contained" : "outlined"}
                fullWidth
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                {option}
              </Button>
            </Grid>
          ))}
        </Grid>
        
        <Typography 
          variant="body2" 
          color="success.main" 
          sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
        >
          <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> 
          Correct! Ctrl+Z is the standard shortcut for undoing an action.
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Mock LessonFlow
const MockLessonFlow = () => (
  <Box>
    <LinearProgress 
      variant="determinate" 
      value={100} 
      sx={{ mb: 2, height: 10, borderRadius: 5 }} 
    />
    <Typography variant="body2" align="center" sx={{ mb: 2 }}>
      Step 5/5 Completed
    </Typography>
    <Box sx={{ textAlign: 'center' }}>
      <CheckIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        All Steps Completed!
      </Typography>
      <Typography variant="body2" paragraph>
        You've completed all exercises in this lesson.
      </Typography>
    </Box>
  </Box>
);

// Mock LessonSummary
const MockLessonSummary = ({ data }: { data: typeof mockSummaryData }) => (
  <Box>
    <Typography variant="h5" gutterBottom>
      {data.title} - Completed!
    </Typography>
    
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrophyIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>{data.score}%</Typography>
            <Typography variant="body2" color="text.secondary">Score</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TimerIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>{Math.floor(data.timeSpent / 60)}:{(data.timeSpent % 60).toString().padStart(2, '0')}</Typography>
            <Typography variant="body2" color="text.secondary">Time Spent</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <SchoolIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>{data.completedSteps}/{data.totalSteps}</Typography>
            <Typography variant="body2" color="text.secondary">Steps Completed</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
    <Typography variant="subtitle1" gutterBottom>
      Recommendations
    </Typography>
    <List>
      {data.recommendations.map((rec, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <LightbulbIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={rec} />
        </ListItem>
      ))}
    </List>
    
    <Divider sx={{ my: 2 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button variant="outlined" startIcon={<PlayIcon />}>
        Try Again
      </Button>
      <Button 
        variant="contained" 
        endIcon={<ArrowForwardIcon />}
        color="primary"
      >
        Continue to {data.nextLessonTitle}
      </Button>
    </Box>
  </Box>
);

// Curriculum Flow Component
const CurriculumFlowSimulation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [exerciseType, setExerciseType] = useState<string | null>(null);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  
  const steps = [
    'Curriculum View',
    'Lesson Introduction',
    'Exercise',
    'Lesson Summary'
  ];
  
  const handleNext = () => {
    if (activeStep === 2 && !exerciseCompleted) {
      setExerciseCompleted(true);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep === 2 && exerciseCompleted) {
      setExerciseCompleted(false);
    } else {
      setActiveStep((prevStep) => Math.max(0, prevStep - 1));
    }
  };
  
  const handleLessonSelect = () => {
    setActiveStep(1);
  };
  
  const handleExerciseSelect = (type: string) => {
    setExerciseType(type);
    setActiveStep(2);
  };
  
  const handleFinishLesson = () => {
    setActiveStep(3);
  };
  
  const handleRestart = () => {
    setActiveStep(0);
    setExerciseType(null);
    setExerciseCompleted(false);
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Curriculum View</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              The CurriculumView component displays all available topics and lessons. 
              Users can browse through topics and select a lesson to start.
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
              <MockCurriculumView />
            </Box>
            <Button 
              variant="contained" 
              onClick={handleLessonSelect}
              sx={{ mt: 2 }}
            >
              Select "Common Shortcuts" Lesson
            </Button>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Lesson Introduction</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              The LessonIntroduction component provides an overview of the lesson,
              including objectives, prerequisites, and difficulty level.
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
              <MockLessonIntroduction lesson={mockLesson} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => handleExerciseSelect('shortcut')}
              >
                Start Shortcut Exercise
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleExerciseSelect('quiz')}
              >
                Start Quiz Exercise
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Exercise</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Based on the lesson content, different exercise types can be presented to the user.
            </Typography>
            
            {exerciseType === 'shortcut' && !exerciseCompleted && (
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
                <MockShortcutExercise />
              </Box>
            )}
            
            {exerciseType === 'quiz' && !exerciseCompleted && (
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
                <MockQuizExercise />
              </Box>
            )}
            
            {exerciseCompleted && (
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Exercise Completed!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    You've successfully completed this exercise. In a real lesson flow,
                    this would lead to the next exercise or the lesson summary.
                  </Typography>
                  <MockLessonFlow />
                </Container>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              onClick={handleFinishLesson}
              sx={{ mt: 2 }}
              disabled={!exerciseCompleted}
            >
              Finish Lesson
            </Button>
          </Box>
        )}
        
        {activeStep === 3 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Lesson Summary</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              After completing all exercises, the LessonSummary component displays 
              performance metrics and recommendations for next steps.
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 3 }}>
              <MockLessonSummary data={mockSummaryData} />
            </Box>
            <Button 
              variant="contained" 
              onClick={handleRestart}
              sx={{ mt: 2 }}
            >
              Start Over
            </Button>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleNext}
          disabled={activeStep === 3 || (activeStep === 2 && !exerciseCompleted)}
        >
          Next
        </Button>
      </Box>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Component Integration Flow
        </Typography>
        <Typography variant="body2">
          This story demonstrates how different components in the curriculum flow 
          interact with each other, following a user's journey from browsing 
          the curriculum to completing a lesson. The integration showcases how 
          data and state are passed between components to create a cohesive learning experience.
        </Typography>
      </Box>
    </Box>
  );
};

// StoryBook wrapper component with Redux Provider
const StoryWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Provider store={createMockStore()}>
    {children}
  </Provider>
);

const meta = {
  title: 'Integration/Curriculum Flow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstrates the curriculum navigation flow from topic selection to lesson completion.',
      },
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CurriculumFlowSimulation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteFlow: Story = {
  render: () => <CurriculumFlowSimulation />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the complete curriculum flow from start to finish, including all transition states.',
      },
    },
  },
}; 
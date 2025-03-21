import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Container, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { EnhancedLessonFlow } from '../../components/curriculum';
import type { IShortcut } from '../../types/curriculum/IShortcut';
import type { DifficultyLevel } from '../../types/curriculum/DifficultyLevel';
import type { ILessonStep } from '../../types/curriculum/lesson/ILessonStep';
import type { ILesson } from '../../types/curriculum/lesson/ILesson';

// Mock shortcut
const mockShortcut: IShortcut = {
  id: 'ctrl-c',
  name: 'Copy',
  shortcutWindows: 'Ctrl+C',
  shortcutMac: '⌘+C',
  shortcutLinux: 'Ctrl+C',
  description: 'Copy selected text or item',
  category: 'BASICS',
  context: 'text-editor'
};

// Mock lesson content
const mockLessonContent: ILesson = {
  id: 'keyboard-basics-101',
  title: 'Keyboard Basics 101',
  description: 'Learn the fundamentals of keyboard shortcuts',
  difficulty: 'beginner' as DifficultyLevel,
  estimatedTime: 15, // minutes
  prerequisites: [],
  xpReward: 100,
  steps: [
    {
      id: 'step-1',
      type: 'info' as const,
      title: 'Introduction to Keyboard Shortcuts',
      context: `
        <h2>Why Keyboard Shortcuts Matter</h2>
        <p>Keyboard shortcuts allow you to perform actions quickly without using the mouse, significantly improving your productivity.</p>
        <p>In this lesson, you'll learn the most essential shortcuts that work across many applications.</p>
      `
    },
    {
      id: 'copy-paste',
      type: 'info' as const,
      title: 'Copy, Cut, and Paste',
      context: `
        <h2>The Foundation of Text Editing</h2>
        <p>These three shortcuts form the foundation of text editing:</p>
        <div class="shortcut-list">
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">C</span>
            </div>
            <div class="description">Copy selected text</div>
          </div>
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">X</span>
            </div>
            <div class="description">Cut selected text</div>
          </div>
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">V</span>
            </div>
            <div class="description">Paste from clipboard</div>
          </div>
        </div>
        <p>On macOS, replace <span class="key">Ctrl</span> with <span class="key">⌘ Command</span>.</p>
      `
    },
    {
      id: 'undo-redo',
      type: 'info' as const,
      title: 'Undo and Redo',
      context: `
        <h2>Fixing Mistakes and Recovering Changes</h2>
        <p>These shortcuts help you recover from mistakes or restore changes:</p>
        <div class="shortcut-list">
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">Z</span>
            </div>
            <div class="description">Undo last action</div>
          </div>
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">Y</span>
            </div>
            <div class="description">Redo last undone action</div>
          </div>
          <div class="shortcut-item">
            <div class="keys">
              <span class="key">Ctrl</span> + <span class="key">Shift</span> + <span class="key">Z</span>
            </div>
            <div class="description">Alternative Redo (used in some applications)</div>
          </div>
        </div>
        <p>On macOS, replace <span class="key">Ctrl</span> with <span class="key">⌘ Command</span>.</p>
      `
    },
    {
      id: 'quiz-1',
      type: 'quiz' as const,
      title: 'Test Your Knowledge',
      question: 'Which keyboard shortcut is used to copy selected text?',
      options: [
        { id: 'a', text: 'Ctrl + C' },
        { id: 'b', text: 'Ctrl + V' },
        { id: 'c', text: 'Ctrl + X' },
        { id: 'd', text: 'Ctrl + Z' },
      ],
      correctAnswer: 0, // Index of the correct option (Ctrl + C)
      explanation: 'Ctrl + C (⌘ + C on Mac) is used to copy selected text to the clipboard.'
    },
    {
      id: 'practice-1',
      type: 'shortcut' as const,
      title: 'Practice: Copy & Paste',
      description: 'Practice using copy and paste shortcuts by copying the text below and pasting it into the input field.',
      shortcut: mockShortcut,
      context: 'Practice makes perfect!',
      codeContext: {
        language: 'javascript',
        code: 'const text = "Practice makes perfect!";'
      }
    }
  ]
};

// Create a mock Redux store with necessary hooks
const createMockStore = (initialStep = 0) => {
  return configureStore({
    reducer: {
      app: () => ({
        isInitialized: true,
        isLoading: false,
        error: null,
        messages: [],
        theme: 'light',
        showTutorial: false,
        version: '1.0.0',
        notification: null
      }),
      curriculum: () => ({
        activeCurriculum: {
          id: 'default-curriculum',
          name: 'Default Curriculum',
          description: 'A comprehensive keyboard shortcut curriculum',
          version: '1.0.0',
          lessons: [mockLessonContent]
        },
        currentCurriculum: {
          id: 'default-curriculum',
          name: 'Default Curriculum',
          description: 'A comprehensive keyboard shortcut curriculum',
          version: '1.0.0',
          lessons: [mockLessonContent]
        },
        tracks: [
          {
            id: 'vscode',
            name: 'VS Code',
            description: 'Visual Studio Code shortcuts'
          }
        ],
        topics: [],
        lessons: [mockLessonContent],
        isLoading: false,
        error: null
      }),
      progress: () => ({
        userProgress: {
          level: 3,
          xp: 350,
          streakDays: 5,
          totalLessonsCompleted: 12,
          achievements: [],
          lessonProgress: {
            'keyboard-basics-101': {
              currentStep: initialStep,
              completed: false,
              quizScore: null,
              practiceScore: null
            }
          },
          completedLessons: [],
          currentLessons: [
            {
              lessonId: 'keyboard-basics-101',
              trackId: 'vscode',
              progress: 0
            }
          ]
        },
        isLoading: false,
        error: null,
        currentLessonId: 'keyboard-basics-101',
        lastCompletedLessonId: null,
        completedLessons: [],
        currentLessons: [
          {
            lessonId: 'keyboard-basics-101',
            trackId: 'vscode',
            progress: 0
          }
        ]
      }),
      // Mock the useAchievementsRedux hook
      achievements: () => ({
        achievements: [],
        recentAchievements: [],
        isLoading: false,
        error: null,
        updateAchievements: () => {},
        awardAchievement: (achievementId: string) => {
          console.log(`Achievement awarded: ${achievementId}`);
        }
      }),
      user: () => ({
        isLoggedIn: true,
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@keyboarddojo.com',
          profileImage: null,
          preferences: {
            theme: 'light',
            notifications: true
          },
          subscription: {
            isPremium: true,
            plan: 'pro',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          achievements: []
        },
        isLoading: false,
        error: null
      }),
      // Mock for audio service
      audio: () => ({
        volume: 0.5,
        muted: false,
        playSound: (sound: string) => {
          console.log(`Playing sound: ${sound}`);
        }
      })
    }
  });
};

interface EnhancedLessonFlowStoryProps {
  initialStep?: number;
  allowSkipping?: boolean;
  showControls?: boolean;
}

const EnhancedLessonFlowStory: React.FC<EnhancedLessonFlowStoryProps> = ({
  initialStep = 0,
  allowSkipping = true,
  showControls = true
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [store] = useState(() => createMockStore(initialStep));
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, mockLessonContent.steps.length - 1));
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const handleFinish = () => {
    console.log('Lesson completed');
    alert('Lesson completed! Great job!');
  };
  
  const handleJumpToStep = (step: number) => {
    if (allowSkipping || step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };
  
  return (
    <Provider store={store}>
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h4" gutterBottom>
            Lesson: {mockLessonContent.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {mockLessonContent.description}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <EnhancedLessonFlow 
              lesson={mockLessonContent}
              onComplete={(performance) => {
                console.log('Lesson completed:', performance);
                handleFinish();
              }}
              onExit={() => {
                console.log('Lesson exited');
                alert('Lesson exited');
              }}
            />
          </Box>
          
          {showControls && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />} 
                onClick={handleNext}
                disabled={currentStep === mockLessonContent.steps.length - 1}
              >
                Next
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Provider>
  );
};

const meta: Meta<typeof EnhancedLessonFlowStory> = {
  title: 'Advanced/Curriculum/EnhancedLessonFlow',
  component: EnhancedLessonFlowStory,
  parameters: {
    layout: 'fullscreen',
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        component: 'An enhanced lesson flow component that guides users through content, quizzes, and practice exercises.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialStep: 0,
    allowSkipping: true,
    showControls: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const StartAtContentStep: Story = {
  args: {
    initialStep: 1,
    allowSkipping: true,
    showControls: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const StartAtQuizStep: Story = {
  args: {
    initialStep: 3,
    allowSkipping: true,
    showControls: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const StartAtPracticeStep: Story = {
  args: {
    initialStep: 4,
    allowSkipping: true,
    showControls: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const NoSkipping: Story = {
  args: {
    initialStep: 0,
    allowSkipping: false,
    showControls: true
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const MinimalControls: Story = {
  args: {
    initialStep: 0,
    allowSkipping: true,
    showControls: false
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
}; 
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Paper, Typography } from '@mui/material';

import LessonSummary from '@/components/curriculum/LessonSummary';

// Create mock shortcut data
const mockShortcuts = [
  {
    id: 'copy',
    name: 'Copy',
    description: 'Copy selected text',
    category: 'Editing',
    shortcutWindows: 'Ctrl+C',
    shortcutMac: 'Cmd+C',
  },
  {
    id: 'paste',
    name: 'Paste',
    description: 'Paste from clipboard',
    category: 'Editing',
    shortcutWindows: 'Ctrl+V',
    shortcutMac: 'Cmd+V',
  },
  {
    id: 'cut',
    name: 'Cut',
    description: 'Cut selected text',
    category: 'Editing',
    shortcutWindows: 'Ctrl+X',
    shortcutMac: 'Cmd+X',
  },
  {
    id: 'find',
    name: 'Find',
    description: 'Search for text',
    category: 'Navigation',
    shortcutWindows: 'Ctrl+F',
    shortcutMac: 'Cmd+F',
  },
  {
    id: 'find-replace',
    name: 'Find and Replace',
    description: 'Search and replace text',
    category: 'Navigation',
    shortcutWindows: 'Ctrl+H',
    shortcutMac: 'Cmd+Opt+F',
  },
];

// Assessment result scenario props
interface ResultsScreenStoryProps {
  assessmentType: 'quiz' | 'challenge' | 'shortcut' | 'coding';
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs-improvement';
  showRecommendations?: boolean;
}

// Component to display assessment results using LessonSummary
const ResultsScreenStory: React.FC<ResultsScreenStoryProps> = ({
  assessmentType,
  performanceLevel,
  showRecommendations = true,
}) => {
  // Generate appropriate title and description based on assessment type
  const getTitleAndDescription = () => {
    switch (assessmentType) {
      case 'quiz':
        return {
          title: 'Keyboard Shortcuts Quiz Results',
          description: 'Results of your knowledge assessment on keyboard shortcuts',
        };
      case 'challenge':
        return {
          title: 'Timed Challenge Results',
          description: 'Results of your timed keyboard shortcut challenge',
        };
      case 'shortcut':
        return {
          title: 'Shortcut Master Assessment',
          description: 'Results of your shortcut mastery assessment',
        };
      case 'coding':
        return {
          title: 'Code Editor Efficiency Results',
          description: 'Results of your code editor efficiency assessment',
        };
      default:
        return {
          title: 'Assessment Results',
          description: 'Results of your assessment',
        };
    }
  };

  // Generate performance metrics based on performance level
  const getPerformanceData = () => {
    // Base values
    let correctAnswers = 0;
    let totalQuestions = 10;
    let timeSpent = 0;
    let xpEarned = 0;
    let gemsEarned = 0;
    let stars = 0;
    let shortcutsMastered = [];

    // Adjust values based on performance level
    switch (performanceLevel) {
      case 'excellent':
        correctAnswers = 10;
        timeSpent = 120; // 2 minutes
        xpEarned = 250;
        gemsEarned = 30;
        stars = 3;
        shortcutsMastered = [...mockShortcuts];
        break;
      case 'good':
        correctAnswers = 8;
        timeSpent = 180; // 3 minutes
        xpEarned = 175;
        gemsEarned = 20;
        stars = 2;
        shortcutsMastered = mockShortcuts.slice(0, 3);
        break;
      case 'average':
        correctAnswers = 6;
        timeSpent = 240; // 4 minutes
        xpEarned = 100;
        gemsEarned = 10;
        stars = 1;
        shortcutsMastered = mockShortcuts.slice(0, 1);
        break;
      case 'needs-improvement':
        correctAnswers = 3;
        timeSpent = 300; // 5 minutes
        xpEarned = 50;
        gemsEarned = 5;
        stars = 1;
        shortcutsMastered = [];
        break;
    }

    return {
      lessonId: `${assessmentType}-assessment`,
      completed: true,
      correctAnswers,
      totalQuestions,
      timeSpent,
      xpEarned,
      gemsEarned,
      stars,
      shortcutsMastered,
    };
  };

  const { title, description } = getTitleAndDescription();
  const performanceData = getPerformanceData();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Interactive Assessment Results
      </Typography>
      
      {showRecommendations && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          <Typography variant="body1" paragraph>
            {performanceLevel === 'excellent' && 'Excellent work! You\'ve mastered these shortcuts. Consider trying more advanced challenges.'}
            {performanceLevel === 'good' && 'Good progress! Practice the shortcuts you missed to improve your speed and accuracy.'}
            {performanceLevel === 'average' && 'You\'re making progress. Regular practice of these shortcuts will help you improve your efficiency.'}
            {performanceLevel === 'needs-improvement' && 'Keep practicing! Focus on a few shortcuts at a time to build your muscle memory.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Next recommended step: {
              performanceLevel === 'excellent' ? 'Advanced IDE Shortcuts Challenge' :
              performanceLevel === 'good' ? 'Shortcut Speed Drills' :
              performanceLevel === 'average' ? 'Basic Shortcut Review' :
              'Fundamentals of Keyboard Navigation'
            }
          </Typography>
        </Paper>
      )}
      
      <Box sx={{ mb: 4 }}>
        <LessonSummary
          title={title}
          description={description}
          performance={performanceData}
          onNext={() => console.log('Continue to next assessment')}
          onReplay={() => console.log('Repeat this assessment')}
          onHome={() => console.log('Return to home')}
        />
      </Box>
    </Container>
  );
};

// Storybook meta configuration
const meta = {
  title: 'Assessment/ResultsScreen',
  component: ResultsScreenStory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The ResultsScreen component displays detailed results after completing an assessment, including performance metrics, earned rewards, and personalized recommendations.',
      },
    },
  },
  argTypes: {
    assessmentType: {
      control: 'select',
      options: ['quiz', 'challenge', 'shortcut', 'coding'],
      description: 'Type of assessment completed',
    },
    performanceLevel: {
      control: 'select',
      options: ['excellent', 'good', 'average', 'needs-improvement'],
      description: 'Level of performance achieved',
    },
    showRecommendations: {
      control: 'boolean',
      description: 'Whether to show personalized recommendations',
    },
  },
} satisfies Meta<typeof ResultsScreenStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story variants
export const QuizExcellentResults: Story = {
  args: {
    assessmentType: 'quiz',
    performanceLevel: 'excellent',
    showRecommendations: true,
  },
};

export const ChallengeGoodResults: Story = {
  args: {
    assessmentType: 'challenge',
    performanceLevel: 'good',
    showRecommendations: true,
  },
};

export const ShortcutAverageResults: Story = {
  args: {
    assessmentType: 'shortcut',
    performanceLevel: 'average',
    showRecommendations: true,
  },
};

export const CodingNeedsImprovementResults: Story = {
  args: {
    assessmentType: 'coding',
    performanceLevel: 'needs-improvement',
    showRecommendations: true,
  },
};

export const MinimalResults: Story = {
  args: {
    assessmentType: 'quiz',
    performanceLevel: 'good',
    showRecommendations: false,
  },
}; 
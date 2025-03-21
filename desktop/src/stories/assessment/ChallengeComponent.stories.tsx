import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Paper, Typography, Divider, Stack, Chip, useTheme } from '@mui/material';
import { TimerOutlined as TimerIcon, EmojiEventsOutlined as TrophyIcon } from '@mui/icons-material';

import ShortcutChallenge from '@/components/exercises/ShortcutChallenge';

// Interface for challenge scenario
interface ChallengeScenario {
  id: string;
  shortcut: string;
  shortcutMac: string;
  description: string;
  context?: string;
  application: 'vscode' | 'intellij' | 'cursor';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Mock challenge scenarios
const vsCodeChallenges: ChallengeScenario[] = [
  {
    id: 'vsc1',
    shortcut: 'Ctrl+C',
    shortcutMac: 'Cmd+C',
    description: 'Copy selected text',
    application: 'vscode',
    difficulty: 'beginner',
  },
  {
    id: 'vsc2',
    shortcut: 'Ctrl+V',
    shortcutMac: 'Cmd+V',
    description: 'Paste from clipboard',
    application: 'vscode',
    difficulty: 'beginner',
  },
  {
    id: 'vsc3',
    shortcut: 'Ctrl+F',
    shortcutMac: 'Cmd+F',
    description: 'Find in file',
    context: 'const findThisText = "Search me with keyboard shortcuts";',
    application: 'vscode',
    difficulty: 'beginner',
  },
  {
    id: 'vsc4',
    shortcut: 'Alt+Shift+F',
    shortcutMac: 'Option+Shift+F',
    description: 'Format document',
    context: 'function messyCode(){const x=1;const y=2;return x+y;}',
    application: 'vscode',
    difficulty: 'intermediate',
  },
  {
    id: 'vsc5',
    shortcut: 'Ctrl+Shift+P',
    shortcutMac: 'Cmd+Shift+P',
    description: 'Show command palette',
    application: 'vscode',
    difficulty: 'intermediate',
  },
];

const cursorChallenges: ChallengeScenario[] = [
  {
    id: 'cursor1',
    shortcut: 'Ctrl+P',
    shortcutMac: 'Cmd+P',
    description: 'Quick open, go to file',
    application: 'cursor',
    difficulty: 'beginner',
  },
  {
    id: 'cursor2',
    shortcut: 'Ctrl+Shift+\\',
    shortcutMac: 'Cmd+Shift+\\',
    description: 'Jump to matching bracket',
    context: 'function example() { if (condition) { return true; } }',
    application: 'cursor',
    difficulty: 'intermediate',
  },
  {
    id: 'cursor3',
    shortcut: 'Ctrl+G',
    shortcutMac: 'Cmd+G',
    description: 'Go to line',
    application: 'cursor',
    difficulty: 'beginner',
  },
];

const intellijChallenges: ChallengeScenario[] = [
  {
    id: 'ij1',
    shortcut: 'Ctrl+N',
    shortcutMac: 'Cmd+N',
    description: 'Go to class',
    application: 'intellij',
    difficulty: 'beginner',
  },
  {
    id: 'ij2',
    shortcut: 'Alt+Enter',
    shortcutMac: 'Option+Enter',
    description: 'Show intention actions',
    context: 'String message = "Hello";',
    application: 'intellij',
    difficulty: 'intermediate',
  },
  {
    id: 'ij3',
    shortcut: 'Ctrl+Shift+A',
    shortcutMac: 'Cmd+Shift+A',
    description: 'Find action',
    application: 'intellij',
    difficulty: 'intermediate',
  },
];

// Props for the ChallengeComponent story
interface ChallengeComponentStoryProps {
  editorType: 'vscode' | 'cursor' | 'intellij';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  showKeyboard?: boolean;
  withTimer?: boolean;
  timerDuration?: number; // in seconds
}

// Challenge component wrapper
const ChallengeComponentStory: React.FC<ChallengeComponentStoryProps> = ({
  editorType = 'vscode',
  difficultyLevel = 'beginner',
  showKeyboard = true,
  withTimer = false,
  timerDuration = 30,
}) => {
  const theme = useTheme();
  
  // State for current challenges and index
  const [challenges] = useState(() => {
    switch (editorType) {
      case 'cursor':
        return cursorChallenges;
      case 'intellij':
        return intellijChallenges;
      default:
        return vsCodeChallenges;
    }
  });
  
  // Filter challenges by difficulty
  const filteredChallenges = challenges.filter(c => c.difficulty === difficultyLevel);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  
  // Get current challenge
  const currentChallenge = filteredChallenges[currentIndex] || challenges[0];
  
  // Handler functions
  const handleSuccess = () => {
    setScore(prev => prev + 10);
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      console.log('Challenge completed!');
    }
  };
  
  const handleSkip = () => {
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      console.log('Challenge skipped, final one!');
    }
  };
  
  const handleHint = () => {
    console.log('Hint requested');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          position: 'relative',
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            {editorType === 'vscode' ? 'VS Code' : 
             editorType === 'cursor' ? 'Cursor' : 'IntelliJ IDEA'} Shortcut Challenge
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              icon={<TrophyIcon />} 
              label={`Score: ${score}`} 
              color="primary" 
              variant="outlined" 
            />
            {withTimer && (
              <Chip 
                icon={<TimerIcon />} 
                label={`${timeRemaining}s`} 
                color={timeRemaining < 10 ? "error" : "default"} 
                variant="outlined" 
              />
            )}
          </Stack>
        </Box>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Practice your {editorType} keyboard shortcuts. Press the correct shortcut for each challenge.
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
          Challenge {currentIndex + 1} of {filteredChallenges.length} • {difficultyLevel} level
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ my: 4 }}>
          <ShortcutChallenge
            shortcut={currentChallenge.shortcut}
            shortcutMac={currentChallenge.shortcutMac}
            description={currentChallenge.description}
            context={currentChallenge.context}
            application={currentChallenge.application}
            showKeyboard={showKeyboard}
            onSuccess={handleSuccess}
            onSkip={handleSkip}
            onHint={handleHint}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Complete all challenges to earn XP and gems!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

// Storybook configuration
const meta = {
  title: 'Assessment/ChallengeComponent',
  component: ChallengeComponentStory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The ChallengeComponent lets users practice keyboard shortcuts in a gamified environment. It presents a series of shortcut challenges for different editors and difficulty levels.',
      },
    },
  },
  argTypes: {
    editorType: {
      control: 'select',
      options: ['vscode', 'cursor', 'intellij'],
      description: 'The type of editor shortcuts to practice',
    },
    difficultyLevel: {
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced'],
      description: 'Difficulty level of the shortcuts',
    },
    showKeyboard: {
      control: 'boolean',
      description: 'Whether to show keyboard visualization',
    },
    withTimer: {
      control: 'boolean',
      description: 'Whether to include a countdown timer',
    },
    timerDuration: {
      control: 'number',
      description: 'Timer duration in seconds',
    },
  },
} satisfies Meta<typeof ChallengeComponentStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story variants
export const VSCodeBeginnerChallenge: Story = {
  args: {
    editorType: 'vscode',
    difficultyLevel: 'beginner',
    showKeyboard: true,
    withTimer: false,
  },
};

export const CursorIntermediateChallenge: Story = {
  args: {
    editorType: 'cursor',
    difficultyLevel: 'intermediate',
    showKeyboard: true,
    withTimer: false,
  },
};

export const IntelliJChallenge: Story = {
  args: {
    editorType: 'intellij',
    difficultyLevel: 'intermediate',
    showKeyboard: true,
    withTimer: false,
  },
};

export const TimedChallenge: Story = {
  args: {
    editorType: 'vscode',
    difficultyLevel: 'beginner',
    showKeyboard: true,
    withTimer: true,
    timerDuration: 30,
  },
}; 
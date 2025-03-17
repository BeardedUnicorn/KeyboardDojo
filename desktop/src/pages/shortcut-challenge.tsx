import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Grid,
  Divider,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Refresh as ResetIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { ShortcutChallenge, IDESimulator } from '../components';
import HeartsDisplay from '../components/HeartsDisplay';
import { useHearts } from '../contexts/HeartsContext';

// Sample code for IDE simulator
const sampleJavaScriptCode = `// Sample JavaScript code
function calculateSum(a, b) {
  return a + b;
}

// Calculate the sum of two numbers
const num1 = 5;
const num2 = 10;
const sum = calculateSum(num1, num2);

console.log(\`The sum of \${num1} and \${num2} is \${sum}\`);

// More code below
function multiply(a, b) {
  return a * b;
}

const product = multiply(num1, num2);
console.log(\`The product of \${num1} and \${num2} is \${product}\`);
`;

// Sample challenges for VS Code
const vsCodeChallenges = [
  {
    id: 'vscode-1',
    shortcut: 'Ctrl+S',
    description: 'Save the current file',
    context: 'You\'ve made changes to your code and want to save them.',
    application: 'vscode' as const,
  },
  {
    id: 'vscode-2',
    shortcut: 'Ctrl+F',
    description: 'Find text in the current file',
    context: 'You need to search for a specific variable name in your code.',
    application: 'vscode' as const,
  },
  {
    id: 'vscode-3',
    shortcut: 'Ctrl+//',
    description: 'Toggle line comment',
    context: 'You want to comment out a line of code.',
    application: 'vscode' as const,
  },
  {
    id: 'vscode-4',
    shortcut: 'Ctrl+D',
    description: 'Select the next occurrence of the current selection',
    context: 'You want to select all instances of a variable to rename it.',
    application: 'vscode' as const,
  },
  {
    id: 'vscode-5',
    shortcut: 'Alt+Up',
    description: 'Move line up',
    context: 'You want to move a line of code above the previous line.',
    application: 'vscode' as const,
  },
];

// Sample challenges for IntelliJ
const intellijChallenges = [
  {
    id: 'intellij-1',
    shortcut: 'Ctrl+S',
    description: 'Save all files',
    context: 'You\'ve made changes to multiple files and want to save them all.',
    application: 'intellij' as const,
  },
  {
    id: 'intellij-2',
    shortcut: 'Ctrl+Shift+F',
    description: 'Find text in all project files',
    context: 'You need to search for a method name across the entire project.',
    application: 'intellij' as const,
  },
  {
    id: 'intellij-3',
    shortcut: 'Ctrl+/',
    description: 'Comment or uncomment the current line',
    context: 'You want to temporarily disable a line of code.',
    application: 'intellij' as const,
  },
  {
    id: 'intellij-4',
    shortcut: 'Alt+F7',
    description: 'Find all usages of a symbol',
    context: 'You want to see everywhere a method is called in your project.',
    application: 'intellij' as const,
  },
  {
    id: 'intellij-5',
    shortcut: 'Ctrl+Alt+L',
    description: 'Reformat code',
    context: 'You want to fix the indentation and formatting of your code.',
    application: 'intellij' as const,
  },
];

// Sample challenges for Cursor
const cursorChallenges = [
  {
    id: 'cursor-1',
    shortcut: 'Ctrl+K',
    description: 'Open command palette',
    context: 'You want to access Cursor\'s AI commands quickly.',
    application: 'cursor' as const,
  },
  {
    id: 'cursor-2',
    shortcut: 'Ctrl+Shift+I',
    description: 'Generate code with AI',
    context: 'You want to use AI to help you implement a function.',
    application: 'cursor' as const,
  },
  {
    id: 'cursor-3',
    shortcut: 'Ctrl+Shift+L',
    description: 'Explain selected code with AI',
    context: 'You want to understand what a complex piece of code does.',
    application: 'cursor' as const,
  },
  {
    id: 'cursor-4',
    shortcut: 'Ctrl+Shift+D',
    description: 'Debug code with AI',
    context: 'Your code has a bug and you want AI to help find it.',
    application: 'cursor' as const,
  },
  {
    id: 'cursor-5',
    shortcut: 'Ctrl+Shift+R',
    description: 'Refactor code with AI',
    context: 'You want to improve your code\'s structure and readability.',
    application: 'cursor' as const,
  },
];

// Combined challenges
const allChallenges = {
  vscode: vsCodeChallenges,
  intellij: intellijChallenges,
  cursor: cursorChallenges,
};

const ShortcutChallengePage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIDE, setSelectedIDE] = useState<'vscode' | 'intellij' | 'cursor'>('vscode');
  const [challenges, setChallenges] = useState(vsCodeChallenges);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Hearts system from context
  const { 
    currentHearts, 
    useHeart, 
    isLoading: heartsLoading 
  } = useHearts();
  
  const [showNoHeartsAlert, setShowNoHeartsAlert] = useState(false);
  
  // Get the current challenges based on selected IDE
  const currentChallenges = allChallenges[selectedIDE];
  
  // Handle challenge success
  const handleSuccess = () => {
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Calculate final time if timer was running
    if (startTime) {
      const endTime = Date.now();
      const elapsed = Math.floor((endTime - startTime) / 1000);
      setTimeElapsed(elapsed);
    }
    
    // Update score based on time and hints
    const timeBonus = Math.max(0, 100 - timeElapsed);
    const hintPenalty = showHint ? 20 : 0;
    const challengeScore = 100 + timeBonus - hintPenalty;
    
    setScore(challengeScore);
    setCompleted(true);
    
    // Award XP or other rewards here
  };
  
  const handleFailure = () => {
    // Use a heart when failing a challenge
    const heartUsed = useHeart();
    
    // Show alert if out of hearts
    if (!heartUsed || currentHearts <= 0) {
      setShowNoHeartsAlert(true);
    }
  };
  
  const handleSkip = () => {
    // Use a heart when skipping a challenge
    const heartUsed = useHeart();
    
    // If no hearts left, show alert
    if (!heartUsed) {
      setShowNoHeartsAlert(true);
      return;
    }
    
    // Otherwise proceed to next challenge
    handleNext();
  };
  
  // Handle hint
  const handleHint = () => {
    console.log('Hint requested for challenge:', currentChallenge.id);
  };
  
  // Handle IDE change
  const handleIDEChange = (ide: 'vscode' | 'intellij' | 'cursor') => {
    setSelectedIDE(ide);
    setActiveStep(0);
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep < currentChallenges.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    // Reset challenge state
    setActiveStep(0);
    setShowHint(false);
    setCompleted(false);
    setScore(0);
    setTimeElapsed(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setStartTime(null);
  };
  
  const startChallenge = () => {
    // Check if user has hearts
    if (currentHearts <= 0) {
      setShowNoHeartsAlert(true);
      return;
    }
    
    // Start timer
    const now = Date.now();
    setStartTime(now);
    
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Create sample files for IDE simulator
  const sampleFiles = [
    {
      name: 'index.js',
      language: 'javascript' as const,
      content: sampleJavaScriptCode,
    },
    {
      name: 'styles.css',
      language: 'css' as const,
      content: `/* Sample CSS */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* More styles below */
.button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
}`,
    },
    {
      name: 'README.md',
      language: 'markdown' as const,
      content: `# Sample Project

This is a sample project for the IDE simulator.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

1. Clone the repository
2. Install dependencies
3. Run the project`,
    },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Shortcut Challenge
          </Typography>
          
          {/* Hearts display */}
          <HeartsDisplay showTimer={true} size="medium" />
        </Box>
        
        <Typography variant="body1" paragraph>
          Test your knowledge of keyboard shortcuts in different IDEs. Complete challenges to earn XP and achievements.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* IDE Selection */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button 
                fullWidth
                variant={selectedIDE === 'vscode' ? 'contained' : 'outlined'}
                onClick={() => handleIDEChange('vscode')}
                sx={{ 
                  borderColor: selectedIDE === 'vscode' ? '#0078D7' : undefined,
                  backgroundColor: selectedIDE === 'vscode' ? '#0078D7' : undefined,
                }}
              >
                VS Code
              </Button>
            </Grid>
            
            <Grid item xs={4}>
              <Button 
                fullWidth
                variant={selectedIDE === 'intellij' ? 'contained' : 'outlined'}
                onClick={() => handleIDEChange('intellij')}
                sx={{ 
                  borderColor: selectedIDE === 'intellij' ? '#FC801D' : undefined,
                  backgroundColor: selectedIDE === 'intellij' ? '#FC801D' : undefined,
                }}
              >
                IntelliJ IDEA
              </Button>
            </Grid>
            
            <Grid item xs={4}>
              <Button 
                fullWidth
                variant={selectedIDE === 'cursor' ? 'contained' : 'outlined'}
                onClick={() => handleIDEChange('cursor')}
                sx={{ 
                  borderColor: selectedIDE === 'cursor' ? '#9B57B6' : undefined,
                  backgroundColor: selectedIDE === 'cursor' ? '#9B57B6' : undefined,
                }}
              >
                Cursor
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {/* Challenge content */}
        {!completed ? (
          <Box>
            {!startTime && !heartsLoading ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Ready to start the challenge?
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={startChallenge}
                  disabled={currentHearts <= 0}
                  sx={{ mt: 2 }}
                >
                  Start Challenge
                </Button>
                {currentHearts <= 0 && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    You don't have any lives left. Wait for them to regenerate or earn more.
                  </Typography>
                )}
              </Box>
            ) : (
              <>
                <ShortcutChallenge
                  shortcut={currentChallenge.shortcut}
                  description={currentChallenge.description}
                  context={currentChallenge.context}
                  application={currentChallenge.application}
                  onSuccess={handleSuccess}
                  onSkip={handleSkip}
                  onHint={handleHint}
                  showKeyboard={true}
                />
                
                {/* Navigation buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PrevIcon />}
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ResetIcon />}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  
                  <Button
                    variant="outlined"
                    endIcon={<NextIcon />}
                    onClick={handleNext}
                    disabled={activeStep === currentChallenges.length - 1}
                  >
                    Next
                  </Button>
                </Box>
                
                {/* Progress info */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {`Challenge ${activeStep + 1} of ${currentChallenges.length}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`Completed: ${completed ? 'Yes' : 'No'}`}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              Challenge Completed!
            </Typography>
            <Typography variant="body1">
              Your score: {score}
            </Typography>
            <Typography variant="body2">
              Time elapsed: {timeElapsed} seconds
            </Typography>
          </Box>
        )}
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Paper>
      
      {/* No hearts alert */}
      <Snackbar 
        open={showNoHeartsAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowNoHeartsAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowNoHeartsAlert(false)} 
          severity="warning" 
          variant="filled"
        >
          You don't have any lives left! Wait for them to regenerate or earn more.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShortcutChallengePage; 
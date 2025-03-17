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

// Sample VS Code challenges
const vsCodeChallenges = [
  {
    id: 'vscode-challenge-1',
    title: 'Navigate to File',
    description: 'Use the keyboard shortcut to open the "Go to File" dialog.',
    shortcut: {
      windows: 'Ctrl+P',
      mac: 'Cmd+P',
    },
    hint: 'This shortcut allows you to quickly open any file in your project.',
  },
  {
    id: 'vscode-challenge-2',
    title: 'Quick Open Symbol',
    description: 'Use the keyboard shortcut to open the "Go to Symbol" dialog.',
    shortcut: {
      windows: 'Ctrl+Shift+O',
      mac: 'Cmd+Shift+O',
    },
    hint: 'This shortcut allows you to navigate to any symbol (function, class, etc.) in the current file.',
  },
  {
    id: 'vscode-challenge-3',
    title: 'Toggle Terminal',
    description: 'Use the keyboard shortcut to toggle the integrated terminal.',
    shortcut: {
      windows: 'Ctrl+`',
      mac: 'Cmd+`',
    },
    hint: 'The backtick key (`) is typically located above the Tab key.',
  },
];

// Sample IntelliJ challenges
const intellijChallenges = [
  {
    id: 'intellij-challenge-1',
    title: 'Search Everywhere',
    description: 'Use the keyboard shortcut to open the "Search Everywhere" dialog.',
    shortcut: {
      windows: 'Shift+Shift (double tap)',
      mac: 'Shift+Shift (double tap)',
    },
    hint: 'Double-tapping the Shift key opens a powerful search dialog.',
  },
  {
    id: 'intellij-challenge-2',
    title: 'Recent Files',
    description: 'Use the keyboard shortcut to show the list of recently opened files.',
    shortcut: {
      windows: 'Ctrl+E',
      mac: 'Cmd+E',
    },
    hint: 'This shortcut shows a popup with your most recently accessed files.',
  },
  {
    id: 'intellij-challenge-3',
    title: 'Generate Code',
    description: 'Use the keyboard shortcut to open the code generation menu.',
    shortcut: {
      windows: 'Alt+Insert',
      mac: 'Cmd+N',
    },
    hint: 'This shortcut opens a menu for generating common code constructs.',
  },
];

// Sample Cursor challenges
const cursorChallenges = [
  {
    id: 'cursor-challenge-1',
    title: 'Open AI Chat',
    description: 'Use the keyboard shortcut to open the AI chat panel.',
    shortcut: {
      windows: 'Ctrl+I',
      mac: 'Cmd+I',
    },
    hint: 'This shortcut opens the AI assistant chat panel.',
  },
  {
    id: 'cursor-challenge-2',
    title: 'Generate Code with AI',
    description: 'Use the keyboard shortcut to generate code with AI.',
    shortcut: {
      windows: 'Ctrl+K',
      mac: 'Cmd+K',
    },
    hint: 'This shortcut triggers AI code generation based on your comments.',
  },
  {
    id: 'cursor-challenge-3',
    title: 'Explain Code with AI',
    description: 'Use the keyboard shortcut to explain selected code with AI.',
    shortcut: {
      windows: 'Ctrl+Shift+E',
      mac: 'Cmd+Shift+E',
    },
    hint: 'Select some code first, then use this shortcut to get an explanation.',
  },
];

// All challenges by IDE
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
    // Just show feedback, no hearts penalty
    console.log('Challenge failed');
  };
  
  const handleSkip = () => {
    // Skip to next challenge without penalty
    handleNext();
  };
  
  // Handle hint
  const handleHint = () => {
    setShowHint(true);
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
    // Start timer
    const now = Date.now();
    setStartTime(now);
    
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Update current challenge when active step changes
  useEffect(() => {
    setCurrentChallenge(currentChallenges[activeStep]);
    setShowHint(false);
  }, [activeStep, currentChallenges]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Shortcut Challenge
          </Typography>
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
            {!startTime ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Ready to start the challenge?
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={startChallenge}
                  sx={{ mt: 2 }}
                >
                  Start Challenge
                </Button>
              </Box>
            ) : (
              <Box>
                {/* Challenge progress */}
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                  {currentChallenges.map((challenge, index) => (
                    <Step key={challenge.id} completed={index < activeStep}>
                      <StepLabel>{`Challenge ${index + 1}`}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {/* Current challenge */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {currentChallenge.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentChallenge.description}
                  </Typography>
                  
                  {showHint && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Hint:</strong> {currentChallenge.hint}
                      </Typography>
                    </Alert>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time: {timeElapsed} seconds
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={handleHint}
                      disabled={showHint}
                    >
                      Show Hint
                    </Button>
                  </Box>
                </Box>
                
                {/* IDE Simulator */}
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: theme.palette.background.default,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    IDE Simulator
                  </Typography>
                  <IDESimulator 
                    code={sampleJavaScriptCode}
                    targetShortcut={currentChallenge.shortcut}
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                  />
                </Paper>
                
                {/* Navigation buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                    onClick={handleSkip}
                  >
                    Skip Challenge
                  </Button>
                  
                  <Button
                    variant="contained"
                    endIcon={<NextIcon />}
                    onClick={handleNext}
                    disabled={activeStep === currentChallenges.length - 1}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
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
    </Container>
  );
};

export default ShortcutChallengePage; 
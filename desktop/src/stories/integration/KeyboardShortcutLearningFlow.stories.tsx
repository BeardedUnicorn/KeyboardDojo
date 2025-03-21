import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Card, 
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Keyboard as KeyboardIcon, 
  Check as CheckIcon,
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

// Mock data for keyboard shortcuts
const mockShortcuts = [
  { id: 1, name: 'Copy', keys: ['Control', 'c'], description: 'Copy selected text or item' },
  { id: 2, name: 'Paste', keys: ['Control', 'v'], description: 'Paste from clipboard' },
  { id: 3, name: 'Cut', keys: ['Control', 'x'], description: 'Cut selected text or item' },
  { id: 4, name: 'Save', keys: ['Control', 's'], description: 'Save current document' },
  { id: 5, name: 'Select All', keys: ['Control', 'a'], description: 'Select all text or items' },
];

// Mock data for the lesson
const mockLesson = {
  id: 'essential-shortcuts',
  title: 'Essential Keyboard Shortcuts',
  description: 'Master the most commonly used keyboard shortcuts that will boost your productivity',
  difficulty: 'beginner',
  estimatedTime: 15,
  prerequisites: [],
  objectives: [
    'Learn 5 essential keyboard shortcuts',
    'Practice each shortcut multiple times',
    'Understand when to use each shortcut',
    'Improve recall speed for each shortcut'
  ],
  benefits: [
    'Increase productivity by up to 30%',
    'Reduce reliance on mouse navigation',
    'Build muscle memory for common operations',
    'Become more efficient in daily tasks'
  ]
};

interface KeyboardShortcutLearningFlowProps {
  showIntroduction?: boolean;
}

/**
 * A simplified version of the keyboard shortcut learning flow
 * Note: This story is for demonstration purposes only. In a real application,
 * you would use the actual components with proper state management.
 */
const KeyboardShortcutLearningFlow: React.FC<KeyboardShortcutLearningFlowProps> = ({ 
  showIntroduction = true 
}) => {
  const [activeStep, setActiveStep] = useState(showIntroduction ? 0 : 1);
  const [activeShortcut, setActiveShortcut] = useState(mockShortcuts[0]);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState<number[]>([]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    setShowSuccess(false);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    setShowSuccess(false);
  };

  const handleKeyPress = (key: string) => {
    const isCorrect = activeShortcut.keys.includes(key.toLowerCase());
    if (isCorrect) {
      setShowSuccess(true);
      if (!practiceCompleted.includes(activeShortcut.id)) {
        setPracticeCompleted([...practiceCompleted, activeShortcut.id]);
        setProgress(progress + 20);
      }
    }
  };

  const handleSelectShortcut = (shortcut: typeof mockShortcuts[0]) => {
    setActiveShortcut(shortcut);
    setShowSuccess(false);
  };

  const handleComplete = () => {
    setActiveStep(3); // Move to the completion step
  };

  const steps = ['Introduction', 'Learn', 'Practice', 'Completion'];
  
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          mt: 2,
          borderRadius: 2
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              {mockLesson.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {mockLesson.description}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Objectives
              </Typography>
              <List>
                {mockLesson.objectives.map((objective, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Benefits
              </Typography>
              <List>
                {mockLesson.benefits.map((benefit, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Button 
              variant="contained" 
              onClick={handleNext} 
              endIcon={<PlayIcon />}
              size="large"
            >
              Start Learning
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Learn Essential Shortcuts
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Familiarize yourself with these common keyboard shortcuts. Observe the keyboard visualization and the keys you need to press.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <List>
                  {mockShortcuts.map((shortcut) => (
                    <ListItem 
                      key={shortcut.id}
                      onClick={() => handleSelectShortcut(shortcut)}
                      divider
                      sx={{ 
                        mb: 1, 
                        borderRadius: 1,
                        bgcolor: activeShortcut.id === shortcut.id ? 'action.selected' : 'background.paper',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <KeyboardIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={shortcut.name} 
                        secondary={shortcut.description}
                        primaryTypographyProps={{ 
                          fontWeight: activeShortcut.id === shortcut.id ? 'bold' : 'normal' 
                        }}
                      />
                      <Chip 
                        label={shortcut.keys.join(' + ')} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom textAlign="center">
                      {activeShortcut.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                      {activeShortcut.description}
                    </Typography>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Typography variant="body1" gutterBottom>
                        Keys to press:
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 1, 
                        my: 3 
                      }}>
                        {activeShortcut.keys.map((key, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && (
                              <Typography variant="h6" sx={{ lineHeight: '36px' }}>+</Typography>
                            )}
                            <Chip 
                              label={key} 
                              sx={{ fontSize: '1.2rem', px: 2, py: 3 }} 
                              color="primary"
                            />
                          </React.Fragment>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={handleBack} variant="outlined">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
              >
                Continue to Practice
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Practice Shortcuts
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Practice each shortcut to build muscle memory. Press the keyboard combinations when prompted.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Progress
                    </Typography>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Box sx={{ 
                        width: '100%', 
                        height: 10, 
                        bgcolor: 'grey.200', 
                        borderRadius: 5,
                        overflow: 'hidden'
                      }}>
                        <Box 
                          sx={{ 
                            width: `${progress}%`, 
                            height: '100%', 
                            bgcolor: 'primary.main',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        {progress}% Complete
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {practiceCompleted.length} of {mockShortcuts.length} shortcuts mastered
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense>
                      {mockShortcuts.map((shortcut) => (
                        <ListItem key={shortcut.id} divider>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {practiceCompleted.includes(shortcut.id) ? (
                              <CheckIcon color="success" fontSize="small" />
                            ) : (
                              <TimerIcon color="action" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={shortcut.name} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              fontWeight: practiceCompleted.includes(shortcut.id) ? 'bold' : 'normal'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  disabled={practiceCompleted.length < mockShortcuts.length}
                  onClick={handleComplete}
                  endIcon={<TrophyIcon />}
                >
                  Complete Practice
                </Button>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {activeShortcut.name}
                      </Typography>
                      <Chip 
                        label={`Shortcut: ${activeShortcut.keys.join(' + ')}`} 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {activeShortcut.description}
                      </Typography>
                      
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 3, 
                          backgroundColor: showSuccess ? 'success.light' : 'grey.100',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        {showSuccess ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CheckIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6" color="success.dark">
                              Great job!
                            </Typography>
                            <Typography variant="body2">
                              You've successfully used the {activeShortcut.name} shortcut
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              Press the following shortcut:
                            </Typography>
                            <Typography variant="h5" fontWeight="bold">
                              {activeShortcut.keys.join(' + ')}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">
                        (In a real app, press the keys on your keyboard)
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {activeShortcut.keys.map((key, index) => (
                          <Button 
                            key={index}
                            variant="outlined"
                            sx={{ m: 1 }}
                            onClick={() => handleKeyPress(key)}
                          >
                            Simulate pressing '{key}'
                          </Button>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          const currentIndex = mockShortcuts.findIndex(s => s.id === activeShortcut.id);
                          const prevIndex = (currentIndex - 1 + mockShortcuts.length) % mockShortcuts.length;
                          handleSelectShortcut(mockShortcuts[prevIndex]);
                        }}
                      >
                        Previous Shortcut
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          const currentIndex = mockShortcuts.findIndex(s => s.id === activeShortcut.id);
                          const nextIndex = (currentIndex + 1) % mockShortcuts.length;
                          handleSelectShortcut(mockShortcuts[nextIndex]);
                        }}
                      >
                        Next Shortcut
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={handleBack} variant="outlined">
                Back to Learning
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Congratulations!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              You've successfully learned and practiced all essential keyboard shortcuts. 
              These skills will significantly improve your productivity.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
              <TrophyIcon color="primary" sx={{ fontSize: 48, mr: 2 }} />
              <Box>
                <Typography variant="h6">
                  Shortcut Master
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Achievement Unlocked
                </Typography>
              </Box>
            </Box>
            
            <Paper elevation={2} sx={{ p: 3, maxWidth: 400, mx: 'auto', mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Rewards Earned
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    +100
                  </Typography>
                  <Typography variant="body2">
                    XP Points
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="secondary">
                    5/5
                  </Typography>
                  <Typography variant="body2">
                    Shortcuts Mastered
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Level Progress
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  height: 10, 
                  bgcolor: 'grey.200', 
                  borderRadius: 5,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      width: '75%', 
                      height: '100%', 
                      bgcolor: 'primary.main' 
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption">Level 1</Typography>
                  <Typography variant="caption">75/100 XP</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
                Practice Again
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setActiveStep(0)}
                endIcon={<SchoolIcon />}
              >
                Next Lesson
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

const meta = {
  title: 'Integration/Keyboard Shortcut Learning Flow',
  component: KeyboardShortcutLearningFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'This story demonstrates the complete flow of learning keyboard shortcuts, from introduction to practice and mastery tracking.',
      },
    },
  },
  argTypes: {
    showIntroduction: {
      control: 'boolean',
      description: 'Whether to show the introduction step or start directly with learning',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof KeyboardShortcutLearningFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteFlow: Story = {
  args: {
    showIntroduction: true,
  },
};

export const SkipIntroduction: Story = {
  args: {
    showIntroduction: false,
  },
}; 
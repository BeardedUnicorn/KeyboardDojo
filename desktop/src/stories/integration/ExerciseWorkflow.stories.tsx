import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel, Container, Card, CardContent, LinearProgress, Divider, Grid, Chip, Stack, useTheme, Fade, Zoom } from '@mui/material';
import { 
  EmojiEvents as TrophyIcon, 
  CheckCircle as CheckCircleIcon, 
  StarBorder as StarBorderIcon, 
  Star as StarIcon, 
  Celebration as CelebrationIcon, 
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import Confetti from 'react-confetti';

// Mock Exercise Workflow Component
const ExerciseWorkflowSimulation = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  
  const steps = [
    'Exercise',
    'Feedback',
    'Reward',
    'Progress Update'
  ];
  
  const handleNext = () => {
    if (activeStep === 0) {
      setShowFeedback(true);
      setTimeout(() => setActiveStep(1), 500);
    } else if (activeStep === 1) {
      setShowReward(true);
      setShowConfetti(true);
      setTimeout(() => {
        setActiveStep(2);
        setTimeout(() => setShowConfetti(false), 3000);
      }, 500);
    } else if (activeStep === 2) {
      setShowProgressUpdate(true);
      setTimeout(() => setActiveStep(3), 500);
    }
  };
  
  const handleBack = () => {
    if (activeStep === 1) {
      setShowFeedback(false);
    } else if (activeStep === 2) {
      setShowReward(false);
    } else if (activeStep === 3) {
      setShowProgressUpdate(false);
    }
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setShowFeedback(false);
    setShowReward(false);
    setShowConfetti(false);
    setShowProgressUpdate(false);
  };
  
  // Mock Exercise Component
  const MockShortcutExercise = () => (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Keyboard Shortcut Exercise</Typography>
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" gutterBottom>Press the shortcut for saving a file:</Typography>
          <Typography variant="h4" sx={{ my: 2, fontFamily: 'monospace' }}>
            Ctrl + S
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1, 
            my: 3 
          }}>
            <Chip label="Ctrl" sx={{ fontSize: '1.2rem', px: 2, py: 3 }} />
            <Typography variant="h6" sx={{ lineHeight: '36px' }}>+</Typography>
            <Chip label="S" sx={{ fontSize: '1.2rem', px: 2, py: 3 }} />
          </Box>
          
          <Box sx={{ width: '60%', mx: 'auto', my: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              color="success"
              sx={{ height: 10, borderRadius: 5 }} 
            />
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
            sx={{ mt: 2 }}
          >
            Submit Answer
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
  
  // Mock Feedback Component
  const MockFeedback = () => (
    <Fade in={showFeedback}>
      <Card variant="outlined" sx={{ mb: 3, border: `2px solid ${theme.palette.success.main}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" color="success.main">Correct!</Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Great job! Ctrl+S is the standard shortcut for saving a file in most applications.
          </Typography>
          
          <Box sx={{ bgcolor: theme.palette.success.light, p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="body2" color="success.dark">
              <strong>Tip:</strong> You can also use Ctrl+Shift+S for "Save As" functionality in many applications.
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <TimerIcon color="primary" sx={{ fontSize: 24, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">Time</Typography>
                <Typography variant="h6">1.2s</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="body2" color="text.secondary">Accuracy</Typography>
                <Typography variant="h6">100%</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="body2" color="text.secondary">Attempts</Typography>
                <Typography variant="h6">1/3</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
            sx={{ mt: 3 }}
            fullWidth
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
  
  // Mock Reward Component
  const MockReward = () => (
    <Fade in={showReward}>
      <Card variant="outlined" sx={{ mb: 3, border: `2px solid ${theme.palette.warning.main}`, position: 'relative', overflow: 'visible' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {showConfetti && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
              <Confetti 
                width={500} 
                height={500} 
                recycle={false}
                numberOfPieces={500}
                gravity={0.15}
              />
            </Box>
          )}
          
          <Zoom in={showReward}>
            <TrophyIcon sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
          </Zoom>
          
          <Typography variant="h4" gutterBottom color="primary">
            Achievement Unlocked!
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            "Keyboard Maestro"
          </Typography>
          
          <Typography variant="body1" paragraph>
            Complete 5 shortcut exercises without errors
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Stack direction="row" spacing={1}>
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
            </Stack>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ bgcolor: theme.palette.primary.light }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>+50 XP</Typography>
                  <Typography variant="body2">Experience Points</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ bgcolor: theme.palette.secondary.light }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>+2 Coins</Typography>
                  <Typography variant="body2">Reward Currency</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            color="warning"
            onClick={handleNext}
            startIcon={<CelebrationIcon />}
            sx={{ mt: 1 }}
          >
            Claim Rewards
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
  
  // Mock Progress Update Component
  const MockProgressUpdate = () => (
    <Fade in={showProgressUpdate}>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Your Progress
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Level Progress</Typography>
                  </Box>
                  
                  <Box sx={{ position: 'relative', pt: 3, pb: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      color="primary"
                      sx={{ height: 20, borderRadius: 5 }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      750/1000 XP
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Level 4</Typography>
                    <Typography variant="body2">Level 5</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">XP Earned Today</Typography>
                    <Typography variant="body2" fontWeight="bold">+150 XP</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LightbulbIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Skill Mastery</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Common Shortcuts Proficiency
                  </Typography>
                  
                  <Box sx={{ position: 'relative', pt: 3, pb: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      color="warning"
                      sx={{ height: 20, borderRadius: 5 }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      60% Mastery
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Exercises Completed</Typography>
                      <Typography variant="body2" fontWeight="bold">6/10</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Average Score</Typography>
                      <Typography variant="body2" fontWeight="bold">92%</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom>
            Recommended Next Steps
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            <Chip label="Complete Text Selection Lesson" color="primary" />
            <Chip label="Practice Cut & Paste Shortcuts" color="secondary" />
            <Chip label="Try Advanced Shortcut Challenge" variant="outlined" />
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            onClick={handleReset}
          >
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
  
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {steps[activeStep]}
          </Typography>
          <Typography variant="body1" paragraph>
            {activeStep === 0 && "Complete the exercise to receive feedback and rewards."}
            {activeStep === 1 && "Review your performance and learn from feedback."}
            {activeStep === 2 && "Celebrate your achievements and receive rewards."}
            {activeStep === 3 && "See how this exercise has contributed to your overall progress."}
          </Typography>
        </Box>
        
        {/* Exercise Display */}
        {activeStep === 0 && <MockShortcutExercise />}
        
        {/* Feedback Display */}
        {activeStep >= 1 && <MockFeedback />}
        
        {/* Reward Display */}
        {activeStep >= 2 && <MockReward />}
        
        {/* Progress Update Display */}
        {activeStep >= 3 && <MockProgressUpdate />}
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
          onClick={activeStep === 3 ? handleReset : handleNext}
          disabled={activeStep === 3}
        >
          {activeStep === 3 ? 'Reset' : 'Next'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Exercise Workflow Integration
        </Typography>
        <Typography variant="body2">
          This story demonstrates the complete workflow from completing an exercise
          to receiving feedback, unlocking achievements, and tracking progress.
          The integration showcases how rewards and progression systems work together
          to create an engaging learning experience.
        </Typography>
      </Box>
    </Box>
  );
};

const meta = {
  title: 'Integration/Exercise Workflow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstrates the complete exercise workflow from completion to feedback, rewards, and progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExerciseWorkflowSimulation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteWorkflow: Story = {
  render: () => <ExerciseWorkflowSimulation />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the complete exercise workflow with interactive steps and visual feedback.',
      },
    },
  },
}; 
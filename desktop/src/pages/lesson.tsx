import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Check as CheckIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { ShortcutChallenge, IDESimulator } from '../components';
import { curriculumService } from '../services/curriculumService';
import { userProgressService } from '../services/userProgressService';
import { ApplicationType, Shortcut } from '../types/curriculum';
import { useUserProgress } from '../contexts/UserProgressContext';

const LessonPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { refreshProgress } = useUserProgress();
  const { trackId = 'vscode', moduleId = '', lessonId = '' } = useParams<{
    trackId: ApplicationType;
    moduleId: string;
    lessonId: string;
  }>();
  
  const [activeShortcutIndex, setActiveShortcutIndex] = useState(0);
  const [completedShortcuts, setCompletedShortcuts] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get lesson data
  const lesson = curriculumService.getLesson(trackId, moduleId, lessonId);
  const shortcuts = lesson?.shortcuts || [];
  
  // Get current shortcut
  const currentShortcut = shortcuts[activeShortcutIndex];
  
  // Handle shortcut success
  const handleShortcutSuccess = () => {
    if (!currentShortcut) return;
    
    // Mark the shortcut as completed
    const updatedCompletedShortcuts = [...completedShortcuts];
    if (!updatedCompletedShortcuts.includes(currentShortcut.id)) {
      updatedCompletedShortcuts.push(currentShortcut.id);
      setCompletedShortcuts(updatedCompletedShortcuts);
    }
    
    // Check if all shortcuts are completed
    if (updatedCompletedShortcuts.length === shortcuts.length) {
      // Show success message
      setShowSuccess(true);
      
      // Complete the lesson
      if (lesson) {
        userProgressService.completeLesson(
          trackId,
          moduleId,
          lessonId,
          100, // Score
          60 // Time spent (seconds)
        );
        
        // Check if all lessons in the module are completed
        const module = curriculumService.getModule(trackId, moduleId);
        if (module) {
          const moduleLessons = module.lessons;
          const completedLessons = userProgressService.getProgress()?.completedLessons || [];
          const completedLessonIds = completedLessons.map(cl => cl.lessonId);
          
          const allLessonsCompleted = moduleLessons.every(lesson => 
            completedLessonIds.includes(lesson.id)
          );
          
          if (allLessonsCompleted) {
            // Complete the module
            userProgressService.completeModule(trackId, moduleId);
          }
        }
        
        // Refresh progress in context
        refreshProgress();
      }
      
      // Navigate back to curriculum after a delay
      setTimeout(() => {
        navigate('/curriculum');
      }, 3000);
    } else {
      // Move to the next shortcut after a delay
      setTimeout(() => {
        setActiveShortcutIndex((prev) => Math.min(prev + 1, shortcuts.length - 1));
      }, 1000);
    }
  };
  
  // Handle skip
  const handleSkip = () => {
    setActiveShortcutIndex((prev) => Math.min(prev + 1, shortcuts.length - 1));
  };
  
  // Handle previous
  const handlePrevious = () => {
    setActiveShortcutIndex((prev) => Math.max(prev - 1, 0));
  };
  
  // Handle hint
  const handleHint = () => {
    console.log('Hint requested for shortcut:', currentShortcut?.id);
  };
  
  // Sample code for IDE simulator
  const sampleCode = `// Sample code for demonstration
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

  // Create sample files for IDE simulator
  const sampleFiles = [
    {
      name: 'index.js',
      language: 'javascript' as const,
      content: sampleCode,
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
}`,
    },
  ];
  
  // If lesson not found, show error
  if (!lesson) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Lesson Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The requested lesson could not be found.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/curriculum')}
          >
            Back to Curriculum
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Lesson header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {lesson.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {lesson.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Difficulty: {lesson.difficulty}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Estimated Time: {lesson.estimatedTime} minutes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            XP Reward: {lesson.xpReward} XP
          </Typography>
        </Box>
      </Paper>
      
      {/* Progress stepper */}
      <Stepper activeStep={activeShortcutIndex} alternativeLabel sx={{ mb: 4 }}>
        {shortcuts.map((shortcut, index) => (
          <Step key={shortcut.id} completed={completedShortcuts.includes(shortcut.id)}>
            <StepLabel>{`Shortcut ${index + 1}`}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Main content */}
      <Grid container spacing={4}>
        {/* Shortcut challenge */}
        <Grid item xs={12} md={6}>
          {currentShortcut && (
            <ShortcutChallenge
              key={`shortcut-${currentShortcut.id}-${activeShortcutIndex}`}
              shortcut={currentShortcut.shortcutWindows}
              description={currentShortcut.name}
              context={currentShortcut.context}
              application={trackId}
              onSuccess={handleShortcutSuccess}
              onSkip={handleSkip}
              onHint={handleHint}
              showKeyboard={true}
            />
          )}
          
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PrevIcon />}
              onClick={handlePrevious}
              disabled={activeShortcutIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              variant="outlined"
              endIcon={<NextIcon />}
              onClick={handleSkip}
              disabled={activeShortcutIndex === shortcuts.length - 1}
            >
              Skip
            </Button>
          </Box>
          
          {/* Progress info */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {`Shortcut ${activeShortcutIndex + 1} of ${shortcuts.length}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Completed: ${completedShortcuts.length} of ${shortcuts.length}`}
            </Typography>
          </Box>
        </Grid>
        
        {/* IDE Simulator */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            IDE Preview
          </Typography>
          
          <IDESimulator
            application={trackId}
            files={sampleFiles}
            activeFile="index.js"
            highlightLines={[3, 4]}
            showSidebar={true}
            showStatusBar={true}
            showTabs={true}
            height="500px"
          />
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            This is a simulated IDE environment to help you visualize where the shortcuts would be used.
            The actual effect of pressing the shortcut is not shown in this preview.
          </Typography>
        </Grid>
      </Grid>
      
      {/* Shortcut description card */}
      {currentShortcut && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About this Shortcut
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentShortcut.description}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  When to use
                </Typography>
                <Typography variant="body1">
                  {currentShortcut.context}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Shortcut Keys
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Windows: {currentShortcut.shortcutWindows}
                  </Typography>
                  {currentShortcut.shortcutMac && (
                    <Typography variant="body1" fontWeight="bold">
                      Mac: {currentShortcut.shortcutMac}
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {currentShortcut.category}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Difficulty
                </Typography>
                <Typography variant="body1">
                  {currentShortcut.difficulty}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {/* Success overlay */}
      {showSuccess && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Paper
            elevation={5}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: '400px',
              backgroundColor: theme.palette.success.light,
            }}
          >
            <TrophyIcon sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Lesson Completed!
            </Typography>
            <Typography variant="body1" paragraph>
              Congratulations! You've completed all shortcuts in this lesson.
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              +{lesson.xpReward} XP
            </Typography>
            <Typography variant="body2">
              Returning to curriculum...
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default LessonPage; 
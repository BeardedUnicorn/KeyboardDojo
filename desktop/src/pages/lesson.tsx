import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import QuizIcon from '@mui/icons-material/Quiz';
import { useUserProgress } from '../contexts/UserProgressContext';
import { useAchievements } from '../contexts/AchievementsContext';
import { Lesson, LessonStep, LessonStepType, ApplicationType } from '../types/curriculum';
import CodeExercise from '../components/CodeExercise';
import ShortcutExercise from '../components/ShortcutExercise';
import QuizExercise from '../components/QuizExercise';
import { curriculumService } from '../services/curriculumService';

interface LessonParams {
  lessonId: string;
  trackId: string;
  curriculumId: string;
}

const LessonPage: React.FC = () => {
  const { lessonId, trackId, curriculumId } = useParams<keyof LessonParams>() as LessonParams;
  const navigate = useNavigate();
  const { markLessonCompleted, isLessonCompleted } = useUserProgress();
  const { awardAchievement } = useAchievements();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Load lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const lessonData = await curriculumService.getLesson(curriculumId, trackId as ApplicationType, lessonId);
        setLesson(lessonData || null);
        
        // If lesson is already completed, mark all steps as completed
        if (isLessonCompleted(curriculumId, trackId as ApplicationType, lessonId)) {
          const completedSteps: { [k: number]: boolean } = {};
          if (lessonData?.steps) {
            lessonData.steps.forEach((_, index) => {
              completedSteps[index] = true;
            });
          }
          setCompleted(completedSteps);
        }
      } catch (err) {
        setError('Failed to load lesson. Please try again later.');
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [lessonId, trackId, curriculumId, isLessonCompleted]);
  
  // Handle step completion
  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = { ...completed };
    newCompleted[stepIndex] = true;
    setCompleted(newCompleted);
    
    // Check if all steps are completed
    const allStepsCompleted = lesson?.steps.every((_, index) => newCompleted[index]) ?? false;
    
    if (allStepsCompleted) {
      // Mark lesson as completed
      markLessonCompleted(curriculumId, trackId as ApplicationType, lessonId);
      
      // Award achievement for completing a lesson
      awardAchievement('complete_lesson');
      
      // Show success message
      setShowSuccess(true);
    } else {
      // Move to next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Handle step failure - just stay on the same step
  const handleStepFailure = () => {
    // No hearts deduction, just stay on the same step
  };
  
  // Handle back to curriculum
  const handleBackToCurriculum = () => {
    navigate('/curriculum');
  };
  
  // Render step content based on step type
  const renderStepContent = (step: LessonStep, index: number) => {
    switch (step.type) {
      case LessonStepType.CODE:
        return (
          <CodeExercise
            instructions={step.instructions || ''}
            initialCode={step.initialCode || ''}
            expectedOutput={step.expectedOutput || ''}
            onSuccess={() => handleStepComplete(index)}
            onFailure={handleStepFailure}
          />
        );
      case LessonStepType.SHORTCUT:
        return (
          <ShortcutExercise
            instructions={step.instructions || ''}
            shortcut={step.shortcut || { windows: '', mac: '' }}
            onSuccess={() => handleStepComplete(index)}
            onFailure={handleStepFailure}
          />
        );
      case LessonStepType.QUIZ:
        return (
          <QuizExercise
            question={step.question || ''}
            options={step.options || []}
            correctAnswer={step.correctAnswer || 0}
            onSuccess={() => handleStepComplete(index)}
            onFailure={handleStepFailure}
          />
        );
      default:
        return <Typography>Unknown step type</Typography>;
    }
  };
  
  // Get step icon based on step type
  const getStepIcon = (type: LessonStepType) => {
    switch (type) {
      case LessonStepType.CODE:
        return <CodeIcon />;
      case LessonStepType.SHORTCUT:
        return <KeyboardIcon />;
      case LessonStepType.QUIZ:
        return <QuizIcon />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !lesson) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Lesson not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToCurriculum}
          sx={{ mt: 2 }}
        >
          Back to Curriculum
        </Button>
      </Box>
    );
  }
  
  const allStepsCompleted = lesson.steps.every((_, index) => completed[index]);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToCurriculum}>
          Back to Curriculum
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {lesson.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {lesson.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {allStepsCompleted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Lesson Completed!
            </Typography>
            <Typography variant="body1" paragraph>
              Great job! You've completed all steps in this lesson.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToCurriculum}
              sx={{ mt: 2 }}
            >
              Back to Curriculum
            </Button>
          </Box>
        ) : (
          <Stepper activeStep={activeStep} orientation="vertical">
            {lesson.steps.map((step, index) => (
              <Step key={index} completed={completed[index]}>
                <StepLabel
                  optional={
                    <Typography variant="caption">
                      {step.type === LessonStepType.CODE
                        ? 'Code Exercise'
                        : step.type === LessonStepType.SHORTCUT
                        ? 'Shortcut Practice'
                        : 'Quiz Question'}
                    </Typography>
                  }
                  icon={getStepIcon(step.type)}
                >
                  {step.title}
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" paragraph>
                      {step.description}
                    </Typography>
                    {renderStepContent(step, index)}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        )}
      </Paper>
      
      {lesson.tips && lesson.tips.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Helpful Tips
            </Typography>
          </Grid>
          {lesson.tips.map((tip, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.content}
                  </Typography>
                </CardContent>
                {tip.link && (
                  <CardActions>
                    <Button size="small" href={tip.link} target="_blank" rel="noopener">
                      Learn More
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Congratulations! You've completed this lesson.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LessonPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  Keyboard as KeyboardIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { selectCurrentLesson, fetchLessonById, selectLessonsLoading, selectLessonsError } from './lessonsSlice';
import {
  selectLessonProgress,
  fetchUserProgress,
} from '../progress/progressSlice';
import { selectUser } from '../auth/authSlice';
import { capitalize } from '../../utils/stringUtils';
import { formatKeyCombo, isModifierKey, arraysEqual } from '../../utils/keyboardUtils';

// Types
interface Shortcut {
  id: string;
  name: string;
  description: string;
  keyCombination: string[];
  operatingSystem?: string;
}

interface ShortcutProgress {
  id: string;
  completed: boolean;
  score: number;
  progress: number;
  mastered: boolean;
  attempts: number;
}

interface LessonCompletion {
  shortcuts: Record<string, {
    completed: boolean;
    score: number;
    progress: number;
    mastered: boolean;
    attempts: number;
  }>;
}

const LessonDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const lesson = useAppSelector(selectCurrentLesson);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLessonsLoading);
  const error = useAppSelector(selectLessonsError);
  const lessonProgress = useAppSelector(state => selectLessonProgress(state, lessonId || '')) as LessonCompletion | null;

  const [isPracticing, setIsPracticing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [score, setScore] = useState(0);
  const [inputKeys, setInputKeys] = useState<string[]>([]);
  const [shortcutsFeedback, setShortcutsFeedback] = useState<Record<string, { correct: boolean; attempted: boolean }>>({});

  // Fetch lesson data when component mounts or lessonId changes
  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(lessonId));
      dispatch(fetchUserProgress());
    }
  }, [dispatch, lessonId]);

  // Handle keyboard events
  useEffect(() => {
    if (!isPracticing || !lesson) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifierKey(event.key)) {
        setInputKeys(prev => [...prev, event.key]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isModifierKey(event.key)) {
        const newInputKeys = [...inputKeys, event.key];
        setInputKeys(newInputKeys);
        
        // Check if input matches target sequence
        const targetSequence = lesson.content.shortcuts[currentStep].keyCombination;
        const isMatch = arraysEqual(newInputKeys, targetSequence);
        
        setShowFeedback(true);
        setFeedbackCorrect(isMatch);
        
        if (isMatch) {
          // Update score and feedback
          setScore(prev => prev + 1);
          setShortcutsFeedback(prev => ({
            ...prev,
            [lesson.content.shortcuts[currentStep].id]: { correct: true, attempted: true }
          }));
          
          // Check if this was the last shortcut
          const isLastShortcut = currentStep === lesson.content.shortcuts.length - 1;
          if (isLastShortcut) {
            setShowCompletionDialog(true);
          } else {
            // Move to next shortcut after delay
            setTimeout(() => {
              setCurrentStep(prev => prev + 1);
              setShowFeedback(false);
              setInputKeys([]);
            }, 2500);
          }
        } else {
          // Update feedback for incorrect attempt
          setShortcutsFeedback(prev => ({
            ...prev,
            [lesson.content.shortcuts[currentStep].id]: { correct: false, attempted: true }
          }));
          
          // Reset after showing error feedback
          setTimeout(() => {
            setShowFeedback(false);
            setInputKeys([]);
          }, 2500);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPracticing, currentStep, lesson, inputKeys]);

  // Handle clicking a shortcut in list view
  const handleShortcutClick = (step: number) => {
    if (!isPracticing) {
      setCurrentStep(step);
    }
  };

  // Start practice mode
  const handlePracticeStart = () => {
    setIsPracticing(true);
    setCurrentStep(0);
  };

  // Stop practice mode
  const handlePracticeStop = () => {
    setIsPracticing(false);
  };

  // Get shortcut progress
  const getShortcutProgress = (shortcutId: string): ShortcutProgress | null => {
    if (!lessonProgress?.shortcuts) return null;
    const progress = lessonProgress.shortcuts[shortcutId];
    if (!progress) return null;
    return {
      id: shortcutId,
      completed: progress.completed,
      score: progress.score,
      progress: progress.progress,
      mastered: progress.mastered,
      attempts: progress.attempts,
    };
  };

  if (loading && !lesson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lessons')} sx={{ mb: 2 }}>
          Back to Lessons
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lessons')} sx={{ mb: 2 }}>
          Back to Lessons
        </Button>
        <Alert severity="warning">Lesson not found.</Alert>
      </Box>
    );
  }

  // Check if this is a premium lesson and user doesn't have premium access
  const isPremiumLocked = lesson.isPremium && (!user || !user.isPremium);

  // Get active shortcut
  const activeShortcut = lesson.content.shortcuts[currentStep];

  // Calculate progress
  const progressValue = getShortcutProgress(activeShortcut.id)?.progress || 0;

  // Determine feedback messages
  const isCompleted = showCompletionDialog;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/lessons')}
          >
            Back to Lessons
          </Button>
          {isPracticing ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CancelIcon />}
              onClick={handlePracticeStop}
            >
              Exit Practice
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<KeyboardIcon />}
              onClick={handlePracticeStart}
              data-testid="start-practice-button"
            >
              Practice Shortcuts
            </Button>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 auto', mr: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {lesson.title}
            </Typography>
            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
              <Chip label={capitalize(lesson.category)} color="primary" />
              <Chip label={capitalize(lesson.difficulty)} color="secondary" />
              {lesson.isPremium && <Chip label="Premium" color="warning" />}
            </Box>
            <Typography variant="body1" paragraph>
              {lesson.description}
            </Typography>
          </Box>
          
          <Box sx={{ flex: '0 0 auto', mt: 2 }}>
            {isPremiumLocked ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/pricing')}
              >
                Upgrade to Access
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={isPracticing ? handlePracticeStop : handlePracticeStart}
                startIcon={isPracticing ? <CancelIcon /> : <KeyboardIcon />}
              >
                {isPracticing ? 'Exit Practice' : 'Practice Shortcuts'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Premium locked message */}
      {isPremiumLocked && (
        <Alert severity="info" sx={{ mb: 4 }}>
          This is a premium lesson. Please upgrade your account to access it.
        </Alert>
      )}
      
      {!isPremiumLocked && (
        <>
          {/* Introduction */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Introduction
            </Typography>
            <Typography variant="body1">
              {lesson.content.introduction}
            </Typography>
          </Paper>
          
          {/* Practice mode */}
          {isPracticing && (
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                  Practice Mode
                </Typography>
                
                <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
                  {lesson.content.shortcuts.map((shortcut, index) => {
                    const feedback = shortcutsFeedback[shortcut.id];
                    
                    return (
                      <Step key={shortcut.id}>
                        <StepLabel
                          StepIconProps={{
                            icon: feedback?.attempted ? (
                              feedback.correct ? 
                                <CheckCircleIcon color="success" /> : 
                                <CancelIcon color="error" />
                            ) : index + 1,
                          }}
                        >
                          {shortcut.name}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                
                <Box
                  sx={{
                    p: 4,
                    border: '2px solid',
                    borderColor: showFeedback 
                      ? (feedbackCorrect ? 'success.main' : 'error.main') 
                      : 'primary.main',
                    borderRadius: 2,
                    mb: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {showFeedback && (
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: feedbackCorrect ? 'success.main' : 'error.main',
                        opacity: 0.1,
                      }}
                    />
                  )}
                  
                  <Typography variant="h6" align="center" gutterBottom>
                    {activeShortcut.name}
                  </Typography>
                  
                  <Typography variant="body1" align="center" paragraph>
                    {activeShortcut.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {activeShortcut.keyCombination.map((key, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 50,
                          height: 50,
                          m: 0.5,
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          boxShadow: 1,
                          bgcolor: 'background.paper',
                          fontWeight: 'bold',
                        }}
                      >
                        {key}
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Press the key combination above
                    </Typography>
                    
                    {inputKeys.length > 0 && (
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Detected keys: {inputKeys.join(' + ')}
                      </Typography>
                    )}
                    
                    {showFeedback && (
                      <Typography 
                        variant="h6" 
                        color={feedbackCorrect ? 'success.main' : 'error.main'}
                        sx={{ mt: 2, fontWeight: 'bold' }}
                      >
                        {feedbackCorrect ? 'Correct!' : 'Try Again!'}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handlePracticeStop}
                    color="secondary"
                  >
                    Exit Practice
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Shortcuts list */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Shortcuts
              </Typography>
              <Paper elevation={1} sx={{ overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                  {lesson.content.shortcuts.map((shortcut: Shortcut, index: number) => {
                    const progress = getShortcutProgress(shortcut.id);
                    const isMastered = progress?.mastered || false;
                    
                    return (
                      <ListItem
                        component="li"
                        key={shortcut.id}
                        disablePadding
                        onClick={() => handleShortcutClick(index)}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          bgcolor: currentStep === index && isPracticing ? 'action.selected' : 'inherit',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon>
                          {isMastered ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <KeyboardIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={shortcut.name}
                          secondary={
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                              {formatKeyCombo(shortcut.keyCombination)}
                              {shortcut.operatingSystem && shortcut.operatingSystem !== 'all' && (
                                <Chip
                                  label={capitalize(shortcut.operatingSystem)}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {!isPracticing && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {activeShortcut.name}
                      </Typography>
                      
                      <Typography variant="body1" paragraph>
                        {activeShortcut.description}
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Key Combination:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {activeShortcut.keyCombination.map((key: string, keyIndex: number) => (
                            <Chip
                              key={keyIndex}
                              label={key}
                              variant="outlined"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      {activeShortcut.operatingSystem && activeShortcut.operatingSystem !== 'all' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Specific to: {capitalize(activeShortcut.operatingSystem)}
                        </Typography>
                      )}
                      
                      {activeShortcut.context && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Context: {activeShortcut.context}
                        </Typography>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      {isPracticing ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handlePracticeStop}
                          startIcon={<CancelIcon />}
                        >
                          Exit Practice
                        </Button>
                      ) : (
                        <Button
                          startIcon={<KeyboardIcon />}
                          variant="contained"
                          color="primary"
                          onClick={handlePracticeStart}
                          data-testid="details-practice-button"
                        >
                          Practice Shortcuts
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Tips
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <List>
                      {lesson.content.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon color="info" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </Grid>
          </Grid>
        </>
      )}
      
      {/* Completion dialog */}
      <Dialog 
        open={showCompletionDialog} 
        onClose={() => setShowCompletionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
            Lesson Completed!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {score}%
            </Typography>
            <Typography variant="body1" paragraph>
              You've completed the "{lesson.title}" lesson!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep practicing to improve your score and mastery of these shortcuts.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/lessons')}>
            Return to Lessons
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowCompletionDialog(false);
              handlePracticeStart();
            }}
          >
            Practice Again
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress indicator */}
      {isPracticing && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            data-testid="progress-indicator"
          />
        </Box>
      )}

      {/* Feedback messages */}
      {showFeedback && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '500px',
            width: '90%',
            zIndex: 1000,
          }}
        >
          <Alert
            severity={feedbackCorrect ? 'success' : 'error'}
            data-testid={isCompleted ? 'completion-message' : (feedbackCorrect ? 'success-message' : 'error-message')}
          >
            {isCompleted 
              ? 'Lesson completed! Great job!' 
              : (feedbackCorrect 
                  ? 'Correct! Keep going!' 
                  : 'Incorrect sequence. Try again!')}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default LessonDetail; 
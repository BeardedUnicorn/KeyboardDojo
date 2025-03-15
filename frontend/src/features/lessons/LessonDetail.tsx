import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchLessonById, selectCurrentLesson, selectLessonsLoading, selectLessonsError } from './lessonsSlice';
import {
  fetchUserProgress,
  saveUserShortcutProgress,
  selectLessonProgress,
  selectProgressLoading,
} from '../progress/progressSlice';
import { selectUser } from '../auth/authSlice';
import { Shortcut } from '../../api/lessonsService';
import { ShortcutProgress } from '../../api/progressService';

// Helper function to format key combinations
const formatKeyCombination = (keys: string[]): string => {
  return keys.join(' + ');
};

// Helper function to capitalize first letter
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const lesson = useAppSelector(selectCurrentLesson);
  const lessonsLoading = useAppSelector(selectLessonsLoading);
  const lessonsError = useAppSelector(selectLessonsError);
  const progressLoading = useAppSelector(selectProgressLoading);
  const user = useAppSelector(selectUser);
  const lessonProgress = useAppSelector(state => 
    lessonId ? selectLessonProgress(state, lessonId) : null
  );

  const [activeShortcutIndex, setActiveShortcutIndex] = useState(0);
  const [inputKeys, setInputKeys] = useState<string[]>([]);
  const [keydownTimeout, setKeydownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean>(false);
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [shortcutsFeedback, setShortcutsFeedback] = useState<Record<string, { correct: boolean; attempted: boolean }>>({});
  const [showCompletionDialog, setShowCompletionDialog] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Fetch lesson data when component mounts or lessonId changes
  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(lessonId));
      dispatch(fetchUserProgress());
    }
  }, [dispatch, lessonId]);

  // Set up keyboard event listener for practice mode
  useEffect(() => {
    if (!practiceMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      // Add key to input keys
      const key = e.key.toLowerCase();
      
      if (!inputKeys.includes(key)) {
        setInputKeys(prev => [...prev, key]);
      }

      // Clear any existing timeout
      if (keydownTimeout) {
        clearTimeout(keydownTimeout);
      }

      // Set a new timeout to check if the key combination is correct
      const timeout = setTimeout(() => {
        checkKeyCombination();
      }, 1000);

      setKeydownTimeout(timeout as unknown as NodeJS.Timeout);
    };

    const handleKeyUp = () => {
      // No-op, but might be useful later
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (keydownTimeout) {
        clearTimeout(keydownTimeout);
      }
    };
  }, [practiceMode, inputKeys, keydownTimeout]);

  // Check if the key combination matches the current shortcut
  const checkKeyCombination = () => {
    if (!lesson || activeShortcutIndex >= lesson.content.shortcuts.length) return;

    const currentShortcut = lesson.content.shortcuts[activeShortcutIndex];
    const expectedKeys = currentShortcut.keyCombination.map(k => k.toLowerCase());
    const inputKeysLower = inputKeys.map(k => k.toLowerCase());
    
    // Check if user has entered all required keys
    const allKeysPressed = expectedKeys.every(key => {
      // Handle special key mapping
      let mappedKey = key.toLowerCase();
      if (mappedKey === 'ctrl') mappedKey = 'control';
      if (mappedKey === 'cmd') mappedKey = 'meta';
      if (mappedKey === 'option') mappedKey = 'alt';
      
      return inputKeysLower.includes(mappedKey) || inputKeysLower.includes(key);
    });
    
    // Check if user hasn't entered any extra keys
    const noExtraKeys = inputKeysLower.every(key => {
      // Handle special key mapping
      if (key === 'control') return expectedKeys.some(k => k.toLowerCase() === 'ctrl' || k.toLowerCase() === 'control');
      if (key === 'meta') return expectedKeys.some(k => k.toLowerCase() === 'cmd' || k.toLowerCase() === 'meta');
      if (key === 'alt') return expectedKeys.some(k => k.toLowerCase() === 'option' || k.toLowerCase() === 'alt');
      
      return expectedKeys.some(k => k.toLowerCase() === key);
    });
    
    const isCorrect = allKeysPressed && noExtraKeys;
    
    // Update feedback state
    setFeedbackCorrect(isCorrect);
    setShowFeedback(true);
    
    // Update shortcut feedback
    setShortcutsFeedback(prev => ({
      ...prev,
      [currentShortcut.id]: { 
        correct: isCorrect, 
        attempted: true 
      }
    }));
    
    // Save progress to backend
    if (lessonId) {
      dispatch(saveUserShortcutProgress({
        lessonId,
        shortcutId: currentShortcut.id,
        data: {
          attempts: 1,
          correctAttempts: isCorrect ? 1 : 0,
          mastered: isCorrect,
          lastAttemptAt: Date.now()
        }
      }));
    }
    
    // Clear input keys
    setInputKeys([]);
    
    // Auto-advance to next shortcut after a delay if correct
    if (isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
        
        // If this was the last shortcut, show completion dialog
        if (activeShortcutIndex === lesson.content.shortcuts.length - 1) {
          // Calculate score
          const totalCorrect = Object.values(shortcutsFeedback).filter(f => f.correct).length + (isCorrect ? 1 : 0);
          const totalShortcuts = lesson.content.shortcuts.length;
          const calculatedScore = Math.round((totalCorrect / totalShortcuts) * 100);
          
          setScore(calculatedScore);
          setShowCompletionDialog(true);
          setPracticeMode(false);
        } else {
          // Otherwise, go to next shortcut
          setActiveShortcutIndex(activeShortcutIndex + 1);
        }
      }, 1500);
    } else {
      // Hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  // Handle clicking a shortcut in list view
  const handleShortcutClick = (index: number) => {
    if (!practiceMode) {
      setActiveShortcutIndex(index);
    }
  };

  // Start practice mode
  const handlePracticeStart = () => {
    setActiveShortcutIndex(0);
    setPracticeMode(true);
    setShortcutsFeedback({});
    setInputKeys([]);
  };

  // Stop practice mode
  const handlePracticeStop = () => {
    setPracticeMode(false);
  };

  // Get shortcut progress
  const getShortcutProgress = (shortcutId: string): ShortcutProgress | null => {
    if (!lessonProgress || !lessonProgress.shortcuts) return null;
    return lessonProgress.shortcuts[shortcutId] || null;
  };

  if (lessonsLoading && !lesson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (lessonsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lessons')} sx={{ mb: 2 }}>
          Back to Lessons
        </Button>
        <Alert severity="error">{lessonsError}</Alert>
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
  const activeShortcut = lesson.content.shortcuts[activeShortcutIndex];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lessons')} sx={{ mb: 2 }}>
          Back to Lessons
        </Button>
        
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
                onClick={practiceMode ? handlePracticeStop : handlePracticeStart}
                startIcon={practiceMode ? <CancelIcon /> : <KeyboardIcon />}
              >
                {practiceMode ? 'Exit Practice' : 'Practice Shortcuts'}
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
          {practiceMode && (
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                  Practice Mode
                </Typography>
                
                <Stepper activeStep={activeShortcutIndex} alternativeLabel sx={{ mb: 3 }}>
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
                        key={shortcut.id}
                        button
                        selected={index === activeShortcutIndex}
                        onClick={() => handleShortcutClick(index)}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          bgcolor: index === activeShortcutIndex ? 'action.selected' : 'inherit',
                        }}
                      >
                        <ListItemIcon>
                          {isMastered ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <KeyboardIcon color="action" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={shortcut.name}
                          secondary={
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                              {formatKeyCombination(shortcut.keyCombination)}
                              {shortcut.operatingSystem && shortcut.operatingSystem !== 'all' && (
                                <Chip 
                                  label={shortcut.operatingSystem} 
                                  size="small" 
                                  sx={{ ml: 1, height: 20, fontSize: '0.6rem' }} 
                                />
                              )}
                            </Box>
                          }
                        />
                        {index === activeShortcutIndex && !practiceMode && (
                          <DoubleArrowIcon color="primary" fontSize="small" />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {!practiceMode && (
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
                          {activeShortcut.keyCombination.map((key, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 40,
                                height: 40,
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
                      
                      <Button
                        variant="contained"
                        onClick={handlePracticeStart}
                        startIcon={<KeyboardIcon />}
                        fullWidth
                      >
                        Practice Shortcuts
                      </Button>
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
    </Box>
  );
};

export default LessonDetail; 
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Keyboard as KeyboardIcon,
  NavigateNext as NavigateNextIcon,
  Timer as TimerIcon,
  EmojiEvents as EmojiEventsIcon,
  School as SchoolIcon,
  NavigateBefore as NavigateBeforeIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  useTheme,
  Fade,
  Stack,
  useMediaQuery,
  Chip,
  LinearProgress,
  Tooltip,
  Drawer,
  alpha,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { useLogger } from '@/services';
import { useAppDispatch, useAppSelector } from '@/store';
import { vscodePath , cursorPath , intellijPath } from '@data/paths';

import { EnhancedShortcutExercise, HeartRequirement } from '../components';
import {
  awardAchievement as awardAchievementAction,
} from '../store/slices/achievementsSlice';
import {
  selectUserProgress,
  markLessonCompleted as markLessonCompletedAction,
  selectIsLessonCompleted,
} from '../store/slices/userProgressSlice';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { ApplicationType, PathNode } from '@/types/progress/ICurriculum';
import type { FC } from 'react';

interface LessonParams {
  trackId: string;
  nodeId: string;
}

// Define the LessonData interface for the lesson state
interface LessonData {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  category: ShortcutCategory;
  xpReward: number;
  currencyReward: number;
  heartsRequired: number;
  shortcut: {
    id: string;
    name: string;
    description: string;
    shortcutWindows: string;
    shortcutMac: string;
    category: ShortcutCategory;
    difficulty: DifficultyLevel;
    xpValue: number;
  };
  context: string;
}

// Helper function to create lesson data from a node
const createLessonData = (node: PathNode, logger: ReturnType<typeof useLogger>) => {
  logger.info('Creating lesson data from node:', { nodeId: node.id, nodeContent: node.content });

  // Ensure we have valid data
  if (!node) {
    console.error('Cannot create lesson data: node is undefined');
    return null;
  }

  // Default values for required fields
  const title = node.title || 'Untitled Lesson';
  const description = node.description || 'No description available';
  const difficulty = node.difficulty || 'beginner';
  const category = node.category || 'navigation';

  // Create shortcut data based on node type and category
  const shortcutData = {
    id: `shortcut-${node.id}`,
    name: title,
    description: description,
    shortcutWindows: 'Ctrl+?',
    shortcutMac: 'Cmd+?',
    category: category,
    difficulty: difficulty,
    xpValue: 10,
  };

  // Customize shortcut based on category
  if (category === 'navigation') {
    shortcutData.shortcutWindows = 'Ctrl+P';
    shortcutData.shortcutMac = 'Cmd+P';
  } else if (category === 'editing') {
    shortcutData.shortcutWindows = 'Ctrl+S';
    shortcutData.shortcutMac = 'Cmd+S';
  } else if (category === 'search') {
    shortcutData.shortcutWindows = 'Ctrl+F';
    shortcutData.shortcutMac = 'Cmd+F';
  }

  return {
    id: node.id,
    title: title,
    description: description,
    difficulty: difficulty,
    category: category,
    xpReward: 50,
    currencyReward: 10,
    heartsRequired: 1,
    shortcut: shortcutData,
    context: `What shortcut ${description ? 'does ' + description : 'would you use for this action'}?`,
  };
};

const LessonPage: FC = () => {
  const { trackId, nodeId } = useParams<keyof LessonParams>() as LessonParams;
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const userProgress = useAppSelector(selectUserProgress);
  const lessonCompletionStatus = useAppSelector((state) => ({
    isLessonCompleted: (lessonId: string) => selectIsLessonCompleted(state, lessonId),
  }));
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHeartRequirement, setShowHeartRequirement] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [progress, setProgress] = useState(0);
  const [showProgressDrawer, setShowProgressDrawer] = useState(false);
  const [adjacentLessons, setAdjacentLessons] = useState<{
    prev: PathNode | null;
    next: PathNode | null;
  }>({ prev: null, next: null });

  // Create a logger instance for this component
  const logger = useLogger('LessonPage');

  const markLessonCompleted = (params: {
    curriculumId: string;
    trackId: ApplicationType;
    lessonId: string;
    score?: number;
    timeSpent?: number;
  }) => {
    dispatch(markLessonCompletedAction(params));
  };

  const awardAchievement = (achievementId: string) => {
    dispatch(awardAchievementAction(achievementId));
  };

  const isLessonCompleted = (lessonId: string) => {
    return lessonCompletionStatus.isLessonCompleted(lessonId);
  };

  // Load lesson data and calculate progress
  const loadLesson = async () => {
    setLoading(true);
    setError(null);

    try {
      // Find the node in the appropriate path
      let node: PathNode | undefined;
      let currentPath: PathNode[] = [];

      if (nodeId) {
        // Check each path for the lesson
        if (trackId === 'vscode') {
          currentPath = vscodePath.nodes;
          node = vscodePath.nodes.find((n: PathNode) => n.id === nodeId);
        } else if (trackId === 'intellij') {
          currentPath = intellijPath.nodes;
          node = intellijPath.nodes.find((n: PathNode) => n.id === nodeId);
        } else if (trackId === 'cursor') {
          currentPath = cursorPath.nodes;
          node = cursorPath.nodes.find((n: PathNode) => n.id === nodeId);
        }

        if (node) {
          // Create lesson data from the node
          const lessonData = createLessonData(node, logger);
          setLesson(lessonData);

          // Calculate progress
          const currentIndex = currentPath.findIndex((n) => n.id === nodeId);
          setProgress((currentIndex + 1) / currentPath.length * 100);

          // Find adjacent lessons
          setAdjacentLessons({
            prev: currentIndex > 0 ? currentPath[currentIndex - 1] : null,
            next: currentIndex < currentPath.length - 1 ? currentPath[currentIndex + 1] : null,
          });
        } else {
          // Lesson not found
          setError('Lesson not found');
          logger.error('Lesson not found:', { nodeId });
        }
      } else {
        // No lesson ID provided
        setError('No lesson ID provided');
        logger.error('No lesson ID provided');
      }
    } catch (err) {
      // Handle error
      setError('Failed to load lesson');
      logger.error('Failed to load lesson:', { error: err });
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle navigation when not in an input field
    if (document.activeElement?.tagName === 'INPUT') return;

    if (event.key === 'ArrowLeft' && adjacentLessons.prev) {
      navigate(`/lesson/${trackId}/${adjacentLessons.prev.id}`);
    } else if (event.key === 'ArrowRight' && adjacentLessons.next) {
      navigate(`/lesson/${trackId}/${adjacentLessons.next.id}`);
    } else if (event.key === 'Escape') {
      handleBack();
    }
  }, [adjacentLessons, trackId, navigate]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    loadLesson();
  }, [nodeId]);

  // Handle lesson completion
  const handleLessonComplete = () => {
    // Mark the lesson as completed
    markLessonCompleted({
      curriculumId: 'default',
      trackId: trackId as ApplicationType,
      lessonId: nodeId,
      score: 100,
      timeSpent: 60,
    });

    // Award achievement if applicable
    if (trackId === 'vscode') {
      awardAchievement('vscode_first_lesson');
    } else if (trackId === 'cursor') {
      awardAchievement('cursor_first_lesson');
    } else if (trackId === 'intellij') {
      awardAchievement('intellij_first_lesson');
    }

    // Show completion state
    setCompleted(true);
  };

  // Handle back button
  const handleBack = () => {
    navigate('/curriculum');
  };

  // Handle navigation to next lesson
  const handleNextLesson = () => {
    // Find the next lesson in the path
    if (trackId === 'vscode') {
      const currentNodeIndex = vscodePath.nodes.findIndex((n) => n.id === nodeId);
      if (currentNodeIndex !== -1 && currentNodeIndex < vscodePath.nodes.length - 1) {
        const nextNode = vscodePath.nodes[currentNodeIndex + 1];
        navigate(`/lesson/${trackId}/${nextNode.id}`);
      } else {
        // If no next lesson, go back to curriculum
        navigate('/curriculum');
      }
    } else if (trackId === 'cursor') {
      const currentNodeIndex = cursorPath.nodes.findIndex((n) => n.id === nodeId);
      if (currentNodeIndex !== -1 && currentNodeIndex < cursorPath.nodes.length - 1) {
        const nextNode = cursorPath.nodes[currentNodeIndex + 1];
        navigate(`/lesson/${trackId}/${nextNode.id}`);
      } else {
        // If no next lesson, go back to curriculum
        navigate('/curriculum');
      }
    } else if (trackId === 'intellij') {
      const currentNodeIndex = intellijPath.nodes.findIndex((n) => n.id === nodeId);
      if (currentNodeIndex !== -1 && currentNodeIndex < intellijPath.nodes.length - 1) {
        const nextNode = intellijPath.nodes[currentNodeIndex + 1];
        navigate(`/lesson/${trackId}/${nextNode.id}`);
      } else {
        // If no next lesson, go back to curriculum
        navigate('/curriculum');
      }
    } else {
      // Default fallback
      navigate('/curriculum');
    }
  };

  // Handle continue with hearts
  const handleContinueWithHearts = () => {
    setShowHeartRequirement(false);
  };

  // Handle cancel lesson
  const handleCancelLesson = () => {
    navigate('/curriculum');
  };

  // Show loading state
  if (loading) {
    return (
      <Fade in>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Container>
      </Fade>
    );
  }

  // Show error state
  if (error) {
    return (
      <Fade in>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            minHeight: '100vh',
          }}
        >
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleBack} size="large" sx={{ color: theme.palette.text.secondary }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" component="h1">
                Lesson Not Found
              </Typography>
            </Box>

            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Stack spacing={3}>
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '2rem',
                    },
                  }}
                >
                  {error}
                </Alert>

                <Typography variant="body1" color="text.secondary">
                  We couldn't find the lesson you're looking for. This might be due to:
                </Typography>

                <Box
                  component="ul"
                  sx={{
                    pl: 4,
                    '& li': {
                      color: theme.palette.text.secondary,
                      mb: 1,
                    },
                  }}
                >
                  <li>The lesson ID is incorrect</li>
                  <li>The lesson has been removed or renamed</li>
                  <li>There was an error loading the lesson data</li>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Back to Curriculum
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Fade>
    );
  }

  // Show heart requirement dialog
  if (showHeartRequirement) {
    return (
      <HeartRequirement
        required={lesson?.heartsRequired || 1}
        onContinue={handleContinueWithHearts}
        onCancel={handleCancelLesson}
        lessonTitle={lesson?.title}
      />
    );
  }

  // Progress drawer content
  const ProgressDrawer = () => (
    <Drawer
      anchor="right"
      open={showProgressDrawer}
      onClose={() => setShowProgressDrawer(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" gutterBottom>
          Your Progress
        </Typography>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Position
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 1,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Navigation
          </Typography>
          <Stack spacing={1}>
            {adjacentLessons.prev && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<NavigateBeforeIcon />}
                onClick={() => adjacentLessons.prev && navigate(`/lesson/${trackId}/${adjacentLessons.prev.id}`)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Previous: {adjacentLessons.prev.title}
              </Button>
            )}
            {adjacentLessons.next && (
              <Button
                fullWidth
                variant="outlined"
                endIcon={<NavigateNextIcon />}
                onClick={() => adjacentLessons.next && navigate(`/lesson/${trackId}/${adjacentLessons.next.id}`)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Next: {adjacentLessons.next.title}
              </Button>
            )}
          </Stack>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Keyboard Shortcuts
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption">Previous Lesson</Typography>
              <Typography variant="caption" fontFamily="monospace">← Left Arrow</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption">Next Lesson</Typography>
              <Typography variant="caption" fontFamily="monospace">→ Right Arrow</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption">Back to Curriculum</Typography>
              <Typography variant="caption" fontFamily="monospace">Esc</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );

  // Main lesson content
  return (
    <Fade in>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          minHeight: '100vh',
        }}
      >
        <Stack spacing={3}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleBack}
              size="large"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                }}
              >
                {lesson?.title || 'Untitled Lesson'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip
                  icon={<SchoolIcon />}
                  label={lesson?.difficulty || 'Beginner'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<TimerIcon />}
                  label="5 min"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  icon={<EmojiEventsIcon />}
                  label={`${lesson?.xpReward || 0} XP`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Tooltip title="View Progress">
                  <Chip
                    icon={<MapIcon />}
                    label={`${Math.round(progress)}%`}
                    size="small"
                    color="default"
                    variant="outlined"
                    onClick={() => setShowProgressDrawer(true)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              </Box>
            </Stack>

            {/* Navigation Preview */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {adjacentLessons.prev && (
                <Tooltip
                  title={`Previous: ${adjacentLessons.prev.title}`}
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => adjacentLessons.prev && navigate(`/lesson/${trackId}/${adjacentLessons.prev.id}`)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                </Tooltip>
              )}
              {adjacentLessons.next && (
                <Tooltip
                  title={`Next: ${adjacentLessons.next.title}`}
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => adjacentLessons.next && navigate(`/lesson/${trackId}/${adjacentLessons.next.id}`)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }}
          />

          {/* Main Content */}
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Description Section */}
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: theme.palette.background.paper,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary">
                  {lesson?.description || 'No description available'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <KeyboardIcon color="primary" />
                  <Typography variant="subtitle1" color="primary.main">
                    Shortcut to Learn:
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexDirection: isSmall ? 'column' : 'row',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      flex: 1,
                      textAlign: 'center',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Windows / Linux
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontFamily="monospace">
                      {lesson?.shortcut?.shortcutWindows || 'N/A'}
                    </Typography>
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      flex: 1,
                      textAlign: 'center',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      macOS
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontFamily="monospace">
                      {lesson?.shortcut?.shortcutMac || 'N/A'}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </Box>

            {/* Exercise Section */}
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Practice Exercise
                </Typography>

                <EnhancedShortcutExercise
                  title={lesson?.title || 'Keyboard Shortcut Exercise'}
                  description={lesson?.description || ''}
                  context={lesson?.context || 'Press the correct keyboard shortcut'}
                  shortcut={lesson?.shortcut || {
                    id: 'temp-shortcut',
                    name: lesson?.title || 'Shortcut',
                    shortcutWindows: lesson?.shortcut?.shortcutWindows || '',
                    shortcutMac: lesson?.shortcut?.shortcutMac || '',
                  }}
                  difficulty={lesson?.difficulty || 'beginner'}
                  feedbackSuccess={{
                    message: 'Great job! You executed the shortcut correctly.',
                    mascotReaction: 'Excellent! Your keyboard skills are improving!',
                  }}
                  feedbackFailure={{
                    message: 'Not quite right. Try again!',
                    mascotReaction: "Keep trying! You'll get it soon.",
                    hint: 'Check the key combination carefully and try again.',
                  }}
                  onSuccess={handleLessonComplete}
                  onFailure={() => {}}
                />

                {completed && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" />
                      <Typography color="success.main">
                        Lesson Completed!
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<NavigateNextIcon />}
                      onClick={handleNextLesson}
                    >
                      Next Lesson
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>
          </Paper>
        </Stack>

        {/* Progress Drawer */}
        <ProgressDrawer />
      </Container>
    </Fade>
  );
};

export default LessonPage;

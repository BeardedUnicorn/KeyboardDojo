import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  ChipProps,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { RootState } from '../../store/store';
import { fetchAllLessons } from '../lessons/lessonsSlice';
import { fetchUserProgress } from '../progress/progressSlice';
import { AppDispatch } from '../../store/store';
import DesktopAppBanner from '../../components/DesktopAppBanner';

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Map difficulty levels to colors
const difficultyColors: Record<string, ChipProps['color']> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

// Define a type for our derived progress item
interface ProgressItem {
  lessonId: string;
  completedShortcuts: number;
  lastPracticed: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    lessons, 
    loading: lessonsLoading, 
    error: lessonsError 
  } = useSelector((state: RootState) => state.lessons);
  const { 
    data: progressData,
    loading: progressLoading 
  } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    dispatch(fetchAllLessons());
    if (user?.id) {
      dispatch(fetchUserProgress());
    }
  }, [dispatch, user?.id]);

  // Create a derived array of lesson progress for easier processing
  const progressArray: ProgressItem[] = progressData && lessons ? Object.entries(progressData.completedLessons || {})
    .map(([lessonId, lessonData]) => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return null;
      
      const shortcutsCompleted = Object.values(lessonData.shortcuts || {}).filter(s => s.mastered).length;
      
      return {
        lessonId,
        completedShortcuts: shortcutsCompleted,
        lastPracticed: lessonData.completedAt || Date.now(),
      };
    })
    .filter((item): item is ProgressItem => item !== null) : [];

  // Calculate overall progress
  const totalLessons = lessons?.length || 0;
  const completedLessons = progressData ? progressData.totalLessonsCompleted || 0 : 0;
  const completionPercentage = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get in-progress lessons
  const inProgressLessons = progressArray
    .filter(p => {
      const lesson = lessons?.find(l => l.id === p.lessonId);
      return p.completedShortcuts > 0 && lesson && p.completedShortcuts < (lesson.shortcuts?.length || 0);
    })
    .sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime())
    .slice(0, 3);

  // Get recommended lessons
  const recommendedLessons = lessons ? lessons
    .filter(lesson => {
      // If user has no progress, recommend beginner lessons
      if (!progressData || Object.keys(progressData.completedLessons || {}).length === 0) {
        return lesson.difficulty === 'beginner';
      }
      
      // Otherwise, recommend lessons not started yet, prioritizing by user's level
      const lessonProgress = progressData.completedLessons[lesson.id];
      return !lessonProgress || Object.values(lessonProgress.shortcuts || {}).filter(s => s.mastered).length === 0;
    })
    .slice(0, 3) : [];
  
  // Get recent completed lessons
  const recentCompletedLessons = progressArray
    .filter(p => {
      const lesson = lessons?.find(l => l.id === p.lessonId);
      return lesson && p.completedShortcuts === (lesson.shortcuts?.length || 0);
    })
    .sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime())
    .slice(0, 3);

  const handleNavigateToLesson = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  if (lessonsLoading || progressLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (lessonsError) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Error loading data: {lessonsError}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view your dashboard.
          <Button 
            color="inherit" 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => navigate('/auth/login')}
          >
            Log In
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <DesktopAppBanner />
      
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.name || 'Keyboard Ninja'}!
      </Typography>
      
      {/* Overall Progress Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Your Overall Progress</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} key="completed-lessons">
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {completedLessons}
                </Typography>
                <Typography variant="body2">
                  Lessons Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4} key="completion-rate">
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {completionPercentage}%
                </Typography>
                <Typography variant="body2">
                  Completion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4} key="lessons-remaining">
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {totalLessons - completedLessons}
                </Typography>
                <Typography variant="body2">
                  Lessons Remaining
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Total Progress: {completionPercentage}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Paper>
      
      {/* Continue Learning Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Continue Learning</Typography>
        </Box>
        
        {inProgressLessons.length > 0 ? (
          <Grid container spacing={3}>
            {inProgressLessons.map(progressItem => {
              const lesson = lessons.find(l => l.id === progressItem.lessonId);
              if (!lesson) return null;
              
              const lessonShortcutsLength = lesson.shortcuts?.length || 1; // Prevent division by zero
              const completionPercentage = Math.round((progressItem.completedShortcuts / lessonShortcutsLength) * 100);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {lesson.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          key={`category-${lesson.category}`}
                          label={capitalize(lesson.category)} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          key={`difficulty-${lesson.difficulty}`}
                          label={capitalize(lesson.difficulty)} 
                          size="small" 
                          color={difficultyColors[lesson.difficulty]} 
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {progressItem.completedShortcuts} of {lesson.shortcuts?.length || 0} shortcuts completed
                      </Typography>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={completionPercentage} 
                        sx={{ mb: 2 }}
                      />
                      
                      <Typography variant="caption" color="text.secondary">
                        Last practiced: {new Date(progressItem.lastPracticed).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => handleNavigateToLesson(lesson.lessonId)}
                      >
                        Continue
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Alert severity="info">
            You don't have any lessons in progress. Start a new lesson to begin tracking your progress!
          </Alert>
        )}
      </Paper>
      
      {/* Recommended Lessons Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Recommended Lessons</Typography>
        </Box>
        
        {recommendedLessons.length > 0 ? (
          <Grid container spacing={3}>
            {recommendedLessons.map(lesson => (
              <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {lesson.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip 
                        key={`category-${lesson.category}`}
                        label={capitalize(lesson.category)} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        key={`difficulty-${lesson.difficulty}`}
                        label={capitalize(lesson.difficulty)} 
                        size="small" 
                        color={difficultyColors[lesson.difficulty]} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {lesson.description}
                    </Typography>
                    
                    <Typography variant="body2">
                      {lesson.shortcuts?.length || 0} shortcuts to learn
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleNavigateToLesson(lesson.lessonId)}
                    >
                      Start Lesson
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            Great job! You've started all available lessons. Check back later for more content.
          </Alert>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="primary" onClick={() => navigate('/lessons')}>
            View All Lessons
          </Button>
        </Box>
      </Paper>
      
      {/* Recent Achievements Section */}
      {recentCompletedLessons.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Recent Achievements</Typography>
          </Box>
          
          <Grid container spacing={3}>
            {recentCompletedLessons.map(progressItem => {
              const lesson = lessons.find(l => l.id === progressItem.lessonId);
              if (!lesson) return null;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {lesson.title} Completed!
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          key={`category-${lesson.category}`}
                          label={capitalize(lesson.category)} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          key={`difficulty-${lesson.difficulty}`}
                          label={capitalize(lesson.difficulty)} 
                          size="small" 
                          color={difficultyColors[lesson.difficulty]} 
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Completed on: {new Date(progressItem.lastPracticed).toLocaleDateString()}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="body2">
                        Mastered all {lesson.shortcuts?.length || 0} shortcuts!
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => handleNavigateToLesson(lesson.lessonId)}
                      >
                        Practice Again
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard; 
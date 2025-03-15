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
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { RootState } from '../../store/store';
import { fetchAllLessons } from '../lessons/lessonsSlice';
import { fetchUserProgress } from '../progress/progressSlice';

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Map difficulty levels to colors
const difficultyColors: Record<string, string> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    lessons, 
    loading: lessonsLoading, 
    error: lessonsError 
  } = useSelector((state: RootState) => state.lessons);
  const { 
    progress, 
    loading: progressLoading 
  } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    dispatch(fetchAllLessons() as any);
    if (user?.id) {
      dispatch(fetchUserProgress(user.id) as any);
    }
  }, [dispatch, user?.id]);

  // Calculate overall progress
  const totalLessons = lessons.length;
  const completedLessons = progress ? progress.filter(p => p.completedShortcuts > 0).length : 0;
  const completionPercentage = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get in-progress lessons
  const inProgressLessons = progress 
    ? progress
        .filter(p => p.completedShortcuts > 0 && p.completedShortcuts < lessons.find(l => l.id === p.lessonId)?.shortcuts.length)
        .sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime())
        .slice(0, 3)
    : [];

  // Get recommended lessons
  const recommendedLessons = lessons
    .filter(lesson => {
      // If user has no progress, recommend beginner lessons
      if (!progress || progress.length === 0) {
        return lesson.difficulty === 'beginner';
      }
      
      // Otherwise, recommend lessons not started yet, prioritizing by user's level
      const userProgress = progress.find(p => p.lessonId === lesson.id);
      return !userProgress || userProgress.completedShortcuts === 0;
    })
    .slice(0, 3);
  
  // Get recent completed lessons
  const recentCompletedLessons = progress 
    ? progress
        .filter(p => {
          const lesson = lessons.find(l => l.id === p.lessonId);
          return lesson && p.completedShortcuts === lesson.shortcuts.length;
        })
        .sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime())
        .slice(0, 3)
    : [];

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
          <Grid item xs={12} sm={4}>
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
          
          <Grid item xs={12} sm={4}>
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
          
          <Grid item xs={12} sm={4}>
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
              
              const completionPercentage = Math.round((progressItem.completedShortcuts / lesson.shortcuts.length) * 100);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {lesson.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={capitalize(lesson.category)} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={capitalize(lesson.difficulty)} 
                          size="small" 
                          color={difficultyColors[lesson.difficulty] as any} 
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {progressItem.completedShortcuts} of {lesson.shortcuts.length} shortcuts completed
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
                        onClick={() => handleNavigateToLesson(lesson.id)}
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
                        label={capitalize(lesson.category)} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={capitalize(lesson.difficulty)} 
                        size="small" 
                        color={difficultyColors[lesson.difficulty] as any} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {lesson.description}
                    </Typography>
                    
                    <Typography variant="body2">
                      {lesson.shortcuts.length} shortcuts to learn
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleNavigateToLesson(lesson.id)}
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
                          label={capitalize(lesson.category)} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={capitalize(lesson.difficulty)} 
                          size="small" 
                          color={difficultyColors[lesson.difficulty] as any} 
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Completed on: {new Date(progressItem.lastPracticed).toLocaleDateString()}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="body2">
                        Mastered all {lesson.shortcuts.length} shortcuts!
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => handleNavigateToLesson(lesson.id)}
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
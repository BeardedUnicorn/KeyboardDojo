import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllLessons,
  filterLessonsByCategory,
  selectCategories,
  selectFilteredLessons,
  selectLessonsError,
  selectLessonsLoading,
} from './lessonsSlice';
import { selectIsAuthenticated, selectUser } from '../auth/authSlice';
import { 
  selectProgressLoading, 
  selectTotalLessonsCompleted,
  selectProgress
} from '../progress/progressSlice';
import { type Progress } from '../../api/progressService';
import { capitalize } from '../../utils/stringUtils';

// Color mapping for difficulty levels
const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const Lessons = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const categories = useAppSelector(selectCategories);
  const filteredLessons = useAppSelector(selectFilteredLessons);
  const lessonsLoading = useAppSelector(selectLessonsLoading);
  const lessonsError = useAppSelector(selectLessonsError);
  const progressLoading = useAppSelector(selectProgressLoading);
  const totalLessonsCompleted = useAppSelector(selectTotalLessonsCompleted);
  const progress = useAppSelector(selectProgress) as Progress | null;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Fetch lessons when component mounts, but only if there's no error and no lessons
    if (!lessonsError && filteredLessons.length === 0) {
      dispatch(fetchAllLessons());
    }
  }, [dispatch, lessonsError, filteredLessons.length]);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
    dispatch(filterLessonsByCategory(newValue));
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const getLessonProgress = (lessonId: string) => {
    const lessonProgress = progress?.completedLessons?.[lessonId];
    
    if (!lessonProgress) {
      return {
        completed: false,
        score: 0,
        attempts: 0,
      };
    }
    
    return {
      completed: true,
      score: lessonProgress.score,
      attempts: lessonProgress.attempts,
    };
  };

  // Check for error first, then loading
  if (lessonsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Alert severity="error" data-testid="error-message">
          {lessonsError}
        </Alert>
      </Box>
    );
  }

  if (lessonsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress data-testid="loading-indicator" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Keyboard Shortcuts Library
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Master keyboard shortcuts for popular applications and boost your productivity.
        </Typography>
        
        {isAuthenticated && !progressLoading && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6">
              Your Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You've completed {totalLessonsCompleted} lessons. Keep going!
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Category tabs */}
      <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Lessons" value="all" />
          {categories.map((category) => (
            <Tab
              key={category}
              label={capitalize(category)}
              value={category}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Lessons grid */}
      <Grid container spacing={3}>
        {filteredLessons.map((lesson) => {
          const { completed, score } = getLessonProgress(lesson.lessonId);
          const isPremiumLocked = lesson.isPremium && (!user || !user.isPremium);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={lesson.lessonId}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: isPremiumLocked ? 0.7 : 1,
                }}
              >
                {completed && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 1,
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {score}%
                  </Box>
                )}
                
                <CardActionArea
                  onClick={() => !isPremiumLocked && handleLessonClick(lesson.lessonId)}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  disabled={isPremiumLocked}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', mb: 1, gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={capitalize(lesson.category)}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={capitalize(lesson.difficulty)}
                        size="small"
                        color={difficultyColors[lesson.difficulty]}
                      />
                      {lesson.isPremium && (
                        <Chip
                          icon={<LockIcon />}
                          label="Premium"
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" component="h2" gutterBottom>
                      {lesson.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {lesson.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {lesson.content.shortcuts.length} shortcuts
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
                
                {isPremiumLocked && (
                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate('/pricing')}
                    >
                      Upgrade to Unlock
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      {filteredLessons.length === 0 && !lessonsLoading && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6">
            No lessons found in this category.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => {
              setSelectedCategory('all');
              dispatch(filterLessonsByCategory('all'));
            }}
          >
            View All Lessons
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Lessons; 
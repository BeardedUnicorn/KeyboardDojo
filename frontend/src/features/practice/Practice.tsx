import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  SelectChangeEvent,
  Snackbar,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { RootState } from '../../store/store';
import { fetchLessons } from '../lessons/lessonsSlice';
import { fetchUserProgress, updateUserProgress } from '../progress/progressSlice';

// Helper function to capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Map difficulty levels to colors
const difficultyColors: Record<string, string> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const Practice = () => {
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
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Extract unique categories and difficulties from lessons
  const categories = ['all', ...new Set(lessons.map(lesson => lesson.category))];
  const difficulties = ['all', ...new Set(lessons.map(lesson => lesson.difficulty))];

  useEffect(() => {
    dispatch(fetchLessons() as any);
    if (user?.id) {
      dispatch(fetchUserProgress(user.id) as any);
    }
  }, [dispatch, user?.id]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleStartRandomPractice = () => {
    const filteredLessons = lessons.filter(lesson => 
      (selectedCategory === 'all' || lesson.category === selectedCategory) &&
      (selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty)
    );
    
    if (filteredLessons.length > 0) {
      const randomLesson = filteredLessons[Math.floor(Math.random() * filteredLessons.length)];
      navigate(`/lessons/${randomLesson.id}`);
    }
  };

  const handleRetry = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  // Filter lessons based on selected category and difficulty
  const filteredLessons = lessons.filter(lesson => 
    (selectedCategory === 'all' || lesson.category === selectedCategory) &&
    (selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty)
  );

  // Group recent practice sessions by day
  const recentPractice = progress
    ? Object.entries(
        progress.reduce((acc: Record<string, any[]>, curr) => {
          const date = new Date(curr.lastPracticed).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(curr);
          return acc;
        }, {})
      )
    : [];

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
        <Alert severity="error">Error loading lessons: {lessonsError}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Practice Keyboard Shortcuts
      </Typography>
      
      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : capitalize(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                {difficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : capitalize(difficulty)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleStartRandomPractice}
            disabled={filteredLessons.length === 0}
          >
            Start Random Practice
          </Button>
        </Box>
      </Paper>
      
      {/* Recent Practice */}
      {progress && progress.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Recent Practice</Typography>
          </Box>
          
          {recentPractice.map(([date, sessions]) => (
            <Box key={date} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {date}
              </Typography>
              
              <Grid container spacing={2}>
                {sessions.map((session) => {
                  const lesson = lessons.find(l => l.id === session.lessonId);
                  return lesson ? (
                    <Grid item xs={12} sm={6} md={4} key={session.lessonId}>
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
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              Completed: {session.completedShortcuts}/{lesson.shortcuts.length}
                            </Typography>
                            <Button 
                              size="small" 
                              color="primary"
                              onClick={() => handleRetry(lesson.id)}
                            >
                              Practice Again
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ) : null;
                })}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
      
      {/* Available Lessons */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Practice Sessions ({filteredLessons.length})
        </Typography>
        
        <Grid container spacing={3}>
          {filteredLessons.map(lesson => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {lesson.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {lesson.description}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Shortcuts: {lesson.shortcuts.length}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      variant="contained"
                      color="primary"
                      onClick={() => handleRetry(lesson.id)}
                    >
                      Start Practice
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredLessons.length === 0 && (
          <Alert severity="info">
            No lessons found for the selected filters. Try changing your filters.
          </Alert>
        )}
      </Box>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Box>
  );
};

export default Practice; 
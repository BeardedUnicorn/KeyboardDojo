import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { RootState } from '../../store/store';
import { fetchUserProgress } from '../progress/progressSlice';
import { fetchAllLessons } from '../lessons/lessonsSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Map difficulty levels to colors
const difficultyColors: Record<string, string> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress, loading: progressLoading } = useSelector((state: RootState) => state.progress);
  const { lessons, loading: lessonsLoading } = useSelector((state: RootState) => state.lessons);
  
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProgress(user.id) as any);
      dispatch(fetchAllLessons() as any);
    }
  }, [dispatch, user?.id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Calculate statistics
  const completedLessons = progress ? progress.filter(p => p.completedShortcuts > 0).length : 0;
  const totalShortcutsPracticed = progress 
    ? progress.reduce((sum, p) => sum + p.completedShortcuts, 0)
    : 0;
  
  // Group progress by category
  const progressByCategory = progress && lessons 
    ? lessons.reduce((acc: Record<string, number>, lesson) => {
        const userProgress = progress.find(p => p.lessonId === lesson.id);
        if (userProgress && userProgress.completedShortcuts > 0) {
          if (!acc[lesson.category]) {
            acc[lesson.category] = 0;
          }
          acc[lesson.category] += 1;
        }
        return acc;
      }, {})
    : {};

  if (!user) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your profile.</Alert>
      </Box>
    );
  }

  if (progressLoading || lessonsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
              src={user.picture || undefined}
            >
              {!user.picture && getInitials(user.name || 'User')}
            </Avatar>
            
            <Box>
              <Typography variant="h4" component="h1">
                {user.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              {user.authProvider && (
                <Chip 
                  label={`Signed in with ${capitalize(user.authProvider)}`} 
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>
          
          <Button 
            startIcon={<EditIcon />}
            onClick={toggleEditMode}
            variant="outlined"
          >
            Edit Profile
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
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
                  {totalShortcutsPracticed}
                </Typography>
                <Typography variant="body2">
                  Shortcuts Practiced
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {user.premium ? 'Premium' : 'Free'}
                </Typography>
                <Typography variant="body2">
                  Account Type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            centered
          >
            <Tab 
              label="Progress" 
              icon={<TrendingUpIcon />} 
              iconPosition="start"
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
            />
            <Tab 
              label="Completed Lessons" 
              icon={<SchoolIcon />} 
              iconPosition="start"
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Progress by Category
          </Typography>
          
          {Object.keys(progressByCategory).length > 0 ? (
            <Grid container spacing={3}>
              {Object.entries(progressByCategory).map(([category, count]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {capitalize(category)}
                      </Typography>
                      <Typography variant="body1">
                        {count} {count === 1 ? 'lesson' : 'lessons'} completed
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              You haven't completed any lessons yet. Start practicing to track your progress!
            </Alert>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Completed Lessons
          </Typography>
          
          {progress && progress.some(p => p.completedShortcuts > 0) ? (
            <Grid container spacing={3}>
              {progress
                .filter(p => p.completedShortcuts > 0)
                .map(p => {
                  const lesson = lessons.find(l => l.id === p.lessonId);
                  return lesson ? (
                    <Grid item xs={12} sm={6} md={4} key={p.lessonId}>
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
                            Completed: {p.completedShortcuts}/{lesson.shortcuts.length} shortcuts
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary">
                            Last practiced: {new Date(p.lastPracticed).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" href={`/lessons/${lesson.id}`}>
                            Practice Again
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ) : null;
                })}
            </Grid>
          ) : (
            <Alert severity="info">
              You haven't completed any lessons yet. Start practicing to see your completed lessons here!
            </Alert>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Profile; 
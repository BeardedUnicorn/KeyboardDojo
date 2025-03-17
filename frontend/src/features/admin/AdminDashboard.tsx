import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentsIcon from '@mui/icons-material/Payments';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardStats, AdminDashboardStats } from '../../api/adminService';

// Default stats for initial render
const defaultStats: AdminDashboardStats = {
  totalUsers: 0,
  totalLessons: 0,
  activeUsers: 0,
  premiumUsers: 0,
  recentUsers: [],
  recentLessons: [],
  userEngagement: {
    beginnerCompletionRate: 0,
    intermediateCompletionRate: 0,
    advancedCompletionRate: 0,
  }
};

// Mock data for fallback
const mockStats: AdminDashboardStats = {
  totalUsers: 1248,
  totalLessons: 42,
  activeUsers: 876,
  premiumUsers: 384,
  recentUsers: [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', joinDate: '2023-06-15' },
    { id: '2', name: 'Maria Garcia', email: 'maria@example.com', joinDate: '2023-06-14' },
    { id: '3', name: 'James Wilson', email: 'james@example.com', joinDate: '2023-06-13' },
  ],
  recentLessons: [
    { id: '1', title: 'VS Code Essentials', category: 'Development', createdAt: '2023-06-15' },
    { id: '2', title: 'Photoshop Shortcuts', category: 'Design', createdAt: '2023-06-14' },
    { id: '3', title: 'Excel Power User', category: 'Productivity', createdAt: '2023-06-13' },
  ],
  userEngagement: {
    beginnerCompletionRate: 75,
    intermediateCompletionRate: 62,
    advancedCompletionRate: 41,
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats>(defaultStats);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Use mock data if selected
        setStats(mockStats);
      } else {
        // Try to fetch real data
        try {
          const dashboardStats = await getAdminDashboardStats();
          setStats(dashboardStats);
        } catch (err) {
          console.error('Failed to fetch admin dashboard stats:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to load dashboard data: ${errorMessage}. Please try again or use mock data.`);
          
          // If we have no data yet, set mock data as fallback
          if (stats === defaultStats) {
            console.log('Using mock data as fallback');
            setStats(mockStats);
            setUseMockData(true);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error in fetchStats:', err);
      setError('An unexpected error occurred. Please try again or use mock data.');
      
      // If we have no data yet, set mock data as fallback
      if (stats === defaultStats) {
        console.log('Using mock data as fallback after unexpected error');
        setStats(mockStats);
        setUseMockData(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [useMockData]);

  const handleToggleMockData = () => {
    setUseMockData(prev => !prev);
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const handleNavigateToLessons = () => {
    navigate('/admin/lessons');
  };

  const StatCard = ({ icon, title, value, color }: StatCardProps) => (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <Avatar sx={{ bgcolor: color }}>
          {icon}
        </Avatar>
      </Box>
      <Typography variant="h4">{value.toLocaleString()}</Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color={useMockData ? "warning" : "primary"}
            onClick={handleToggleMockData}
            sx={{ mr: 1 }}
          >
            {useMockData ? "Using Mock Data" : "Use Mock Data"}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Total Users"
            value={stats.totalUsers}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SchoolIcon />}
            title="Total Lessons"
            value={stats.totalLessons}
            color="secondary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Active Users"
            value={stats.activeUsers}
            color="success.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PaymentsIcon />}
            title="Premium Users"
            value={stats.premiumUsers}
            color="warning.main"
          />
        </Grid>
      </Grid>
      
      {/* Lessons Management Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Lessons Management" 
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNavigateToLessons}
                >
                  Manage Lessons
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Premium</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentLessons.map((lesson) => (
                      <TableRow key={lesson.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              bgcolor: 
                                lesson.category === 'Development' ? 'primary.main' : 
                                lesson.category === 'Design' ? 'secondary.main' : 'success.main',
                              width: 30,
                              height: 30,
                              mr: 1
                            }}>
                              <MenuBookIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            {lesson.title}
                          </Box>
                        </TableCell>
                        <TableCell>{lesson.category}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stats.recentLessons.indexOf(lesson) % 3 === 0 ? 'Beginner' : 
                                  stats.recentLessons.indexOf(lesson) % 3 === 1 ? 'Intermediate' : 'Advanced'} 
                            size="small"
                            color={stats.recentLessons.indexOf(lesson) % 3 === 0 ? 'success' : 
                                  stats.recentLessons.indexOf(lesson) % 3 === 1 ? 'warning' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={stats.recentLessons.indexOf(lesson) % 2 === 0 ? 'Free' : 'Premium'} 
                            size="small"
                            color={stats.recentLessons.indexOf(lesson) % 2 === 0 ? 'default' : 'primary'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{lesson.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {stats.recentLessons.length} of {stats.totalLessons} lessons
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Users" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {stats.recentUsers.length > 0 ? (
                <List>
                  {stats.recentUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{user.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={user.name} 
                          secondary={user.email}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                        <Chip 
                          label={user.joinDate} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No recent users</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Lessons" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {stats.recentLessons.length > 0 ? (
                <List>
                  {stats.recentLessons.map((lesson) => (
                    <React.Fragment key={lesson.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 
                            lesson.category === 'Development' ? 'primary.main' : 
                            lesson.category === 'Design' ? 'secondary.main' : 'success.main' 
                          }}>
                            <MenuBookIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={lesson.title} 
                          secondary={`${lesson.category} • ${new Date(lesson.createdAt).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No recent lessons</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader title="User Engagement" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>Beginner Lessons</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.userEngagement.beginnerCompletionRate} 
                    sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stats.userEngagement.beginnerCompletionRate}% completion rate
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>Intermediate Lessons</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.userEngagement.intermediateCompletionRate} 
                    sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                    color="secondary"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stats.userEngagement.intermediateCompletionRate}% completion rate
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>Advanced Lessons</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.userEngagement.advancedCompletionRate} 
                    sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                    color="warning"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stats.userEngagement.advancedCompletionRate}% completion rate
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 
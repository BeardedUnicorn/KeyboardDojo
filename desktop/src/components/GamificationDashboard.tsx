import {
  EmojiEvents as TrophyIcon,
  Timeline as ProgressIcon,
  Favorite as HeartIcon,
  Diamond as GemIcon,
  LocalFireDepartment as StreakIcon,
  Inventory2 as InventoryIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAchievementsRedux } from '@/hooks';
import Store from '@components/Store.tsx';

import { useXP } from '../hooks/useXP';

import CurrencyDisplay from './CurrencyDisplay';
import HeartsDisplay from './HeartsDisplay';
import Inventory from './Inventory';

import type { ReactNode, FC , SyntheticEvent } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`gamification-tabpanel-${index}`}
      aria-labelledby={`gamification-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const GamificationDashboard: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const { level, totalXP } = useXP();
  const { achievements, completedAchievements } = useAchievementsRedux();
  const totalAchievements = achievements.length;
  const completedCount = completedAchievements.length;

  useEffect(() => {
    // Load streak data
    const loadStreakData = async () => {
      try {
        // This would typically come from a streakService
        // For now, we'll use mock data
        setStreakData({
          current: 3,
          longest: 7,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load streak data:', error);
        setLoading(false);
      }
    };

    loadStreakData();
  }, []);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewAchievements = () => {
    navigate('/achievements');
  };

  const handleViewProgress = () => {
    navigate('/progress-dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gamification Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Level Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <ProgressIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Level</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                {level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalXP} XP Total
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleViewProgress} fullWidth>
                View Progress
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Achievements Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              }}
            >
              <TrophyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Achievements</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {totalAchievements} Completed
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleViewAchievements} fullWidth>
                View Achievements
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Currency Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.info.main,
                color: theme.palette.info.contrastText,
              }}
            >
              <GemIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Currency</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <CurrencyDisplay variant="large" showLabel={false} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gems to spend in store
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => setActiveTab(1)}
                fullWidth
              >
                Visit StorePage
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Streak Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
              }}
            >
              <StreakIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Daily Streak</Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                {streakData.current}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Longest: {streakData.longest} days
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/home')}
                fullWidth
              >
                Practice Today
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Hearts Display */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HeartIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Hearts</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <HeartsDisplay variant="large" showRefillTimer />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
          Hearts are required to attempt lessons and challenges. They regenerate over time or can be purchased.
        </Typography>
      </Paper>

      {/* Tabs for StorePage and Inventory */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<InventoryIcon />}
            label="Inventory"
            id="gamification-tab-0"
            aria-controls="gamification-tabpanel-0"
          />
          <Tab
            icon={<StoreIcon />}
            label="StorePage"
            id="gamification-tab-1"
            aria-controls="gamification-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Inventory />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Store />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default GamificationDashboard;

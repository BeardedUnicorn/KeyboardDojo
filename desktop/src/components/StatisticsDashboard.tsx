import {
  Timeline as TimelineIcon,
  EmojiEvents as AchievementsIcon,
  Favorite as HeartIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import React, { useMemo } from 'react';

import { useAppSelector } from '../store';
import { selectUserProgress } from '../store/slices/userProgressSlice';
import { formatDuration } from '../utils/dateTimeUtils';

import type { FC, ReactNode } from 'react';

interface StatCard {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

interface StatisticsDashboardProps {
  showDetailedStats?: boolean;
}

/**
 * Component to display user statistics and progress metrics
 */
const StatisticsDashboard: FC<StatisticsDashboardProps> = ({
  showDetailedStats = true,
}) => {
  const progress = useAppSelector(selectUserProgress);
  const isLoading = progress.isLoading;
  const theme = useTheme();

  // Calculate statistics from user progress
  const stats = useMemo(() => {
    if (!progress || isLoading) return null;

    // For demo purposes, generate some sample stats
    // In a real implementation, these would be calculated from actual user data

    // Basic stats that are available in the progress object
    const basicStats: StatCard[] = [
      {
        title: 'Level',
        value: progress.level,
        icon: <TrendingUpIcon />,
        color: theme.palette.primary.main,
        subtitle: `${progress.xp} XP total`,
      },
      {
        title: 'Streak',
        value: progress.streakDays,
        icon: <TimelineIcon />,
        color: theme.palette.warning.main,
        subtitle: 'days',
      },
    ];

    // Additional stats that would be calculated from user history
    const detailedStats: StatCard[] = [
      {
        title: 'Shortcuts Mastered',
        value: 87, // Demo value
        icon: <SpeedIcon />,
        color: theme.palette.success.main,
        subtitle: 'out of 250',
      },
      {
        title: 'Achievements',
        value: 12, // Demo value
        icon: <AchievementsIcon />,
        color: theme.palette.info.main,
        subtitle: 'unlocked',
      },
      {
        title: 'Practice Sessions',
        value: 42, // Demo value
        icon: <TimeIcon />,
        color: theme.palette.secondary.main,
        subtitle: 'completed',
      },
      {
        title: 'Hearts Earned',
        value: 35, // Demo value
        icon: <HeartIcon />,
        color: theme.palette.error.main,
        subtitle: 'total',
      },
    ];

    return {
      basicStats,
      detailedStats,
      practiceTime: 1250, // Demo value in minutes
      accuracy: 78, // Demo percentage
      mostPracticedCategory: 'Navigation',
      leastPracticedCategory: 'Refactoring',
      bestPerformingCategory: 'Editing',
      worstPerformingCategory: 'Debugging',
    };
  }, [progress, isLoading, theme]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No statistics available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Basic Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.basicStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: stat.color,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>

              <Typography variant="h4" component="div" fontWeight="bold">
                {stat.value}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                {stat.title}
              </Typography>

              {stat.subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {showDetailedStats && (
        <>
          {/* Detailed Stats */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom>
              Detailed Statistics
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Detailed Stat Cards */}
              {stats.detailedStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${stat.color}20`,
                        color: stat.color,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {stat.icon}
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h6" component="div" fontWeight="medium">
                        {stat.value}
                      </Typography>
                      {stat.subtitle && (
                        <Typography variant="caption" color="text.secondary">
                          {stat.subtitle}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}

              {/* Additional Stats */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Practice Time
                  </Typography>
                  <Typography variant="h6" component="div" fontWeight="medium">
                    {formatDuration(stats.practiceTime * 60)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    across all sessions
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Accuracy
                  </Typography>
                  <Typography variant="h6" component="div" fontWeight="medium">
                    {stats.accuracy}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    correct shortcuts
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category Performance
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Most Practiced:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {stats.mostPracticedCategory}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Least Practiced:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {stats.leastPracticedCategory}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Best Performance:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        {stats.bestPerformingCategory}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Needs Improvement:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="warning.main">
                        {stats.worstPerformingCategory}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StatisticsDashboard;

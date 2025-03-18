import {
  Box,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import React, { useMemo } from 'react';

import { useAppSelector } from '../../store';
import { selectUserProgress } from '../../store/slices/userProgressSlice';

import type { FC } from 'react';

interface PracticeSession {
  date: Date;
  count: number;
  xpEarned?: number;
}

interface PracticeHeatmapProps {
  title?: string;
  weeks?: number;
  showLabels?: boolean;
}

/**
 * Component to display a heatmap of practice sessions over time
 */
const PracticeHeatmap: FC<PracticeHeatmapProps> = ({
  title = 'Practice Activity',
  weeks = 12,
  showLabels = true,
}) => {
  const userProgress = useAppSelector(selectUserProgress);
  const { completedLessons, isLoading } = userProgress;
  const theme = useTheme();

  // Calculate practice data based on completed lessons
  const practiceData = useMemo(() => {
    if (isLoading || !completedLessons) return [];

    return completedLessons.map((lesson) => ({
      date: new Date(lesson.completedAt),
      count: 1,
      xpEarned: lesson.score,
    }));
  }, [completedLessons, isLoading]);

  // Organize data into a grid format for the heatmap
  const heatmapData = useMemo(() => {
    if (!practiceData) return null;

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grid: (PracticeSession | null)[][] = Array(7).fill(null).map(() => Array(weeks).fill(null));

    // Calculate the start date (first Sunday before or on the start date)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * 7 - 1));
    const startDay = startDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    startDate.setDate(startDate.getDate() - startDay);

    // Fill the grid with practice sessions
    practiceData.forEach((session) => {
      const sessionDate = new Date(session.date);
      const diffTime = Math.abs(sessionDate.getTime() - startDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < weeks * 7) {
        const col = Math.floor(diffDays / 7);
        const row = sessionDate.getDay();

        if (col < weeks) {
          grid[row][col] = session;
        }
      }
    });

    return {
      dayLabels,
      grid,
    };
  }, [practiceData, weeks]);

  // Function to get color based on practice intensity
  const getColorByIntensity = (count: number | null): string => {
    if (!count) return theme.palette.action.disabledBackground;

    const baseColor = theme.palette.primary.main;
    const opacity = Math.min(0.2 + (count * 0.15), 0.9);

    // Extract RGB components from the hex color
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!heatmapData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No practice data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          {/* Day labels column */}
          <Box sx={{ width: 40, flexShrink: 0 }}>
            <Box sx={{ height: 30 }} /> {/* Empty space for alignment */}
            {heatmapData.dayLabels.map((day, index) => (
              <Box
                key={day}
                sx={{
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              >
                {day}
              </Box>
            ))}
          </Box>

          {/* Heatmap grid */}
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {Array(weeks).fill(null).map((_, weekIndex) => (
              <Box key={weekIndex} sx={{ width: 30, flexShrink: 0 }}>
                {/* Week label */}
                <Box
                  sx={{
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  }}
                >
                  {weekIndex % 4 === 0 ? `W${Math.floor(weekIndex / 4) + 1}` : ''}
                </Box>

                {/* Days in the week */}
                {heatmapData.grid.map((row, dayIndex) => {
                  const session = row[weekIndex];
                  return (
                    <Tooltip
                      key={dayIndex}
                      title={session ?
                        `${session.date.toLocaleDateString()}: ${session.count} session${session.count !== 1 ? 's' : ''}, ${session.xpEarned} XP earned` :
                        'No practice'
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 1,
                            bgcolor: getColorByIntensity(session?.count || null),
                            border: 1,
                            borderColor: 'divider',
                          }}
                        />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: getColorByIntensity(null),
                border: 1,
                borderColor: 'divider',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              No practice
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: getColorByIntensity(1),
                border: 1,
                borderColor: 'divider',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Light
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: getColorByIntensity(3),
                border: 1,
                borderColor: 'divider',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Medium
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: getColorByIntensity(5),
                border: 1,
                borderColor: 'divider',
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Intense
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PracticeHeatmap;

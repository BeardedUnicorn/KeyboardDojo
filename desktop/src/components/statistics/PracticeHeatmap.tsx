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

import type { FC, CSSProperties } from 'react';

interface PracticeSession {
  date: Date;
  count: number;
  xpEarned?: number;
}

interface PracticeHeatmapProps {
  title?: string;
  weeks?: number;
  showLabels?: boolean;
  /**
   * Unique ID for accessibility purposes
   */
  heatmapId?: string;
  /**
   * Description for screen readers
   */
  accessibilityDescription?: string;
}

// Style for elements that should be visually hidden but available to screen readers
const visuallyHiddenStyle: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
};

/**
 * Component to display a heatmap of practice sessions over time
 */
const PracticeHeatmap: FC<PracticeHeatmapProps> = ({
  title = 'Practice Activity',
  weeks = 12,
  showLabels = true,
  heatmapId = 'practice-heatmap',
  accessibilityDescription,
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
      startDate,
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

  // Function to get intensity description for screen readers
  const getIntensityDescription = (count: number | null): string => {
    if (!count) return 'No practice';
    if (count === 1) return 'Light practice';
    if (count === 2) return 'Moderate practice';
    return 'Intensive practice';
  };

  // Function to get formatted date for screen readers
  const getFormattedDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
    });
  };

  // Helper to safely focus elements with typechecking
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ display: 'flex', justifyContent: 'center', p: 3 }}
        aria-live="polite" 
        role="status"
        aria-busy="true"
      >
        <CircularProgress aria-label="Loading practice data" />
      </Box>
    );
  }

  if (!heatmapData) {
    return (
      <Box 
        sx={{ p: 3 }}
        aria-live="polite"
        role="status"
      >
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
      role="region"
      aria-labelledby={`${heatmapId}-title`}
      aria-describedby={accessibilityDescription ? `${heatmapId}-description` : undefined}
    >
      <Typography 
        variant="h6" 
        component="h3" 
        id={`${heatmapId}-title`}
        gutterBottom
      >
        {title}
      </Typography>

      {accessibilityDescription && (
        <Typography sx={{ display: 'none' }} id={`${heatmapId}-description`}>
          {accessibilityDescription}
        </Typography>
      )}

      {/* Screen reader summary of practice data */}
      <div aria-live="polite" style={visuallyHiddenStyle}>
        {practiceData.length > 0 ? (
          <>
            You have {practiceData.length} practice sessions over the past {weeks} weeks.
            {practiceData.length > 0 && ` Your most recent practice was on ${getFormattedDate(practiceData[0].date)}.`}
          </>
        ) : (
          'You have no practice sessions recorded in the past period.'
        )}
      </div>

      <Box sx={{ overflowX: 'auto' }}>
        <Box 
          sx={{ display: 'flex', mb: 2 }}
          role="grid"
          aria-label={`${title} heatmap for the past ${weeks} weeks`}
        >
          {/* Day labels column */}
          <Box 
            sx={{ width: 40, flexShrink: 0 }}
            role="rowgroup"
            aria-label="Days of the week"
          >
            <Box sx={{ height: 30 }} role="row" /> {/* Empty space for alignment */}
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
                role="rowheader"
                id={`${heatmapId}-day-${index}`}
              >
                {day}
              </Box>
            ))}
          </Box>

          {/* Heatmap grid */}
          <Box 
            sx={{ display: 'flex', flexGrow: 1 }}
            role="rowgroup"
          >
            {Array(weeks).fill(null).map((_, weekIndex) => {
              // Calculate the start date for this week column
              const weekStartDate = new Date(heatmapData.startDate);
              weekStartDate.setDate(weekStartDate.getDate() + (weekIndex * 7));
              
              return (
                <Box 
                  key={weekIndex} 
                  sx={{ width: 30, flexShrink: 0 }}
                  role="row"
                  aria-label={`Week ${Math.floor(weekIndex / 4) + 1}`}
                >
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
                    role="columnheader"
                    id={`${heatmapId}-week-${weekIndex}`}
                  >
                    {weekIndex % 4 === 0 ? `W${Math.floor(weekIndex / 4) + 1}` : ''}
                  </Box>

                  {/* Days in the week */}
                  {heatmapData.grid.map((row, dayIndex) => {
                    const session = row[weekIndex];
                    const dayDate = new Date(weekStartDate);
                    dayDate.setDate(dayDate.getDate() + dayIndex);
                    
                    const dayFormatted = getFormattedDate(dayDate);
                    const intensity = session ? session.count : 0;
                    const xpEarned = session?.xpEarned || 0;
                    
                    const cellId = `${heatmapId}-cell-${weekIndex}-${dayIndex}`;
                    
                    return (
                      <Tooltip
                        key={dayIndex}
                        title={session ?
                          `${dayFormatted}: ${session.count} session${session.count !== 1 ? 's' : ''}, ${session.xpEarned} XP earned` :
                          `${dayFormatted}: No practice`
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
                          role="gridcell"
                          tabIndex={0}
                          aria-labelledby={`${heatmapId}-day-${dayIndex} ${heatmapId}-week-${weekIndex}`}
                          aria-describedby={cellId}
                          onKeyDown={(e) => {
                            // Handle keyboard navigation
                            if (e.key === 'ArrowRight' && weekIndex < weeks - 1) {
                              focusElement(`[aria-labelledby="${heatmapId}-day-${dayIndex} ${heatmapId}-week-${weekIndex + 1}"]`);
                            } else if (e.key === 'ArrowLeft' && weekIndex > 0) {
                              focusElement(`[aria-labelledby="${heatmapId}-day-${dayIndex} ${heatmapId}-week-${weekIndex - 1}"]`);
                            } else if (e.key === 'ArrowDown' && dayIndex < 6) {
                              focusElement(`[aria-labelledby="${heatmapId}-day-${dayIndex + 1} ${heatmapId}-week-${weekIndex}"]`);
                            } else if (e.key === 'ArrowUp' && dayIndex > 0) {
                              focusElement(`[aria-labelledby="${heatmapId}-day-${dayIndex - 1} ${heatmapId}-week-${weekIndex}"]`);
                            }
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
                              '&:focus-within': {
                                outline: `2px solid ${theme.palette.primary.main}`,
                                outlineOffset: '2px',
                              },
                            }}
                          />
                          
                          {/* Hidden description for screen readers */}
                          <Typography 
                            sx={{ display: 'none' }} 
                            id={cellId}
                          >
                            {dayFormatted}: {getIntensityDescription(intensity)}
                            {intensity > 0 && `, ${xpEarned} XP earned`}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Legend */}
        <Box 
          sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}
          role="list"
          aria-label="Heatmap intensity legend"
        >
          <Box 
            sx={{ display: 'flex', alignItems: 'center' }}
            role="listitem"
          >
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
              aria-hidden="true"
            />
            <Typography variant="caption" color="text.secondary">
              No practice
            </Typography>
          </Box>

          <Box 
            sx={{ display: 'flex', alignItems: 'center' }}
            role="listitem"
          >
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
              aria-hidden="true"
            />
            <Typography variant="caption" color="text.secondary">
              Light
            </Typography>
          </Box>

          <Box 
            sx={{ display: 'flex', alignItems: 'center' }}
            role="listitem"
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: getColorByIntensity(2),
                border: 1,
                borderColor: 'divider',
                mr: 1,
              }}
              aria-hidden="true"
            />
            <Typography variant="caption" color="text.secondary">
              Medium
            </Typography>
          </Box>

          <Box 
            sx={{ display: 'flex', alignItems: 'center' }}
            role="listitem"
          >
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
              aria-hidden="true"
            />
            <Typography variant="caption" color="text.secondary">
              High
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PracticeHeatmap;

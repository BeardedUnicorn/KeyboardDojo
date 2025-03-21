import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Tooltip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import React, { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { selectUserProgress } from '@store/slices';

import type { IApplicationTrack, IModule } from '@/types/progress/ICurriculum';
import type { FC } from 'react';

// Style to visually hide elements but keep them accessible to screen readers
const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

// Define the track progress interface based on the component usage
interface TrackProgress {
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  modules: {
    [moduleId: string]: {
      completed: boolean;
      completedLessons: number;
      totalLessons: number;
    }
  };
}

// Define extended user progress interface
interface ExtendedUserProgress {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActivity: string;
  trackProgress: {
    [trackId: string]: TrackProgress;
  };
}

interface CurriculumProgressChartProps {
  tracks?: IApplicationTrack[];
  showDetails?: boolean;
  /**
   * ID for accessibility purposes
   */
  chartId?: string;
  /**
   * Additional context for screen readers
   */
  accessibilityDescription?: string;
}

/**
 * Component to visualize curriculum progress across tracks and modules
 */
const CurriculumProgressChart: FC<CurriculumProgressChartProps> = ({
  tracks,
  showDetails = true,
  chartId = 'curriculum-progress-chart',
  accessibilityDescription,
}) => {
  const userProgress = useAppSelector(selectUserProgress);
  const { completedLessons = {}, completedModules = {}, isLoading = false } = userProgress || {};
  const theme = useTheme();

  // Calculate progress percentages for each track and module
  const progressData = useMemo(() => {
    if (!tracks || !userProgress || !completedLessons || !completedModules || isLoading) return null;

    // Cast progress to extended type that includes trackProgress
    const extendedProgress = userProgress as unknown as ExtendedUserProgress;

    return tracks.map((track) => {
      // Calculate track completion percentage
      const trackProgress = extendedProgress.trackProgress?.[track.id] || {
        completedLessons: 0,
        totalLessons: 0,
        completedModules: 0,
        modules: {},
      };

      const trackCompletionPercentage =
        trackProgress.totalLessons > 0
          ? Math.round(
              (trackProgress.completedLessons / trackProgress.totalLessons) * 100,
            )
          : 0;

      // Calculate module completion percentages
      const moduleData = track.modules.map((module: IModule) => {
        const moduleProgress = trackProgress.modules[module.id] || {
          completed: false,
          completedLessons: 0,
          totalLessons: module.lessons.length,
        };

        const moduleCompletionPercentage =
          moduleProgress.totalLessons > 0
            ? Math.round(
                (moduleProgress.completedLessons / moduleProgress.totalLessons) *
                  100,
              )
            : 0;

        return {
          module,
          completionPercentage: moduleCompletionPercentage,
          completedLessons: moduleProgress.completedLessons,
          totalLessons: moduleProgress.totalLessons,
        };
      });

      return {
        track,
        completionPercentage: trackCompletionPercentage,
        completedLessons: trackProgress.completedLessons,
        totalLessons: trackProgress.totalLessons,
        modules: moduleData,
      };
    });
  }, [tracks, userProgress, completedLessons, completedModules, isLoading]);

  // Get color based on completion percentage
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 40) return theme.palette.info.main;
    if (percentage > 0) return theme.palette.warning.main;
    return theme.palette.grey[400];
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ display: 'flex', justifyContent: 'center', p: 3 }}
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress aria-label="Loading curriculum progress data" />
      </Box>
    );
  }

  // Show loading state if isLoading is true or userProgress is undefined
  if (isLoading || !userProgress) {
    return (
      <Box 
        sx={{ display: 'flex', justifyContent: 'center', p: 3 }}
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress aria-label="Loading curriculum progress data" />
      </Box>
    );
  }

  if (!progressData) {
    return (
      <Box 
        sx={{ p: 3 }}
        aria-live="polite"
        role="status"
      >
        <Typography variant="body1" color="text.secondary">
          No curriculum data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      role="region" 
      aria-labelledby={`${chartId}-title`}
    >
      <Typography id={`${chartId}-title`} variant="h2" sx={visuallyHidden}>
        Curriculum Progress Chart
      </Typography>
      
      {accessibilityDescription && (
        <Typography id={`${chartId}-description`} sx={visuallyHidden}>
          {accessibilityDescription}
        </Typography>
      )}
      
      <div role="list" aria-label="Curriculum Tracks">
        {progressData.map(
          ({ track, completionPercentage, completedLessons, totalLessons, modules }, trackIndex) => (
            <Paper
              key={track.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
              role="listitem"
              aria-labelledby={`${chartId}-track-${trackIndex}-title`}
              tabIndex={0}
            >
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="h3"
                    id={`${chartId}-track-${trackIndex}-title`}
                  >
                    {track.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    id={`${chartId}-track-${trackIndex}-progress`}
                  >
                    {completedLessons} / {totalLessons} lessons completed
                  </Typography>
                </Box>

                <Box
                  role="progressbar"
                  aria-valuenow={completionPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-labelledby={`${chartId}-track-${trackIndex}-title ${chartId}-track-${trackIndex}-progress`}
                >
                  <Tooltip title={`${completionPercentage}% complete`}>
                    <LinearProgress
                      variant="determinate"
                      value={completionPercentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getColorByPercentage(completionPercentage),
                        },
                      }}
                    />
                  </Tooltip>
                </Box>
                
                {/* Screen reader text for progress */}
                <Typography sx={visuallyHidden}>
                  {track.name} track: {completionPercentage}% complete, {completedLessons} of {totalLessons} lessons completed.
                </Typography>
              </Box>

              {showDetails && (
                <Grid 
                  container 
                  spacing={2}
                  role="list"
                  aria-label={`${track.name} modules`}
                >
                  {modules.map(
                    ({
                      module,
                      completionPercentage,
                      completedLessons,
                      totalLessons,
                    }, moduleIndex) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        key={module.id}
                        role="listitem"
                      >
                        <Box
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:focus-within': {
                              outline: `2px solid ${theme.palette.primary.main}`,
                              outlineOffset: '2px',
                            },
                          }}
                          tabIndex={0}
                          aria-labelledby={`${chartId}-module-${trackIndex}-${moduleIndex}-title ${chartId}-module-${trackIndex}-${moduleIndex}-progress`}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              fontWeight="medium"
                              id={`${chartId}-module-${trackIndex}-${moduleIndex}-title`}
                            >
                              {module.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              id={`${chartId}-module-${trackIndex}-${moduleIndex}-progress`}
                            >
                              {completedLessons}/{totalLessons}
                            </Typography>
                          </Box>

                          <Box
                            role="progressbar"
                            aria-valuenow={completionPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-labelledby={`${chartId}-module-${trackIndex}-${moduleIndex}-title ${chartId}-module-${trackIndex}-${moduleIndex}-progress`}
                          >
                            <Tooltip title={`${completionPercentage}% complete`}>
                              <LinearProgress
                                variant="determinate"
                                value={completionPercentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: theme.palette.grey[200],
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getColorByPercentage(completionPercentage),
                                  },
                                }}
                              />
                            </Tooltip>
                          </Box>
                          
                          {/* Screen reader text for module progress */}
                          <Typography sx={visuallyHidden}>
                            {module.title} module: {completionPercentage}% complete, {completedLessons} of {totalLessons} lessons completed.
                          </Typography>
                        </Box>
                      </Grid>
                    ),
                  )}
                </Grid>
              )}
            </Paper>
          ),
        )}
      </div>
    </Box>
  );
};

export default CurriculumProgressChart;

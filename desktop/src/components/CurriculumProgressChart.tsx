import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Grid, 
  Tooltip, 
  useTheme,
  CircularProgress
} from '@mui/material';
import { useUserProgress } from '../contexts/UserProgressContext';
import { ApplicationTrack as Track, Module, Lesson } from '../types/curriculum';

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
  tracks?: Track[];
  showDetails?: boolean;
}

/**
 * Component to visualize curriculum progress across tracks and modules
 */
const CurriculumProgressChart: React.FC<CurriculumProgressChartProps> = ({
  tracks,
  showDetails = true
}) => {
  const { progress, isLoading } = useUserProgress();
  const theme = useTheme();

  // Calculate progress percentages for each track and module
  const progressData = useMemo(() => {
    if (!tracks || !progress || isLoading) return null;

    // Cast progress to extended type that includes trackProgress
    const extendedProgress = progress as unknown as ExtendedUserProgress;

    return tracks.map(track => {
      // Calculate track completion percentage
      const trackProgress = extendedProgress.trackProgress?.[track.id] || { 
        completedLessons: 0, 
        totalLessons: 0,
        completedModules: 0,
        modules: {} 
      };
      
      const trackCompletionPercentage = trackProgress.totalLessons > 0
        ? Math.round((trackProgress.completedLessons / trackProgress.totalLessons) * 100)
        : 0;

      // Calculate module completion percentages
      const moduleData = track.modules.map((module: Module) => {
        const moduleProgress = trackProgress.modules[module.id] || { 
          completed: false, 
          completedLessons: 0, 
          totalLessons: module.lessons.length 
        };
        
        const moduleCompletionPercentage = moduleProgress.totalLessons > 0
          ? Math.round((moduleProgress.completedLessons / moduleProgress.totalLessons) * 100)
          : 0;

        return {
          module,
          completionPercentage: moduleCompletionPercentage,
          completedLessons: moduleProgress.completedLessons,
          totalLessons: moduleProgress.totalLessons
        };
      });

      return {
        track,
        completionPercentage: trackCompletionPercentage,
        completedLessons: trackProgress.completedLessons,
        totalLessons: trackProgress.totalLessons,
        modules: moduleData
      };
    });
  }, [tracks, progress, isLoading]);

  // Get color based on completion percentage
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 40) return theme.palette.info.main;
    if (percentage > 0) return theme.palette.warning.main;
    return theme.palette.grey[400];
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!progressData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No curriculum data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {progressData.map(({ track, completionPercentage, completedLessons, totalLessons, modules }) => (
        <Paper 
          key={track.id} 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h3">
                {track.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedLessons} / {totalLessons} lessons completed
              </Typography>
            </Box>
            
            <Tooltip title={`${completionPercentage}% complete`}>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getColorByPercentage(completionPercentage)
                  }
                }} 
              />
            </Tooltip>
          </Box>
          
          {showDetails && (
            <Grid container spacing={2}>
              {modules.map(({ module, completionPercentage, completedLessons, totalLessons }) => (
                <Grid item xs={12} sm={6} md={4} key={module.id}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {module.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {completedLessons}/{totalLessons}
                      </Typography>
                    </Box>
                    
                    <Tooltip title={`${completionPercentage}% complete`}>
                      <LinearProgress 
                        variant="determinate" 
                        value={completionPercentage} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getColorByPercentage(completionPercentage)
                          }
                        }} 
                      />
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default CurriculumProgressChart; 
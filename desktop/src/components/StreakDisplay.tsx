import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useUserProgress } from '../contexts/UserProgressContext';

interface StreakDisplayProps {
  compact?: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ compact = false }) => {
  const theme = useTheme();
  const { progress } = useUserProgress();
  
  if (!progress) {
    return null;
  }
  
  const { streakDays } = progress;
  
  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalFireDepartmentIcon 
          color="error" 
          sx={{ mr: 0.5, fontSize: 20 }} 
        />
        <Typography variant="body2" fontWeight="medium">
          {streakDays} day{streakDays !== 1 ? 's' : ''} streak
        </Typography>
      </Box>
    );
  }
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper
      }}
    >
      <LocalFireDepartmentIcon 
        color="error" 
        sx={{ mr: 1.5, fontSize: 32 }} 
      />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {streakDays} Day{streakDays !== 1 ? 's' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Streak
        </Typography>
      </Box>
    </Paper>
  );
};

export default StreakDisplay; 
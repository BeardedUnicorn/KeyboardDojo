import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { useUserProgress } from '../contexts/UserProgressContext';
import { userProgressService } from '../services/userProgressService';

interface LevelProgressBarProps {
  compact?: boolean;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ compact = false }) => {
  const { progress } = useUserProgress();
  
  if (!progress) {
    return null;
  }
  
  const { level, xp } = progress;
  const nextLevelXP = userProgressService.getNextLevelXP();
  const progressPercentage = nextLevelXP ? (xp / nextLevelXP) * 100 : 100;
  
  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" fontWeight="bold" mr={1}>
          Level {level}
        </Typography>
        <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
          <Tooltip title={`${xp}/${nextLevelXP} XP`}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" ml={1}>
          {xp}/{nextLevelXP} XP
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">Level {level}</Typography>
        <Typography variant="body2" color="text.secondary">
          {xp}/{nextLevelXP} XP
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{ height: 10, borderRadius: 5 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Current
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Next Level
        </Typography>
      </Box>
    </Box>
  );
};

export default LevelProgressBar; 
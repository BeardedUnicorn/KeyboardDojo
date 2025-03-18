import StarIcon from '@mui/icons-material/Star';
import { Box, Typography, Tooltip, LinearProgress, useTheme } from '@mui/material';
import React from 'react';

import { useAppSelector } from '../store';
import { selectXp, selectLevel, selectUserProgress } from '../store/slices/userProgressSlice';

import type { FC } from 'react';

interface XPDisplayProps {
  xp?: number;
  level?: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
}

const XPDisplay: FC<XPDisplayProps> = ({
  xp: propXp,
  level: propLevel,
  showProgress = false,
  size = 'medium',
  compact = false,
}) => {
  const theme = useTheme();

  // Use props if provided, otherwise get from Redux
  const stateXp = useAppSelector(selectXp);
  const stateLevel = useAppSelector(selectLevel);
  const userProgress = useAppSelector(selectUserProgress);

  const xp = propXp !== undefined ? propXp : stateXp;
  const level = propLevel !== undefined ? propLevel : stateLevel;

  // Calculate next level XP and progress
  const nextLevelXP = Math.pow(level + 1, 2) * 100; // Example calculation
  const levelProgress = ((xp - Math.pow(level, 2) * 100) / (nextLevelXP - Math.pow(level, 2) * 100)) * 100;

  // Get level title
  const levelTitle = `Level ${level}`;

  // Size configurations
  const sizes = {
    small: {
      iconSize: 16,
      fontSize: '0.75rem',
      levelFontSize: '0.875rem',
      height: 24,
    },
    medium: {
      iconSize: 20,
      fontSize: '0.875rem',
      levelFontSize: '1rem',
      height: 32,
    },
    large: {
      iconSize: 24,
      fontSize: '1rem',
      levelFontSize: '1.25rem',
      height: 40,
    },
  };

  // If compact is true, use small size
  const effectiveSize = compact ? 'small' : size;

  return (
    <Tooltip
      title={`${xp} XP - ${levelTitle} - ${levelProgress}% to Level ${level + 1}`}
      arrow
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          px: 1,
          py: 0.5,
          height: sizes[effectiveSize].height,
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarIcon
            sx={{
              color: theme.palette.warning.main,
              fontSize: sizes[effectiveSize].iconSize,
              mr: 0.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              fontSize: sizes[effectiveSize].levelFontSize,
            }}
          >
            {level}
          </Typography>
        </Box>

        {showProgress && !compact && (
          <Box sx={{ mx: 1, flexGrow: 1, width: 60 }}>
            <LinearProgress
              variant="determinate"
              value={levelProgress}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.warning.main,
                },
              }}
            />
          </Box>
        )}

        {showProgress && !compact && (
          <Typography
            variant="caption"
            sx={{
              fontSize: sizes[effectiveSize].fontSize,
              color: theme.palette.text.secondary,
              ml: 0.5,
            }}
          >
            {levelProgress}%
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default XPDisplay;

import StarIcon from '@mui/icons-material/Star';
import { Box, Typography, Tooltip, LinearProgress, useTheme } from '@mui/material';
import React, { memo, useMemo } from 'react';

import { useGamificationRedux } from '@/hooks';

import type { FC } from 'react';

interface XPDisplayProps {
  xp?: number;
  level?: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
}

// Size configurations
const SIZES = {
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
} as const;

const XPDisplay: FC<XPDisplayProps> = memo(({
  xp: propXp,
  level: propLevel,
  showProgress = false,
  size = 'medium',
  compact = false,
}) => {
  const theme = useTheme();
  const gamificationData = useGamificationRedux();
  const { level: serviceLevel } = gamificationData;
  const totalXP = gamificationData.getXP?.() || 0;
  const levelProgress = gamificationData.getLevelProgress?.() || 0;
  const levelTitle = 'Level ' + serviceLevel; // Constructing level title
  // The nextLevelXP is not used, so we don't need to retrieve it

  // Use props if provided, otherwise use service values
  const xp = propXp ?? totalXP;
  const level = propLevel ?? serviceLevel;

  // Memoize size configuration
  const effectiveSize = useMemo(() =>
    compact ? 'small' : size,
    [compact, size],
  );

  // Memoize tooltip text
  const tooltipText = useMemo(() =>
    `${xp} XP - ${levelTitle} - ${levelProgress}% to Level ${level + 1}`,
    [xp, levelTitle, levelProgress, level],
  );

  return (
    <Tooltip title={tooltipText} arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          px: 1,
          py: 0.5,
          height: SIZES[effectiveSize].height,
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarIcon
            sx={{
              color: theme.palette.warning.main,
              fontSize: SIZES[effectiveSize].iconSize,
              mr: 0.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              fontSize: SIZES[effectiveSize].levelFontSize,
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
              fontSize: SIZES[effectiveSize].fontSize,
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
});

XPDisplay.displayName = 'XPDisplay';

export default XPDisplay;

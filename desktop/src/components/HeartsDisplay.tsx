import { Favorite as HeartIcon } from '@mui/icons-material';
import { Box, Typography, Tooltip, Badge, useTheme, LinearProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { heartsService, HEARTS_CONFIG } from '../services';

import type { FC } from 'react';

interface HeartsDisplayProps {
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'large';
  showRefillTimer?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  showRefill?: boolean;
  vertical?: boolean;
}

const HeartsDisplay: FC<HeartsDisplayProps> = ({
  showLabel = true,
  variant = 'default',
  showRefillTimer = true,
  color,
  size,
  showTooltip = true,
  showRefill,
  vertical = false,
}) => {
  const theme = useTheme();
  const [hearts, setHearts] = useState(0);
  const [maxHearts, setMaxHearts] = useState(5);
  const [timeToNextHeart, setTimeToNextHeart] = useState<number | null>(null);
  const [recentChange, setRecentChange] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  // Map size prop to variant for backward compatibility
  const effectiveVariant = size ? (size === 'small' ? 'compact' : size === 'large' ? 'large' : 'default') : variant;
  // Map showRefill to showRefillTimer for backward compatibility
  const effectiveShowRefillTimer = showRefill !== undefined ? showRefill : showRefillTimer;

  useEffect(() => {
    // Initialize with current hearts
    const heartsData = heartsService.getHeartsData();
    setHearts(heartsData.current);
    setMaxHearts(heartsData.max);

    if (heartsData.current < heartsData.max) {
      setTimeToNextHeart(heartsService.getTimeUntilNextHeart());
    }

    // Subscribe to hearts changes
    const handleHeartsChange = (data: any) => {
      const oldHearts = hearts;
      const newHearts = data.newHearts;
      const change = newHearts - oldHearts;

      // Show animation for heart changes
      if (change !== 0) {
        setRecentChange(change);
        setAnimating(true);

        // Reset animation after delay
        setTimeout(() => {
          setAnimating(false);
          setRecentChange(null);
        }, 2000);
      }

      setHearts(newHearts);
      setMaxHearts(heartsService.getMaxHearts());

      if (newHearts < heartsService.getMaxHearts()) {
        setTimeToNextHeart(heartsService.getTimeUntilNextHeart());
      } else {
        setTimeToNextHeart(null);
      }
    };

    heartsService.subscribe(handleHeartsChange);

    // Update timer every second
    const timer = setInterval(() => {
      if (hearts < maxHearts) {
        setTimeToNextHeart(heartsService.getTimeUntilNextHeart());
      }
    }, 1000);

    return () => {
      heartsService.unsubscribe(handleHeartsChange);
      clearInterval(timer);
    };
  }, [hearts, maxHearts]);

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number | null): string => {
    if (milliseconds === null || milliseconds <= 0) return '';

    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine size based on variant
  const getIconSize = () => {
    switch (effectiveVariant) {
      case 'compact':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  const getFontSize = () => {
    switch (effectiveVariant) {
      case 'compact':
        return '0.875rem';
      case 'large':
        return '1.5rem';
      default:
        return '1rem';
    }
  };

  const getIconColor = () => {
    if (color) return color;
    return theme.palette.error.main;
  };

  // Calculate progress for refill timer
  const getRefillProgress = (): number => {
    if (timeToNextHeart === null || hearts >= maxHearts) return 100;

    const refillTime = HEARTS_CONFIG.REGENERATION_TIME_MINUTES * 60 * 1000;
    const elapsed = refillTime - timeToNextHeart;
    return (elapsed / refillTime) * 100;
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Badge
          badgeContent={recentChange ? (recentChange > 0 ? `+${recentChange}` : recentChange) : 0}
          color={recentChange && recentChange > 0 ? 'success' : 'error'}
          sx={{
            '& .MuiBadge-badge': {
              opacity: animating ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              fontWeight: 'bold',
            },
          }}
        >
          <HeartIcon
            fontSize={getIconSize()}
            sx={{
              color: getIconColor(),
              mr: 0.5,
              animation: animating ? 'pulse 0.5s ease-in-out' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          />
        </Badge>
        <Typography
          variant={effectiveVariant === 'large' ? 'h6' : 'body1'}
          component="span"
          sx={{
            fontWeight: 'bold',
            fontSize: getFontSize(),
            color: color || 'inherit',
            animation: animating ? 'fadeIn 0.5s ease-in-out' : 'none',
            '@keyframes fadeIn': {
              '0%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        >
          {hearts}/{maxHearts}
        </Typography>
        {showLabel && effectiveVariant !== 'compact' && (
          <Typography
            variant="body2"
            component="span"
            sx={{
              ml: 0.5,
              color: color || 'text.secondary',
              fontSize: effectiveVariant === 'large' ? '1rem' : '0.75rem',
            }}
          >
            hearts
          </Typography>
        )}
      </Box>

      {effectiveShowRefillTimer && hearts < maxHearts && timeToNextHeart !== null && (
        <Box sx={{ width: '100%', mt: 0.5, minWidth: 80 }}>
          <LinearProgress
            variant="determinate"
            value={getRefillProgress()}
            color="error"
            sx={{
              height: effectiveVariant === 'compact' ? 2 : 4,
              borderRadius: 1,
            }}
          />
          {effectiveVariant !== 'compact' && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 0.25,
                fontSize: '0.7rem',
                color: 'text.secondary',
              }}
            >
              {formatTimeRemaining(timeToNextHeart)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );

  return showTooltip ? (
    <Tooltip
      title={
        hearts < maxHearts && timeToNextHeart !== null
          ? `Next heart in ${formatTimeRemaining(timeToNextHeart)}`
          : `${hearts}/${maxHearts} hearts`
      }
      arrow
    >
      {content}
    </Tooltip>
  ) : content;
};

export default HeartsDisplay;

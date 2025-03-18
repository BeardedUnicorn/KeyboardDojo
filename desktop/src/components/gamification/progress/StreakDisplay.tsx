import {
  LocalFireDepartment as FireIcon,
  AcUnit as FreezeIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Tooltip,
  Badge,
  useTheme,
} from '@mui/material';
import React from 'react';

import type { FC } from 'react';

interface StreakDisplayProps {
  days?: number;
  compact?: boolean;
  showFreeze?: boolean;
  showLongest?: boolean;
  onStreakClick?: () => void;
}

const StreakDisplay: FC<StreakDisplayProps> = ({
  days,
  compact = false,
  showFreeze = false,
  showLongest = false,
  onStreakClick,
}) => {
  const theme = useTheme();

  // Use provided days or fallback to mock data
  const currentStreak = days !== undefined ? days : 7;
  const longestStreak = 14;
  const freezesAvailable: number = 2;

  // Determine color based on streak length
  const getStreakColor = () => {
    if (currentStreak >= 30) return theme.palette.error.dark;
    if (currentStreak >= 14) return theme.palette.error.main;
    if (currentStreak >= 7) return theme.palette.error.light;
    if (currentStreak >= 3) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  const streakColor = getStreakColor();

  // Define text for streak pluralization
  const streakText = currentStreak === 1 ? 'Day Streak' : 'Days Streak';
  const freezeText = freezesAvailable === 1 ? 'Streak Freeze' : 'Streak Freezes';

  const handleClick = () => {
    if (onStreakClick) {
      onStreakClick();
    }
  };

  if (compact) {
    return (
      <Tooltip
        title={`${currentStreak} day streak${showFreeze ? ` • ${freezesAvailable} freezes available` : ''}`}
        arrow
        placement="top"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: onStreakClick ? 'pointer' : 'default',
            '&:hover': {
              opacity: onStreakClick ? 0.8 : 1,
            },
            transition: 'all 0.2s ease',
          }}
          onClick={handleClick}
        >
          <Badge
            badgeContent={currentStreak}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                height: '1.2rem',
                minWidth: '1.2rem',
                fontWeight: 'bold',
                animation: currentStreak >= 7 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              },
            }}
          >
            <FireIcon
              sx={{
                color: streakColor,
                fontSize: '1.5rem',
                animation: currentStreak >= 7 ? 'flicker 3s infinite' : 'none',
                '@keyframes flicker': {
                  '0%': { opacity: 0.8 },
                  '25%': { opacity: 1 },
                  '50%': { opacity: 0.8 },
                  '75%': { opacity: 1 },
                  '100%': { opacity: 0.8 },
                },
              }}
            />
          </Badge>

          {showFreeze && freezesAvailable > 0 && (
            <Tooltip title={`${freezesAvailable} streak freezes available`} arrow placement="top">
              <FreezeIcon
                sx={{
                  color: theme.palette.info.main,
                  fontSize: '1rem',
                  ml: 0.5,
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        cursor: onStreakClick ? 'pointer' : 'default',
        '&:hover': {
          opacity: onStreakClick ? 0.8 : 1,
          transform: onStreakClick ? 'translateY(-2px)' : 'none',
        },
        transition: 'all 0.3s ease',
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
          position: 'relative',
        }}
      >
        <FireIcon
          sx={{
            color: streakColor,
            fontSize: '2rem',
            mr: 1,
            animation: currentStreak >= 7 ? 'flicker 3s infinite' : 'none',
            '@keyframes flicker': {
              '0%': { opacity: 0.8 },
              '25%': { opacity: 1 },
              '50%': { opacity: 0.8 },
              '75%': { opacity: 1 },
              '100%': { opacity: 0.8 },
            },
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: streakColor,
            fontWeight: currentStreak >= 7 ? 'bold' : 'medium',
          }}
        >
          {currentStreak} {streakText}
        </Typography>

        {currentStreak >= 30 && (
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: -15,
              background: theme.palette.error.main,
              color: '#fff',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' },
              },
            }}
          >
            🔥
          </Box>
        )}
      </Box>

      {showLongest && (
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            fontStyle: currentStreak >= longestStreak ? 'italic' : 'normal',
            fontWeight: currentStreak >= longestStreak ? 'bold' : 'normal',
          }}
        >
          {currentStreak >= longestStreak ? 'New record!' : `Longest streak: ${longestStreak} days`}
        </Typography>
      )}

      {showFreeze && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          backgroundColor: freezesAvailable > 0 ? theme.palette.info.main + '15' : 'transparent',
          borderRadius: 1,
          px: 1,
          py: 0.5,
        }}>
          <FreezeIcon
            sx={{
              color: theme.palette.info.main,
              fontSize: '1.2rem',
              mr: 0.5,
            }}
          />
          <Typography
            variant="body2"
            color={freezesAvailable > 0 ? theme.palette.info.main : 'text.secondary'}
            fontWeight={freezesAvailable > 0 ? 'medium' : 'normal'}
          >
            {freezesAvailable} {freezeText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StreakDisplay;

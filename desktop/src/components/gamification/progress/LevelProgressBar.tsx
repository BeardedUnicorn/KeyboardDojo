import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Typography, LinearProgress, Tooltip, Paper, useTheme } from '@mui/material';
import React from 'react';

import { useXP } from '../../../hooks';

import type { FC } from 'react';

interface LevelProgressBarProps {
  compact?: boolean;
  showTitle?: boolean;
  showXP?: boolean;
}

const LevelProgressBar: FC<LevelProgressBarProps> = ({
  compact = false,
  showTitle = true,
  showXP = true,
}) => {
  const theme = useTheme();
  const {
    level,
    totalXP,
    currentLevelXP,
    nextLevelXP,
    progress,
    levelTitle,
    xpHistory,
  } = useXP();

  // Calculate today's XP
  const today = new Date().toISOString().split('T')[0];
  const todayXP = xpHistory
    .filter((entry) => entry.date.startsWith(today))
    .reduce((total, entry) => total + entry.amount, 0);

  // Calculate XP needed for next level
  const xpForNextLevel = nextLevelXP - currentLevelXP;

  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round(progress * 100));

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" fontWeight="bold" mr={1}>
          Level {level}
        </Typography>
        <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
          <Tooltip title={`${currentLevelXP}/${nextLevelXP} XP (${progressPercent}%)`} arrow placement="top">
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                  transition: 'transform 0.8s ease-in-out',
                },
              }}
            />
          </Tooltip>
        </Box>
        {showXP && (
          <Typography variant="body2" color="text.secondary" ml={1}>
            {totalXP} XP
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 0 1px ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 0 8px ${theme.palette.primary.main}30`,
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: { xs: 1.5, sm: 1 },
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { xs: 1, sm: 0 },
        }}>
          <EmojiEventsIcon
            color="primary"
            sx={{
              mr: 1,
              fontSize: { xs: 22, sm: 24 },
              animation: levelTitle === 'Keyboard Master' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 },
              },
            }}
          />
          <Typography variant="h6">Level {level}</Typography>
        </Box>

        {showTitle && (
          <Tooltip title="Your current rank" arrow placement="top">
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              sx={{
                fontWeight: levelTitle === 'Keyboard Master' ? 600 : 400,
                color: levelTitle === 'Keyboard Master' ? theme.palette.warning.main : 'inherit',
              }}
            >
              {levelTitle}
            </Typography>
          </Tooltip>
        )}
      </Box>

      <Tooltip title={`${progressPercent}% to next level`} arrow placement="top" followCursor>
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: { xs: 8, md: 10 },
              borderRadius: 5,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          />
          {progressPercent > 15 && (
            <Typography
              variant="caption"
              component="span"
              sx={{
                position: 'absolute',
                top: '50%',
                left: `${Math.min(progressPercent, 90)}%`,
                transform: 'translate(-50%, -50%)',
                color: theme.palette.primary.contrastText,
                textShadow: '0 0 2px rgba(0,0,0,0.7)',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                userSelect: 'none',
              }}
            >
              {progressPercent}%
            </Typography>
          )}
        </Box>
      </Tooltip>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 0.5, sm: 0 },
      }}>
        <Typography variant="body2" color="text.secondary">
          {currentLevelXP} XP
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {xpForNextLevel} XP to Level {level + 1}
        </Typography>
      </Box>

      {showXP && (
        <Box sx={{
          mt: 2,
          pt: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="body2" color="text.secondary">
            Total XP: <strong>{totalXP}</strong>
          </Typography>
          <Typography
            variant="caption"
            color={todayXP > 0 ? 'success.main' : 'text.secondary'}
            sx={{
              fontWeight: todayXP > 0 ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Today: <strong>{todayXP} XP</strong>
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LevelProgressBar;

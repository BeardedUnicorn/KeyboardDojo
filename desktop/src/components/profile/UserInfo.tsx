import { Box, Avatar, Chip } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../store';
import { selectUserProgress } from '../../store/slices/userProgressSlice';

import type { FC } from 'react';

/**
 * Component to display user information in the header
 */
const UserInfo: FC = () => {
  const userProgress = useAppSelector(selectUserProgress);
  const { xp, level, streakDays, isLoading } = userProgress;

  // If loading or no progress, show placeholder
  if (isLoading || !userProgress) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label="Loading..." size="small" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
      }}
      component={Link}
      to="/profile"
    >
      <Chip
        label={`Level ${level}`}
        color="primary"
        size="small"
        sx={{ fontWeight: 'medium' }}
      />

      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'primary.main',
          fontSize: '0.875rem',
          fontWeight: 'bold',
        }}
      >
        {level}
      </Avatar>
    </Box>
  );
};

export default UserInfo;

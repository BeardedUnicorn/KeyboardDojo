import { Box, Avatar, Chip, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../store';
import { selectUserProgress } from '../../store/slices/userProgressSlice';

import type { FC } from 'react';

interface UserInfoProps {
  /**
   * ID for accessibility purposes
   */
  userInfoId?: string;
  /**
   * Additional context for screen readers
   */
  accessibilityDescription?: string;
}

/**
 * Component to display user information in the header
 */
const UserInfo: FC<UserInfoProps> = ({ 
  userInfoId = 'header-user-info',
  accessibilityDescription,
}) => {
  const userProgress = useAppSelector(selectUserProgress);
  const { xp, level, streakDays, isLoading } = userProgress;

  // If loading or no progress, show placeholder
  if (isLoading || !userProgress) {
    return (
      <Box 
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        role="status"
        aria-live="polite"
        aria-busy={isLoading}
      >
        <CircularProgress size={16} aria-label="Loading user information" />
        <Chip 
          label="Loading..." 
          size="small" 
          aria-hidden="true"
        />
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
        position: 'relative',
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      }}
      component={Link}
      to="/profile"
      role="navigation"
      aria-labelledby={`${userInfoId}-label`}
      aria-describedby={accessibilityDescription ? `${userInfoId}-description` : undefined}
    >
      {/* Hidden text for screen readers */}
      <Typography 
        id={`${userInfoId}-label`} 
        sx={{ 
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        User profile, level {level} with {xp} experience points
        {streakDays > 0 && `, current streak: ${streakDays} days`}. Click to view full profile.
      </Typography>

      {accessibilityDescription && (
        <Typography 
          id={`${userInfoId}-description`} 
          sx={{ 
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        >
          {accessibilityDescription}
        </Typography>
      )}

      <Chip
        label={`Level ${level}`}
        color="primary"
        size="small"
        sx={{ fontWeight: 'medium' }}
        aria-label={`Level ${level}`}
        tabIndex={-1}
      />

      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'primary.main',
          fontSize: '0.875rem',
          fontWeight: 'bold',
        }}
        alt={`Level ${level} avatar`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {level}
      </Avatar>
    </Box>
  );
};

export default UserInfo;

import {
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Button,
  useTheme,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';

import { LevelProgressBar, StreakDisplay, XPDisplay } from '../gamification';

import type { FC } from 'react';

interface UserProfileCardProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
}

const UserProfileCard: FC<UserProfileCardProps> = ({
  username = 'Keyboard Enthusiast',
  email = 'user@example.com',
  avatarUrl,
  onEditProfile,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 400,
        width: '100%',
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: expanded ? 'scale(1.02)' : 'scale(1)',
        '&:hover': {
          boxShadow: `0 8px 24px ${theme.palette.primary.main}25`,
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <Avatar
          src={avatarUrl}
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${theme.palette.background.paper}`,
            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
          }}
        >
          {!avatarUrl && <PersonIcon sx={{ fontSize: 40 }} />}
        </Avatar>
      </Box>

      <CardContent sx={{ pt: 7, pb: 2 }}>
        {/* User Info */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>

          {onEditProfile && (
            <Button
              startIcon={<EditIcon />}
              size="small"
              sx={{ mt: 1 }}
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <StreakDisplay compact showFreeze />
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <XPDisplay compact />
          </Paper>
        </Box>

        {/* Level Progress */}
        <Box sx={{ mt: 3 }}>
          <LevelProgressBar showTitle showXP />
        </Box>

        {/* Expand/Collapse Button */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            size="small"
            color="primary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </Box>

        {/* Expanded Content */}
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Recent Activity
            </Typography>

            <Box sx={{ p: 1, backgroundColor: theme.palette.background.default, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                • Completed Advanced Shortcuts module
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Earned "Shortcut Wizard" achievement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Maintained a 7-day practice streak
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;

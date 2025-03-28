import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Snackbar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useState } from 'react';

import { AchievementBadge } from './';

import type { IAchievement } from '@/types/achievements/IAchievement';
import type { FC } from 'react';

interface AchievementNotificationProps {
  achievement: IAchievement;
  onClose: () => void;
  autoHideDuration?: number;
}

const AchievementNotification: FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  autoHideDuration = 6000,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  // Get color based on rarity
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return theme.palette.warning.main;
      case 'epic':
        return theme.palette.secondary.main;
      case 'rare':
        return theme.palette.info.main;
      case 'uncommon':
        return theme.palette.success.main;
      case 'common':
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: getRarityColor(),
          boxShadow: `0 4px 12px ${alpha(getRarityColor(), 0.3)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <AchievementBadge
            achievement={achievement}
            size="medium"
            showDescription
          />

          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Show XP reward if applicable */}
        {achievement.xpReward && achievement.xpReward > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
              p: 1,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              +{achievement.xpReward} XP earned!
            </Typography>
          </Box>
        )}
      </Paper>
    </Snackbar>
  );
};

export default AchievementNotification;

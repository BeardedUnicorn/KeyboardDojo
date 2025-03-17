import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Slide, 
  useTheme,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Achievement } from '../services/achievementsService';
import { AchievementBadge } from './';
import { useHearts } from '../contexts/HeartsContext';
import { alpha } from '@mui/material/styles';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoHideDuration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  autoHideDuration = 6000
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { addHearts } = useHearts();
  
  useEffect(() => {
    // If the achievement has a hearts reward, add it
    if (achievement.heartsReward && achievement.heartsReward > 0) {
      addHearts(achievement.heartsReward);
    }
  }, [achievement, addHearts]);
  
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
            showDescription={true}
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
        
        {/* Show hearts reward if applicable */}
        {achievement.heartsReward && achievement.heartsReward > 0 && (
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
            <FavoriteIcon color="error" sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2">
              +{achievement.heartsReward} {achievement.heartsReward === 1 ? 'life' : 'lives'} added!
            </Typography>
          </Box>
        )}
      </Paper>
    </Snackbar>
  );
};

export default AchievementNotification; 
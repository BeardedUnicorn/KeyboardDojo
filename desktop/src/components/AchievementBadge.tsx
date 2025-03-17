import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import LockIcon from '@mui/icons-material/Lock';
import { Achievement } from '../services/achievementsService';

interface AchievementBadgeProps {
  achievement: Achievement;
  completed?: boolean;
  showRarity?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  completed = true,
  showRarity = true,
  showDescription = false,
  size = 'medium'
}) => {
  const theme = useTheme();
  
  // Get icon size based on badge size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 40;
      default:
        return 32;
    }
  };
  
  // Get badge size based on component size
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };
  
  // Get color based on rarity
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return theme.palette.error.main;
      case 'epic':
        return theme.palette.secondary.main;
      case 'rare':
        return theme.palette.info.main;
      case 'uncommon':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get icon based on category
  const getIcon = () => {
    const iconSize = getIconSize();
    
    if (achievement.secret && !completed) {
      return <LockIcon sx={{ fontSize: iconSize }} />;
    }
    
    switch (achievement.category) {
      case 'streak':
        return <LocalFireDepartmentIcon sx={{ fontSize: iconSize }} />;
      case 'mastery':
        return <SchoolIcon sx={{ fontSize: iconSize }} />;
      case 'speed':
        return <SpeedIcon sx={{ fontSize: iconSize }} />;
      case 'exploration':
        return <ExploreIcon sx={{ fontSize: iconSize }} />;
      default:
        return <EmojiEventsIcon sx={{ fontSize: iconSize }} />;
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: getBadgeSize(),
            height: getBadgeSize(),
            borderRadius: '50%',
            bgcolor: `${getRarityColor()}${completed ? '20' : '10'}`,
            color: completed ? getRarityColor() : theme.palette.text.disabled,
            mr: 1.5,
            opacity: completed ? 1 : 0.7,
            border: completed ? `2px solid ${getRarityColor()}` : 'none',
          }}
        >
          {getIcon()}
        </Box>
        
        {size !== 'small' && (
          <Box>
            <Typography 
              variant={size === 'large' ? 'h6' : 'subtitle1'} 
              fontWeight="medium"
              color={completed ? 'text.primary' : 'text.secondary'}
            >
              {achievement.secret && !completed ? 'Secret Achievement' : achievement.title}
            </Typography>
            
            {showRarity && (
              <Chip 
                label={achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)} 
                size="small"
                sx={{ 
                  bgcolor: `${getRarityColor()}${completed ? '20' : '10'}`,
                  color: completed ? getRarityColor() : theme.palette.text.disabled,
                  fontWeight: 'medium',
                  fontSize: '0.7rem',
                  opacity: completed ? 1 : 0.7,
                }}
              />
            )}
          </Box>
        )}
      </Box>
      
      {showDescription && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 1, ml: size === 'small' ? 0 : getBadgeSize() + 12 }}
        >
          {achievement.secret && !completed 
            ? 'Complete a special action to unlock this achievement' 
            : achievement.description}
        </Typography>
      )}
    </Box>
  );
};

export default AchievementBadge; 
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, Typography, Chip, useTheme } from '@mui/material';

import { AchievementCategory } from '@/types/achievements/AchievementCategory';

import type { Achievement as ContextAchievement } from '../contexts/AchievementsContext';
import type { Achievement as ServiceAchievement } from '../services/achievementsService';
import type { IAchievement } from '@/types/achievements/IAchievement';
import type  { FC } from 'react';

// Union type to accept both achievement types
type AchievementType = ServiceAchievement | ContextAchievement;

interface AchievementBadgeProps {
  achievement: AchievementType;
  completed?: boolean;
  showRarity?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AchievementBadge: FC<AchievementBadgeProps> = ({
  achievement,
  completed = true,
  showRarity = true,
  showDescription = false,
  size = 'medium',
}) => {
  const theme = useTheme();

  // Get icon size based on badge size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  // Get badge size based on component size
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 80;
      default:
        return 60;
    }
  };

  // Get color based on rarity
  const getRarityColor = () => {
    const achievementData = ('achievement' in achievement ? achievement.achievement : achievement) as IAchievement;
    switch (achievementData.rarity) {
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

  // Get icon based on category
  const getIcon = () => {
    const iconSize = getIconSize();
    const achievementData = ('achievement' in achievement ? achievement.achievement : achievement) as IAchievement;

    if (achievementData.secret && !completed) {
      return <LockIcon sx={{ fontSize: iconSize }} />;
    }

    switch (achievementData.category) {
      case AchievementCategory.STREAKS:
        return <LocalFireDepartmentIcon sx={{ fontSize: iconSize }} />;
      case AchievementCategory.MASTERY:
        return <SchoolIcon sx={{ fontSize: iconSize }} />;
      case AchievementCategory.SHORTCUTS:
        return <SpeedIcon sx={{ fontSize: iconSize }} />;
      case AchievementCategory.GENERAL:
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

            {showRarity && achievement.rarity && (
              <Chip
                label={(achievement.rarity || 'common').charAt(0).toUpperCase() + (achievement.rarity || 'common').slice(1)}
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

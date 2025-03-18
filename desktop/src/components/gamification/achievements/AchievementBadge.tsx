import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, Typography, Chip, useTheme } from '@mui/material';

import { AchievementCategory } from '@/types/achievements/AchievementCategory';

import type { IAchievement } from '@/types/achievements/IAchievement';
import type { IAchievementProgress } from '@/types/achievements/IAchievementProgress';
import type { FC } from 'react';

// Union type to accept both achievement types
type AchievementType = IAchievement | IAchievementProgress;

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

  // Helper function to get the actual achievement data
  const getAchievementData = (achievement: AchievementType): IAchievement => {
    return 'achievement' in achievement ? achievement.achievement : achievement;
  };

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
    const achievementData = getAchievementData(achievement);
    switch (achievementData.rarity) {
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
    const iconSizeMap = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    } as const;

    const iconSizeProp = iconSizeMap[size] || 'medium';
    const achievementData = 'achievement' in achievement ? achievement.achievement : achievement;

    if (achievementData.secret && !completed) {
      return <LockIcon sx={{ fontSize: getIconSize() }} />;
    }

    switch (achievementData.category) {
      case AchievementCategory.LESSONS:
        return <SchoolIcon fontSize={iconSizeProp} />;
      case AchievementCategory.STREAKS:
        return <LocalFireDepartmentIcon fontSize={iconSizeProp} />;
      case AchievementCategory.SHORTCUTS:
        return <SpeedIcon fontSize={iconSizeProp} />;
      case AchievementCategory.GENERAL:
        return <ExploreIcon fontSize={iconSizeProp} />;
      case AchievementCategory.MASTERY:
        return <EmojiEventsIcon fontSize={iconSizeProp} />;
      default:
        return <EmojiEventsIcon fontSize={iconSizeProp} />;
    }
  };

  const achievementData = getAchievementData(achievement);

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
            bgcolor: completed ? getRarityColor() : theme.palette.grey[300],
            color: completed ? theme.palette.common.white : theme.palette.grey[500],
            opacity: completed ? 1 : 0.7,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              opacity: 1,
            },
          }}
        >
          {getIcon()}
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography
            variant={size === 'small' ? 'body2' : 'body1'}
            fontWeight="medium"
            color={achievementData.secret && !completed ? 'text.disabled' : 'text.primary'}
          >
            {achievementData.secret && !completed ? '???' : achievementData.title}
          </Typography>
          {showRarity && (
            <Chip
              label={achievementData.rarity}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: getRarityColor(),
                color: theme.palette.common.white,
                textTransform: 'capitalize',
              }}
            />
          )}
        </Box>
      </Box>
      {showDescription && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, ml: getBadgeSize() + 16 }}
        >
          {achievementData.secret && !completed ? '???' : achievementData.description}
        </Typography>
      )}
    </Box>
  );
};

export default AchievementBadge;

import React from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Paper, 
  Grid, 
  Tooltip, 
  LinearProgress,
  Divider,
  Badge,
  Avatar,
  Chip
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  Bolt as LightningIcon,
  Whatshot as HotstreakIcon,
  WorkspacePremium as PremiumIcon
} from '@mui/icons-material';

// Define achievement interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  date?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress?: number; // 0-100 for in-progress achievements
}

// Define stats interface
export interface UserStats {
  xp: number;
  level: number;
  nextLevelXp: number;
  streak: number;
  longestStreak: number;
  totalPracticeTime?: number; // in minutes
  lessonsCompleted?: number;
  accuracy?: number; // 0-100
  achievements?: Achievement[];
}

// Define display mode
export type StatsDisplayMode = 'compact' | 'detailed' | 'minimal';

// Define props interface
interface StatsDisplayProps {
  stats: UserStats;
  mode?: StatsDisplayMode;
  showAchievements?: boolean;
  maxAchievements?: number;
  className?: string;
}

// Styled components
const StatsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const StatIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1.5),
  color: theme.palette.primary.main,
}));

const StatContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const XPProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  marginTop: theme.spacing(0.5),
  backgroundColor: `${theme.palette.primary.main}20`,
}));

const AchievementsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const AchievementItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}10`,
  },
}));

const AchievementIcon = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1.5),
}));

const AchievementContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const AchievementProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  marginTop: theme.spacing(0.5),
  width: '100%',
  backgroundColor: `${theme.palette.primary.main}20`,
}));

const RarityChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'rarity',
})<{ rarity: Achievement['rarity'] }>(({ theme, rarity }) => {
  let color;
  
  switch (rarity) {
    case 'legendary':
      color = theme.palette.error.main;
      break;
    case 'epic':
      color = theme.palette.secondary.main;
      break;
    case 'rare':
      color = theme.palette.info.main;
      break;
    case 'uncommon':
      color = theme.palette.success.main;
      break;
    case 'common':
    default:
      color = theme.palette.grey[500];
  }
  
  return {
    backgroundColor: `${color}20`,
    color: color,
    fontSize: '0.6rem',
    height: 20,
    marginLeft: theme.spacing(1),
  };
});

// Helper function to format time
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// StatsDisplay component
const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  mode = 'detailed',
  showAchievements = true,
  maxAchievements = 3,
  className,
}) => {
  // Calculate XP progress percentage
  const xpProgressPercentage = Math.min(
    Math.round((stats.xp / stats.nextLevelXp) * 100),
    100
  );
  
  // Filter and sort achievements
  const achievements = stats.achievements || [];
  const sortedAchievements = [...achievements].sort((a, b) => {
    // Sort by completion (incomplete first)
    if ((a.progress === 100) !== (b.progress === 100)) {
      return (a.progress === 100) ? 1 : -1;
    }
    
    // Then by rarity (legendary first)
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    const aRarity = a.rarity || 'common';
    const bRarity = b.rarity || 'common';
    
    return rarityOrder[aRarity] - rarityOrder[bRarity];
  });
  
  // Limit achievements to display
  const displayedAchievements = sortedAchievements.slice(0, maxAchievements);
  
  // Render compact mode
  const renderCompactMode = () => (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <StatItem>
          <StatIcon>
            <StarIcon color="primary" />
          </StatIcon>
          <StatContent>
            <StatValue variant="h6">{stats.xp} XP</StatValue>
            <XPProgress variant="determinate" value={xpProgressPercentage} />
          </StatContent>
        </StatItem>
      </Grid>
      
      <Grid item xs={6}>
        <StatItem>
          <StatIcon>
            <Badge badgeContent={stats.streak} color="error" max={99}>
              <FireIcon color="primary" />
            </Badge>
          </StatIcon>
          <StatContent>
            <StatValue variant="h6">Streak</StatValue>
            <StatLabel>Best: {stats.longestStreak}</StatLabel>
          </StatContent>
        </StatItem>
      </Grid>
    </Grid>
  );
  
  // Render minimal mode
  const renderMinimalMode = () => (
    <Box display="flex" alignItems="center">
      <Tooltip title={`Level ${stats.level}`}>
        <Chip
          icon={<StarIcon />}
          label={`${stats.xp} XP`}
          color="primary"
          size="small"
          sx={{ mr: 1 }}
        />
      </Tooltip>
      
      <Tooltip title={`${stats.streak} day streak`}>
        <Chip
          icon={<FireIcon />}
          label={stats.streak}
          color="error"
          size="small"
        />
      </Tooltip>
    </Box>
  );
  
  // Render detailed mode
  const renderDetailedMode = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StatItem>
            <StatIcon>
              <StarIcon fontSize="large" />
            </StatIcon>
            <StatContent>
              <Box display="flex" alignItems="center">
                <StatValue variant="h5">{stats.xp} XP</StatValue>
                <Chip 
                  label={`Level ${stats.level}`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <XPProgress variant="determinate" value={xpProgressPercentage} sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {stats.xp}/{stats.nextLevelXp}
                </Typography>
              </Box>
            </StatContent>
          </StatItem>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <StatItem>
            <StatIcon>
              <FireIcon fontSize="large" />
            </StatIcon>
            <StatContent>
              <Box display="flex" alignItems="center">
                <StatValue variant="h5">{stats.streak} day streak</StatValue>
                {stats.streak >= 7 && (
                  <Tooltip title="7+ day streak!">
                    <HotstreakIcon color="error" sx={{ ml: 1 }} />
                  </Tooltip>
                )}
              </Box>
              <StatLabel>Longest streak: {stats.longestStreak} days</StatLabel>
            </StatContent>
          </StatItem>
        </Grid>
        
        {stats.lessonsCompleted !== undefined && (
          <Grid item xs={6} sm={4}>
            <StatItem>
              <StatIcon>
                <LightningIcon />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.lessonsCompleted}</StatValue>
                <StatLabel>Lessons Completed</StatLabel>
              </StatContent>
            </StatItem>
          </Grid>
        )}
        
        {stats.totalPracticeTime !== undefined && (
          <Grid item xs={6} sm={4}>
            <StatItem>
              <StatIcon>
                <TrophyIcon />
              </StatIcon>
              <StatContent>
                <StatValue>{formatTime(stats.totalPracticeTime)}</StatValue>
                <StatLabel>Practice Time</StatLabel>
              </StatContent>
            </StatItem>
          </Grid>
        )}
        
        {stats.accuracy !== undefined && (
          <Grid item xs={6} sm={4}>
            <StatItem>
              <StatIcon>
                <PremiumIcon />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.accuracy}%</StatValue>
                <StatLabel>Accuracy</StatLabel>
              </StatContent>
            </StatItem>
          </Grid>
        )}
      </Grid>
      
      {showAchievements && displayedAchievements.length > 0 && (
        <AchievementsContainer>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Achievements
          </Typography>
          
          {displayedAchievements.map((achievement) => (
            <AchievementItem key={achievement.id}>
              <AchievementIcon>
                {achievement.icon || <TrophyIcon />}
              </AchievementIcon>
              
              <AchievementContent>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" fontWeight="bold">
                    {achievement.title}
                  </Typography>
                  
                  {achievement.rarity && (
                    <RarityChip 
                      label={achievement.rarity.toUpperCase()} 
                      size="small" 
                      rarity={achievement.rarity} 
                    />
                  )}
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  {achievement.description}
                </Typography>
                
                {achievement.progress !== undefined && achievement.progress < 100 && (
                  <Box display="flex" alignItems="center" width="100%">
                    <AchievementProgress 
                      variant="determinate" 
                      value={achievement.progress} 
                      sx={{ flexGrow: 1 }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {achievement.progress}%
                    </Typography>
                  </Box>
                )}
              </AchievementContent>
            </AchievementItem>
          ))}
          
          {sortedAchievements.length > maxAchievements && (
            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
              +{sortedAchievements.length - maxAchievements} more achievements
            </Typography>
          )}
        </AchievementsContainer>
      )}
    </>
  );
  
  // Render based on mode
  const renderContent = () => {
    switch (mode) {
      case 'compact':
        return renderCompactMode();
      case 'minimal':
        return renderMinimalMode();
      case 'detailed':
      default:
        return renderDetailedMode();
    }
  };
  
  return (
    <StatsContainer className={className}>
      {renderContent()}
    </StatsContainer>
  );
};

export default StatsDisplay; 
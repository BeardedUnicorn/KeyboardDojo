import React from 'react';
import { Box, Typography, Tooltip, Badge, CircularProgress, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfinityIcon from '@mui/icons-material/AllInclusive';
import { useHearts } from '../contexts/HeartsContext';
import { useSubscription } from '../contexts/SubscriptionContext';

interface HeartsDisplayProps {
  showTimer?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  maxDisplayedHearts?: number;
}

/**
 * Component to display the user's hearts/lives
 */
const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
  showTimer = true,
  size = 'medium',
  showLabel = true,
  maxDisplayedHearts = 5,
}) => {
  const { 
    currentHearts, 
    maxHearts, 
    timeUntilNextHeart, 
    isLoading 
  } = useHearts();
  
  const { hasPremium } = useSubscription();

  // Determine icon size based on prop
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 16, spacing: 0.5 };
      case 'large':
        return { fontSize: 28, spacing: 1.5 };
      case 'medium':
      default:
        return { fontSize: 22, spacing: 1 };
    }
  };

  const { fontSize, spacing } = getIconSize();
  
  // Determine how many hearts to display
  const heartsToDisplay = Math.min(maxDisplayedHearts, maxHearts);
  const hasUnlimitedHearts = hasPremium && maxHearts > maxDisplayedHearts;

  // If not initialized yet, show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={fontSize} sx={{ mr: 1 }} />
        <Typography variant="body2">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {showLabel && (
        <Typography 
          variant={size === 'small' ? 'body2' : 'body1'} 
          sx={{ mr: 1, fontWeight: 'medium' }}
        >
          Lives:
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {hasUnlimitedHearts ? (
          // Show infinity symbol for premium users
          <Tooltip title="Unlimited lives (Premium)">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FavoriteIcon 
                sx={{ 
                  color: 'error.main', 
                  fontSize,
                  filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
                }} 
              />
              <InfinityIcon 
                sx={{ 
                  color: 'primary.main', 
                  fontSize,
                  ml: 0.5
                }} 
              />
              {size !== 'small' && (
                <Chip 
                  label="Premium" 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Tooltip>
        ) : (
          // Render filled and empty hearts based on current state
          Array.from({ length: heartsToDisplay }).map((_, index) => (
            <Box key={index} sx={{ mx: spacing / 2 }}>
              {index < currentHearts ? (
                <FavoriteIcon 
                  sx={{ 
                    color: 'error.main', 
                    fontSize,
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
                  }} 
                />
              ) : (
                <FavoriteBorderIcon 
                  sx={{ 
                    color: 'text.secondary', 
                    fontSize 
                  }} 
                />
              )}
            </Box>
          ))
        )}
        
        {/* Show counter if there are more hearts than we display */}
        {!hasUnlimitedHearts && currentHearts > heartsToDisplay && (
          <Tooltip title={`${currentHearts} out of ${maxHearts} lives`}>
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1, 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              +{currentHearts - heartsToDisplay}
            </Typography>
          </Tooltip>
        )}
        
        {/* Show timer for next heart if enabled and hearts are regenerating */}
        {showTimer && !hasUnlimitedHearts && currentHearts < maxHearts && (
          <Tooltip title="Time until next life">
            <Badge
              badgeContent={timeUntilNextHeart}
              color="primary"
              sx={{
                ml: 1,
                '& .MuiBadge-badge': {
                  fontSize: size === 'small' ? '0.6rem' : '0.75rem',
                  height: 'auto',
                  padding: '0 4px',
                },
              }}
            >
              <AccessTimeIcon sx={{ fontSize, color: 'action.active' }} />
            </Badge>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default HeartsDisplay; 
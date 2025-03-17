import React from 'react';
import { Box, Typography, styled, CircularProgress, Tooltip } from '@mui/material';
import { keyframes } from '@mui/system';
import { CheckCircle, Star, Lock } from '@mui/icons-material';

// Define indicator types
export type IndicatorType = 'progress' | 'completion' | 'level' | 'locked';

// Define indicator sizes
export type IndicatorSize = 'small' | 'medium' | 'large';

// Define props interface
interface CompletionIndicatorProps {
  type: IndicatorType;
  size?: IndicatorSize;
  value?: number; // For progress type (0-100)
  level?: number; // For level type
  animate?: boolean;
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

// Animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(66, 135, 245, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(66, 135, 245, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(66, 135, 245, 0.5);
  }
`;

// Styled components
const IndicatorContainer = styled(Box, {
  shouldForwardProp: (prop) => !['indicatorSize', 'isAnimating', 'isClickable'].includes(prop as string),
})<{ indicatorSize: IndicatorSize; isAnimating: boolean; isClickable: boolean }>(
  ({ theme, indicatorSize, isAnimating, isClickable }) => {
    // Size mapping
    const sizeMap = {
      small: {
        width: 32,
        height: 32,
        fontSize: '0.75rem',
      },
      medium: {
        width: 48,
        height: 48,
        fontSize: '0.875rem',
      },
      large: {
        width: 64,
        height: 64,
        fontSize: '1rem',
      },
    };
    
    const size = sizeMap[indicatorSize];
    
    return {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: size.width,
      height: size.height,
      borderRadius: '50%',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      transition: 'all 0.3s ease',
      ...(isAnimating && {
        animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
      }),
      ...(isClickable && {
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: theme.shadows[3],
        },
      }),
    };
  }
);

const LevelStar = styled(Star)(({ theme }) => ({
  color: theme.palette.warning.main,
}));

const CompletionCheck = styled(CheckCircle)(({ theme }) => ({
  color: theme.palette.success.main,
}));

const LockIcon = styled(Lock)(({ theme }) => ({
  color: theme.palette.grey[500],
}));

const LevelText = styled(Typography)({
  fontWeight: 'bold',
  lineHeight: 1,
});

const LabelText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

// CompletionIndicator component
const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({
  type,
  size = 'medium',
  value = 0,
  level = 1,
  animate = false,
  showLabel = false,
  className,
  onClick,
}) => {
  // Get size values
  const getSizeValue = (small: number, medium: number, large: number) => {
    switch (size) {
      case 'small':
        return small;
      case 'large':
        return large;
      case 'medium':
      default:
        return medium;
    }
  };
  
  // Get icon size
  const iconSize = getSizeValue(16, 24, 32);
  
  // Get label text
  const getLabelText = () => {
    switch (type) {
      case 'progress':
        return `${value}% Complete`;
      case 'completion':
        return 'Completed';
      case 'level':
        return `Level ${level}`;
      case 'locked':
        return 'Locked';
      default:
        return '';
    }
  };
  
  // Render indicator content
  const renderIndicatorContent = () => {
    switch (type) {
      case 'progress':
        return (
          <Tooltip title={`${value}% Complete`} arrow>
            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
              <CircularProgress
                variant="determinate"
                value={value}
                size={getSizeValue(28, 44, 60)}
                thickness={getSizeValue(4, 4, 3.6)}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  position: 'absolute',
                }}
              />
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ position: 'relative' }}
              >
                {value}%
              </Typography>
            </Box>
          </Tooltip>
        );
      case 'completion':
        return (
          <Tooltip title="Completed" arrow>
            <CompletionCheck
              sx={{
                fontSize: iconSize,
                animation: animate ? `${glowAnimation} 2s infinite ease-in-out` : 'none',
              }}
            />
          </Tooltip>
        );
      case 'level':
        return (
          <Tooltip title={`Level ${level}`} arrow>
            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
              <LevelStar sx={{ fontSize: iconSize, position: 'absolute' }} />
              <LevelText
                variant="caption"
                sx={{ position: 'relative', fontSize: getSizeValue(10, 14, 18) }}
              >
                {level}
              </LevelText>
            </Box>
          </Tooltip>
        );
      case 'locked':
        return (
          <Tooltip title="Locked" arrow>
            <LockIcon sx={{ fontSize: iconSize }} />
          </Tooltip>
        );
      default:
        return null;
    }
  };
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <IndicatorContainer
        indicatorSize={size}
        isAnimating={animate}
        isClickable={!!onClick}
        className={className}
        onClick={onClick}
      >
        {renderIndicatorContent()}
      </IndicatorContainer>
      
      {showLabel && (
        <LabelText variant="caption">
          {getLabelText()}
        </LabelText>
      )}
    </Box>
  );
};

export default CompletionIndicator; 
import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Backdrop, Fade, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import { LockOpen, Star } from '@mui/icons-material';

// Define animation types
export type UnlockAnimationType = 'simple' | 'celebration' | 'achievement';

// Define props interface
interface UnlockAnimationProps {
  open: boolean;
  onClose: () => void;
  type?: UnlockAnimationType;
  title?: string;
  description?: string;
  xp?: number;
  level?: number;
  duration?: number; // in milliseconds
  className?: string;
}

// Animations
const unlockKeyframes = keyframes`
  0% {
    transform: scale(0.5) rotate(0deg);
    opacity: 0;
  }
  20% {
    transform: scale(1.2) rotate(0deg);
    opacity: 1;
  }
  40% {
    transform: scale(1) rotate(0deg);
  }
  60% {
    transform: scale(1) rotate(15deg);
  }
  80% {
    transform: scale(1) rotate(-15deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 135, 245, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 15px rgba(66, 135, 245, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 135, 245, 0);
  }
`;

const floatUpKeyframes = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const sparkleKeyframes = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

// Styled components
const AnimationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'transparent',
  position: 'relative',
  width: '100%',
  maxWidth: 400,
  textAlign: 'center',
}));

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'animationType'
})<{ animationType: UnlockAnimationType }>(({ theme, animationType }) => {
  let animationStyle = {};
  
  switch (animationType) {
    case 'celebration':
      animationStyle = {
        animation: `${unlockKeyframes} 1.5s ease-out forwards, ${pulseKeyframes} 2s 1.5s infinite`,
      };
      break;
    case 'achievement':
      animationStyle = {
        animation: `${unlockKeyframes} 1.5s ease-out forwards`,
      };
      break;
    case 'simple':
    default:
      animationStyle = {
        animation: `${unlockKeyframes} 1s ease-out forwards`,
      };
  }
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(2),
    ...animationStyle,
  };
});

const ContentContainer = styled(Box)({
  animation: `${floatUpKeyframes} 0.8s ease-out 0.5s both`,
});

const XpContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  animation: `${floatUpKeyframes} 0.8s ease-out 0.8s both`,
}));

const Sparkle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: theme.palette.warning.main,
  boxShadow: `0 0 10px ${theme.palette.warning.main}`,
  animation: `${sparkleKeyframes} 1.5s infinite`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[10],
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  padding: theme.spacing(3),
}));

// UnlockAnimation component
const UnlockAnimation: React.FC<UnlockAnimationProps> = ({
  open,
  onClose,
  type = 'simple',
  title = 'New Content Unlocked!',
  description = 'You have unlocked new content. Keep up the good work!',
  xp,
  level,
  duration = 4000,
  className,
}) => {
  const [sparkles, setSparkles] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);
  
  // Generate random sparkles for celebration animation
  useEffect(() => {
    if (open && type === 'celebration') {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [open, type]);
  
  // Auto-close after duration
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);
  
  // Render icon based on animation type
  const renderIcon = () => {
    switch (type) {
      case 'achievement':
        return <Star sx={{ fontSize: 40 }} />;
      case 'celebration':
      case 'simple':
      default:
        return <LockOpen sx={{ fontSize: 40 }} />;
    }
  };
  
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <Fade in={open}>
        <StyledPaper className={className}>
          <AnimationContainer>
            {type === 'celebration' && sparkles.map((sparkle) => (
              <Sparkle
                key={sparkle.id}
                sx={{
                  top: `${sparkle.top}%`,
                  left: `${sparkle.left}%`,
                  animationDelay: `${sparkle.delay}s`,
                }}
              />
            ))}
            
            <IconContainer animationType={type}>
              {renderIcon()}
            </IconContainer>
            
            <ContentContainer>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {title}
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            </ContentContainer>
            
            {(xp !== undefined || level !== undefined) && (
              <XpContainer>
                {xp !== undefined && (
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 2 }}>
                    +{xp} XP
                  </Typography>
                )}
                
                {level !== undefined && (
                  <Typography variant="subtitle1" fontWeight="bold">
                    Level {level}
                  </Typography>
                )}
              </XpContainer>
            )}
          </AnimationContainer>
        </StyledPaper>
      </Fade>
    </Backdrop>
  );
};

export default UnlockAnimation; 
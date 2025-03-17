import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Paper, 
  Fade, 
  Grow,
  Slide,
  Zoom,
  IconButton
} from '@mui/material';
import { keyframes } from '@mui/system';
import { 
  CheckCircle as CorrectIcon, 
  Cancel as IncorrectIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Define feedback types
export type FeedbackType = 'correct' | 'incorrect' | 'info' | 'warning' | 'hint';

// Define animation types
export type FeedbackAnimation = 'fade' | 'grow' | 'slide' | 'zoom' | 'bounce';

// Define feedback position
export type FeedbackPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

// Define props interface
interface FeedbackProps {
  type: FeedbackType;
  message: string;
  detail?: string;
  isVisible: boolean;
  animation?: FeedbackAnimation;
  position?: FeedbackPosition;
  duration?: number; // in milliseconds, 0 for no auto-hide
  onClose?: () => void;
  showIcon?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

// Animations
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// Styled components
const FeedbackContainer = styled(Paper, {
  shouldForwardProp: (prop) => !['feedbackType', 'feedbackPosition', 'isBounceAnimated'].includes(prop as string),
})<{ 
  feedbackType: FeedbackType; 
  feedbackPosition: FeedbackPosition;
  isBounceAnimated: boolean;
}>(({ theme, feedbackType, feedbackPosition, isBounceAnimated }) => {
  // Set color based on feedback type
  let backgroundColor;
  let textColor;
  
  switch (feedbackType) {
    case 'correct':
      backgroundColor = theme.palette.success.main;
      textColor = theme.palette.success.contrastText;
      break;
    case 'incorrect':
      backgroundColor = theme.palette.error.main;
      textColor = theme.palette.error.contrastText;
      break;
    case 'warning':
      backgroundColor = theme.palette.warning.main;
      textColor = theme.palette.warning.contrastText;
      break;
    case 'hint':
      backgroundColor = theme.palette.info.light;
      textColor = theme.palette.info.contrastText;
      break;
    case 'info':
    default:
      backgroundColor = theme.palette.info.main;
      textColor = theme.palette.info.contrastText;
  }
  
  // Set position styles
  let positionStyles = {};
  
  switch (feedbackPosition) {
    case 'top':
      positionStyles = {
        top: theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',
      };
      break;
    case 'bottom':
      positionStyles = {
        bottom: theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',
      };
      break;
    case 'left':
      positionStyles = {
        left: theme.spacing(2),
        top: '50%',
        transform: 'translateY(-50%)',
      };
      break;
    case 'right':
      positionStyles = {
        right: theme.spacing(2),
        top: '50%',
        transform: 'translateY(-50%)',
      };
      break;
    case 'center':
    default:
      positionStyles = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
  }
  
  return {
    position: 'absolute',
    zIndex: theme.zIndex.snackbar,
    backgroundColor,
    color: textColor,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    display: 'flex',
    alignItems: 'center',
    maxWidth: '90%',
    width: 'auto',
    ...(isBounceAnimated && {
      animation: `${bounceAnimation} 1s ease`,
    }),
    ...positionStyles,
  };
});

const IconContainer = styled(Box)({
  marginRight: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const CloseButtonContainer = styled(Box)({
  marginLeft: '16px',
});

// Feedback component
const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  detail,
  isVisible,
  animation = 'fade',
  position = 'bottom',
  duration = 3000,
  onClose,
  showIcon = true,
  showCloseButton = true,
  className,
}) => {
  const [open, setOpen] = useState(isVisible);
  
  // Handle visibility changes
  useEffect(() => {
    setOpen(isVisible);
    
    // Auto-hide after duration if specified
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isVisible, duration, onClose]);
  
  // Handle close button click
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  // Get icon based on feedback type
  const getIcon = () => {
    switch (type) {
      case 'correct':
        return <CorrectIcon sx={{ color: 'inherit', fontSize: 28 }} />;
      case 'incorrect':
        return <IncorrectIcon sx={{ color: 'inherit', fontSize: 28 }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'inherit', fontSize: 28 }} />;
      case 'hint':
      case 'info':
      default:
        return <InfoIcon sx={{ color: 'inherit', fontSize: 28 }} />;
    }
  };
  
  // Determine animation component
  const AnimationComponent = (() => {
    switch (animation) {
      case 'grow':
        return Grow;
      case 'slide':
        return Slide;
      case 'zoom':
        return Zoom;
      case 'fade':
      default:
        return Fade;
    }
  })();
  
  // Get animation props
  const getAnimationProps = () => {
    if (animation === 'slide') {
      let direction: 'up' | 'down' | 'left' | 'right';
      
      switch (position) {
        case 'top':
          direction = 'down';
          break;
        case 'bottom':
          direction = 'up';
          break;
        case 'left':
          direction = 'right';
          break;
        case 'right':
          direction = 'left';
          break;
        default:
          direction = 'up';
      }
      
      return { direction };
    }
    
    return {};
  };
  
  return (
    <AnimationComponent
      in={open}
      timeout={300}
      {...getAnimationProps()}
    >
      <FeedbackContainer 
        feedbackType={type} 
        feedbackPosition={position}
        isBounceAnimated={animation === 'bounce'}
        className={className}
        elevation={6}
      >
        {showIcon && (
          <IconContainer>
            {getIcon()}
          </IconContainer>
        )}
        
        <ContentContainer>
          <Typography variant="body1" fontWeight="bold">
            {message}
          </Typography>
          
          {detail && (
            <Typography variant="body2">
              {detail}
            </Typography>
          )}
        </ContentContainer>
        
        {showCloseButton && (
          <CloseButtonContainer>
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: 'inherit' }}
              aria-label="Close feedback"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </CloseButtonContainer>
        )}
      </FeedbackContainer>
    </AnimationComponent>
  );
};

export default Feedback; 
import React from 'react';
import { 
  Box, 
  styled, 
  keyframes, 
  useTheme
} from '@mui/material';

// Define animation types
export type FeedbackAnimationType = 
  | 'pulse' 
  | 'shake' 
  | 'bounce' 
  | 'highlight' 
  | 'wiggle'
  | 'blink'
  | 'float';

// Define props interface
interface FeedbackAnimationProps {
  children: React.ReactNode;
  type: FeedbackAnimationType;
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
  repeat?: number | 'infinite';
  color?: string;
  isActive?: boolean;
  className?: string;
}

// Define keyframes animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
`;

const highlight = keyframes`
  0% { background-color: transparent; }
  50% { background-color: rgba(255, 255, 0, 0.3); }
  100% { background-color: transparent; }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const AnimatedContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'animationType' && 
    prop !== 'animationDuration' && 
    prop !== 'animationDelay' && 
    prop !== 'animationRepeat' && 
    prop !== 'highlightColor' &&
    prop !== 'isActive',
})<{ 
  animationType: FeedbackAnimationType; 
  animationDuration: number;
  animationDelay: number;
  animationRepeat: number | 'infinite';
  highlightColor: string;
  isActive: boolean;
}>(({ 
  animationType, 
  animationDuration, 
  animationDelay, 
  animationRepeat,
  highlightColor,
  isActive
}) => {
  // Get animation based on type
  let animation;
  
  switch (animationType) {
    case 'pulse':
      animation = pulse;
      break;
    case 'shake':
      animation = shake;
      break;
    case 'bounce':
      animation = bounce;
      break;
    case 'highlight':
      animation = highlight;
      break;
    case 'wiggle':
      animation = wiggle;
      break;
    case 'blink':
      animation = blink;
      break;
    case 'float':
      animation = float;
      break;
    default:
      animation = pulse;
  }
  
  return {
    display: 'inline-block',
    position: 'relative',
    ...(isActive && {
      animation: `${animation} ${animationDuration}ms ease-in-out ${animationDelay}ms ${animationRepeat}`,
    }),
    ...(animationType === 'highlight' && {
      '& *': {
        position: 'relative',
        zIndex: 1,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: highlightColor,
        opacity: 0,
        zIndex: 0,
        animation: isActive ? `${highlight} ${animationDuration}ms ease-in-out ${animationDelay}ms ${animationRepeat}` : 'none',
      },
    }),
  };
});

// FeedbackAnimation component
const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  children,
  type,
  duration = 500,
  delay = 0,
  repeat = 1,
  color,
  isActive = true,
  className,
}) => {
  const theme = useTheme();
  
  // Get highlight color
  const highlightColor = color || `${theme.palette.primary.main}40`;
  
  return (
    <AnimatedContainer
      animationType={type}
      animationDuration={duration}
      animationDelay={delay}
      animationRepeat={repeat}
      highlightColor={highlightColor}
      isActive={isActive}
      className={className}
    >
      {children}
    </AnimatedContainer>
  );
};

export default FeedbackAnimation; 
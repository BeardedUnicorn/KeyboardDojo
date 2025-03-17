import React, { useState, useEffect } from 'react';
import { 
  Box, 
  styled, 
  keyframes, 
  useTheme
} from '@mui/material';
import { 
  CheckCircle as CorrectIcon, 
  Cancel as IncorrectIcon,
  EmojiEvents as AchievementIcon
} from '@mui/icons-material';

// Define animation types
export type AnswerAnimationType = 
  | 'fade' 
  | 'bounce' 
  | 'pulse' 
  | 'scale' 
  | 'slide' 
  | 'confetti';

// Define result types
export type AnswerResult = 'correct' | 'incorrect' | 'achievement';

// Define props interface
interface AnswerAnimationProps {
  result: AnswerResult;
  animationType?: AnswerAnimationType;
  duration?: number; // in milliseconds
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  text?: string;
  onAnimationComplete?: () => void;
  className?: string;
}

// Define keyframes animations
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const scale = keyframes`
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  0% { transform: translateY(-50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(50px); opacity: 0; }
`;

const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
`;

// Styled components
const AnimationContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'animationType' && 
    prop !== 'result' && 
    prop !== 'isExiting' &&
    prop !== 'animationDuration',
})<{ 
  animationType: AnswerAnimationType; 
  result: AnswerResult;
  isExiting: boolean;
  animationDuration: number;
}>(({ theme, animationType, result, isExiting, animationDuration }) => {
  // Set color based on result
  let color;
  switch (result) {
    case 'correct':
      color = theme.palette.success.main;
      break;
    case 'incorrect':
      color = theme.palette.error.main;
      break;
    case 'achievement':
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  // Set animation based on type
  let animation;
  let exitAnimation;
  
  switch (animationType) {
    case 'bounce':
      animation = `${bounce} ${animationDuration}ms ease-in-out`;
      exitAnimation = `${fadeOut} 300ms ease-in-out forwards`;
      break;
    case 'pulse':
      animation = `${pulse} ${animationDuration}ms ease-in-out infinite`;
      exitAnimation = `${fadeOut} 300ms ease-in-out forwards`;
      break;
    case 'scale':
      animation = `${scale} ${animationDuration}ms ease-out`;
      exitAnimation = `${fadeOut} 300ms ease-in-out forwards`;
      break;
    case 'slide':
      animation = `${slideIn} ${animationDuration / 2}ms ease-out`;
      exitAnimation = `${slideOut} 300ms ease-in-out forwards`;
      break;
    case 'confetti':
      animation = `${fadeIn} ${animationDuration / 2}ms ease-out`;
      exitAnimation = `${fadeOut} 300ms ease-in-out forwards`;
      break;
    case 'fade':
    default:
      animation = `${fadeIn} ${animationDuration / 2}ms ease-out`;
      exitAnimation = `${fadeOut} 300ms ease-in-out forwards`;
  }
  
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: theme.zIndex.tooltip,
    animation: isExiting ? exitAnimation : animation,
    pointerEvents: 'none',
  };
});

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: AnswerAnimationProps['size'] }>(({ size }) => {
  let iconSize;
  switch (size) {
    case 'small':
      iconSize = 48;
      break;
    case 'large':
      iconSize = 96;
      break;
    case 'medium':
    default:
      iconSize = 64;
  }
  
  return {
    fontSize: iconSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

const TextContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: AnswerAnimationProps['size'] }>(({ theme, size }) => {
  let fontSize;
  switch (size) {
    case 'small':
      fontSize = '1rem';
      break;
    case 'large':
      fontSize = '1.75rem';
      break;
    case 'medium':
    default:
      fontSize = '1.25rem';
  }
  
  return {
    fontSize,
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    textAlign: 'center',
    textShadow: '0 0 10px rgba(0,0,0,0.2)',
  };
});

const ConfettiPiece = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'color' && 
    prop !== 'delay' && 
    prop !== 'size' &&
    prop !== 'left',
})<{ 
  color: string; 
  delay: number;
  size: number;
  left: number;
}>(({ color, delay, size, left }) => ({
  position: 'absolute',
  backgroundColor: color,
  width: size,
  height: size,
  top: 0,
  left: `${left}%`,
  animation: `${confettiAnimation} 1s ease-out ${delay}ms forwards`,
  opacity: 0,
}));

// Confetti component
const Confetti: React.FC = () => {
  const theme = useTheme();
  const confettiColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];
  
  // Generate random confetti pieces
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 500,
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
  }));
  
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          delay={piece.delay}
          size={piece.size}
          left={piece.left}
        />
      ))}
    </Box>
  );
};

// AnswerAnimation component
const AnswerAnimation: React.FC<AnswerAnimationProps> = ({
  result,
  animationType = 'fade',
  duration = 1500,
  size = 'medium',
  showIcon = true,
  text,
  onAnimationComplete,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  // Handle animation completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      
      // Additional timeout for exit animation
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 300);
      
      return () => clearTimeout(exitTimer);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);
  
  // Get icon based on result
  const getIcon = () => {
    switch (result) {
      case 'correct':
        return <CorrectIcon fontSize="inherit" />;
      case 'incorrect':
        return <IncorrectIcon fontSize="inherit" />;
      case 'achievement':
        return <AchievementIcon fontSize="inherit" />;
      default:
        return <CorrectIcon fontSize="inherit" />;
    }
  };
  
  // Get text based on result if not provided
  const getDefaultText = () => {
    switch (result) {
      case 'correct':
        return 'Correct!';
      case 'incorrect':
        return 'Try Again!';
      case 'achievement':
        return 'Achievement Unlocked!';
      default:
        return '';
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <AnimationContainer
      animationType={animationType}
      result={result}
      isExiting={isExiting}
      animationDuration={duration}
      className={className}
    >
      {animationType === 'confetti' && result === 'correct' && <Confetti />}
      
      {showIcon && (
        <IconContainer size={size}>
          {getIcon()}
        </IconContainer>
      )}
      
      {(text || getDefaultText()) && (
        <TextContainer size={size}>
          {text || getDefaultText()}
        </TextContainer>
      )}
    </AnimationContainer>
  );
};

export default AnswerAnimation; 
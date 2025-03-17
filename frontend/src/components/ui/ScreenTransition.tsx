import React, { useState, useEffect } from 'react';
import { 
  Box, 
  styled, 
  keyframes, 
  Fade,
  Slide,
  Grow,
  Zoom,
  Collapse
} from '@mui/material';

// Define transition types
export type TransitionType = 
  | 'fade' 
  | 'slide'
  | 'slide-left' 
  | 'slide-right' 
  | 'slide-up' 
  | 'slide-down' 
  | 'grow' 
  | 'zoom' 
  | 'collapse' 
  | 'none';

// Define props interface
interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  direction?: 'in' | 'out';
  duration?: number;
  delay?: number;
  onExited?: () => void;
  className?: string;
}

// Define custom keyframes animations
const slideLeftIn = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideLeftOut = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
`;

const slideRightIn = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideRightOut = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const slideUpIn = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const slideUpOut = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
`;

const slideDownIn = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const slideDownOut = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

// Styled components
const TransitionContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'transitionType' && 
    prop !== 'transitionDirection' && 
    prop !== 'transitionDuration' &&
    prop !== 'transitionDelay',
})<{ 
  transitionType: TransitionType; 
  transitionDirection: 'in' | 'out';
  transitionDuration: number;
  transitionDelay: number;
}>(({ 
  transitionType, 
  transitionDirection, 
  transitionDuration, 
  transitionDelay 
}) => {
  // Set animation based on type and direction
  let animation;
  
  if (transitionType === 'none') {
    return {
      position: 'relative',
    };
  }
  
  if (transitionType.startsWith('slide-')) {
    let slideAnimation;
    
    switch (transitionType) {
      case 'slide-left':
        slideAnimation = transitionDirection === 'in' ? slideLeftIn : slideLeftOut;
        break;
      case 'slide-right':
        slideAnimation = transitionDirection === 'in' ? slideRightIn : slideRightOut;
        break;
      case 'slide-up':
        slideAnimation = transitionDirection === 'in' ? slideUpIn : slideUpOut;
        break;
      case 'slide-down':
        slideAnimation = transitionDirection === 'in' ? slideDownIn : slideDownOut;
        break;
      default:
        slideAnimation = transitionDirection === 'in' ? slideLeftIn : slideLeftOut;
    }
    
    animation = `${slideAnimation} ${transitionDuration}ms ease-in-out ${transitionDelay}ms forwards`;
  }
  
  return {
    position: 'relative',
    ...(animation && { animation }),
    ...(transitionType.startsWith('slide-') && { overflow: 'hidden' }),
  };
});

// ScreenTransition component
const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'in',
  duration = 300,
  delay = 0,
  onExited,
  className,
}) => {
  const [mounted, setMounted] = useState(direction === 'in');
  
  // Handle mounting/unmounting based on direction
  useEffect(() => {
    if (direction === 'in') {
      setMounted(true);
    } else if (direction === 'out') {
      const timer = setTimeout(() => {
        setMounted(false);
        if (onExited) {
          onExited();
        }
      }, duration + delay);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [direction, duration, delay, onExited]);
  
  // Render appropriate transition component based on type
  const renderTransition = () => {
    if (type === 'none') {
      return (
        <TransitionContainer
          transitionType={type}
          transitionDirection={direction}
          transitionDuration={duration}
          transitionDelay={delay}
          className={className}
        >
          {children}
        </TransitionContainer>
      );
    }
    
    if (type.startsWith('slide-')) {
      return (
        <TransitionContainer
          transitionType={type}
          transitionDirection={direction}
          transitionDuration={duration}
          transitionDelay={delay}
          className={className}
        >
          {children}
        </TransitionContainer>
      );
    }
    
    // Use Material-UI transition components for standard transitions
    switch (type) {
      case 'fade':
        return (
          <Fade 
            in={direction === 'in'} 
            timeout={duration}
            style={{ transitionDelay: `${delay}ms` }}
            onExited={onExited}
          >
            <Box className={className}>
              {children}
            </Box>
          </Fade>
        );
      case 'slide':
        return (
          <Slide 
            in={direction === 'in'} 
            direction={direction === 'in' ? 'up' : 'down'}
            timeout={duration}
            style={{ transitionDelay: `${delay}ms` }}
            onExited={onExited}
          >
            <Box className={className}>
              {children}
            </Box>
          </Slide>
        );
      case 'grow':
        return (
          <Grow 
            in={direction === 'in'} 
            timeout={duration}
            style={{ transitionDelay: `${delay}ms` }}
            onExited={onExited}
          >
            <Box className={className}>
              {children}
            </Box>
          </Grow>
        );
      case 'zoom':
        return (
          <Zoom 
            in={direction === 'in'} 
            timeout={duration}
            style={{ transitionDelay: `${delay}ms` }}
            onExited={onExited}
          >
            <Box className={className}>
              {children}
            </Box>
          </Zoom>
        );
      case 'collapse':
        return (
          <Collapse 
            in={direction === 'in'} 
            timeout={duration}
            style={{ transitionDelay: `${delay}ms` }}
            onExited={onExited}
          >
            <Box className={className}>
              {children}
            </Box>
          </Collapse>
        );
      default:
        return (
          <Box className={className}>
            {children}
          </Box>
        );
    }
  };
  
  if (!mounted && direction === 'out') {
    return null;
  }
  
  return renderTransition();
};

export default ScreenTransition; 
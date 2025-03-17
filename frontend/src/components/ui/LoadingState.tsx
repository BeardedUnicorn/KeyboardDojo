import React from 'react';
import { 
  Box, 
  CircularProgress, 
  LinearProgress,
  Typography,
  Skeleton,
  styled, 
  keyframes, 
  useTheme
} from '@mui/material';
import { NinjaMascot } from './';

// Define loading types
export type LoadingType = 
  | 'circular' 
  | 'linear' 
  | 'skeleton' 
  | 'dots' 
  | 'pulse'
  | 'ninja';

// Define loading sizes
export type LoadingSize = 'small' | 'medium' | 'large';

// Define props interface
interface LoadingStateProps {
  type?: LoadingType;
  size?: LoadingSize;
  text?: string;
  progress?: number; // 0-100 for determinate progress
  variant?: 'determinate' | 'indeterminate';
  fullScreen?: boolean;
  overlay?: boolean;
  transparent?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

// Define keyframes animations
const dotPulse = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isFullScreen' && 
    prop !== 'isOverlay' && 
    prop !== 'isTransparent',
})<{ 
  isFullScreen: boolean; 
  isOverlay: boolean;
  isTransparent: boolean;
}>(({ isFullScreen, isOverlay, isTransparent }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  ...(isFullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  }),
  ...(isOverlay && {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  }),
  ...(isOverlay && !isTransparent && {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  }),
}));

const TextContainer = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  maxWidth: '80%',
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const Dot = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'dotColor' && 
    prop !== 'dotSize' && 
    prop !== 'dotIndex',
})<{ 
  dotColor: string; 
  dotSize: number;
  dotIndex: number;
}>(({ dotColor, dotSize, dotIndex }) => ({
  width: dotSize,
  height: dotSize,
  borderRadius: '50%',
  backgroundColor: dotColor,
  animation: `${dotPulse} 1.4s infinite ease-in-out both`,
  animationDelay: `${dotIndex * 0.16}s`,
}));

const PulseContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'pulseColor' && 
    prop !== 'pulseSize',
})<{ 
  pulseColor: string; 
  pulseSize: number;
}>(({ pulseColor, pulseSize }) => ({
  width: pulseSize,
  height: pulseSize,
  borderRadius: '50%',
  backgroundColor: pulseColor,
  animation: `${pulse} 1.5s infinite ease-in-out`,
}));

const NinjaContainer = styled(Box)(() => ({
  animation: `${rotate} 2s infinite linear`,
  transformOrigin: 'center center',
}));

// LoadingState component
const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'circular',
  size = 'medium',
  text,
  progress,
  variant = 'indeterminate',
  fullScreen = false,
  overlay = false,
  transparent = false,
  color = 'primary',
  className,
}) => {
  const theme = useTheme();
  
  // Get color from theme
  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get size based on prop
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      case 'medium':
      default:
        return 40;
    }
  };
  
  // Get width for skeleton
  const getSkeletonWidth = () => {
    switch (size) {
      case 'small':
        return 100;
      case 'large':
        return 300;
      case 'medium':
      default:
        return 200;
    }
  };
  
  // Get height for skeleton
  const getSkeletonHeight = () => {
    switch (size) {
      case 'small':
        return 60;
      case 'large':
        return 150;
      case 'medium':
      default:
        return 100;
    }
  };
  
  // Render loading indicator based on type
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'linear':
        return (
          <LinearProgress 
            color={color} 
            variant={variant} 
            value={progress} 
            sx={{ width: getSkeletonWidth(), height: size === 'small' ? 4 : size === 'large' ? 8 : 6 }}
          />
        );
      case 'skeleton':
        return (
          <Box>
            <Skeleton 
              variant="rectangular" 
              width={getSkeletonWidth()} 
              height={getSkeletonHeight()} 
              animation="wave" 
            />
            {text && (
              <Skeleton 
                variant="text" 
                width={getSkeletonWidth() * 0.8} 
                sx={{ mt: 1 }} 
                animation="wave" 
              />
            )}
          </Box>
        );
      case 'dots':
        return (
          <DotsContainer>
            {[0, 1, 2].map((index) => (
              <Dot 
                key={index} 
                dotColor={getColor()} 
                dotSize={getSize() / 3} 
                dotIndex={index} 
              />
            ))}
          </DotsContainer>
        );
      case 'pulse':
        return (
          <PulseContainer 
            pulseColor={getColor()} 
            pulseSize={getSize()} 
          />
        );
      case 'ninja':
        return (
          <NinjaContainer>
            <NinjaMascot 
              size={size} 
              emotion="neutral" 
              animate={true}
            />
          </NinjaContainer>
        );
      case 'circular':
      default:
        return (
          <CircularProgress 
            color={color} 
            variant={variant} 
            value={progress} 
            size={getSize()} 
          />
        );
    }
  };
  
  return (
    <LoadingContainer 
      isFullScreen={fullScreen} 
      isOverlay={overlay}
      isTransparent={transparent}
      className={className}
    >
      {renderLoadingIndicator()}
      
      {text && type !== 'skeleton' && (
        <TextContainer variant={size === 'small' ? 'body2' : 'body1'} color="text.secondary">
          {text}
        </TextContainer>
      )}
    </LoadingContainer>
  );
};

export default LoadingState; 
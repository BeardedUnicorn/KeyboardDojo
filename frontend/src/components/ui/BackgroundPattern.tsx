import React from 'react';
import { 
  Box, 
  styled, 
  useTheme,
  alpha,
  SxProps,
  Theme
} from '@mui/material';

// Define pattern types
export type PatternType = 
  | 'dots' 
  | 'grid' 
  | 'lines' 
  | 'waves' 
  | 'circuit' 
  | 'hexagons'
  | 'triangles'
  | 'noise';

// Define props interface
interface BackgroundPatternProps {
  type?: PatternType;
  color?: string;
  opacity?: number;
  size?: number;
  rotate?: number;
  blur?: number;
  overlay?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Styled components
const PatternContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isOverlay',
})<{ 
  isOverlay: boolean;
}>(({ isOverlay }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  ...(isOverlay && {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  }),
}));

const ContentContainer = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  height: '100%',
});

// Function to generate pattern styles
const getPatternStyles = (
  patternType: PatternType,
  patternColor: string,
  patternOpacity: number,
  patternSize: number,
  patternRotate: number,
  patternBlur: number
): SxProps<Theme> => {
  // Base styles
  const baseStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: patternOpacity,
    transform: `rotate(${patternRotate}deg)`,
    filter: `blur(${patternBlur}px)`,
    pointerEvents: 'none',
    zIndex: -1,
  };
  
  // Get pattern-specific styles
  switch (patternType) {
    case 'dots':
      return {
        ...baseStyles,
        backgroundImage: `radial-gradient(${patternColor} 2px, transparent 2px)`,
        backgroundSize: `${patternSize * 3}px ${patternSize * 3}px`,
      };
    case 'grid':
      return {
        ...baseStyles,
        backgroundImage: `linear-gradient(to right, ${patternColor} 1px, transparent 1px), 
                        linear-gradient(to bottom, ${patternColor} 1px, transparent 1px)`,
        backgroundSize: `${patternSize * 2}px ${patternSize * 2}px`,
      };
    case 'lines':
      return {
        ...baseStyles,
        backgroundImage: `linear-gradient(${patternRotate + 90}deg, ${patternColor} 1px, transparent 1px)`,
        backgroundSize: `${patternSize * 2}px ${patternSize * 2}px`,
      };
    case 'waves':
      return {
        ...baseStyles,
        backgroundImage: `
          radial-gradient(ellipse at 50% 50%, ${patternColor} 0%, transparent 70%),
          radial-gradient(ellipse at 70% 30%, ${patternColor} 0%, transparent 70%),
          radial-gradient(ellipse at 30% 70%, ${patternColor} 0%, transparent 70%)
        `,
        backgroundSize: `${patternSize * 10}px ${patternSize * 10}px`,
        backgroundPosition: '0 0, 0 0, 0 0',
      };
    case 'circuit':
      return {
        ...baseStyles,
        backgroundImage: `
          linear-gradient(to right, ${patternColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${patternColor} 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, ${patternColor} 2px, transparent 2px)
        `,
        backgroundSize: `${patternSize * 5}px ${patternSize * 5}px, ${patternSize * 5}px ${patternSize * 5}px, ${patternSize * 10}px ${patternSize * 10}px`,
        backgroundPosition: `0 0, 0 0, ${patternSize * 2.5}px ${patternSize * 2.5}px`,
      };
    case 'hexagons':
      return {
        ...baseStyles,
        backgroundImage: `
          radial-gradient(circle at 0% 50%, transparent 9px, ${patternColor} 10px, ${patternColor} 11px, transparent 12px),
          radial-gradient(circle at 100% 50%, transparent 9px, ${patternColor} 10px, ${patternColor} 11px, transparent 12px),
          radial-gradient(circle at 50% 0%, transparent 9px, ${patternColor} 10px, ${patternColor} 11px, transparent 12px),
          radial-gradient(circle at 50% 100%, transparent 9px, ${patternColor} 10px, ${patternColor} 11px, transparent 12px)
        `,
        backgroundSize: `${patternSize * 4}px ${patternSize * 7}px`,
        backgroundPosition: '0 0, 0 0, 0 0, 0 0',
      };
    case 'triangles':
      return {
        ...baseStyles,
        backgroundImage: `
          linear-gradient(45deg, ${patternColor} 25%, transparent 25%),
          linear-gradient(135deg, ${patternColor} 25%, transparent 25%),
          linear-gradient(225deg, ${patternColor} 25%, transparent 25%),
          linear-gradient(315deg, ${patternColor} 25%, transparent 25%)
        `,
        backgroundSize: `${patternSize * 2}px ${patternSize * 2}px`,
        backgroundPosition: `0 0, ${patternSize}px 0, ${patternSize}px -${patternSize}px, 0 ${patternSize}px`,
      };
    case 'noise':
    default:
      return {
        ...baseStyles,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: `${patternSize * 4}px ${patternSize * 4}px`,
        opacity: patternOpacity * 0.3, // Noise is more visible, so reduce opacity
      };
  }
};

// BackgroundPattern component
const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  type = 'dots',
  color,
  opacity = 0.1,
  size = 10,
  rotate = 0,
  blur = 0,
  overlay = false,
  children,
  className,
}) => {
  const theme = useTheme();
  
  // Get color from theme if not provided
  const patternColor = color || alpha(theme.palette.primary.main, 0.5);
  
  // Get pattern styles
  const patternStyles = getPatternStyles(
    type,
    patternColor,
    opacity,
    size,
    rotate,
    blur
  );
  
  return (
    <PatternContainer isOverlay={overlay} className={className}>
      <Box sx={patternStyles} />
      
      {children && <ContentContainer>{children}</ContentContainer>}
    </PatternContainer>
  );
};

export default BackgroundPattern; 
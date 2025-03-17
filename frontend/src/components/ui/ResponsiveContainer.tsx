import React from 'react';
import { 
  Container,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';

// Define container sizes
export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Define props interface
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: ContainerSize;
  minHeight?: string | number;
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  margin?: string | number;
  marginX?: string | number;
  marginY?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  disableGutters?: boolean;
  centerContent?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Styled components
const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => 
    prop !== 'centerContent' && 
    prop !== 'fullHeight' && 
    prop !== 'fullWidth',
})<{ 
  centerContent: boolean; 
  fullHeight: boolean;
  fullWidth: boolean;
}>(({ centerContent, fullHeight, fullWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(centerContent && {
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ...(fullHeight && {
    height: '100%',
    minHeight: '100%',
  }),
  ...(fullWidth && {
    width: '100%',
    maxWidth: '100% !important',
  }),
}));

// ResponsiveContainer component
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  minHeight,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  disableGutters = false,
  centerContent = false,
  fullHeight = false,
  fullWidth = false,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Adjust padding based on screen size
  const getResponsivePadding = () => {
    if (padding !== undefined) return padding;
    
    if (isMobile) {
      return theme.spacing(2);
    } else if (isTablet) {
      return theme.spacing(3);
    } else {
      return theme.spacing(4);
    }
  };
  
  // Create style object
  const containerStyle = {
    minHeight,
    padding: getResponsivePadding(),
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  };
  
  return (
    <StyledContainer
      maxWidth={maxWidth === 'full' ? false : maxWidth}
      disableGutters={disableGutters}
      centerContent={centerContent}
      fullHeight={fullHeight}
      fullWidth={fullWidth}
      className={className}
      sx={containerStyle}
    >
      {children}
    </StyledContainer>
  );
};

export default ResponsiveContainer; 
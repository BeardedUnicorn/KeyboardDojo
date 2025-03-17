import React from 'react';
import { Box, Container, Typography, BoxProps, keyframes, useTheme, SxProps } from '@mui/material';
import GradientText from './GradientText';

// Define section types
export type SectionType = 'default' | 'hero' | 'feature' | 'lesson' | 'dashboard';

// Define pattern types
export type PatternType = 'none' | 'dots' | 'grid' | 'circuit' | 'waves';

interface SectionProps extends Omit<BoxProps, 'maxWidth'> {
  title?: string;
  subtitle?: string;
  titleGradient?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  centered?: boolean;
  spacing?: number;
  gradientBackground?: boolean;
  pattern?: PatternType;
  sectionType?: SectionType;
  animateIn?: boolean;
  divider?: boolean;
}

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  titleGradient = false,
  maxWidth = 'lg',
  centered = false,
  spacing = 8,
  gradientBackground = false,
  pattern = 'none',
  sectionType = 'default',
  animateIn = false,
  divider = false,
  children,
  ...props
}) => {
  const theme = useTheme();
  
  // Create style object
  const sxStyles = {
    position: 'relative',
    ...(gradientBackground && {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
    }),
    ...(animateIn && {
      animation: `${fadeIn} 0.8s ease-out forwards`,
    }),
    ...(divider && {
      borderBottom: `1px solid ${theme.palette.divider}`,
    }),
    // Add pattern styles
    ...(pattern === 'dots' && {
      backgroundImage: `radial-gradient(${theme.palette.primary.light}20 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    }),
    ...(pattern === 'grid' && {
      backgroundImage: `linear-gradient(${theme.palette.primary.light}10 1px, transparent 1px), 
                        linear-gradient(90deg, ${theme.palette.primary.light}10 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    }),
    // Add section type styles
    ...(sectionType === 'hero' && {
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
    }),
    ...(sectionType === 'feature' && {
      overflow: 'hidden',
      py: 10,
    }),
    ...(sectionType === 'lesson' && {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    }),
    ...(sectionType === 'dashboard' && {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      height: '100%',
    }),
    ...(props.sx || {}),
  };
  
  // Title box styles
  const titleBoxStyles = {
    maxWidth: centered ? '800px' : 'none',
    mx: centered ? 'auto' : 0,
    ...(animateIn && {
      animation: `${slideInUp} 0.5s ease-out forwards`,
      animationDelay: '0.2s',
      opacity: 0,
    }),
  };
  
  // Content box styles
  const contentBoxStyles = {
    ...(animateIn && {
      animation: `${slideInUp} 0.5s ease-out forwards`,
      animationDelay: '0.3s',
      opacity: 0,
    }),
  };
  
  return (
    <Box
      component="section"
      py={spacing}
      {...props}
      sx={sxStyles}
    >
      <Container maxWidth={maxWidth}>
        {(title || subtitle) && (
          <Box 
            mb={4} 
            textAlign={centered ? 'center' : 'left'}
            sx={titleBoxStyles}
          >
            {title && (
              titleGradient ? (
                <GradientText 
                  variant="h2" 
                  fontWeight="bold" 
                  mb={2}
                  direction="to right"
                  startColor={theme.palette.primary.main}
                  endColor={theme.palette.secondary.main}
                >
                  {title}
                </GradientText>
              ) : (
                <Typography variant="h2" fontWeight="bold" mb={2}>
                  {title}
                </Typography>
              )
            )}
            
            {subtitle && (
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  maxWidth: centered ? '700px' : 'none', 
                  mx: centered ? 'auto' : 0,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        
        <Box sx={contentBoxStyles}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Section; 
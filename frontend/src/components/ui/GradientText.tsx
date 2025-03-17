import React from 'react';
import { Typography, TypographyProps, useTheme } from '@mui/material';

interface GradientTextProps extends Omit<TypographyProps, 'color'> {
  gradient?: string;
  direction?: 'to right' | 'to left' | '45deg' | 'to bottom' | 'to top';
  startColor?: string;
  endColor?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient,
  direction = '45deg',
  startColor,
  endColor,
  ...props
}) => {
  const theme = useTheme();
  
  // Default gradient uses theme colors if not specified
  const defaultGradient = `linear-gradient(${direction}, ${startColor || theme.palette.primary.light}, ${endColor || theme.palette.secondary.light})`;
  
  return (
    <Typography
      {...props}
      sx={{
        background: gradient || defaultGradient,
        backgroundClip: 'text',
        textFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        ...props.sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default GradientText; 
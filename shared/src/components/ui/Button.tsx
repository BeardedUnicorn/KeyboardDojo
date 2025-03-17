import React from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps, 
  styled,
  Box,
  CircularProgress
} from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  fullWidthMobile?: boolean;
  gradient?: boolean;
  loading?: boolean;
  iconPosition?: 'start' | 'end';
}

// Create a styled version of MuiButton
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['fullWidthMobile', 'gradient', 'loading', 'iconPosition'].includes(prop as string),
})<ButtonProps>(({ theme, fullWidthMobile, gradient }) => ({
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(1.25)} ${theme.spacing(2.5)}`,
  transition: 'all 0.2s ease-in-out',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  
  // Full width on mobile if fullWidthMobile is true
  [theme.breakpoints.down('sm')]: {
    width: fullWidthMobile ? '100%' : 'auto',
  },
  
  // Enhanced hover effects
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  
  // Active state
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Gradient background for contained variant
  ...(gradient && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
  }),
  
  // Disabled state
  '&.Mui-disabled': {
    opacity: 0.7,
    boxShadow: 'none',
  },
}));

// Button ripple effect
const ButtonRipple = styled('span')({
  position: 'absolute',
  borderRadius: '50%',
  transform: 'scale(0)',
  animation: 'ripple 600ms linear',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  '@keyframes ripple': {
    to: {
      transform: 'scale(4)',
      opacity: 0,
    },
  },
});

const Button: React.FC<ButtonProps> = ({ 
  children, 
  fullWidthMobile = false, 
  gradient = false,
  loading = false,
  startIcon,
  endIcon,
  iconPosition = 'start',
  disabled,
  ...props 
}) => {
  const [rippleCount, setRippleCount] = React.useState(0);
  const [rippleArray, setRippleArray] = React.useState<{ x: number, y: number, size: number }[]>([]);

  // Handle ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rippleContainer = e.currentTarget.getBoundingClientRect();
    const size = rippleContainer.width > rippleContainer.height 
      ? rippleContainer.width 
      : rippleContainer.height;
    const x = e.clientX - rippleContainer.left - size / 2;
    const y = e.clientY - rippleContainer.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
    };

    setRippleArray([...rippleArray, newRipple]);
    setRippleCount(rippleCount + 1);
  };

  // Clean up ripples
  React.useEffect(() => {
    let bounce: number;
    if (rippleArray.length > 0) {
      bounce = window.setTimeout(() => {
        setRippleArray([]);
        setRippleCount(0);
      }, 600);
    }

    return () => clearTimeout(bounce);
  }, [rippleCount, rippleArray.length]);

  // Determine which icon to show based on position
  const buttonStartIcon = iconPosition === 'start' ? startIcon : undefined;
  const buttonEndIcon = iconPosition === 'end' ? endIcon : undefined;

  return (
    <StyledButton
      fullWidthMobile={fullWidthMobile}
      gradient={gradient}
      loading={loading}
      disabled={disabled || loading}
      startIcon={loading ? undefined : buttonStartIcon}
      endIcon={loading ? undefined : buttonEndIcon}
      onClick={handleClick}
      {...props}
    >
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => (
          <ButtonRipple
            key={`ripple_${index}`}
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress 
            size={20} 
            color="inherit" 
            sx={{ mr: children ? 1 : 0 }} 
          />
          {children}
        </Box>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button; 
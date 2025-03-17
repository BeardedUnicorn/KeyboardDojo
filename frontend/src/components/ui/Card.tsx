import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps, 
  styled, 
  keyframes,
  Box
} from '@mui/material';

// Define card types
export type CardType = 'default' | 'lesson' | 'achievement' | 'track';

interface CardProps extends MuiCardProps {
  hoverEffect?: boolean;
  gradientBorder?: boolean;
  highlighted?: boolean;
  cardType?: CardType;
  animateIn?: boolean;
}

// Define animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(65, 105, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(65, 105, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(65, 105, 225, 0);
  }
`;

// Create a styled version of MuiCard
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['hoverEffect', 'gradientBorder', 'highlighted', 'cardType', 'animateIn'].includes(prop as string),
})<CardProps>(({ theme, hoverEffect = true, gradientBorder = false, highlighted = false, cardType = 'default', animateIn = false }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  // Animation on mount if animateIn is true
  ...(animateIn && {
    animation: `${fadeInUp} 0.5s ease-out forwards`,
  }),
  
  // Apply hover effect only if hoverEffect is true
  ...(hoverEffect && {
    '&:hover': {
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-4px)',
    },
  }),
  
  // Apply gradient border if gradientBorder is true
  ...(gradientBorder && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: '2px',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
    },
  }),
  
  // Apply highlight effect if highlighted is true
  ...(highlighted && {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}, 0px 4px 20px rgba(0, 0, 0, 0.15)`,
    animation: `${pulse} 2s infinite`,
  }),
  
  // Apply card type specific styling
  ...(cardType === 'lesson' && {
    background: theme.palette.background.paper,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  }),
  
  ...(cardType === 'achievement' && {
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(65, 105, 225, 0.05) 100%)`,
  }),
  
  ...(cardType === 'track' && {
    background: theme.palette.background.paper,
    borderTop: `4px solid ${theme.palette.secondary.main}`,
  }),
}));

// Gradient overlay for cards
const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  zIndex: 1,
}));

const Card: React.FC<CardProps> = ({ 
  children, 
  hoverEffect = true, 
  gradientBorder = false,
  highlighted = false,
  cardType = 'default',
  animateIn = false,
  ...props 
}) => {
  return (
    <StyledCard 
      hoverEffect={hoverEffect} 
      gradientBorder={gradientBorder}
      highlighted={highlighted}
      cardType={cardType}
      animateIn={animateIn}
      {...props}
    >
      {cardType === 'default' && !gradientBorder && <GradientOverlay />}
      {children}
    </StyledCard>
  );
};

export default Card; 
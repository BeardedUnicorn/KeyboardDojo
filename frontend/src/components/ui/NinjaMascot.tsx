import React from 'react';
import { Box, Typography, styled, useTheme } from '@mui/material';
import {
  bounce,
  celebrate,
  fadeIn,
  getInteractionAnimation,
  MascotInteraction,
  animationDurations,
  animationEasings
} from './NinjaMascotAnimations';

// Define emotion types
export type MascotEmotion = 'happy' | 'sad' | 'encouraging' | 'celebrating' | 'neutral';

// Define size types
export type MascotSize = 'small' | 'medium' | 'large';

// Define props interface
interface NinjaMascotProps {
  emotion?: MascotEmotion;
  size?: MascotSize;
  animate?: boolean;
  interaction?: MascotInteraction;
  speech?: string;
  speechDuration?: number;
  onClick?: () => void;
  className?: string;
}

// Speech bubble component
const SpeechBubble = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-60px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '20px',
  padding: theme.spacing(1.5),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '200px',
  zIndex: 10,
  animation: `${fadeIn} 0.3s ease-out forwards`,
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '10px 10px 0',
    borderStyle: 'solid',
    borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
  },
}));

// Mascot container
const MascotContainer = styled(Box, {
  shouldForwardProp: (prop) => !['mascotSize', 'isAnimating', 'mascotEmotion', 'interactionType'].includes(prop as string),
})<{ 
  mascotSize: MascotSize; 
  isAnimating: boolean; 
  mascotEmotion: MascotEmotion;
  interactionType?: MascotInteraction;
}>(
  ({ mascotSize, isAnimating, mascotEmotion, interactionType }) => {
    // Determine which animation to use
    let animationToUse = bounce;
    let animationDuration = animationDurations.medium;
    let animationEasing = animationEasings.smooth;
    let animationIterationCount = 'infinite';
    
    if (isAnimating) {
      if (interactionType) {
        // Use interaction-specific animation
        animationToUse = getInteractionAnimation(interactionType);
        
        // Set appropriate duration and easing based on interaction
        if (interactionType === 'levelUp' || interactionType === 'success') {
          animationDuration = animationDurations.medium;
          animationEasing = animationEasings.bounce;
        } else if (interactionType === 'error') {
          animationDuration = animationDurations.short;
          animationEasing = animationEasings.sharp;
        } else if (interactionType === 'waiting') {
          animationDuration = animationDurations.long;
          animationEasing = animationEasings.smooth;
        }
        
        // Set iteration count
        if (interactionType === 'click' || interactionType === 'levelUp') {
          animationIterationCount = '1';
        }
      } else if (mascotEmotion === 'celebrating') {
        animationToUse = celebrate;
        animationDuration = animationDurations.medium;
        animationEasing = animationEasings.bounce;
      }
    }
    
    return {
      position: 'relative',
      cursor: 'pointer',
      width: mascotSize === 'small' ? '80px' : mascotSize === 'medium' ? '120px' : '160px',
      height: mascotSize === 'small' ? '80px' : mascotSize === 'medium' ? '120px' : '160px',
      transition: 'all 0.3s ease',
      ...(isAnimating && {
        animation: `${animationToUse} ${animationDuration} ${animationEasing} ${animationIterationCount}`,
      }),
      '&:hover': {
        transform: 'scale(1.05)',
      },
    };
  }
);

// Ninja Mascot component
const NinjaMascot: React.FC<NinjaMascotProps> = ({
  emotion = 'neutral',
  size = 'medium',
  animate = false,
  interaction,
  speech,
  speechDuration = 3000,
  onClick,
  className,
}) => {
  const theme = useTheme();
  const [showSpeech, setShowSpeech] = React.useState(!!speech);

  // Hide speech bubble after duration
  React.useEffect(() => {
    if (speech) {
      setShowSpeech(true);
      const timer = setTimeout(() => {
        setShowSpeech(false);
      }, speechDuration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [speech, speechDuration]);

  // Get colors based on theme
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const backgroundColor = theme.palette.background.paper;

  // Render different SVG based on emotion
  const renderMascot = () => {
    // Common ninja body parts
    const body = (
      <g>
        {/* Ninja body */}
        <ellipse cx="50" cy="55" rx="30" ry="35" fill={primaryColor} />
        {/* Ninja head */}
        <circle cx="50" cy="30" r="20" fill={primaryColor} />
        {/* Ninja mask */}
        <rect x="40" y="25" width="20" height="5" fill={backgroundColor} />
        {/* Ninja belt */}
        <rect x="20" y="55" width="60" height="5" fill={secondaryColor} />
      </g>
    );

    // Render eyes based on emotion
    let eyes;
    let mouth;

    switch (emotion) {
      case 'happy':
        eyes = (
          <g>
            <circle cx="43" cy="28" r="3" fill={backgroundColor} />
            <circle cx="57" cy="28" r="3" fill={backgroundColor} />
          </g>
        );
        mouth = <path d="M45,35 Q50,40 55,35" stroke={backgroundColor} strokeWidth="2" fill="none" />;
        break;
      case 'sad':
        eyes = (
          <g>
            <circle cx="43" cy="28" r="3" fill={backgroundColor} />
            <circle cx="57" cy="28" r="3" fill={backgroundColor} />
          </g>
        );
        mouth = <path d="M45,38 Q50,33 55,38" stroke={backgroundColor} strokeWidth="2" fill="none" />;
        break;
      case 'encouraging':
        eyes = (
          <g>
            <circle cx="43" cy="28" r="3" fill={backgroundColor} />
            <circle cx="57" cy="28" r="3" fill={backgroundColor} />
            {/* Determined eyebrows */}
            <path d="M40,25 L46,26" stroke={backgroundColor} strokeWidth="2" />
            <path d="M54,26 L60,25" stroke={backgroundColor} strokeWidth="2" />
          </g>
        );
        mouth = <path d="M45,35 Q50,38 55,35" stroke={backgroundColor} strokeWidth="2" fill="none" />;
        break;
      case 'celebrating':
        eyes = (
          <g>
            {/* Star eyes */}
            <path d="M43,28 L44,25 L45,28 L42,26 L46,26 Z" fill={backgroundColor} />
            <path d="M57,28 L58,25 L59,28 L56,26 L60,26 Z" fill={backgroundColor} />
          </g>
        );
        mouth = <path d="M45,35 Q50,42 55,35" stroke={backgroundColor} strokeWidth="2" fill="none" />;
        break;
      default: // neutral
        eyes = (
          <g>
            <circle cx="43" cy="28" r="3" fill={backgroundColor} />
            <circle cx="57" cy="28" r="3" fill={backgroundColor} />
          </g>
        );
        mouth = <line x1="45" y1="35" x2="55" y2="35" stroke={backgroundColor} strokeWidth="2" />;
    }

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {body}
        {eyes}
        {mouth}
        {/* Ninja hands */}
        <circle cx="15" cy="60" r="8" fill={primaryColor} />
        <circle cx="85" cy="60" r="8" fill={primaryColor} />
      </svg>
    );
  };

  return (
    <Box position="relative" display="inline-block" className={className}>
      {showSpeech && speech && (
        <SpeechBubble>
          <Typography variant="body2">{speech}</Typography>
        </SpeechBubble>
      )}
      <MascotContainer
        mascotSize={size}
        isAnimating={animate}
        mascotEmotion={emotion}
        interactionType={interaction}
        onClick={onClick}
      >
        {renderMascot()}
      </MascotContainer>
    </Box>
  );
};

export default NinjaMascot; 
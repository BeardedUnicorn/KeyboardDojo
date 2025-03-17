import { keyframes } from '@mui/material';

// Basic animations
export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const celebrate = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Interaction animations
export const jump = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const wave = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

// Emotion-specific animations
export const happyBounce = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
`;

export const sadDroop = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(5px) rotate(-3deg);
  }
`;

export const encouragingPump = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1) translateY(-5px);
  }
`;

// Interaction types
export type MascotInteraction = 
  | 'idle'
  | 'click'
  | 'success'
  | 'error'
  | 'levelUp'
  | 'greeting'
  | 'thinking'
  | 'waiting';

// Get animation based on interaction type
export const getInteractionAnimation = (interaction: MascotInteraction): ReturnType<typeof keyframes> => {
  switch (interaction) {
    case 'click':
      return pulse;
    case 'success':
      return happyBounce;
    case 'error':
      return shake;
    case 'levelUp':
      return jump;
    case 'greeting':
      return wave;
    case 'thinking':
      return pulse;
    case 'waiting':
      return bounce;
    default:
      return bounce;
  }
};

// Animation durations
export const animationDurations = {
  short: '0.5s',
  medium: '1s',
  long: '2s',
  infinite: 'infinite',
};

// Animation easings
export const animationEasings = {
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
}; 
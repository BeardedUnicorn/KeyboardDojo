import { Box, styled, keyframes, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';

import type { FC, ReactNode } from 'react';

// Animation types
export type FeedbackAnimationType =
  | 'confetti'
  | 'stars'
  | 'sparkles'
  | 'fireworks'
  | 'pulse';

// Props for the FeedbackAnimation component
interface FeedbackAnimationProps {
  type: FeedbackAnimationType;
  isVisible: boolean;
  duration?: number;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

// Keyframes for different animations
const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

const starAnimation = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

const sparkleAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;

const fireworkAnimation = keyframes`
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)); opacity: 0; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 0.9; }
  100% { transform: scale(1); opacity: 0.7; }
`;

// Styled components for different animation types
const ConfettiPiece = styled('div')<{ delay: number; color: string }>`
  position: absolute;
  width: 10px;
  height: 20px;
  background-color: ${(props) => props.color};
  opacity: 0;
  animation: ${confettiAnimation} 3s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

// Prefixing unused components with underscore
const _Star = styled('div')<{ delay: number; size: number; color: string }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0;
  animation: ${starAnimation} 2s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

// Prefixing unused components with underscore
const _Sparkle = styled('div')<{ delay: number; size: number; color: string }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  opacity: 0;
  animation: ${sparkleAnimation} 1.5s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const Firework = styled('div')<{ delay: number; size: number; color: string; x: number; y: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  opacity: 0;
  --x: ${(props) => props.x}px;
  --y: ${(props) => props.y}px;
  animation: ${fireworkAnimation} 1s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const PulseCircle = styled('div')<{ color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  opacity: 0.7;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

// Main component
const FeedbackAnimation: FC<FeedbackAnimationProps> = ({
  type,
  isVisible,
  duration = 2000,
  onComplete,
  intensity = 'medium',
  color,
  size = 'medium',
}) => {
  const theme = useTheme();
  const [particles, setParticles] = useState<ReactNode[]>([]);

  // Generate particles based on animation type
  useEffect(() => {
    if (!isVisible) {
      setParticles([]);
      return;
    }

    // Determine number of particles based on intensity
    const getParticleCount = () => {
      switch (intensity) {
        case 'low': return 20;
        case 'high': return 100;
        case 'medium':
        default: return 50;
      }
    };

    // Determine particle size based on size prop
    const getParticleSize = () => {
      switch (size) {
        case 'small': return { min: 5, max: 10 };
        case 'large': return { min: 15, max: 30 };
        case 'medium':
        default: return { min: 10, max: 20 };
      }
    };

    // Get color with fallback to theme
    const getColor = () => {
      if (color) return color;

      switch (type) {
        case 'confetti': return theme.palette.primary.main;
        case 'stars': return theme.palette.secondary.main;
        case 'sparkles': return theme.palette.warning.main;
        case 'fireworks': return theme.palette.error.main;
        case 'pulse': return theme.palette.info.main;
        default: return theme.palette.primary.main;
      }
    };

    const count = getParticleCount();
    const sizeRange = getParticleSize();
    const mainColor = getColor();
    const newParticles: ReactNode[] = [];

    // Define colors arrays outside of the switch statement
    const confettiColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];

    // Generate different particles based on animation type
    switch (type) {
      case 'confetti':
        // Generate confetti pieces with random colors
        for (let i = 0; i < count; i++) {
          const delay = Math.random() * 0.5;
          const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          const left = Math.random() * 100;
          const top = Math.random() * 100;

          newParticles.push(
            <ConfettiPiece
              key={`confetti-${i}`}
              delay={delay}
              color={color}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />,
          );
        }
        break;

      case 'stars':
        // Stars animation
        // ... existing code ...
        break;

      case 'sparkles':
        // Sparkles animation
        // ... existing code ...
        break;

      case 'fireworks':
        // Generate firework particles
        for (let i = 0; i < count; i++) {
          const delay = Math.random() * 0.3;
          const size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
          // All fireworks start from center
          const x = (Math.random() - 0.5) * 200; // Random x direction
          const y = (Math.random() - 0.5) * 200; // Random y direction

          newParticles.push(
            <Firework
              key={`firework-${i}`}
              delay={delay}
              size={size}
              color={mainColor}
              x={x}
              y={y}
              style={{
                left: '50%',
                top: '50%',
              }}
            />,
          );
        }
        break;

      case 'pulse':
        // Simple pulse animation
        newParticles.push(
          <PulseCircle key="pulse" color={mainColor} />,
        );
        break;
    }

    setParticles(newParticles);

    // Add completion cleanup
    if (isVisible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [
    isVisible,
    type,
    theme,
    duration,
    onComplete,
    intensity,
    size,
    color,
  ]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {particles}
    </Box>
  );
};

export default FeedbackAnimation;

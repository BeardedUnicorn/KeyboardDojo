import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import ReactConfetti from 'react-confetti';

import type { FC, CSSProperties } from 'react';

interface ConfettiEffectProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

// Default confetti colors
const DEFAULT_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
];

/**
 * Component that displays a confetti animation
 */
const ConfettiEffect: FC<ConfettiEffectProps> = memo(({
  duration = 2000,
  particleCount = 200,
  spread = 70,
  colors = DEFAULT_COLORS,
}) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isActive, setIsActive] = useState(true);

  // Memoize the resize handler to prevent recreation on each render
  const handleResize = useCallback(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Memoize confetti style for consistent reference
  const confettiStyle = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  }), []);

  // Memoize confetti props for better performance
  const confettiProps = useMemo(() => ({
    width: windowDimensions.width,
    height: windowDimensions.height,
    numberOfPieces: particleCount,
    recycle: false,
    colors: colors,
    gravity: 0.3,
    initialVelocityY: 20,
    spread: spread,
  }), [
    windowDimensions.width,
    windowDimensions.height,
    particleCount,
    colors,
    spread,
  ]);

  useEffect(() => {
    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Set a timeout to remove the confetti after the specified duration
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, duration);

    // Clean up event listeners and timers
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [duration, handleResize]);

  // Early return if not active to avoid rendering
  if (!isActive) return null;

  return (
    <ReactConfetti
      {...confettiProps}
      style={confettiStyle as CSSProperties}
    />
  );
});

// Add display name for debugging
ConfettiEffect.displayName = 'ConfettiEffect';

export default ConfettiEffect;

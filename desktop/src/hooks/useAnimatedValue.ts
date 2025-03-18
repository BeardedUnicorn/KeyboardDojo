/**
 * useAnimatedValue Hook
 * 
 * A custom hook for animating value changes with optional callbacks.
 * Useful for currency, XP, and other numeric displays that need animations.
 */

import { useState, useEffect, useRef } from 'react';

interface AnimatedValueOptions {
  /**
   * Duration of the animation in milliseconds
   */
  duration?: number;
  
  /**
   * Delay before starting the animation in milliseconds
   */
  delay?: number;
  
  /**
   * Callback when animation starts
   */
  onStart?: () => void;
  
  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
  
  /**
   * Whether to highlight the change (e.g., with a different color)
   */
  highlight?: boolean;
  
  /**
   * Duration of the highlight effect in milliseconds
   */
  highlightDuration?: number;
}

/**
 * Hook for animating value changes
 * @param initialValue Initial value
 * @param options Animation options
 * @returns Object with current value, display value, animating state, and highlight state
 */
export const useAnimatedValue = (
  initialValue: number,
  options: AnimatedValueOptions = {},
) => {
  const {
    duration = 1000,
    delay = 0,
    onStart,
    onComplete,
    highlight = true,
    highlightDuration = 2000,
  } = options;
  
  const [value, setValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [animating, setAnimating] = useState(false);
  const [highlighting, setHighlighting] = useState(false);
  const [recentChange, setRecentChange] = useState<number | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousValueRef = useRef(initialValue);
  
  // Update value when initialValue changes
  useEffect(() => {
    updateValue(initialValue);
  }, [initialValue]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  /**
   * Update the value with animation
   * @param newValue New value to animate to
   */
  const updateValue = (newValue: number) => {
    if (newValue === previousValueRef.current) {
      return;
    }
    
    const change = newValue - previousValueRef.current;
    setRecentChange(change);
    
    // Start animation after delay
    setTimeout(() => {
      previousValueRef.current = newValue;
      setValue(newValue);
      setAnimating(true);
      setHighlighting(highlight);
      
      if (onStart) {
        onStart();
      }
      
      startTimeRef.current = null;
      
      // Start animation frame loop
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Calculate current display value using easeOutQuad
        const easeOutQuad = (t: number) => t * (2 - t);
        const currentValue = previousValueRef.current - change + change * easeOutQuad(progress);
        
        setDisplayValue(Math.round(currentValue * 100) / 100);
        
        if (progress < 1) {
          // Continue animation
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          setAnimating(false);
          
          if (onComplete) {
            onComplete();
          }
          
          // Keep highlight for specified duration
          if (highlight) {
            setTimeout(() => {
              setHighlighting(false);
            }, highlightDuration);
          }
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }, delay);
  };
  
  return {
    value,
    displayValue,
    animating,
    highlighting,
    recentChange,
    updateValue,
  };
};

export default useAnimatedValue; 

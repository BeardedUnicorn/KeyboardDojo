# Animation System Documentation

## Overview

The animation system provides a comprehensive approach to implementing animations across the application. It centralizes animation logic, maintains consistency, and provides easy-to-use hooks for components.

## Core Components

The animation system consists of:

1. **Constants and Types** - Standard durations, easings, and animation types
2. **Utility Functions** - Functions for generating animation configurations and styles
3. **Hooks** - React hooks for implementing animations in components
4. **Integration Utilities** - Tools for integrating animations with other systems

## Animation Types

The system supports several animation types:

- `fade` - Opacity-based animations
- `slide` - Translation-based animations (with direction support)
- `scale` - Size-based animations
- `rotate` - Rotation-based animations
- `bounce` - Spring-like animations
- `confetti` - Celebration particle effects
- `stars` - Special particle effects

## Intensity Levels

Animations can be configured with different intensity levels:

- `low` - Subtle animations
- `medium` - Default animation intensity
- `high` - Pronounced animations

## Usage Examples

### Basic Feedback Animation

```tsx
import { useFeedbackAnimation } from '@utils/animationSystem';

function MyComponent() {
  const [feedbackState, feedbackActions] = useFeedbackAnimation({
    duration: 500,
    playSounds: true,
    autoHide: true
  });

  const handleSuccess = () => {
    feedbackActions.showSuccess('bounce');
  };

  const handleFailure = () => {
    feedbackActions.showFailure('fade');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleFailure}>Show Failure</button>
      
      {feedbackState.isVisible && (
        <div style={{ 
          opacity: feedbackState.isVisible ? 1 : 0,
          transition: `opacity ${feedbackState.config.duration}ms ${feedbackState.config.easing}`
        }}>
          {feedbackState.isSuccess ? 'Success!' : 'Failed!'}
        </div>
      )}
    </div>
  );
}
```

### Using the Animation Hook

```tsx
import { useAnimation } from '@hooks/useAnimation';

function MyComponent() {
  const animation = useAnimation({
    type: 'scale',
    intensity: 'medium',
    duration: 500,
    autoplay: true
  });

  return (
    <div style={animation.style}>
      <h2>Animated Content</h2>
      <button onClick={animation.play}>Play</button>
      <button onClick={animation.pause}>Pause</button>
      <button onClick={animation.reset}>Reset</button>
    </div>
  );
}
```

### Animated Value Display

```tsx
import { useAnimatedValue } from '@hooks/useAnimatedValue';

function XPCounter({ value }) {
  const displayValue = useAnimatedValue(value, {
    duration: 1000,
    easing: 'easeOut'
  });

  return <div>XP: {Math.round(displayValue)}</div>;
}
```

## Custom Animation Configurations

You can create custom animation configurations:

```tsx
import { getAnimationConfig, getAnimationStyles, AnimationType, AnimationIntensity } from '@utils/animationSystem';

function getCustomAnimation(type: AnimationType, intensity: AnimationIntensity) {
  const config = getAnimationConfig(type, intensity);
  
  // Customize the configuration
  config.duration *= 1.5;
  config.delay = 200;
  
  // Generate styles from the configuration
  const styles = getAnimationStyles(config);
  
  return styles;
}
```

## Performance Considerations

- Animations are automatically cleaned up when components unmount
- Use the `intensity` property to scale down animations on low-end devices
- Apply `will-change` properties only when animations are active
- Consider using GPU-accelerated properties (`transform`, `opacity`) for better performance

## Integration with Sound System

The animation system integrates with the audio service to provide sound effects:

```tsx
import { playAnimationSound } from '@utils/animationSystem';

// Play a sound effect
playAnimationSound('success');
```

## Animation Utilities

The system provides several utility functions:

- `getAnimationDuration` - Get duration based on intensity
- `getAnimationConfig` - Get complete configuration for an animation type
- `getAnimationTransform` - Get CSS transform value for an animation
- `getAnimationKeyframes` - Get CSS keyframes for an animation
- `getAnimationStyles` - Get complete CSS styles for an animation
- `getRandomAnimationDelay` - Generate a random delay value
- `getRandomPosition` - Generate a random position for particle effects
- `getRandomColor` - Get a random color from a palette 
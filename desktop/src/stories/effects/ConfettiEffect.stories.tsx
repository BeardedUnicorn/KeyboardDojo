import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, Box, Stack, Typography, useTheme } from '@mui/material';
import { ConfettiEffect } from '../../components/effects';

// Define the props for our custom ConfettiDemo component
interface ConfettiDemoProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
  // This is a custom prop for our demo component, not for the actual ConfettiEffect
  colorScheme?: 'default' | 'primary' | 'achievement' | 'celebration';
}

// Create a wrapper component to demonstrate the confetti effect with a trigger button
const ConfettiDemo: React.FC<ConfettiDemoProps> = ({ 
  duration = 2000, 
  particleCount = 200, 
  spread = 70, 
  colors = undefined,
  colorScheme = 'default'
}) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const theme = useTheme();
  
  // Define different color schemes
  const colorSchemes = {
    default: undefined, // Use the component's default colors
    primary: [
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.dark,
      theme.palette.secondary.light,
      theme.palette.secondary.main
    ],
    achievement: [
      '#FFD700', // Gold
      '#FFC107', // Amber
      '#FFEB3B', // Yellow
      '#FF9800', // Orange
      '#F57C00'  // Dark Orange
    ],
    celebration: [
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#2196F3'  // Blue
    ]
  };
  
  // Use the color scheme if provided, otherwise use custom colors or default
  const confettiColors = colorScheme !== 'default' ? 
    colorSchemes[colorScheme] : 
    colors;
  
  const triggerConfetti = () => {
    setShowConfetti(false);
    // Small delay to ensure the component fully unmounts before remounting
    setTimeout(() => setShowConfetti(true), 50);
  };
  
  return (
    <Box sx={{ height: 400, width: '100%', position: 'relative', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      {showConfetti && (
        <ConfettiEffect 
          duration={duration}
          particleCount={particleCount}
          spread={spread}
          colors={confettiColors}
        />
      )}
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={triggerConfetti}
        >
          Trigger Confetti!
        </Button>
        
        <Stack spacing={1} mt={3}>
          <Typography variant="body2">Duration: {duration}ms</Typography>
          <Typography variant="body2">Particles: {particleCount}</Typography>
          <Typography variant="body2">Spread: {spread}</Typography>
          <Typography variant="body2">Color Scheme: {colorScheme}</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

// Define proper types for our Story parameters
type ConfettiEffectProps = {
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
};

const meta = {
  title: 'Effects/ConfettiEffect',
  component: ConfettiEffect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that displays a confetti animation effect. Often used to celebrate user achievements or significant milestones in the application.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'range', min: 500, max: 5000, step: 500 },
      description: 'Duration of the confetti animation in milliseconds'
    },
    particleCount: {
      control: { type: 'range', min: 50, max: 500, step: 50 },
      description: 'Number of confetti particles'
    },
    spread: {
      control: { type: 'range', min: 30, max: 180, step: 10 },
      description: 'Spread of the confetti particles (higher values create a wider spread)'
    }
  }
} as Meta<typeof ConfettiEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define a custom type for our story args that includes our demo-specific props
interface ConfettiStoryArgs extends ConfettiEffectProps {
  colorScheme?: 'default' | 'primary' | 'achievement' | 'celebration';
}

// Basic confetti effect story
export const Default: StoryObj<ConfettiStoryArgs> = {
  args: {
    duration: 2000,
    particleCount: 200,
    spread: 70,
    colorScheme: 'default'
  },
  render: (args) => <ConfettiDemo {...args} />
};

// Achievement confetti with gold colors
export const Achievement: StoryObj<ConfettiStoryArgs> = {
  args: {
    duration: 3000,
    particleCount: 300,
    spread: 100,
    colorScheme: 'achievement'
  },
  parameters: {
    docs: {
      description: {
        story: 'A gold-themed confetti effect perfect for celebrating user achievements and milestone completions.'
      }
    }
  },
  render: (args) => <ConfettiDemo {...args} />
};

// Celebration confetti with vibrant colors
export const Celebration: StoryObj<ConfettiStoryArgs> = {
  args: {
    duration: 4000,
    particleCount: 400,
    spread: 120,
    colorScheme: 'celebration'
  },
  parameters: {
    docs: {
      description: {
        story: 'A vibrant, high-density confetti effect for major celebrations and important accomplishments.'
      }
    }
  },
  render: (args) => <ConfettiDemo {...args} />
};

// Subtle confetti with fewer particles
export const Subtle: StoryObj<ConfettiStoryArgs> = {
  args: {
    duration: 1500,
    particleCount: 100,
    spread: 50,
    colorScheme: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'A more subtle confetti effect using the application\'s primary colors, suitable for minor achievements or status changes.'
      }
    }
  },
  render: (args) => <ConfettiDemo {...args} />
};

// Usage documentation
export const UsageDocumentation: Story = {
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the ConfettiEffect Component

The ConfettiEffect component provides a customizable celebration animation that can be triggered for various user achievements, level ups, or milestone completions.

#### Basic Usage

\`\`\`jsx
import { ConfettiEffect } from '../components/effects';

function AchievementScreen() {
  const [showConfetti, setShowConfetti] = React.useState(true);
  
  return (
    <div>
      {showConfetti && <ConfettiEffect />}
      <h1>Congratulations!</h1>
      <p>You've completed the challenge!</p>
    </div>
  );
}
\`\`\`

#### With Custom Configuration

\`\`\`jsx
<ConfettiEffect 
  duration={3000}        // 3 seconds
  particleCount={300}    // 300 particles
  spread={120}           // Wide spread
  colors={[              // Custom colors
    '#FFD700',          // Gold
    '#FFC107',          // Amber
    '#FFEB3B',          // Yellow
    '#FF9800'           // Orange
  ]}
/>
\`\`\`

#### Best Practices

1. **Mount/Unmount for Reuse**: To trigger the confetti effect again, unmount and remount the component
2. **Duration**: Keep the duration reasonable (1-5 seconds) to avoid overwhelming the user
3. **Performance**: For lower-end devices, consider using fewer particles
4. **Color Themes**: Match the colors to the achievement context (gold for major achievements, brand colors for regular activities)
5. **Accessibility**: The confetti effect is purely decorative and doesn't affect functionality

#### Integration Examples

- Level up notifications
- Achievement unlocks
- Course/lesson completions
- Daily streak milestones
- Competition wins
`
      }
    }
  },
  render: () => null
}; 
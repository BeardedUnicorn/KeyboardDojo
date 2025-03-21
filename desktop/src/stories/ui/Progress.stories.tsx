import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress as MuiCircularProgress,
  LinearProgress,
  Stack,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  CircularProgressProps,
  LinearProgressProps,
} from '@mui/material';
import { PlayArrow, Pause, CheckCircle } from '@mui/icons-material';
import type { Meta, StoryObj } from '@storybook/react';

// Create a custom progress component that can be either circular or linear
interface CustomProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  showLabel?: boolean;
  size?: number;
  thickness?: number;
  labelPosition?: 'inside' | 'below';
  labelVariant?: 'body1' | 'body2' | 'h6';
  progressType?: 'circular' | 'linear';
}

const CustomProgress: React.FC<CustomProgressProps> = ({
  value = 0,
  variant = 'determinate',
  color = 'primary',
  showLabel = false,
  size = 40,
  thickness = 3.6,
  labelPosition = 'inside',
  labelVariant = 'body2',
  progressType = 'circular',
}) => {
  const circularProps: CircularProgressProps = {
    variant,
    value: variant === 'determinate' ? value : undefined,
    color,
    size,
    thickness,
  };

  const linearProps: LinearProgressProps = {
    variant,
    value: variant === 'determinate' ? value : undefined,
    color,
  };

  const renderLabel = () => (
    <Typography variant={labelVariant} color="textSecondary">
      {Math.round(value)}%
    </Typography>
  );

  if (progressType === 'circular') {
    if (labelPosition === 'inside' && showLabel) {
      return (
        <Box position="relative" display="inline-flex">
          <MuiCircularProgress {...circularProps} />
          {variant === 'determinate' && (
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {renderLabel()}
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Stack alignItems="center" spacing={1}>
        <MuiCircularProgress {...circularProps} />
        {showLabel && variant === 'determinate' && renderLabel()}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <LinearProgress {...linearProps} />
      {showLabel && variant === 'determinate' && renderLabel()}
    </Stack>
  );
};

const meta: Meta<typeof CustomProgress> = {
  title: 'UI/Progress',
  component: CustomProgress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Customizable progress indicator component that can be displayed as either a circular or linear progress bar with various options.',
      },
    },
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'The value of the progress indicator (0-100)',
      defaultValue: 0,
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: 'The variant to use - determinate shows progress, indeterminate shows animation',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'The color of the progress indicator',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show a percentage label',
    },
    size: {
      control: { type: 'number', min: 20, max: 200, step: 5 },
      description: 'The size of the circular progress (in pixels)',
    },
    thickness: {
      control: { type: 'number', min: 1, max: 10, step: 0.1 },
      description: 'The thickness of the circular progress',
    },
    labelPosition: {
      control: 'select',
      options: ['inside', 'below'],
      description: 'Where to position the label (for circular progress)',
    },
    labelVariant: {
      control: 'select',
      options: ['body1', 'body2', 'h6'],
      description: 'The typography variant to use for the label',
    },
    progressType: {
      control: 'select',
      options: ['circular', 'linear'],
      description: 'The type of progress indicator to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomProgress>;

// Basic variants
export const Basic: Story = {
  render: () => (
    <Stack spacing={4} alignItems="center">
      <Box>
        <Typography variant="h6" gutterBottom>Circular Progress</Typography>
        <Stack direction="row" spacing={2}>
          <MuiCircularProgress />
          <MuiCircularProgress color="secondary" />
          <MuiCircularProgress color="success" />
          <MuiCircularProgress color="error" />
        </Stack>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom>Linear Progress</Typography>
        <Stack spacing={2}>
          <LinearProgress />
          <LinearProgress color="secondary" />
          <LinearProgress color="success" />
          <LinearProgress color="error" />
        </Stack>
      </Box>
    </Stack>
  ),
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

// Determinate variants with different values
export const Determinate: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Circular Determinate</Typography>
        <Stack direction="row" spacing={2}>
          <MuiCircularProgress variant="determinate" value={25} />
          <MuiCircularProgress variant="determinate" value={50} color="secondary" />
          <MuiCircularProgress variant="determinate" value={75} color="success" />
          <MuiCircularProgress variant="determinate" value={100} color="error" />
        </Stack>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom>Linear Determinate</Typography>
        <Stack spacing={2}>
          <LinearProgress variant="determinate" value={25} />
          <LinearProgress variant="determinate" value={50} color="secondary" />
          <LinearProgress variant="determinate" value={75} color="success" />
          <LinearProgress variant="determinate" value={100} color="error" />
        </Stack>
      </Box>
    </Stack>
  )
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h6" gutterBottom>Different Sizes</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <MuiCircularProgress size={24} />
        <MuiCircularProgress size={40} />
        <MuiCircularProgress size={60} />
        <MuiCircularProgress size={80} />
      </Stack>
      
      <Typography variant="h6" gutterBottom>Different Thicknesses</Typography>
      <Stack direction="row" spacing={2}>
        <MuiCircularProgress thickness={1.5} />
        <MuiCircularProgress thickness={3} />
        <MuiCircularProgress thickness={5} />
        <MuiCircularProgress thickness={7} />
      </Stack>
    </Stack>
  )
};

// Progress with label
export const WithLabel: Story = {
  render: () => {
    const CircularProgressWithLabel = ({ value, size = 40 }) => (
      <Box position="relative" display="inline-flex">
        <MuiCircularProgress variant="determinate" value={value} size={size} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            sx={{ fontSize: size > 60 ? 'default' : '10px' }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    );

    const LinearProgressWithLabel = ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={value} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    );

    return (
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>Circular Progress with Label</Typography>
          <Stack direction="row" spacing={2}>
            <CircularProgressWithLabel value={25} />
            <CircularProgressWithLabel value={50} size={60} />
            <CircularProgressWithLabel value={75} size={80} />
            <CircularProgressWithLabel value={100} size={100} />
          </Stack>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>Linear Progress with Label</Typography>
          <Stack spacing={2}>
            <LinearProgressWithLabel value={25} />
            <LinearProgressWithLabel value={50} />
            <LinearProgressWithLabel value={75} />
            <LinearProgressWithLabel value={100} />
          </Stack>
        </Box>
      </Stack>
    );
  }
};

// Interactive progress
export const Interactive: Story = {
  render: () => {
    const InteractiveProgress = () => {
      const [progress, setProgress] = useState(0);
      const [isRunning, setIsRunning] = useState(false);
      
      useEffect(() => {
        let timer;
        if (isRunning) {
          timer = setInterval(() => {
            setProgress((prevProgress) => {
              const newProgress = prevProgress + 1;
              if (newProgress >= 100) {
                setIsRunning(false);
                return 100;
              }
              return newProgress;
            });
          }, 100);
        }
        
        return () => {
          if (timer) {
            clearInterval(timer);
          }
        };
      }, [isRunning]);
      
      const handleStart = () => {
        if (progress === 100) {
          setProgress(0);
        }
        setIsRunning(true);
      };
      
      const handlePause = () => {
        setIsRunning(false);
      };
      
      const handleReset = () => {
        setIsRunning(false);
        setProgress(0);
      };
      
      return (
        <Paper sx={{ p: 3, maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Interactive Progress Demo
          </Typography>
          
          <Box sx={{ my: 2 }}>
            <CircularProgressWithLabel progress={progress} />
          </Box>
          
          <LinearProgressWithLabel progress={progress} />
          
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleStart}
              disabled={isRunning || progress === 100}
            >
              {progress === 0 ? 'Start' : 'Continue'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Pause />}
              onClick={handlePause}
              disabled={!isRunning}
            >
              Pause
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={progress === 0}
            >
              Reset
            </Button>
          </Stack>
        </Paper>
      );
    };
    
    const CircularProgressWithLabel = ({ progress }) => (
      <Box position="relative" display="inline-flex">
        <MuiCircularProgress
          variant="determinate"
          value={progress}
          size={100}
          thickness={4}
          sx={{ mb: 2 }}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" component="div" color="textPrimary">
            {progress === 100 ? (
              <CheckCircle color="success" />
            ) : (
              `${Math.round(progress)}%`
            )}
          </Typography>
        </Box>
      </Box>
    );
    
    const LinearProgressWithLabel = ({ progress }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress === 100 ? 'success' : 'primary'}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    );
    
    return <InteractiveProgress />;
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

// Custom progress
export const Custom: Story = {
  args: {
    value: 65,
    variant: 'determinate',
    color: 'primary',
    showLabel: true,
    size: 60,
    thickness: 4,
    labelPosition: 'inside',
    progressType: 'circular',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

// Indeterminate progress cards example
export const LoadingCardsExample: Story = {
  render: () => {
    const handleClick = () => {
      alert('Card action triggered');
    };
    
    return (
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Progress in Context Example
        </Typography>
        
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>
                  <MuiCircularProgress size={40} />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6">Loading Content</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please wait while we retrieve your data...
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Download Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ height: 8, borderRadius: 5, my: 2 }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  75% Complete
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  15 MB / 20 MB
                </Typography>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small" onClick={handleClick}>
                  Cancel
                </Button>
                <Button size="small" color="primary" onClick={handleClick}>
                  Pause
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MuiCircularProgress
                  variant="determinate"
                  value={100}
                  color="success"
                  size={24}
                  sx={{ mr: 1 }}
                />
                <Typography>Successfully processed all items</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={100}
                color="success"
                sx={{ height: 8, borderRadius: 5, my: 2 }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small" color="primary" onClick={handleClick}>
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

// Simple examples for direct use with our custom component
export const CircularDeterminate: Story = {
  args: {
    variant: 'determinate',
    value: 75,
    showLabel: true,
    progressType: 'circular',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const LinearDeterminate: Story = {
  args: {
    variant: 'determinate',
    value: 65,
    showLabel: true,
    progressType: 'linear',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const CircularIndeterminate: Story = {
  args: {
    variant: 'indeterminate',
    progressType: 'circular',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const LinearIndeterminate: Story = {
  args: {
    variant: 'indeterminate',
    progressType: 'linear',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const CustomColorSuccess: Story = {
  args: {
    variant: 'determinate',
    value: 100,
    showLabel: true,
    color: 'success',
    progressType: 'linear',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const CustomColorError: Story = {
  args: {
    variant: 'determinate',
    value: 20,
    showLabel: true,
    color: 'error',
    progressType: 'linear',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

export const CircularWithCustomSize: Story = {
  args: {
    variant: 'determinate',
    value: 65,
    showLabel: true,
    size: 100,
    thickness: 5,
    progressType: 'circular',
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  }
};

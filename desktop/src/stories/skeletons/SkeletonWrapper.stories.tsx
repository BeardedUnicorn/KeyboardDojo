import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Button, Typography, Grid, Switch, FormControlLabel } from '@mui/material';
import SkeletonWrapper from '../../components/skeletons/SkeletonWrapper';

// Define component props type for clarity
interface SkeletonWrapperProps {
  loading: boolean;
  children?: React.ReactNode;
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave';
  className?: string;
}

// Interactive demo component
const SkeletonDemo = ({ children, defaultLoading = true, ...props }) => {
  const [loading, setLoading] = useState(defaultLoading);
  
  return (
    <Stack spacing={2}>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={loading} onChange={() => setLoading(!loading)} />}
          label={loading ? "Loading" : "Loaded"}
        />
      </Box>
      
      <SkeletonWrapper loading={loading} {...props}>
        {children}
      </SkeletonWrapper>
    </Stack>
  );
};

const meta = {
  title: 'Skeletons/SkeletonWrapper',
  component: SkeletonWrapper,
  parameters: {
    layout: 'padded',
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        component: 'A flexible wrapper component that displays skeleton placeholders during loading and renders its children when loading is complete.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the skeleton is in a loading state',
      defaultValue: true
    },
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'rounded', 'circular'],
      description: 'The variant of the skeleton',
      defaultValue: 'rounded'
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton',
      defaultValue: '100%'
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton',
      defaultValue: '100%'
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave'],
      description: 'The animation effect of the skeleton',
      defaultValue: 'wave'
    }
  }
} as Meta<typeof SkeletonWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple text skeleton
export const TextSkeleton: Story = {
  args: {
    loading: true,
    variant: 'text',
    width: 200,
    height: 40,
    animation: 'wave'
  },
  render: (args) => (
    <SkeletonDemo {...args}>
      <Typography variant="h6">Hello World</Typography>
    </SkeletonDemo>
  )
};

// Rectangular skeleton
export const RectangularSkeleton: Story = {
  args: {
    loading: true,
    variant: 'rectangular',
    width: 300,
    height: 100,
    animation: 'pulse'
  },
  render: (args) => (
    <SkeletonDemo {...args}>
      <Box
        sx={{
          width: 300,
          height: 100,
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 0
        }}
      >
        Content Box
      </Box>
    </SkeletonDemo>
  )
};

// Rounded skeleton
export const RoundedSkeleton: Story = {
  args: {
    loading: true,
    variant: 'rounded',
    width: 300,
    height: 100,
    animation: 'wave'
  },
  render: (args) => (
    <SkeletonDemo {...args}>
      <Box
        sx={{
          width: 300,
          height: 100,
          bgcolor: 'secondary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 1
        }}
      >
        Rounded Content
      </Box>
    </SkeletonDemo>
  )
};

// Circular skeleton
export const CircularSkeleton: Story = {
  args: {
    loading: true,
    variant: 'circular',
    width: 80,
    height: 80,
    animation: 'pulse'
  },
  render: (args) => (
    <SkeletonDemo {...args}>
      <Box
        sx={{
          width: 80,
          height: 80,
          bgcolor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%'
        }}
      >
        Avatar
      </Box>
    </SkeletonDemo>
  )
};

// Animation comparison
export const AnimationComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison between different animation types - pulse and wave.'
      }
    }
  },
  render: () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>Pulse Animation</Typography>
        <Stack spacing={2}>
          <SkeletonWrapper loading={true} animation="pulse" variant="text" width={300} height={30} />
          <SkeletonWrapper loading={true} animation="pulse" variant="rectangular" width={300} height={100} />
          <SkeletonWrapper loading={true} animation="pulse" variant="rounded" width={300} height={100} />
          <SkeletonWrapper loading={true} animation="pulse" variant="circular" width={80} height={80} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>Wave Animation</Typography>
        <Stack spacing={2}>
          <SkeletonWrapper loading={true} animation="wave" variant="text" width={300} height={30} />
          <SkeletonWrapper loading={true} animation="wave" variant="rectangular" width={300} height={100} />
          <SkeletonWrapper loading={true} animation="wave" variant="rounded" width={300} height={100} />
          <SkeletonWrapper loading={true} animation="wave" variant="circular" width={80} height={80} />
        </Stack>
      </Grid>
    </Grid>
  )
};

// Complex content with multiple skeletons
export const ComplexContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of using multiple SkeletonWrapper components to create a more complex loading state for a card-like content block.'
      }
    }
  },
  render: () => {
    const [loading, setLoading] = useState(true);
    
    return (
      <Stack spacing={3}>
        <FormControlLabel
          control={<Switch checked={loading} onChange={() => setLoading(!loading)} />}
          label={loading ? "Loading" : "Loaded"}
        />
        
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, maxWidth: 600 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <SkeletonWrapper loading={loading} variant="circular" width={60} height={60}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
              >
                KB
              </Box>
            </SkeletonWrapper>
            
            <Stack>
              <SkeletonWrapper loading={loading} variant="text" width={200} height={28}>
                <Typography variant="h6">Keyboard Shortcuts</Typography>
              </SkeletonWrapper>
              
              <SkeletonWrapper loading={loading} variant="text" width={120} height={20}>
                <Typography variant="body2" color="text.secondary">Intermediate Level</Typography>
              </SkeletonWrapper>
            </Stack>
          </Stack>
          
          <SkeletonWrapper loading={loading} variant="rounded" height={180} sx={{ mb: 2 }}>
            <Box
              sx={{
                height: 180,
                bgcolor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Typography>Lesson Content Preview</Typography>
            </Box>
          </SkeletonWrapper>
          
          <Stack spacing={1} sx={{ mb: 2 }}>
            <SkeletonWrapper loading={loading} variant="text" height={20}>
              <Typography>Learn essential keyboard shortcuts to boost your productivity.</Typography>
            </SkeletonWrapper>
            
            <SkeletonWrapper loading={loading} variant="text" height={20}>
              <Typography>Master navigation, text editing, and window management.</Typography>
            </SkeletonWrapper>
            
            <SkeletonWrapper loading={loading} variant="text" height={20} width="60%">
              <Typography>Complete 15 exercises to test your skills.</Typography>
            </SkeletonWrapper>
          </Stack>
          
          <SkeletonWrapper loading={loading} variant="rounded" width={120} height={36}>
            <Button variant="contained">Start Learning</Button>
          </SkeletonWrapper>
        </Box>
      </Stack>
    );
  }
};

// Usage documentation
export const UsageDocumentation: Story = {
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the SkeletonWrapper Component

The \`SkeletonWrapper\` component provides a flexible way to display loading skeletons in place of actual content while data is being fetched.

#### Basic Usage

\`\`\`jsx
import SkeletonWrapper from '../components/skeletons/SkeletonWrapper';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Simulate data loading
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  return (
    <SkeletonWrapper loading={loading} width={300} height={200}>
      {data && <MyContentComponent data={data} />}
    </SkeletonWrapper>
  );
}
\`\`\`

#### Props

- \`loading\`: Boolean that determines whether to show the skeleton (true) or children (false)
- \`variant\`: Type of skeleton - 'text', 'rectangular', 'rounded', or 'circular'
- \`width\`: Width of the skeleton (number for pixels, string for other units like %)
- \`height\`: Height of the skeleton (number for pixels, string for other units like %)
- \`animation\`: Animation type - 'pulse' or 'wave'
- \`className\`: Optional CSS class to apply to the skeleton container
- \`children\`: Content to display when loading is false

#### Best Practices

1. **Match Dimensions**: Set width and height to match the dimensions of the content that will eventually replace it
2. **Choose Appropriate Variants**: Use the variant that best represents your content:
   - \`text\` for text content
   - \`rectangular\` for squared content blocks
   - \`rounded\` for content with rounded corners
   - \`circular\` for avatars and circular elements
3. **Animation Selection**: Use 'pulse' for more subtle loading states and 'wave' for more obvious ones
4. **Progressive Loading**: For complex UIs, consider showing skeletons progressively
5. **Accessibility**: Ensure your app has appropriate aria attributes to inform screen readers about loading states

#### Creating Complex Loading States

Combine multiple SkeletonWrapper components to create complex loading states:

\`\`\`jsx
<Box>
  <SkeletonWrapper loading={loading} variant="text" width="60%" height={32}>
    <Typography variant="h5">{title}</Typography>
  </SkeletonWrapper>
  
  <Stack spacing={1} sx={{ mt: 1 }}>
    <SkeletonWrapper loading={loading} variant="text" width="100%" height={20}>
      <Typography>{description1}</Typography>
    </SkeletonWrapper>
    
    <SkeletonWrapper loading={loading} variant="text" width="90%" height={20}>
      <Typography>{description2}</Typography>
    </SkeletonWrapper>
  </Stack>
  
  <SkeletonWrapper loading={loading} variant="rounded" width="100%" height={200} sx={{ my: 2 }}>
    <ImageComponent src={imageUrl} />
  </SkeletonWrapper>
  
  <SkeletonWrapper loading={loading} variant="rounded" width={120} height={36}>
    <Button variant="contained">{buttonText}</Button>
  </SkeletonWrapper>
</Box>
\`\`\`
`
      }
    }
  },
  render: () => null
}; 
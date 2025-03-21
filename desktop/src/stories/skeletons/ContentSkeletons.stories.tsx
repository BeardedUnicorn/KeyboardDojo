import React, { useState, useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Button, Paper, Typography, useTheme } from '@mui/material';
import {
  LessonSkeleton,
  PathSkeleton,
  CardSkeleton,
  GridSkeleton
} from '../../components/skeletons/ContentSkeletons';

// Demo component that toggles between loading and loaded states
const LoadingDemo = ({ 
  SkeletonComponent, 
  children, 
  loadingTime = 3000,
  autoToggle = true,
  title,
  description,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  
  // Toggle loading state
  const toggleLoading = () => {
    setLoading(true);
    if (autoToggle) {
      setTimeout(() => setLoading(false), loadingTime);
    }
  };
  
  // Auto-toggle loading state on mount
  useEffect(() => {
    if (autoToggle) {
      const timer = setTimeout(() => setLoading(false), loadingTime);
      return () => clearTimeout(timer);
    }
  }, [autoToggle, loadingTime]);
  
  return (
    <Stack spacing={2}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
      )}
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
          borderRadius: 1
        }}
      >
        {loading ? (
          <SkeletonComponent loading={true} {...props} />
        ) : (
          children || <Box p={2}>{title} Content (Demo)</Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={toggleLoading}
          disabled={loading && autoToggle}
        >
          {loading ? `Loading... (${loadingTime/1000}s)` : 'Show Skeleton Again'}
        </Button>
      </Box>
    </Stack>
  );
};

const meta = {
  title: 'Skeletons/ContentSkeletons',
  component: LessonSkeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A collection of skeleton loading components for different content types in the application.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the skeleton is in a loading state',
      defaultValue: true
    }
  }
} satisfies Meta<typeof LessonSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// LessonSkeleton story
export const Lesson: Story = {
  render: (args) => (
    <LoadingDemo 
      SkeletonComponent={LessonSkeleton} 
      title="Lesson Skeleton"
      description="Used for loading states in lesson pages, showing placeholder for title, description, and exercise area."
      {...args}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Introduction to Keyboard Shortcuts</Typography>
        <Typography paragraph>
          This lesson will teach you the fundamentals of keyboard shortcuts in modern applications.
          You'll learn how to navigate efficiently without using a mouse.
        </Typography>
        <Typography paragraph>
          Keyboard shortcuts can significantly improve your productivity by reducing the time spent
          moving between keyboard and mouse.
        </Typography>
        <Box sx={{ bgcolor: 'background.paper', p: 3, my: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Exercise Area</Typography>
          <Typography>Practice content would appear here when loaded.</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined">Previous</Button>
          <Button variant="contained">Next</Button>
        </Box>
      </Box>
    </LoadingDemo>
  )
};

// PathSkeleton story
export const Path: Story = {
  render: (args) => (
    <LoadingDemo 
      SkeletonComponent={PathSkeleton}
      title="Path Skeleton"
      description="Used for loading states in learning path views, showing placeholder for path header, description, progress, and nodes."
      {...args}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              borderRadius: '50%', 
              width: 48, 
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            VS
          </Box>
          <Typography variant="h5">VS Code Master Path</Typography>
        </Box>
        
        <Typography paragraph>
          Master Visual Studio Code shortcuts and become a productive developer.
          This path contains 15 lessons with increasing difficulty.
        </Typography>
        
        <Box sx={{ height: 8, bgcolor: 'success.light', borderRadius: 4, mb: 4 }} />
        
        <Stack spacing={2}>
          {["Introduction to VS Code", "Navigation Basics", "Text Editing", "Multiple Cursors", "Advanced Refactoring"].map((name, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: i < 3 ? 'success.main' : 'grey.400', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32 
                }}
              />
              <Typography variant="subtitle1">{name}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </LoadingDemo>
  )
};

// CardSkeleton story
export const Card: Story = {
  render: (args) => (
    <LoadingDemo 
      SkeletonComponent={CardSkeleton}
      title="Card Skeleton"
      description="Used for loading states in card components, showing placeholder for header, content, and footer."
      {...args}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Keyboard Navigation</Typography>
        <Typography variant="body2" paragraph>
          Learn how to navigate your application efficiently using only the keyboard.
          Master tab navigation, focus management, and accessibility shortcuts.
        </Typography>
        <Button variant="contained" size="small">Start Learning</Button>
      </Box>
    </LoadingDemo>
  )
};

// GridSkeleton story
export const Grid: Story = {
  argTypes: {
    count: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Number of card skeletons to display in the grid',
      defaultValue: 6
    }
  },
  render: (args) => (
    <LoadingDemo 
      SkeletonComponent={GridSkeleton}
      title="Grid Skeleton"
      description="Used for loading states in grid layouts, showing multiple card skeletons in a responsive grid."
      count={args.count || 6}
      {...args}
    >
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2,
        }}
      >
        {Array.from({ length: args.count || 6 }).map((_, i) => (
          <Paper key={i} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Card {i + 1}</Typography>
            <Typography variant="body2" paragraph>
              This is example content for card {i + 1}. In a real application,
              this would contain actual data loaded from an API.
            </Typography>
            <Button variant="outlined" size="small">View Details</Button>
          </Paper>
        ))}
      </Box>
    </LoadingDemo>
  )
};

// Multiple skeletons together
export const FullPageLoading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates how different skeleton components can be combined to create a full page loading state.'
      }
    }
  },
  render: (args) => (
    <Stack spacing={4}>
      <Typography variant="h5" gutterBottom>Full Page Loading Example</Typography>
      <Typography variant="body2" paragraph>
        This example shows how different skeleton components can be combined to create a complete page loading state.
        In a real application, these would be replaced with actual content once data is loaded.
      </Typography>
      
      <LessonSkeleton loading={true} />
      
      <Typography variant="h6" sx={{ mt: 4 }}>Related Paths</Typography>
      <PathSkeleton loading={true} />
      
      <Typography variant="h6" sx={{ mt: 4 }}>Recommended Lessons</Typography>
      <GridSkeleton loading={true} count={3} />
    </Stack>
  )
};

// Usage documentation
export const UsageDocumentation: Story = {
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the Skeleton Components

The skeleton components provide loading state placeholders for different types of content in the application. They help improve perceived performance by showing a visual representation of the content that will eventually load.

#### Basic Usage

Import the skeleton component for your content type:

\`\`\`jsx
import { LessonSkeleton, PathSkeleton, CardSkeleton, GridSkeleton } from '../components/skeletons/ContentSkeletons';
\`\`\`

Use the skeleton while content is loading:

\`\`\`jsx
function LessonPage() {
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  
  useEffect(() => {
    // Fetch data and set loading to false when complete
    fetchLessonData().then(data => {
      setLessonData(data);
      setLoading(false);
    });
  }, []);
  
  return (
    <div>
      {loading ? (
        <LessonSkeleton loading={true} />
      ) : (
        <LessonContent data={lessonData} />
      )}
    </div>
  );
}
\`\`\`

#### Available Skeleton Components

1. **LessonSkeleton**: For lesson content pages
2. **PathSkeleton**: For learning path visualization
3. **CardSkeleton**: For individual cards in lists or grids
4. **GridSkeleton**: For grid layouts with multiple cards
   - Accepts a \`count\` prop to control the number of cards (default: 6)

#### Best Practices

1. **Match the Layout**: Choose the skeleton component that most closely matches your content layout
2. **Limit Loading Time**: Aim for loading states to be visible for no more than a few seconds
3. **Consistent Use**: Use skeletons consistently throughout your application for a cohesive experience
4. **Progressive Loading**: For complex pages, consider loading and displaying content progressively
5. **Accessibility**: Skeletons are purely visual; ensure screen readers are informed about loading states

#### Customization

All skeleton components accept a \`loading\` prop to control their visibility:

\`\`\`jsx
<CardSkeleton loading={isLoading} />
\`\`\`

When \`loading\` is false, the skeleton will render its children instead (if provided):

\`\`\`jsx
<CardSkeleton loading={isLoading}>
  <ActualContent />
</CardSkeleton>
\`\`\`
`
      }
    }
  },
  render: () => null
}; 
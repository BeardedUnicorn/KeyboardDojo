import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import PathView from '../../components/curriculum/PathView';
import { ApplicationType } from '../../types/progress/ICurriculum';

// Mock the Redux store for different user states
const createMockStore = (userState: 'beginner' | 'intermediate' | 'advanced' | 'empty') => {
  // Define different progress states
  let completedLessons: string[] = [];
  let completedModules: string[] = [];
  let xp = 0;
  let level = 1;

  switch (userState) {
    case 'beginner':
      completedLessons = ['node-1', 'node-2'];
      completedModules = [];
      xp = 250;
      level = 2;
      break;
    case 'intermediate':
      completedLessons = ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6'];
      completedModules = ['module-1'];
      xp = 750;
      level = 5;
      break;
    case 'advanced':
      completedLessons = ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', 'node-7', 'node-8', 'node-9'];
      completedModules = ['module-1', 'module-2'];
      xp = 1500;
      level = 8;
      break;
    case 'empty':
    default:
      completedLessons = [];
      completedModules = [];
      xp = 0;
      level = 1;
  }

  // Configure the mock Redux store
  return configureStore({
    reducer: {
      userProgress: () => ({
        data: {
          completedLessons,
          completedModules,
          xp,
          level
        }
      })
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
};

// Store wrapper component
const StoreWrapper = ({ children, userState }: { children: React.ReactNode, userState: 'beginner' | 'intermediate' | 'advanced' | 'empty' }) => (
  <Provider store={createMockStore(userState)}>
    {children}
  </Provider>
);

// Styled container for the PathView
const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ 
    p: 4, 
    backgroundColor: 'background.default', 
    height: '80vh', 
    width: '100%',
    overflow: 'auto',
  }}>
    <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative' }}>
      {children}
    </Paper>
  </Box>
);

const meta = {
  title: 'Advanced/PathView',
  component: PathView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A component that visualizes learning paths with connected nodes representing lessons, quizzes, and modules.'
      }
    }
  },
  tags: ['autodocs'],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic path visualization for beginners
export const SimplePathBeginner: Story = {
  render: () => {
    return (
      <StoreWrapper userState="beginner">
        <StyledContainer>
          <Typography variant="h5" gutterBottom>Simple Linear Path - Beginner Progress</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is a mock visualization of the PathView component showing a simple linear path. 
            In a real implementation, it would display nodes and connections based on user progress.
          </Typography>
          <Box sx={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              PathView with 'TYPING' track data and beginner progress would render here.
            </Typography>
          </Box>
        </StyledContainer>
      </StoreWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple linear path showing beginner progress with the first two nodes completed.'
      }
    }
  }
};

// Moderate complexity path with intermediate progress
export const ModeratePathIntermediate: Story = {
  render: () => {
    return (
      <StoreWrapper userState="intermediate">
        <StyledContainer>
          <Typography variant="h5" gutterBottom>Branching Path - Intermediate Progress</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is a mock visualization of the PathView component showing a branching path.
            In a real implementation, it would display multiple paths with intermediate progress.
          </Typography>
          <Box sx={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              PathView with 'SHORTCUTS' track data and intermediate progress would render here.
            </Typography>
          </Box>
        </StyledContainer>
      </StoreWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A moderately complex path with branches showing intermediate progress where multiple paths are being explored.'
      }
    }
  }
};

// Complex path with advanced progress
export const ComplexPathAdvanced: Story = {
  render: () => {
    return (
      <StoreWrapper userState="advanced">
        <StyledContainer>
          <Typography variant="h5" gutterBottom>Complex Path - Advanced Progress</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is a mock visualization of the PathView component showing a complex path structure.
            In a real implementation, it would display multiple branches and advanced user progress.
          </Typography>
          <Box sx={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              PathView with 'IDE' track data and advanced progress would render here.
            </Typography>
          </Box>
        </StyledContainer>
      </StoreWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A complex path with multiple branches and node types showing advanced progress through most of the content.'
      }
    }
  }
};

// New user with no progress
export const EmptyProgress: Story = {
  render: () => {
    return (
      <StoreWrapper userState="empty">
        <StyledContainer>
          <Typography variant="h5" gutterBottom>New User - No Progress</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is a mock visualization of the PathView component for a new user with no progress.
            In a real implementation, it would show only the first node as available.
          </Typography>
          <Box sx={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              PathView with 'SHORTCUTS' track data and no user progress would render here.
            </Typography>
          </Box>
        </StyledContainer>
      </StoreWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A path visualization for a new user with no progress, showing only the first node as unlocked.'
      }
    }
  }
};

// Interactive documentation
export const UsageDocumentation: Story = {
  render: () => {
    return (
      <StoreWrapper userState="beginner">
        <StyledContainer>
          <Typography variant="h5" gutterBottom>Path View Documentation</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The PathView component visualizes learning paths with connected nodes representing lessons, checkpoints, and challenges.
          </Typography>
          <Box sx={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="body1">
              PathView with documentation examples would render here.
            </Typography>
          </Box>
        </StyledContainer>
      </StoreWrapper>
    );
  },
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the PathView Component

The \`PathView\` component visualizes learning paths as connected nodes that represent different types of content like lessons, checkpoints, and challenges.

#### Basic Usage

\`\`\`jsx
import { PathView } from '../components/curriculum';
import { ApplicationType, PathNodeType } from '../types/progress/ICurriculum';

function CurriculumPage() {
  // In a real implementation, you would provide actual path data
  const pathData = {
    id: 'typing-basics',
    title: 'Typing Basics',
    description: 'Learn the fundamentals of touch typing',
    // Additional required properties...
  };
  
  const handleNodeSelect = (trackId: ApplicationType, nodeId: string, nodeType: PathNodeType) => {
    // Navigate to the selected content
    console.log('Selected node:', { trackId, nodeId, nodeType });
  };
  
  return (
    <PathView 
      path={pathData}
      onSelectNode={handleNodeSelect} 
    />
  );
}
\`\`\`

#### Node Types and States

The PathView displays different types of nodes:
- **Lessons**: Standard learning content
- **Checkpoints**: Assessment content
- **Challenges**: More advanced content that tests multiple skills

Nodes can have different states:
- **Locked**: Not yet available (prerequisites not met)
- **Unlocked**: Available but not completed
- **Completed**: User has finished this content
- **Current**: The next recommended node to complete

#### User Progress Integration

The component integrates with Redux to track user progress:
- Completed lessons and modules are reflected visually
- The path automatically shows which nodes are available based on prerequisites
- Current progress is highlighted to guide the user's learning journey
        `
      }
    }
  }
}; 
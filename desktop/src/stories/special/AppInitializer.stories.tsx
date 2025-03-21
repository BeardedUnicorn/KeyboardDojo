import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AppInitializer from '../../components/AppInitializer';

// Declare global window property for Storybook
declare global {
  interface Window {
    STORYBOOK_STORY_NAME?: string;
  }
}

// Create mock data
const mockCurriculum = {
  tracks: [
    {
      id: 'track1',
      title: 'Getting Started',
      description: 'Learn the basics of keyboard shortcuts',
      icon: 'School',
      topics: [
        {
          id: 'topic1',
          title: 'Keyboard Basics',
          description: 'Understanding keyboard fundamentals',
          icon: 'Keyboard'
        }
      ]
    }
  ],
  topics: [
    {
      id: 'topic1',
      title: 'Keyboard Basics',
      description: 'Understanding keyboard fundamentals',
      icon: 'Keyboard',
      lessons: ['lesson1']
    }
  ],
  lessons: [
    {
      id: 'lesson1',
      title: 'Introduction to Keyboard Shortcuts',
      description: 'Learn the most essential keyboard shortcuts',
      difficulty: 'beginner',
      estimatedTime: 10,
      topicId: 'topic1'
    }
  ],
  filter: function(predicate) {
    return this.lessons.filter(predicate);
  }
};

// Create a mock Redux store
const createMockStore = () => {
  return configureStore({
    reducer: {
      app: () => ({
        isInitialized: false,
        isLoading: true,
        error: null,
        showTimeout: false,
        currentProgress: 0,
        theme: 'light',
        isOnline: true,
        errors: [],
        notifications: [],
        currentModal: null,
        modalData: null,
        isUpdateAvailable: false,
        updateVersion: null
      }),
      curriculum: () => ({
        curriculum: mockCurriculum,
        activeCurriculum: mockCurriculum,
        isLoading: false,
        error: null,
        tracks: mockCurriculum.tracks,
        topics: mockCurriculum.topics,
        lessons: mockCurriculum.lessons,
        filter: (predicate) => mockCurriculum.lessons.filter(predicate)
      }),
      progress: () => ({
        userProgress: {
          level: 3,
          xp: 350,
          streakDays: 5,
          totalLessonsCompleted: 12
        },
        isLoading: false,
        error: null
      }),
      user: () => ({
        isAuthenticated: true,
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          profileImage: null,
          preferences: {
            theme: 'light',
            notifications: true
          }
        },
        isLoading: false,
        error: null
      })
    }
  });
};

// Mock the useAppRedux hook with different states
jest.mock('@hooks/useAppRedux', () => ({
  useAppRedux: () => {
    // Get the current story's parameters to determine which state to return
    const storyName = window.STORYBOOK_STORY_NAME || 'Default';
    
    if (storyName.includes('Loading')) {
      return {
        isInitialized: false,
        isLoading: true,
        initialize: jest.fn(),
        errors: []
      };
    } 
    else if (storyName.includes('Error')) {
      return {
        isInitialized: false,
        isLoading: false,
        initialize: jest.fn(),
        errors: [{ message: 'Failed to connect to server. Please check your internet connection.' }]
      };
    }
    else if (storyName.includes('Timeout')) {
      // This will simulate a timeout scenario
      return {
        isInitialized: false,
        isLoading: false,
        initialize: jest.fn(),
        errors: []
      };
    }
    else {
      // Initialized state (default)
      return {
        isInitialized: true,
        isLoading: false,
        initialize: jest.fn(),
        errors: []
      };
    }
  }
}));

// Custom component for the initialized app content
const AppContent = () => (
  <Box 
    sx={{ 
      p: 4, 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 600,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Application Initialized
      </Typography>
      <Typography variant="body1" paragraph>
        The application has been successfully initialized and is now ready to use.
        This content is only visible after the AppInitializer has completed its initialization process.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        In a real application, this would be your main application content.
      </Typography>
    </Paper>
  </Box>
);

// Define the type that includes children and initTimeout props
type AppInitializerStoryProps = {
  children: React.ReactNode;
  initTimeout?: number;
};

// Using a more generic type for the meta to avoid type issues
const meta = {
  title: 'Special/AppInitializer',
  component: AppInitializer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A component that handles application initialization and shows appropriate loading states or error messages.'
      }
    }
  },
  argTypes: {
    initTimeout: {
      control: { type: 'number', min: 1000, max: 10000, step: 1000 },
      description: 'Timeout in milliseconds before showing UI anyway',
      defaultValue: 5000
    }
  },
  tags: ['autodocs'],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Create store once to avoid recreation on each render
const store = createMockStore();

// Wrapper component for all stories
const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

// Initialized state
export const Initialized: Story = {
  args: {
    children: <AppContent />,
    initTimeout: 5000
  },
  parameters: {
    docs: {
      description: {
        story: 'The application has been successfully initialized and shows the main content.'
      }
    }
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    )
  ]
};

// Loading state 
export const Loading: Story = {
  args: {
    children: <AppContent />,
    initTimeout: 5000
  },
  parameters: {
    docs: {
      description: {
        story: 'The application is in the loading state showing a progress indicator.'
      }
    }
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    )
  ]
};

// Error state
export const Error: Story = {
  args: {
    children: <AppContent />,
    initTimeout: 5000
  },
  parameters: {
    docs: {
      description: {
        story: 'The initialization process has encountered an error. The user is shown an error message with options to retry or continue anyway.'
      }
    }
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    )
  ]
};

// Timeout state
export const Timeout: Story = {
  args: {
    children: <AppContent />,
    initTimeout: 2000 // Short timeout for demonstration
  },
  parameters: {
    docs: {
      description: {
        story: 'The initialization process has timed out and the application shows the main content anyway. This is useful to prevent the user from being stuck on a loading screen if initialization takes too long.'
      }
    }
  },
  // Use play to set window.STORYBOOK_STORY_NAME and force a timeout
  play: async ({ canvasElement }) => {
    // Set the story name to "Timeout" for the mock
    window.STORYBOOK_STORY_NAME = 'Timeout';
    
    // Force a timeout by waiting
    await new Promise(resolve => setTimeout(resolve, 2100));
    
    // Reset the story name
    delete window.STORYBOOK_STORY_NAME;
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    )
  ]
};

// Usage documentation
export const UsageDocumentation: Story = {
  args: {
    children: <AppContent />
  },
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the AppInitializer Component

The \`AppInitializer\` component manages the application's initialization process, showing appropriate loading states and handling errors.

#### Basic Usage

Wrap your application with the AppInitializer to ensure it's properly initialized before rendering:

\`\`\`jsx
import AppInitializer from './components/AppInitializer';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <YourApplication />
      </AppInitializer>
    </Provider>
  );
}
\`\`\`

#### With Custom Timeout

You can customize the initialization timeout (default is 5000ms):

\`\`\`jsx
<Provider store={store}>
  <AppInitializer initTimeout={10000}>
    <YourApplication />
  </AppInitializer>
</Provider>
\`\`\`

#### Implementation Details

The AppInitializer:

1. Calls the \`initialize\` function from your Redux store on mount
2. Displays a loading spinner while initialization is in progress
3. Shows error messages if initialization fails, with retry options
4. Automatically continues after a specified timeout to prevent users from being stuck
5. Renders its children once initialization is complete or has timed out

#### Integration with Redux

This component expects a Redux hook called \`useAppRedux\` that provides:
- \`isInitialized\`: Whether initialization is complete
- \`isLoading\`: Whether initialization is in progress  
- \`initialize\`: Function to trigger initialization
- \`errors\`: Array of error objects with messages

\`\`\`jsx
// Example implementation of useAppRedux
function useAppRedux() {
  const dispatch = useDispatch();
  const { isInitialized, isLoading, errors } = useSelector(state => state.app);
  
  const initialize = () => {
    dispatch(appActions.initialize());
  };
  
  return { isInitialized, isLoading, initialize, errors };
}
\`\`\`
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    )
  ]
}; 
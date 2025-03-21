import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, useTheme, ThemeProvider, createTheme } from '@mui/material';
import UpdateNotification from '../../components/notifications/UpdateNotification';

// Create a simple theme for the stories
const appTheme = createTheme();

// Mock the Tauri API for Storybook
if (typeof window !== 'undefined') {
  // Initialize mock state variables
  window.STORYBOOK_UPDATE_AVAILABLE = false;
  window.STORYBOOK_UPDATE_READY = false;
  
  // Add missing necessary properties that may be used by the component
  const mockProgress = { status: 'idle', progress: 0 };
  
  // Create a more complete mock of the update service
  window.updateService = {
    initialize: () => {
      console.log('[MOCK] Initializing update service...');
      // Immediately resolve to prevent timeouts
      return Promise.resolve();
    },
    checkForUpdates: () => {
      console.log('[MOCK] Checking for updates...');
      // Return mock info based on window state
      return Promise.resolve({
        available: window.STORYBOOK_UPDATE_AVAILABLE,
        ready: window.STORYBOOK_UPDATE_READY,
        version: '1.1.0',
        currentVersion: '1.0.0',
        releaseNotes: 'Mock release notes for testing'
      });
    },
    downloadAndInstallUpdate: () => {
      console.log('[MOCK] Downloading and installing update...');
      window.STORYBOOK_UPDATE_READY = true;
      return Promise.resolve();
    },
    restartApp: () => {
      console.log('[MOCK] Restarting app...');
      return Promise.resolve();
    },
    // Add progress listener to properly initialize the component
    addProgressListener: (listener) => {
      console.log('[MOCK] Adding progress listener...');
      // Immediately call with idle state
      setTimeout(() => listener(mockProgress), 0);
    },
    removeProgressListener: () => {
      console.log('[MOCK] Removing progress listener...');
    }
  };
  
  // Mock the logger
  window.logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message, error) => console.error(`[ERROR] ${message}`, error),
    component: (action, data) => console.log(`[COMPONENT] ${action}`, data || '')
  };

  // Mock any other Tauri APIs that might be needed
  if (!window.__TAURI__) {
    window.__TAURI__ = {
      invoke: (cmd: string) => {
        console.log(`[MOCK TAURI] Invoking: ${cmd}`);
        return Promise.resolve();
      }
    };
  }
}

// Declare global window property types
declare global {
  interface Window {
    STORYBOOK_UPDATE_AVAILABLE: boolean;
    STORYBOOK_UPDATE_READY: boolean;
    updateService: {
      initialize: () => Promise<void>;
      checkForUpdates: () => Promise<any>;
      downloadAndInstallUpdate: () => Promise<void>;
      restartApp: () => Promise<void>;
      addProgressListener: (listener: (progress: any) => void) => void;
      removeProgressListener: (listener?: (progress: any) => void) => void;
    };
    logger: {
      info: (message: string) => void;
      error: (message: string, error?: any) => void;
      component: (action: string, data?: any) => void;
    };
    __TAURI__?: {
      invoke: (cmd: string, args?: any) => Promise<any>;
    };
  }
}

// Wrapper component with theme
const UpdateNotificationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      sx={{ 
        p: 4, 
        maxWidth: 800, 
        minWidth: 400,
        mx: 'auto',
        my: 2,
        bgcolor: theme.palette.background.paper
      }}
    >
      {children}
    </Paper>
  );
};

const meta: Meta<typeof UpdateNotification> = {
  title: 'Notifications/UpdateNotification',
  component: UpdateNotification,
  decorators: [
    (Story) => (
      <ThemeProvider theme={appTheme}>
        <UpdateNotificationWrapper>
          <Story />
        </UpdateNotificationWrapper>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    // Add a much longer timeout for all tests
    jest: {
      timeout: 180000, // 3 minutes
    }
  },
  argTypes: {
    checkInterval: {
      control: 'number',
      description: 'How often to check for updates (in seconds)',
      defaultValue: 60
    }
  }
};

export default meta;
type Story = StoryObj<typeof UpdateNotification>;

// No Update Available story
export const NoUpdateAvailable: Story = {
  args: {
    checkInterval: 60
  },
  play: async () => {
    // Reset mock state
    if (typeof window !== 'undefined') {
      window.STORYBOOK_UPDATE_AVAILABLE = false;
      window.STORYBOOK_UPDATE_READY = false;
    }
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
};

// Update Available story
export const UpdateAvailable: Story = {
  render: () => {
    // Set the mock state for update available
    if (typeof window !== 'undefined') {
      window.STORYBOOK_UPDATE_AVAILABLE = true;
      window.STORYBOOK_UPDATE_READY = false;
    }
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Update Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This shows the notification when an update is available but not yet downloaded.
        </Typography>
        <UpdateNotification checkInterval={60} />
      </Box>
    );
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
};

// Update Ready To Install story
export const UpdateReadyToInstall: Story = {
  render: () => {
    // Set the mock state for update ready
    if (typeof window !== 'undefined') {
      window.STORYBOOK_UPDATE_AVAILABLE = true;
      window.STORYBOOK_UPDATE_READY = true;
    }
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Update Ready to Install
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This shows the notification when an update has been downloaded and is ready to install.
        </Typography>
        <UpdateNotification checkInterval={60} />
      </Box>
    );
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
};

// Custom Check Interval story
export const CustomCheckInterval: Story = {
  args: {
    checkInterval: 300
  },
  play: async () => {
    // Reset mock state
    if (typeof window !== 'undefined') {
      window.STORYBOOK_UPDATE_AVAILABLE = false;
      window.STORYBOOK_UPDATE_READY = false;
    }
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
};

// Usage documentation
export const UsageDocumentation: Story = {
  render: () => {
    return (
      <Box sx={{ maxWidth: 800 }}>
        <Typography variant="h4" gutterBottom>
          UpdateNotification Component
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          Basic Usage
        </Typography>
        <Box component="pre" sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 2, mb: 3, overflow: 'auto' }}>
          {`// Import the component
import UpdateNotification from '@/components/notifications/UpdateNotification';

// Add it to your layout
<Layout>
  <UpdateNotification />
  <YourMainContent />
</Layout>`}
        </Box>
        
        <Typography variant="h5" gutterBottom>
          Properties
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>checkInterval</strong> (optional) - Number of minutes between automatic update checks. Defaults to 30 minutes.
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          Examples
        </Typography>
        <Typography variant="h6" gutterBottom>
          With custom check interval:
        </Typography>
        <Box component="pre" sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 2, mb: 3, overflow: 'auto' }}>
          {`<UpdateNotification checkInterval={60} /> // Check every hour`}
        </Box>
      </Box>
    );
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    },
    docs: {
      description: {
        story: 'Documentation for component usage.',
      },
    },
  },
}; 
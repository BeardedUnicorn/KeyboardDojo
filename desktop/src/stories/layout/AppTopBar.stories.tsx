import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, Box, Snackbar } from '@mui/material';

import AppTopBar from '../../components/layout/AppTopBar';
import { TestWrapper } from '../.storybook-test-setup';

// Define props that will be passed through context.args
interface AppTopBarStoryProps {
  title?: string;
  onOpenSettings?: () => void;
}

const meta = {
  title: 'Layout/AppTopBar',
  component: AppTopBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The AppTopBar component is a desktop-specific navigation bar that appears at the top of the application.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    onOpenSettings: { action: 'settings opened' },
  },
  decorators: [
    (Story, context) => {
      const args = context.args as AppTopBarStoryProps;
      
      return (
        <TestWrapper>
          <Story />
        </TestWrapper>
      );
    },
  ],
} satisfies Meta<typeof AppTopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Keyboard Dojo',
  },
  render: (args) => (
    <Box sx={{ height: '100px' }}>
      <AppTopBar title={args.title} onOpenSettings={args.onOpenSettings} />
    </Box>
  ),
  play: async () => {
    // Ensure global mocks are set up
    if (typeof window !== 'undefined') {
      // Set up window.ui directly here
      window.ui = { theme: 'light', mode: 'light', sidebar: { open: true } };
      
      // Mock services to prevent errors with windowService
      window.services = window.services || {};
      window.services.windowService = {
        setTitle: () => Promise.resolve(),
        isMaximized: () => Promise.resolve(false),
        listen: () => () => {},
        minimize: () => {},
        toggleMaximize: () => {},
        close: () => {},
        startDragging: () => {}
      };
      
      // Mock OS detection service
      window.services.osDetectionService = {
        isMacOS: () => false
      };
      
      // CRITICAL: Mock the useThemeRedux hook that AppTopBar uses
      window.useThemeRedux = () => ({
        mode: 'light',
        toggleTheme: () => console.log('Theme toggle clicked'),
        isDarkMode: false
      });
      
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

export const WithSettingsAction: Story = {
  args: {
    title: 'Keyboard Dojo',
    onOpenSettings: () => console.log('Settings clicked'),
  },
  render: (args) => (
    <Box sx={{ height: '100px' }}>
      <AppTopBar title={args.title} onOpenSettings={args.onOpenSettings} />
    </Box>
  ),
  play: async () => {
    // Ensure global mocks are set up
    if (typeof window !== 'undefined') {
      // Set up UI settings
      window.ui = { theme: 'light', mode: 'light', sidebar: { open: true } };
      
      // Mock services
      window.services = window.services || {};
      window.services.windowService = {
        setTitle: () => Promise.resolve(),
        isMaximized: () => Promise.resolve(false),
        listen: () => () => {},
        minimize: () => {},
        toggleMaximize: () => {},
        close: () => {},
        startDragging: () => {}
      };
      
      window.services.osDetectionService = {
        isMacOS: () => false
      };
      
      // Mock theme hook
      window.useThemeRedux = () => ({
        mode: 'light',
        toggleTheme: () => console.log('Theme toggle clicked'),
        isDarkMode: false
      });
      
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

// Demonstrate interactive behavior
export const Interactive: Story = {
  args: {
    title: 'Keyboard Dojo',
  },
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);

    const handleOpenSettings = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Box sx={{ height: '100px' }}>
        <AppTopBar title={args.title} onOpenSettings={handleOpenSettings} />
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" variant="filled">
            Settings panel would open here
          </Alert>
        </Snackbar>
      </Box>
    );
  },
  play: async () => {
    // Ensure global mocks are set up
    if (typeof window !== 'undefined') {
      // Set up UI settings
      window.ui = { theme: 'light', mode: 'light', sidebar: { open: true } };
      
      // Mock services
      window.services = window.services || {};
      window.services.windowService = {
        setTitle: () => Promise.resolve(),
        isMaximized: () => Promise.resolve(false),
        listen: () => () => {},
        minimize: () => {},
        toggleMaximize: () => {},
        close: () => {},
        startDragging: () => {}
      };
      
      window.services.osDetectionService = {
        isMacOS: () => false
      };
      
      // Mock theme hook
      window.useThemeRedux = () => ({
        mode: 'light',
        toggleTheme: () => console.log('Theme toggle clicked'),
        isDarkMode: false
      });
      
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

// Demonstrate responsive behavior
export const ResponsiveAppBar: Story = {
  args: {
    title: 'Keyboard Dojo',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'The AppTopBar is designed for desktop view and adapts based on screen size.',
      },
    },
  },
  render: (args) => (
    <Box sx={{ height: '100px' }}>
      <AppTopBar title={args.title} onOpenSettings={args.onOpenSettings} />
    </Box>
  ),
  play: async () => {
    // Ensure global mocks are set up
    if (typeof window !== 'undefined') {
      // Set up UI settings
      window.ui = { theme: 'light', mode: 'light', sidebar: { open: true } };
      
      // Mock services
      window.services = window.services || {};
      window.services.windowService = {
        setTitle: () => Promise.resolve(),
        isMaximized: () => Promise.resolve(false),
        listen: () => () => {},
        minimize: () => {},
        toggleMaximize: () => {},
        close: () => {},
        startDragging: () => {}
      };
      
      window.services.osDetectionService = {
        isMacOS: () => false
      };
      
      // Mock theme hook
      window.useThemeRedux = () => ({
        mode: 'light',
        toggleTheme: () => console.log('Theme toggle clicked'),
        isDarkMode: false
      });
      
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
    }
  }
};

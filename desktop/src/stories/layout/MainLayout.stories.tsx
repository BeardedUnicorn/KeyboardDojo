import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper } from '@mui/material';

import MainLayout from '../../components/layout/MainLayout';
import { TestWrapper } from '../.storybook-test-setup';

// Just define a simple props interface for the story context
interface StoryContext {
  children: React.ReactNode;
}

const meta = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component: 'The MainLayout component is the primary layout structure for the application, combining AppTopBar, Navigation, and content area.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      // Use our comprehensive TestWrapper that sets up all required contexts
      return (
        <TestWrapper>
          <Story />
        </TestWrapper>
      );
    },
  ],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content to display in the layout
const SampleContent = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="h4" gutterBottom>
      Main Content Area
    </Typography>
    <Typography variant="body1" paragraph>
      This is the main content area of the application. It adapts to the screen size and adjusts
      based on whether the navigation drawer is expanded or collapsed.
    </Typography>

    <Paper sx={{ p: 3, mb: 2 }} elevation={1}>
      <Typography variant="h6" gutterBottom>
        Content Section
      </Typography>
      <Typography variant="body2">
        Individual content sections can be placed within the main layout. The layout handles
        proper spacing, scrolling behavior, and responsive adjustments.
      </Typography>
    </Paper>

    {Array.from({ length: 3 }).map((_, index) => (
      <Paper key={index} sx={{ p: 3, mb: 2 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Content Section {index + 1}
        </Typography>
        <Typography variant="body2">
          This is an example of content that would be displayed within the main layout area.
        </Typography>
      </Paper>
    ))}
  </Box>
);

export const Default: Story = {
  args: {
    children: <div style={{ padding: '2rem' }}>Main Content Area</div>,
  },
  play: async () => {
    // Ensure the global mocks are set up for tests 
    if (typeof window !== 'undefined' && window.setupGlobalMocks) {
      window.setupGlobalMocks();
    }
  }
};

export const WithDetailedContent: Story = {
  args: {
    children: <SampleContent />,
  },
  play: async () => {
    // Ensure the global mocks are set up for tests
    if (typeof window !== 'undefined' && window.setupGlobalMocks) {
      window.setupGlobalMocks();
    }
  }
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    children: <SampleContent />,
  },
  play: async () => {
    // Set up dark mode in the global mocks
    if (typeof window !== 'undefined') {
      window.ui = { theme: 'dark', mode: 'dark', sidebar: { open: true } };
      if (window.setupGlobalMocks) {
        window.setupGlobalMocks();
      }
      window.useThemeContext = () => ({
        isDarkMode: true,
        toggleTheme: () => {},
        mode: 'dark',
        theme: {
          palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: { default: '#121212', paper: '#1e1e1e' },
            text: { primary: '#fff', secondary: 'rgba(255, 255, 255, 0.7)' }
          }
        }
      });
    }
  }
};

export const MobileBehavior: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'The MainLayout component adapts to mobile screen sizes, adjusting the navigation and content areas.',
      },
    },
  },
  args: {
    children: <div style={{ padding: '1rem' }}>Mobile Content Area</div>,
  },
  play: async () => {
    // Ensure the global mocks are set up for tests
    if (typeof window !== 'undefined' && window.setupGlobalMocks) {
      window.setupGlobalMocks();
    }
  }
};

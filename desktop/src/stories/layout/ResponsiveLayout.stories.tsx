import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Folder, Home, Settings, Help } from '@mui/icons-material';

import ResponsiveLayout from '../../components/layout/ResponsiveLayout';

const meta: Meta<typeof ResponsiveLayout> = {
  title: 'Layout/ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The ResponsiveLayout component provides a flexible layout system that adapts to different screen sizes, with support for sidebars and content areas.',
      },
    },
  },
  argTypes: {
    spacing: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    minContentWidth: { control: { type: 'number', min: 280, max: 800, step: 10 } },
    maxContentWidth: { control: { type: 'number', min: 600, max: 1600, step: 50 } },
    sidebarPosition: { control: 'radio', options: ['left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveLayout>;

// Sample content to display in the layout
const SampleContent = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="h4" gutterBottom>
      Main Content Area
    </Typography>
    <Typography variant="body1" paragraph>
      This is the main content area of the application. The ResponsiveLayout component provides
      responsive behavior and proper spacing.
    </Typography>

    <Paper sx={{ p: 3, mb: 2 }} elevation={1}>
      <Typography variant="h6" gutterBottom>
        Content Section
      </Typography>
      <Typography variant="body2">
        The content area width is adjustable through the component props, with minimum and maximum
        width constraints.
      </Typography>
    </Paper>

    {Array.from({ length: 3 }).map((_, index) => (
      <Paper key={index} sx={{ p: 3, mb: 2 }} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Content Section {index + 1}
        </Typography>
        <Typography variant="body2">
          This is an example of content that would be displayed within the main area.
        </Typography>
      </Paper>
    ))}
  </Box>
);

// Sample sidebar to display
const SampleSidebar = () => (
  <Box sx={{ width: '100%' }}>
    <List component="nav">
      <ListItem sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="Projects" />
      </ListItem>
      <Divider />
      <ListItem sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
          <Help />
        </ListItemIcon>
        <ListItemText primary="Help" />
      </ListItem>
    </List>
  </Box>
);

export const Default: Story = {
  args: {
    spacing: 2,
    minContentWidth: 320,
    maxContentWidth: 1200,
    sidebarWidth: 280,
    showSidebar: true,
    sidebarPosition: 'left',
    sidebar: <SampleSidebar />,
  },
  render: (args) => (
    <Box sx={{ height: '100vh' }}>
      <ResponsiveLayout {...args}>
        <SampleContent />
      </ResponsiveLayout>
    </Box>
  ),
};

export const RightSidebar: Story = {
  args: {
    spacing: 2,
    minContentWidth: 320,
    maxContentWidth: 1200,
    sidebarWidth: 280,
    showSidebar: true,
    sidebarPosition: 'right',
    sidebar: <SampleSidebar />,
  },
  render: (args) => (
    <Box sx={{ height: '100vh' }}>
      <ResponsiveLayout {...args}>
        <SampleContent />
      </ResponsiveLayout>
    </Box>
  ),
};

export const NoSidebar: Story = {
  args: {
    spacing: 2,
    minContentWidth: 320,
    maxContentWidth: 1200,
    showSidebar: false,
    sidebar: <SampleSidebar />,
  },
  render: (args) => (
    <Box sx={{ height: '100vh' }}>
      <ResponsiveLayout {...args}>
        <SampleContent />
      </ResponsiveLayout>
    </Box>
  ),
};

export const MobileResponsive: Story = {
  args: {
    spacing: 2,
    minContentWidth: 320,
    maxContentWidth: 1200,
    sidebarWidth: 280,
    showSidebar: true,
    sidebarPosition: 'left',
    sidebar: <SampleSidebar />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'The ResponsiveLayout component adapts to mobile screen sizes, adjusting the sidebar and content areas.',
      },
    },
  },
  render: (args) => (
    <Box sx={{ height: '100vh' }}>
      <ResponsiveLayout {...args}>
        <SampleContent />
      </ResponsiveLayout>
    </Box>
  ),
};

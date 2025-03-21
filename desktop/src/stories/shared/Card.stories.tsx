import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Icon, IconButton, Button, Stack, ThemeProvider, createTheme } from '@mui/material';
import Card from '../../components/shared/Card';

// Create a basic theme for testing
const theme = createTheme({
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

// Mock the transitions and elevation constants if not available in the test environment
if (typeof window !== 'undefined' && !window.TRANSITIONS) {
  window.TRANSITIONS = {
    fast: 'all 0.1s ease',
    medium: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  };
  
  window.ELEVATION = {
    low: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 3px 6px rgba(0,0,0,0.15)',
    high: '0 10px 20px rgba(0,0,0,0.18)',
  };
}

// Extend Window interface to include our mock globals
declare global {
  interface Window {
    TRANSITIONS?: {
      fast: string;
      medium: string;
      slow: string;
    };
    ELEVATION?: {
      low: string;
      medium: string;
      high: string;
    };
  }
}

// Define the metadata for the Card component stories
const meta: Meta<typeof Card> = {
  title: 'Shared/Card',
  component: Card,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    jest: {
      timeout: 60000 // Increase timeout to 60 seconds
    }
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    children: { control: 'text' },
    elevated: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    bordered: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    color: { 
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', undefined] 
    },
    onClick: { action: 'clicked' }
  }
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic examples
export const Default: Story = {
  args: {
    title: 'Card Title',
    children: <Typography>Card content goes here.</Typography>
  }
};

export const WithSubtitle: Story = {
  args: {
    title: 'Card With Subtitle',
    subtitle: 'Supporting information',
    children: <Typography>Card content with a subtitle.</Typography>
  }
};

export const WithIcon: Story = {
  args: {
    title: 'Card With Icon',
    icon: 'star',
    children: <Typography>Card with an icon in the header.</Typography>
  }
};

export const WithActions: Story = {
  args: {
    title: 'Card With Actions',
    children: <Typography>Card with action buttons at the bottom.</Typography>,
    actions: (
      <>
        <Button size="small" color="primary">Action</Button>
        <Button size="small" color="secondary">Cancel</Button>
      </>
    )
  }
};

export const WithHeaderActions: Story = {
  args: {
    title: 'Card With Header Actions',
    headerActions: (
      <>
        <IconButton size="small" aria-label="settings">
          <Icon>settings</Icon>
        </IconButton>
        <IconButton size="small" aria-label="more">
          <Icon>more_vert</Icon>
        </IconButton>
      </>
    ),
    children: <Typography>Card with actions in the header.</Typography>
  }
};

// Styling examples
export const ElevatedHoverable: Story = {
  args: {
    title: 'Elevated & Hoverable Card',
    elevated: true,
    hoverable: true,
    children: <Typography>This card is elevated and has hover effects.</Typography>
  }
};

export const Bordered: Story = {
  args: {
    title: 'Bordered Card',
    bordered: true,
    children: <Typography>This card has a border instead of elevation.</Typography>
  }
};

export const Colored: Story = {
  args: {
    title: 'Colored Card',
    color: 'primary',
    children: <Typography>This card has a background color.</Typography>
  }
};

// States
export const Disabled: Story = {
  args: {
    title: 'Disabled Card',
    disabled: true,
    children: <Typography>This card is disabled and cannot be interacted with.</Typography>
  }
};

export const Loading: Story = {
  args: {
    title: 'Loading Card',
    loading: true,
    children: <Typography>The content is hidden while loading.</Typography>
  }
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    hoverable: true,
    children: <Typography>Click this card to trigger the onClick handler.</Typography>,
    onClick: () => console.log('Card clicked')
  }
};

// Complex example
export const ComplexExample: Story = {
  render: () => (
    <Card 
      title="Feature Overview" 
      subtitle="All available options in one card"
      icon="info"
      elevated={true}
      hoverable={true}
      headerActions={
        <IconButton size="small" aria-label="close">
          <Icon>close</Icon>
        </IconButton>
      }
      actions={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="text">Cancel</Button>
          <Button size="small" variant="contained">Submit</Button>
        </Stack>
      }
    >
      <Box sx={{ p: 1 }}>
        <Typography variant="body1" paragraph>
          This is a complex card example that showcases multiple features:
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Custom title and subtitle</li>
          <li>Icon in the header</li>
          <li>Header actions</li>
          <li>Footer actions</li>
          <li>Elevation and hover effects</li>
        </Typography>
      </Box>
    </Card>
  )
}; 
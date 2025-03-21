import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack, Box, IconButton, ButtonGroup, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Button stories
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component provides users with a way to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.',
      },
    },
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'The variant of the button',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'The color of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take up the full width of its container',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    href: {
      control: 'text',
      description: 'The URL to link to when the button is clicked',
    },
    startIcon: {
      description: 'Element placed before the children',
    },
    endIcon: {
      description: 'Element placed after the children',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button comes in three variants: contained (default), outlined, and text.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </Stack>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button can be displayed with different semantic colors.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant="contained" color="primary">Primary</Button>
      <Button variant="contained" color="secondary">Secondary</Button>
      <Button variant="contained" color="success">Success</Button>
      <Button variant="contained" color="error">Error</Button>
      <Button variant="contained" color="info">Info</Button>
      <Button variant="contained" color="warning">Warning</Button>
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button can be sized using the size prop.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" size="small">Small</Button>
      <Button variant="contained" size="medium">Medium</Button>
      <Button variant="contained" size="large">Large</Button>
    </Stack>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button can include icons before or after the label.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" startIcon={<SendIcon />}>Send</Button>
      <Button variant="contained" endIcon={<DownloadIcon />}>Download</Button>
      <Button variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
    </Stack>
  ),
};

export const IconButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icon buttons are commonly found in app bars and toolbars.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2}>
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="add" color="primary">
        <AddIcon />
      </IconButton>
      <IconButton aria-label="download" color="secondary">
        <DownloadIcon />
      </IconButton>
      <IconButton aria-label="send" color="success" size="small">
        <SendIcon />
      </IconButton>
      <IconButton aria-label="send" color="error" size="large">
        <SendIcon />
      </IconButton>
    </Stack>
  ),
};

export const ButtonGroups: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be grouped to show related actions.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="outlined" color="secondary" aria-label="outlined secondary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="text" color="info" aria-label="text button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="contained"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Stack>
  ),
};

export const LoadingButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons can display a loading state, typically after a user has triggered an action.',
      },
    },
  },
  render: () => {
    const LoadingButtonExample = () => {
      const [loading, setLoading] = useState(false);

      const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };

      return (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleClick}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <span>Loading...</span>
              </Stack>
            ) : (
              'Click to Load'
            )}
          </Button>

          <Button
            variant="outlined"
            disabled={loading}
            onClick={handleClick}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </Stack>
      );
    };

    return <LoadingButtonExample />;
  },
};

export const DisabledButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be disabled to prevent user interaction.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" disabled>Contained</Button>
      <Button variant="outlined" disabled>Outlined</Button>
      <Button variant="text" disabled>Text</Button>
    </Stack>
  ),
};

export const FullWidthButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Full width buttons can be useful in forms or mobile views.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Button variant="contained" fullWidth>
        Full Width Button
      </Button>
    </Box>
  ),
};

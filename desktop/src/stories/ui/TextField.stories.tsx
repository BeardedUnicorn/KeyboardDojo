import AccountCircle from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, Box, Stack, InputAdornment } from '@mui/material';
import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the TextField stories
const meta = {
  title: 'UI/Input/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TextField is a form control component that allows users to enter text input.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant of the TextField',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the TextField',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the TextField',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the TextField should take up the full width of its container',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the TextField is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show the TextField in an error state',
    },
    multiline: {
      control: 'boolean',
      description: 'Whether the TextField is multiline',
    },
    required: {
      control: 'boolean',
      description: 'Whether the TextField is required',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: 'Text Field',
    placeholder: 'Enter text here',
    variant: 'outlined',
  },
  render: (args) => <TextField {...args} />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField comes in three variants: outlined (default), filled, and standard.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField label="Outlined" variant="outlined" />
      <TextField label="Filled" variant="filled" />
      <TextField label="Standard" variant="standard" />
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField comes in two sizes: medium (default) and small.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField label="Medium (default)" size="medium" />
      <TextField label="Small" size="small" />
    </Stack>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField can be displayed in different colors.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField label="Primary" color="primary" />
      <TextField label="Secondary" color="secondary" />
      <TextField label="Error" color="error" />
      <TextField label="Warning" color="warning" />
      <TextField label="Info" color="info" />
      <TextField label="Success" color="success" />
    </Stack>
  ),
};

export const ValidationStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField can show different validation states.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField 
        label="Default" 
      />
      <TextField 
        label="Required" 
        required 
      />
      <TextField 
        label="Error" 
        error 
        helperText="This field has an error"
      />
      <TextField 
        label="Disabled" 
        disabled 
        defaultValue="Disabled text field"
      />
      <TextField 
        label="Read Only" 
        defaultValue="Read-only text field" 
        InputProps={{ readOnly: true }}
      />
    </Stack>
  ),
};

export const WithAdornments: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField can include adornments (icons, text) at the start or end of the input.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField
        label="With Start Adornment"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="With End Adornment"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="With Text Adornment"
        InputProps={{
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        }}
      />
      <TextField
        label="Password"
        type="password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityOffIcon />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  ),
};

export const MultilineTextFields: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField can be multiline for longer text input.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <TextField
        label="Multiline"
        multiline
        rows={4}
        placeholder="Enter multiple lines of text"
      />
      <TextField
        label="Multiline with Max Rows"
        multiline
        maxRows={4}
        placeholder="This field will grow up to 4 rows"
      />
    </Stack>
  ),
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TextField can take up the full width of its container.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Full Width TextField"
        placeholder="This TextField takes up the full width of its container"
        fullWidth
      />
    </Box>
  ),
};

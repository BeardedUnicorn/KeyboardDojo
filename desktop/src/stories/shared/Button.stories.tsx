import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Divider, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Button } from '../../components/shared/Button';
import type { ButtonProps } from '../../components/shared/Button';

// Define a more flexible story type that doesn't require args
type FlexibleStory = StoryObj<typeof Button>;

const meta = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An enhanced button component built on top of MUI Button with additional functionality for loading, success, and error states.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: 'Text content of the button' },
    color: { 
      control: 'select', 
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'Color from theme palette'
    },
    variant: {
      control: 'select',
      options: ['text', 'outlined', 'contained'],
      description: 'The button variant'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The button size'
    },
    disabled: { control: 'boolean', description: 'Whether the button is disabled' },
    disabledTooltip: { control: 'text', description: 'Tooltip text to show when disabled' },
    loading: { control: 'boolean', description: 'Whether the button is in loading state' },
    loadingText: { control: 'text', description: 'Text to show when in loading state' },
    success: { control: 'boolean', description: 'Whether to show the success state' },
    error: { control: 'boolean', description: 'Whether to show the error state' },
    showSpinner: { control: 'boolean', description: 'Whether to show a loading spinner' },
    maintainWidth: { control: 'boolean', description: 'Whether to maintain width during loading state' }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary'
  }
};

// Text buttons
export const TextButtons: FlexibleStory = {
  args: {},
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="text" color="primary">Primary</Button>
      <Button variant="text" color="secondary">Secondary</Button>
      <Button variant="text" color="error">Error</Button>
      <Button variant="text" disabled>Disabled</Button>
    </Stack>
  )
};

// Outlined buttons
export const OutlinedButtons: FlexibleStory = {
  args: {},
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" color="primary">Primary</Button>
      <Button variant="outlined" color="secondary">Secondary</Button>
      <Button variant="outlined" color="error">Error</Button>
      <Button variant="outlined" disabled>Disabled</Button>
    </Stack>
  )
};

// Contained buttons
export const ContainedButtons: FlexibleStory = {
  args: {},
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="primary">Primary</Button>
      <Button variant="contained" color="secondary">Secondary</Button>
      <Button variant="contained" color="error">Error</Button>
      <Button variant="contained" disabled>Disabled</Button>
    </Stack>
  )
};

// Button sizes
export const Sizes: FlexibleStory = {
  args: {},
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button size="small" variant="contained">Small</Button>
        <Button size="medium" variant="contained">Medium</Button>
        <Button size="large" variant="contained">Large</Button>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2}>
        <Button size="small" variant="outlined">Small</Button>
        <Button size="medium" variant="outlined">Medium</Button>
        <Button size="large" variant="outlined">Large</Button>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2}>
        <Button size="small" variant="text">Small</Button>
        <Button size="medium" variant="text">Medium</Button>
        <Button size="large" variant="text">Large</Button>
      </Stack>
    </Stack>
  )
};

// Buttons with icons
export const WithIcons: FlexibleStory = {
  args: {},
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<SaveIcon />}>Save</Button>
        <Button variant="contained" endIcon={<SendIcon />}>Send</Button>
        <Button variant="contained" color="error" startIcon={<DeleteIcon />}>Delete</Button>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" startIcon={<SaveIcon />}>Save</Button>
        <Button variant="outlined" endIcon={<SendIcon />}>Send</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
      </Stack>
    </Stack>
  )
};

// Loading state
export const Loading: Story = {
  args: {
    children: 'Submit',
    variant: 'contained',
    loading: true,
    loadingText: 'Submitting...',
    maintainWidth: true
  }
};

// Loading variations
export const LoadingVariations: FlexibleStory = {
  args: {},
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" loading>Loading</Button>
        <Button variant="contained" loading loadingText="Processing...">Submit</Button>
        <Button variant="contained" loading showSpinner={false} loadingText="Please wait...">Submit</Button>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" loading>Loading</Button>
        <Button variant="outlined" loading loadingText="Saving...">Save</Button>
      </Stack>
    </Stack>
  )
};

// Success state
export const Success: Story = {
  args: {
    children: 'Submit',
    variant: 'contained',
    success: true
  }
};

// Error state
export const Error: Story = {
  args: {
    children: 'Submit',
    variant: 'contained',
    error: true
  }
};

// With disabled tooltip
export const DisabledWithTooltip: Story = {
  args: {
    children: 'Submit Form',
    variant: 'contained',
    disabled: true,
    disabledTooltip: 'You need to fill all required fields first'
  }
};

// All states demonstration
export const AllStates: FlexibleStory = {
  args: {},
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>Normal States</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Default</Button>
          <Button variant="contained" disabled>Disabled</Button>
          <Button variant="contained" disabled disabledTooltip="Disabled with tooltip">Disabled + Tooltip</Button>
        </Stack>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>Loading States</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" loading>Loading</Button>
          <Button variant="contained" loading loadingText="Processing...">With Text</Button>
          <Button variant="contained" loading showSpinner={false} loadingText="Text Only">No Spinner</Button>
        </Stack>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>Feedback States</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" success>Success</Button>
          <Button variant="contained" error>Error</Button>
        </Stack>
      </Box>
    </Stack>
  )
};

// Icon-only buttons
export const IconButtons: FlexibleStory = {
  args: {},
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="primary" startIcon={<AddIcon />}>{''}Add</Button>
      <Button variant="contained" color="secondary" startIcon={<SaveIcon />}>{''}Save</Button>
      <Button variant="outlined" color="primary" startIcon={<AddIcon />}>{''}Add</Button>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>{''}Delete</Button>
    </Stack>
  )
};

// Usage documentation
export const UsageDocumentation: FlexibleStory = {
  args: {},
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the Button Component

The \`Button\` component extends Material UI's Button with additional functionality such as loading states, success/error feedback, and disabled tooltips.

#### Basic Usage

\`\`\`jsx
import { Button } from '../components/shared/Button';

function ButtonExample() {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Click Me
    </Button>
  );
}
\`\`\`

#### Loading State

\`\`\`jsx
import { Button } from '../components/shared/Button';
import { useState } from 'react';

function LoadingButtonExample() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await saveData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  return (
    <Button
      variant="contained"
      color="primary"
      loading={loading}
      loadingText="Saving..."
      onClick={handleClick}
    >
      Save Data
    </Button>
  );
}
\`\`\`

#### Success and Error States

\`\`\`jsx
import { Button } from '../components/shared/Button';
import { useState } from 'react';

function FeedbackButtonExample() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  
  const handleClick = async () => {
    setStatus('loading');
    try {
      await submitForm();
      setStatus('success');
      // Reset to idle after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      // Reset to idle after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    }
  };
  
  return (
    <Button
      variant="contained"
      color="primary"
      loading={status === 'loading'}
      success={status === 'success'}
      error={status === 'error'}
      onClick={handleClick}
    >
      Submit Form
    </Button>
  );
}
\`\`\`

#### Disabled with Tooltip

\`\`\`jsx
<Button
  variant="contained"
  disabled={!isFormValid}
  disabledTooltip="Please fill all required fields"
  onClick={handleSubmit}
>
  Submit
</Button>
\`\`\`
`
      }
    }
  },
  render: () => null
}; 
import React from 'react';
import {
  Alert,
  AlertTitle,
  Stack,
  Button,
  IconButton,
  Box,
  Collapse,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Alert stories
const meta = {
  title: 'UI/Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Alerts are used to display short, important messages that attract the user\'s attention without interrupting their task.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: { type: 'select', options: ['success', 'info', 'warning', 'error'] },
      description: 'The severity of the alert',
    },
    variant: {
      control: { type: 'select', options: ['standard', 'filled', 'outlined'] },
      description: 'The variant to use',
    },
    color: {
      control: { type: 'select', options: ['success', 'info', 'warning', 'error'] },
      description: 'The color of the component',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when the component requests to be closed',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    severity: 'info',
    children: 'This is an informational alert',
  },
};

export const Severities: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts come in four severity levels: success, info, warning, and error.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert severity="success">This is a success alert — check it out!</Alert>
      <Alert severity="info">This is an info alert — check it out!</Alert>
      <Alert severity="warning">This is a warning alert — check it out!</Alert>
      <Alert severity="error">This is an error alert — check it out!</Alert>
    </Stack>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts come in three variants: standard (default), filled, and outlined.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert severity="info" variant="standard">
        This is a standard info alert
      </Alert>
      <Alert severity="info" variant="filled">
        This is a filled info alert
      </Alert>
      <Alert severity="info" variant="outlined">
        This is an outlined info alert
      </Alert>
    </Stack>
  ),
};

export const WithTitle: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can include a title to emphasize the message.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Your profile has been updated successfully.
      </Alert>
      <Alert severity="info">
        <AlertTitle>Information</AlertTitle>
        A new version of the application is available.
      </Alert>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        Your subscription will expire in 10 days.
      </Alert>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        There was a problem processing your request.
      </Alert>
    </Stack>
  ),
};

export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can include actions, like a close button or other action buttons.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        The item has been deleted.
      </Alert>

      <Alert
        severity="info"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              alert('Close button clicked');
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        This is an information message.
      </Alert>

      <Alert
        severity="success"
        action={
          <Stack direction="row" spacing={1}>
            <Button color="inherit" size="small">
              VIEW
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                alert('Close button clicked');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        }
      >
        <AlertTitle>Success</AlertTitle>
        Your file has been uploaded successfully.
      </Alert>
    </Stack>
  ),
};

export const CustomIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can use custom icons or have the icon disabled.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        This is a success alert with a custom icon.
      </Alert>

      <Alert icon={<InfoIcon fontSize="inherit" />} severity="info">
        This is an info alert with a custom icon.
      </Alert>

      <Alert icon={false} severity="warning">
        This is a warning alert with no icon.
      </Alert>

      <Alert icon={<ErrorIcon fontSize="inherit" color="error" />} severity="error">
        This is an error alert with a custom icon.
      </Alert>
    </Stack>
  ),
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can include longer descriptions for more detailed information.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert severity="info">
        <AlertTitle>Browser Update</AlertTitle>
        A new version of your browser is available.
        <Typography variant="body2" sx={{ mt: 1 }}>
          Updating your browser ensures you have the latest security features and improvements.
          We recommend updating at your earliest convenience.
        </Typography>
      </Alert>

      <Alert severity="warning">
        <AlertTitle>Account Security</AlertTitle>
        Your password was last changed 6 months ago.
        <Typography variant="body2" sx={{ mt: 1 }}>
          For better security, we recommend changing your password every 3 months.
          Go to settings to update your password now.
        </Typography>
      </Alert>
    </Stack>
  ),
};

export const Dismissible: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can be dismissible by including a close button and using the Collapse component for animation.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = React.useState(true);

    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Collapse in={open}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <AlertTitle>Important Notice</AlertTitle>
            This alert will disappear when closed.
          </Alert>
        </Collapse>

        {!open && (
          <Button
            onClick={() => {
              setOpen(true);
            }}
            variant="outlined"
          >
            Show Alert Again
          </Button>
        )}
      </Box>
    );
  },
};

export const OutlinedWithBorderColor: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Outlined alerts can have custom border colors.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert
        variant="outlined"
        severity="success"
        sx={{
          borderColor: 'success.main',
          borderWidth: 2,
        }}
      >
        <AlertTitle>Success</AlertTitle>
        This alert has a custom border color and width.
      </Alert>

      <Alert
        variant="outlined"
        severity="info"
        sx={{
          borderColor: 'info.main',
          borderWidth: 2,
          borderRadius: 4,
        }}
      >
        <AlertTitle>Information</AlertTitle>
        This alert has custom border radius too.
      </Alert>
    </Stack>
  ),
};

export const CustomStyledAlert: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alerts can have completely custom styles.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Alert
        severity="success"
        sx={{
          backgroundColor: 'success.light',
          color: 'success.dark',
          '& .MuiAlert-icon': {
            color: 'success.dark',
          },
          borderLeft: 5,
          borderColor: 'success.dark',
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Successfully Saved</AlertTitle>
        Your changes have been saved successfully.
      </Alert>

      <Alert
        severity="error"
        variant="filled"
        sx={{
          backgroundImage: 'linear-gradient(to right, #f44336, #e57373)',
          borderRadius: 2,
          boxShadow: 3,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Critical Error</AlertTitle>
        Your connection was lost. Please check your internet.
      </Alert>
    </Stack>
  ),
};

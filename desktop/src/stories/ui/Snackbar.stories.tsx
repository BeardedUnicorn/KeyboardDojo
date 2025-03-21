import React, { useState } from 'react';
import {
  Snackbar,
  Button,
  IconButton,
  Alert,
  AlertTitle,
  Stack,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Slide,
  Grow,
  Fade,
  Zoom,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import type { Meta, StoryObj } from '@storybook/react';

// Define slide transition component
const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="up" />;
};

// Define metadata for the Snackbar stories
const meta = {
  title: 'UI/Feedback/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Snackbars provide brief messages about app processes at the bottom of the screen.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, the component is shown',
    },
    autoHideDuration: {
      control: { type: 'number', min: 1000, max: 10000, step: 1000 },
      description: 'The number of milliseconds to wait before automatically calling the onClose function',
    },
    message: {
      control: 'text',
      description: 'The message to display',
    },
    anchorOrigin: {
      control: 'object',
      description: 'The anchor of the Snackbar',
    },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={handleClick} variant="contained">
          Open Snackbar
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="This is a simple snackbar message"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    );
  },
};

export const WithAlert: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Snackbars can contain alerts for different message types.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={handleClick} variant="contained">
          Open Alert Snackbar
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Operation completed successfully!
          </Alert>
        </Snackbar>
      </div>
    );
  },
};

export const DifferentPositions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Snackbars can be positioned in different corners of the screen.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<{
      vertical: 'top' | 'bottom';
      horizontal: 'left' | 'center' | 'right';
    }>({
      vertical: 'bottom',
      horizontal: 'left',
    });

    const handleClick = (newPosition: typeof position) => {
      setPosition(newPosition);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="subtitle1" gutterBottom>
          Choose Position:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'top',
              horizontal: 'left',
            })}
          >
            Top-Left
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'top',
              horizontal: 'center',
            })}
          >
            Top-Center
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'top',
              horizontal: 'right',
            })}
          >
            Top-Right
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'bottom',
              horizontal: 'left',
            })}
          >
            Bottom-Left
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'bottom',
              horizontal: 'center',
            })}
          >
            Bottom-Center
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClick({
              vertical: 'bottom',
              horizontal: 'right',
            })}
          >
            Bottom-Right
          </Button>
        </Stack>
        <Snackbar
          anchorOrigin={{ vertical: position.vertical, horizontal: position.horizontal }}
          open={open}
          onClose={handleClose}
          message="Position Demo"
          key={position.vertical + position.horizontal}
          autoHideDuration={3000}
        />
      </Box>
    );
  },
};

export const TransitionVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Snackbars can use different transitions when appearing and disappearing.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState<React.ComponentType<TransitionProps> | undefined>(undefined);

    const handleClick = (Transition: React.ComponentType<TransitionProps>) => {
      setTransition(() => Transition);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="subtitle1" gutterBottom>
          Choose Transition:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={() => handleClick(Slide)}>
            Slide
          </Button>
          <Button variant="outlined" onClick={() => handleClick(Grow)}>
            Grow
          </Button>
          <Button variant="outlined" onClick={() => handleClick(Fade)}>
            Fade
          </Button>
          <Button variant="outlined" onClick={() => handleClick(Zoom)}>
            Zoom
          </Button>
        </Stack>
        <Snackbar
          open={open}
          onClose={handleClose}
          TransitionComponent={transition}
          message="Transition Demo"
          key={transition ? transition.name : ''}
          autoHideDuration={3000}
        />
      </Box>
    );
  },
};

export const SnackbarWithAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Snackbars can include actions that allow users to respond.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [undo, setUndo] = useState(false);

    const handleClick = () => {
      setOpen(true);
      setUndo(false);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const handleUndo = () => {
      setUndo(true);
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={handleClick} variant="contained" color="error">
          Delete Item
        </Button>
        {undo && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Action was undone!
          </Typography>
        )}
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Item deleted"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={handleUndo}>
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  },
};

export const ConsecutiveSnackbars: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When multiple snackbars are needed, they should be displayed one at a time.',
      },
    },
  },
  render: () => {
    const [snackPack, setSnackPack] = useState<{ message: string; key: number }[]>([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<{ message: string; key: number } | undefined>(undefined);

    const handleClick = (message: string) => {
      setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    React.useEffect(() => {
      if (snackPack.length && !messageInfo) {
        // Set a new snack when we don't have an active one
        setMessageInfo({ ...snackPack[0] });
        setSnackPack((prev) => prev.slice(1));
        setOpen(true);
      } else if (snackPack.length && messageInfo && open) {
        // Close an active snack when a new one is added
        setOpen(false);
      }
    }, [snackPack, messageInfo, open]);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const handleExited = () => {
      setMessageInfo(undefined);
    };

    return (
      <div>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" color="success" onClick={() => handleClick('Successfully saved!')}>
            Success Message
          </Button>
          <Button variant="contained" color="info" onClick={() => handleClick('New message received')}>
            Info Message
          </Button>
          <Button variant="contained" color="warning" onClick={() => handleClick('Warning: Connection unstable')}>
            Warning Message
          </Button>
        </Box>
        <Snackbar
          key={messageInfo ? messageInfo.key : undefined}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          message={messageInfo ? messageInfo.message : undefined}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    );
  },
};

export const CustomSnackbar: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Snackbars can be fully customized with rich content.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={handleClick} variant="contained">
          Show Custom Snackbar
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{
              width: '100%',
              boxShadow: 4,
              alignItems: 'flex-start',
            }}
          >
            <AlertTitle>Payment Successful</AlertTitle>
            <Typography variant="body2" sx={{ mt: 0.5, mb: 1 }}>
              Your transaction of $49.99 was completed successfully.
              A receipt has been sent to your email.
            </Typography>
            <Button
              size="small"
              variant="text"
              sx={{
                color: 'inherit',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => {
                handleClose();
                alert('View Receipt clicked');
              }}
            >
              View Receipt
            </Button>
          </Alert>
        </Snackbar>
      </div>
    );
  },
};

export const CustomizableSnackbar: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This interactive example lets you customize the snackbar properties.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('This is a customizable snackbar');
    const [duration, setDuration] = useState(5000);
    const [vertical, setVertical] = useState<'top' | 'bottom'>('bottom');
    const [horizontal, setHorizontal] = useState<'left' | 'center' | 'right'>('center');
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error' | ''>('');

    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Snackbar Customizer
        </Typography>

        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          variant="outlined"
        />

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Vertical Position</FormLabel>
          <RadioGroup
            row
            value={vertical}
            onChange={(e) => setVertical(e.target.value as 'top' | 'bottom')}
          >
            <FormControlLabel value="top" control={<Radio />} label="Top" />
            <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Horizontal Position</FormLabel>
          <RadioGroup
            row
            value={horizontal}
            onChange={(e) => setHorizontal(e.target.value as 'left' | 'center' | 'right')}
          >
            <FormControlLabel value="left" control={<Radio />} label="Left" />
            <FormControlLabel value="center" control={<Radio />} label="Center" />
            <FormControlLabel value="right" control={<Radio />} label="Right" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Alert Type</FormLabel>
          <RadioGroup
            row
            value={severity}
            onChange={(e) => setSeverity(e.target.value as 'success' | 'info' | 'warning' | 'error' | '')}
          >
            <FormControlLabel value="" control={<Radio />} label="None" />
            <FormControlLabel value="success" control={<Radio />} label="Success" />
            <FormControlLabel value="info" control={<Radio />} label="Info" />
            <FormControlLabel value="warning" control={<Radio />} label="Warning" />
            <FormControlLabel value="error" control={<Radio />} label="Error" />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Duration (ms)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          inputProps={{ min: 1000, step: 1000 }}
          margin="normal"
          variant="outlined"
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleClick}
          sx={{ mt: 3 }}
          fullWidth
        >
          Show Snackbar
        </Button>

        {severity ? (
          <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical, horizontal }}
          >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        ) : (
          <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            message={message}
            anchorOrigin={{ vertical, horizontal }}
          />
        )}
      </Box>
    );
  },
};

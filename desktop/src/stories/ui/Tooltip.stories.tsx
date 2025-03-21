import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  ClickAwayListener,
  Fab,
  Zoom,
  Fade,
  Stack,
  Divider,
  TextField,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Define metadata for the Tooltip component stories
const meta = {
  title: 'UI/Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltips display informative text when users hover over, focus on, or tap an element.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The tooltip content',
    },
    placement: {
      control: 'select',
      options: [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
      ],
      description: 'The placement of the tooltip',
    },
    arrow: {
      control: 'boolean',
      description: 'If true, the tooltip will show an arrow pointing to the element',
    },
    followCursor: {
      control: 'boolean',
      description: 'If true, the tooltip will follow the cursor',
    },
    enterDelay: {
      control: 'number',
      description: 'The delay in milliseconds before the tooltip is shown',
    },
    leaveDelay: {
      control: 'number',
      description: 'The delay in milliseconds before the tooltip is hidden',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Basic story for Tooltip
export const Default: Story = {
  args: {
    title: 'This is a tooltip',
    children: <Button>Hover me</Button>,
    arrow: true,
  },
};

// Tooltip Placements
export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be positioned in 12 different ways around the target element.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: 500, height: 400 }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <Grid item xs={12} container justifyContent="center" spacing={1}>
          {['top-start', 'top', 'top-end'].map((placement) => (
            <Grid item key={placement}>
              <Tooltip title={placement} placement={placement as any} arrow>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                  {placement}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={2} container direction="column" spacing={1}>
          {['left-start', 'left', 'left-end'].map((placement) => (
            <Grid item key={placement}>
              <Tooltip title={placement} placement={placement as any} arrow>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                  {placement}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={8} />

        <Grid item xs={2} container direction="column" spacing={1} alignItems="flex-end">
          {['right-start', 'right', 'right-end'].map((placement) => (
            <Grid item key={placement}>
              <Tooltip title={placement} placement={placement as any} arrow>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                  {placement}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} container justifyContent="center" spacing={1}>
          {['bottom-start', 'bottom', 'bottom-end'].map((placement) => (
            <Grid item key={placement}>
              <Tooltip title={placement} placement={placement as any} arrow>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                  {placement}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  ),
};

// Tooltip with Arrow
export const WithArrow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can display an arrow pointing to the target element to better indicate the relation.',
      },
    },
  },
  render: () => (
    <Stack direction="row" spacing={2}>
      <Tooltip title="Without arrow">
        <Button variant="contained">No Arrow</Button>
      </Tooltip>
      <Tooltip title="With arrow" arrow>
        <Button variant="contained">With Arrow</Button>
      </Tooltip>
    </Stack>
  ),
};

// Tooltip Following Cursor
export const FollowCursor: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can follow the cursor to provide contextual information as users move over the element.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <Tooltip title="I stay in place" arrow>
        <Button variant="outlined" fullWidth>
          Normal Tooltip
        </Button>
      </Tooltip>

      <Tooltip title="I follow your cursor" arrow followCursor>
        <Button variant="outlined" fullWidth>
          Follow Cursor
        </Button>
      </Tooltip>

      <Tooltip
        title="I follow cursor horizontally"
        arrow
        followCursor
        componentsProps={{
          popper: {
            modifiers: [
              {
                name: 'followCursor',
                options: {
                  lockAxis: 'x',
                },
              },
            ],
          },
        }}
      >
        <Button variant="outlined" fullWidth>
          Follow Horizontally
        </Button>
      </Tooltip>
    </Stack>
  ),
};

// Interactive Tooltip
export const InteractiveTooltip: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be interactive, allowing users to interact with their content without closing them.',
      },
    },
  },
  render: function InteractiveTooltipStory() {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };

    const handleTooltipOpen = () => {
      setOpen(true);
    };

    return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Box>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Interactive Tooltip</Typography>
                <Typography variant="body2">This tooltip has interactive content.</Typography>
                <Box sx={{ mt: 1 }}>
                  <Link href="#" onClick={(e) => e.preventDefault()}>Learn more</Link>
                </Box>
              </Box>
            }
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            arrow
            placement="top"
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            describeChild
            slotProps={{
              popper: {
                sx: {
                  pointerEvents: 'auto',
                },
              },
            }}
          >
            <Button
              variant="contained"
              onClick={handleTooltipOpen}
              size="small"
            >
              Click me
            </Button>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  },
};

// Delayed Tooltips
export const DelayedTooltips: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be configured with custom enter and leave delays.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <Tooltip title="I appear immediately" arrow>
        <Button variant="outlined">No Delay</Button>
      </Tooltip>

      <Tooltip title="I wait 1 second before showing" arrow enterDelay={1000}>
        <Button variant="outlined">1s Enter Delay</Button>
      </Tooltip>

      <Tooltip title="I stay visible for 2 seconds after you leave" arrow leaveDelay={2000}>
        <Button variant="outlined">2s Leave Delay</Button>
      </Tooltip>
    </Stack>
  ),
};

// Transitions
export const TooltipTransitions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can use different transition effects when showing and hiding.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} direction="row">
      <Tooltip title="Default fade transition" arrow>
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Zoom transition"
        arrow
        TransitionComponent={Zoom}
      >
        <IconButton>
          <HelpIcon />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Custom fade transition (slow)"
        arrow
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 800 }}
      >
        <IconButton>
          <WarningIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  ),
};

// Tooltips with Custom Styling
export const CustomStyledTooltips: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be styled with custom colors, borders, and other properties using the sx prop.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} direction="row">
      <Tooltip
        title="Primary color tooltip"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'primary.main',
              '& .MuiTooltip-arrow': {
                color: 'primary.main',
              },
              boxShadow: 2,
            },
          },
        }}
      >
        <Button variant="contained">Primary</Button>
      </Tooltip>

      <Tooltip
        title="Custom styling tooltip"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
              borderRadius: 1,
              p: 1,
              '& .MuiTooltip-arrow': {
                color: 'background.paper',
              },
            },
          },
        }}
      >
        <Button variant="outlined">Custom Style</Button>
      </Tooltip>

      <Tooltip
        title="Error themed tooltip"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'error.main',
              '& .MuiTooltip-arrow': {
                color: 'error.main',
              },
            },
          },
        }}
      >
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  ),
};

// Rich Content Tooltip
export const RichContentTooltip: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can contain rich content with custom formatting and multiple elements.',
      },
    },
  },
  render: () => (
    <Tooltip
      title={
        <Box sx={{ p: 1, maxWidth: 220 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Rich Content Tooltip
          </Typography>

          <Typography variant="body2" paragraph>
            This tooltip contains rich content with multiple elements.
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="caption">
              Additional information can be displayed here.
            </Typography>
          </Box>

          <Button size="small" variant="outlined" fullWidth>
            Action Button
          </Button>
        </Box>
      }
      arrow
      placement="right"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 3,
            borderRadius: 1,
            p: 0,
            '& .MuiTooltip-arrow': {
              color: 'background.paper',
            },
          },
        },
      }}
    >
      <Fab color="primary" size="medium">
        <InfoIcon />
      </Fab>
    </Tooltip>
  ),
};

// Tooltips with Various Elements
export const TooltipsWithVariousElements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be applied to various UI elements like text fields, icons, links, and more.',
      },
    },
  },
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Tooltip title="Enter your full name" placement="right" arrow>
        <TextField label="Name" size="small" fullWidth />
      </Tooltip>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 1 }}>Status:</Typography>
        <Tooltip title="System is running normally" arrow>
          <Box sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'success.main',
            display: 'inline-block',
          }} />
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="body2">
          Learn more about our{' '}
          <Tooltip title="View our terms and conditions" arrow>
            <Link href="#" onClick={(e) => e.preventDefault()}>
              terms of service
            </Link>
          </Tooltip>
          {' '}and{' '}
          <Tooltip title="View our privacy policy" arrow>
            <Link href="#" onClick={(e) => e.preventDefault()}>
              privacy policy
            </Link>
          </Tooltip>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip title="Edit item" arrow>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add new item" arrow>
          <IconButton size="small" color="primary">
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete item" arrow>
          <IconButton size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  ),
};

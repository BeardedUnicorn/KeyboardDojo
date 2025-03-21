import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  IconButton,
  Slide,
  Divider,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

import type { Meta, StoryObj } from '@storybook/react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define metadata for the Dialog stories
const meta = {
  title: 'UI/Feedback/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dialogs inform users about a task and can require decisions, or involve multiple tasks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, the dialog is open',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If true, the dialog stretches to the maximum width',
    },
    maxWidth: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', false] },
      description: 'Determine the max-width of the dialog',
    },
    scroll: {
      control: { type: 'select', options: ['paper', 'body'] },
      description: 'Determine the container for scrolling the dialog',
    },
    fullScreen: {
      control: 'boolean',
      description: 'If true, the dialog will be full-screen',
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof Dialog>;

// Basic story components for dialog examples
const DialogControls = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => (
  <Stack direction="row" spacing={2}>
    <Button variant="contained" onClick={() => setOpen(true)}>
      Open Dialog
    </Button>
    {open && (
      <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
        Close Externally
      </Button>
    )}
  </Stack>
);

// Simple Alert Dialog Story
export const AlertDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alert dialogs are used to communicate important information that requires acknowledgment.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Open Alert Dialog
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Use Google's location service?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

// Confirmation Dialog Story
export const ConfirmationDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialogs require users to explicitly confirm their choice before an action proceeds.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleConfirm = () => {
      alert('Action confirmed!');
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" color="error" onClick={handleOpen} startIcon={<DeleteIcon />}>
          Delete Item
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

// Form Dialog Story
export const FormDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialogs can contain forms that require user input.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      alert('Form submitted!');
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Open Form Dialog
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe to Newsletter</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>
                To subscribe to our newsletter, please enter your email address here.
                We will send updates occasionally.
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="frequency-label">Email Frequency</InputLabel>
                <Select
                  labelId="frequency-label"
                  id="frequency"
                  label="Email Frequency"
                  defaultValue="weekly"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="I want to receive special offers"
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Subscribe</Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  },
};

// Full Screen Dialog Story
export const FullScreenDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Full-screen dialogs are used for complex tasks that require focused attention.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Open Full-Screen Dialog
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Create New Product
              </Typography>
              <Button color="primary" onClick={handleClose}>
                Save
              </Button>
            </Box>
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                id="product-name"
                label="Product Name"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="dense"
                id="product-description"
                label="Description"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Category"
                  defaultValue="electronics"
                >
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="home">Home & Kitchen</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="number"
                  margin="dense"
                  id="product-price"
                  label="Price"
                  variant="outlined"
                  InputProps={{ startAdornment: '$' }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  type="number"
                  margin="dense"
                  id="product-stock"
                  label="Stock"
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              </Box>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Product Images
              </Typography>
              <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, border: '2px dashed grey' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AddIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Click to upload or drag images here
                  </Typography>
                </Box>
              </Paper>

              <FormControlLabel
                control={<Switch />}
                label="Featured Product"
                sx={{ mb: 2 }}
              />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Availability
                </Typography>
                <RadioGroup defaultValue="inStock">
                  <FormControlLabel value="inStock" control={<Radio />} label="In Stock" />
                  <FormControlLabel value="preOrder" control={<Radio />} label="Pre-Order" />
                  <FormControlLabel value="outOfStock" control={<Radio />} label="Out of Stock" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </Dialog>
      </>
    );
  },
};

// Scrollable Dialog Story
export const ScrollableDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When dialog content is long, scrolling becomes necessary. You can choose whether the content container or the body scrolls.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState<'paper' | 'body'>('paper');

    const handleOpen = (scrollType: 'paper' | 'body') => {
      setScroll(scrollType);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);

    return (
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => handleOpen('paper')}>
          Scroll=Paper
        </Button>
        <Button variant="contained" onClick={() => handleOpen('body')}>
          Scroll=Body
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Terms and Conditions</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {Array.from(new Array(50)).map((_, index) => (
                <React.Fragment key={index}>
                  <Typography variant="body1" paragraph>
                    {`Section ${index + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus, bibendum sit amet vulputate eget, porta semper ligula. Donec bibendum vulputate erat, ac fringilla mi finibus nec. Donec ac dolor sed dolor porttitor blandit vel vel purus. Fusce vel malesuada velit. Cras gravida, mi a fringilla tincidunt, magna libero sodales sem, ac scelerisque metus libero eu justo.`}
                  </Typography>
                  {index < 49 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Accept</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  },
};

// Responsive Dialog
export const ResponsiveDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialogs can be responsive, becoming full-screen on mobile devices.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Typography variant="body2" gutterBottom>
          This dialog becomes full-screen on screens smaller than md (900px).
          Resize your browser window to see the behavior.
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Open Responsive Dialog
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Phone Ringtone
            {fullScreen && (
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please select the ringtone for your incoming calls.
            </DialogContentText>
            <RadioGroup
              aria-label="ringtone"
              name="ringtone"
              sx={{ mt: 2 }}
              defaultValue="default"
            >
              <FormControlLabel value="default" control={<Radio />} label="Default Ringtone" />
              <FormControlLabel value="chimes" control={<Radio />} label="Chimes" />
              <FormControlLabel value="waves" control={<Radio />} label="Waves" />
              <FormControlLabel value="forest" control={<Radio />} label="Forest Morning" />
              <FormControlLabel value="alarm" control={<Radio />} label="Alarm Clock" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleClose} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

// Customized Dialog
export const CustomizedDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialogs can be customized to match your design style.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Open Styled Dialog
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              width: '100%',
              maxWidth: 400,
              boxShadow: 10,
              backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
            },
          }}
        >
          <DialogTitle sx={{
            p: 3,
            color: 'primary.main',
            fontWeight: 'bold',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}>
            Premium Subscription
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText sx={{ mb: 3, color: 'text.primary' }}>
              Upgrade to Premium for exclusive features and priority support.
            </DialogContentText>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2, backgroundColor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">$9.99/month</Typography>
                <Typography variant="body2">Billed monthly, cancel anytime</Typography>
              </Paper>
              <Paper sx={{ p: 2, backgroundColor: 'secondary.light', color: 'secondary.contrastText', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">$99.99/year</Typography>
                <Typography variant="body2">Save 17% with annual billing</Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            justifyContent: 'space-between',
          }}>
            <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
              Maybe Later
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                borderRadius: 4,
                px: 3,
              }}
            >
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

// Selection Dialog
export const SelectionDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialogs can be used for making a selection from a list.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const users = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Carol Williams', email: 'carol@example.com' },
      { name: 'Dave Brown', email: 'dave@example.com' },
      { name: 'Eve Davis', email: 'eve@example.com' },
    ];

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleListItemClick = (value: string) => {
      setSelectedValue(value);
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={handleOpen} startIcon={<PersonIcon />}>
          Select User
        </Button>
        {selectedValue && (
          <Typography sx={{ mt: 2 }}>
            Selected: {selectedValue}
          </Typography>
        )}
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Select User</DialogTitle>
          <List sx={{ pt: 0 }}>
            {users.map((user) => (
              <ListItem
                sx={{ cursor: 'pointer' }}
                onClick={() => handleListItemClick(user.name)}
                key={user.email}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </>
    );
  },
};

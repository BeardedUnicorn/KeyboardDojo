import DraftsIcon from '@mui/icons-material/Drafts';
import FolderIcon from '@mui/icons-material/Folder';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WorkIcon from '@mui/icons-material/Work';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemAvatar,
  ListSubheader,
  Divider,
  Avatar,
  Checkbox,
  IconButton,
  Box,
  Switch,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the List stories
const meta = {
  title: 'UI/Data Display/List',
  component: List,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lists are continuous, vertical indexes of text or images. They are composed of items containing primary and supplemental actions, represented by icons and text.',
      },
    },
    jest: {
      timeout: 180000, // 3 minutes
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dense: {
      control: 'boolean',
      description: 'If true, compact vertical padding is used for the list and list items',
    },
    disablePadding: {
      control: 'boolean',
      description: 'If true, vertical padding is removed from the list',
    },
    subheader: {
      control: 'text',
      description: 'The content of the subheader, normally ListSubheader',
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <Paper sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        <ListItem>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Trash" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Spam" />
        </ListItem>
      </List>
    </Paper>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can include icons to help identify list items.',
      },
    },
  },
  render: () => (
    <Paper sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        <ListItem>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItem>
      </List>
    </Paper>
  ),
};

export const WithSecondaryText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can display primary and secondary text.',
      },
    },
  },
  render: () => (
    <Paper sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        <ListItem>
          <ListItemText
            primary="Project Meeting"
            secondary="Discuss the new features for the upcoming release"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Sprint Planning"
            secondary="Plan the tasks for the next two-week sprint"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Code Review"
            secondary="Review pull requests from the team members"
          />
        </ListItem>
      </List>
    </Paper>
  ),
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can be nested to create hierarchical structures.',
      },
    },
  },
  render: () => (
    <Paper sx={{ width: '100%', maxWidth: 360 }}>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Project Structure
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="src" />
        </ListItemButton>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="components" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 6 }}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="ui" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 8 }}>
            <ListItemText primary="Button.tsx" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 8 }}>
            <ListItemText primary="TextField.tsx" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 6 }}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="layout" />
          </ListItemButton>
        </List>
        <ListItemButton>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="public" />
        </ListItemButton>
      </List>
    </Paper>
  ),
};

export const Selectable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'List items can be selectable with checkboxes.',
      },
    },
  },
  render: () => {
    const CheckboxList = () => {
      const [checked, setChecked] = useState([0]);

      const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
      };

      return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {[0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem
                key={value}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`Task ${value + 1}`}
                    secondary={`This is a description for Task ${value + 1}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      );
    };

    return (
      <Paper>
        <CheckboxList />
      </Paper>
    );
  },
};

export const WithAvatars: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can include avatars to represent people or objects.',
      },
    },
  },
  render: () => (
    <Paper sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="John Smith" secondary="Software Engineer" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <WorkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Jane Brown" secondary="Product Manager" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Robert Johnson" secondary="UX Designer" />
        </ListItem>
      </List>
    </Paper>
  ),
};

export const WithSecondaryAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can have secondary actions, like buttons or toggles.',
      },
    },
  },
  render: () => {
    const SwitchList = () => {
      const [settings, setSettings] = useState({
        wifi: true,
        bluetooth: false,
        notifications: true,
        sound: false,
      });

      const handleToggle = (setting: keyof typeof settings) => () => {
        setSettings((prevSettings) => ({
          ...prevSettings,
          [setting]: !prevSettings[setting],
        }));
      };

      return (
        <List
          subheader={<ListSubheader>Settings</ListSubheader>}
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          <ListItem>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Wi-Fi" />
            <Switch
              edge="end"
              checked={settings.wifi}
              onChange={handleToggle('wifi')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Bluetooth" />
            <Switch
              edge="end"
              checked={settings.bluetooth}
              onChange={handleToggle('bluetooth')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <Switch
              edge="end"
              checked={settings.notifications}
              onChange={handleToggle('notifications')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Sound" />
            <Switch
              edge="end"
              checked={settings.sound}
              onChange={handleToggle('sound')}
            />
          </ListItem>
        </List>
      );
    };

    return (
      <Paper>
        <SwitchList />
      </Paper>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can be interactive, with items that can be selected and actions that can be performed.',
      },
    },
  },
  render: () => {
    const InteractiveList = () => {
      const [selectedIndex, setSelectedIndex] = useState(1);
      const [starred, setStarred] = useState([1, 2]);

      const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
      };

      const handleStarClick = (index: number) => (event: React.MouseEvent) => {
        event.stopPropagation();
        const currentIndex = starred.indexOf(index);
        const newStarred = [...starred];

        if (currentIndex === -1) {
          newStarred.push(index);
        } else {
          newStarred.splice(currentIndex, 1);
        }

        setStarred(newStarred);
      };

      return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <ListItemButton
              key={index}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>
                <IconButton edge="start" onClick={handleStarClick(index)}>
                  {starred.indexOf(index) !== -1 ? <StarIcon color="warning" /> : <StarBorderIcon />}
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={`Email Message ${index + 1}`}
                secondary={index % 2 === 0 ? 'Unread message' : 'Read message'}
              />
            </ListItemButton>
          ))}
        </List>
      );
    };

    return (
      <Paper>
        <InteractiveList />
      </Paper>
    );
  },
};

export const DenseVsDefault: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Lists can have different densities.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Default Density
        </Typography>
        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Inbox"
                secondary="This is with default density"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Drafts"
                secondary="This is with default density"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Dense
        </Typography>
        <Paper>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Inbox"
                secondary="This is with dense property"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Drafts"
                secondary="This is with dense property"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Stack>
  ),
};

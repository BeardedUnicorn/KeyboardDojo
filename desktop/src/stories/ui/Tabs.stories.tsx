import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Stack,
  Badge,
  Divider,
} from '@mui/material';
import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { SyntheticEvent } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

// Define metadata for the Tabs stories
const meta = {
  title: 'UI/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabs make it easy to explore and switch between different views.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the tabs',
    },
    variant: {
      control: 'select',
      options: ['standard', 'scrollable', 'fullWidth'],
      description: 'The variant to use',
    },
    textColor: {
      control: 'select',
      options: ['primary', 'secondary', 'inherit'],
      description: 'The color of the text',
    },
    indicatorColor: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'The color of the indicator',
    },
    centered: {
      control: 'boolean',
      description: 'If true, the tabs will be centered',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const BasicTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            Content for Item One. This is the default selected tab.
          </TabPanel>
          <TabPanel value={value} index={1}>
            Content for Item Two.
          </TabPanel>
          <TabPanel value={value} index={2}>
            Content for Item Three.
          </TabPanel>
        </Box>
      );
    };

    return <BasicTabs />;
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs come in different variants: standard, scrollable, and fullWidth.',
      },
    },
  },
  render: () => {
    const TabVariants = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 500 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Standard
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="standard"
                aria-label="standard tabs example"
              >
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Full Width
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Scrollable
            </Typography>
            <Paper sx={{ maxWidth: 320 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable tabs example"
              >
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
                <Tab label="Tab 4" />
                <Tab label="Tab 5" />
                <Tab label="Tab 6" />
              </Tabs>
            </Paper>
          </Box>
        </Stack>
      );
    };

    return <TabVariants />;
  },
};

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs can be oriented horizontally or vertically.',
      },
    },
  },
  render: () => {
    const OrientationTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Horizontal (default)
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                orientation="horizontal"
                aria-label="horizontal tabs example"
              >
                <Tab label="Tab 1" {...a11yProps(0)} />
                <Tab label="Tab 2" {...a11yProps(1)} />
                <Tab label="Tab 3" {...a11yProps(2)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                Content for horizontal Tab 1
              </TabPanel>
              <TabPanel value={value} index={1}>
                Content for horizontal Tab 2
              </TabPanel>
              <TabPanel value={value} index={2}>
                Content for horizontal Tab 3
              </TabPanel>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Vertical
            </Typography>
            <Paper sx={{ display: 'flex', height: 224 }}>
              <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                aria-label="vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Tab 1" {...a11yProps(0)} />
                <Tab label="Tab 2" {...a11yProps(1)} />
                <Tab label="Tab 3" {...a11yProps(2)} />
              </Tabs>
              <Box sx={{ flex: 1 }}>
                <TabPanel value={value} index={0}>
                  Content for vertical Tab 1
                </TabPanel>
                <TabPanel value={value} index={1}>
                  Content for vertical Tab 2
                </TabPanel>
                <TabPanel value={value} index={2}>
                  Content for vertical Tab 3
                </TabPanel>
              </Box>
            </Paper>
          </Box>
        </Stack>
      );
    };

    return <OrientationTabs />;
  },
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs can include icons to help identify content.',
      },
    },
  },
  render: () => {
    const IconTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 500 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Icon at Top
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon tabs example"
              >
                <Tab icon={<HomeIcon />} label="Home" />
                <Tab icon={<FavoriteIcon />} label="Favorites" />
                <Tab icon={<PersonPinIcon />} label="Profile" />
              </Tabs>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Icon Only
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon-only tabs example"
              >
                <Tab icon={<HomeIcon />} aria-label="home" />
                <Tab icon={<FavoriteIcon />} aria-label="favorites" />
                <Tab icon={<PersonPinIcon />} aria-label="profile" />
              </Tabs>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Icon at Start
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon position tabs example"
              >
                <Tab iconPosition="start" icon={<PhoneIcon />} label="Phone" />
                <Tab iconPosition="start" icon={<ShoppingBagIcon />} label="Shopping" />
                <Tab iconPosition="start" icon={<SettingsIcon />} label="Settings" />
              </Tabs>
            </Paper>
          </Box>
        </Stack>
      );
    };

    return <IconTabs />;
  },
};

export const WithBadge: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs can include badges to show counts or status.',
      },
    },
  },
  render: () => {
    const BadgeTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Paper>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="badge tabs example"
            >
              <Tab
                label="Inbox"
                icon={
                  <Badge badgeContent={4} color="error">
                    <HomeIcon />
                  </Badge>
                }
                iconPosition="start"
              />
              <Tab
                label="Drafts"
                icon={
                  <Badge badgeContent={2} color="primary">
                    <FavoriteIcon />
                  </Badge>
                }
                iconPosition="start"
              />
              <Tab
                label="Trash"
                icon={<PersonPinIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Box>
      );
    };

    return <BadgeTabs />;
  },
};

export const Customized: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs can be customized with different colors and styles.',
      },
    },
  },
  render: () => {
    const CustomizedTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 500 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Custom Colors
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="colored tabs example"
              >
                <Tab label="Primary" />
                <Tab label="Secondary" />
                <Tab label="Disabled" disabled />
              </Tabs>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Custom Styled
            </Typography>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="styled tabs example"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'orange',
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                      color: 'orange',
                    },
                  },
                }}
              >
                <Tab label="Custom Tab 1" />
                <Tab label="Custom Tab 2" />
                <Tab label="Custom Tab 3" />
              </Tabs>
            </Paper>
          </Box>
        </Stack>
      );
    };

    return <CustomizedTabs />;
  },
};

export const Centered: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs can be centered within their container.',
      },
    },
  },
  render: () => {
    const CenteredTabs = () => {
      const [value, setValue] = useState(0);

      const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      return (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Paper>
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              aria-label="centered tabs example"
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </Paper>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography>
              These tabs are centered horizontally within their container.
            </Typography>
          </Box>
        </Box>
      );
    };

    return <CenteredTabs />;
  },
};

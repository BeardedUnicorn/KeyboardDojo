import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Skeleton,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Grid,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  Button,
} from '@mui/material';

// Define metadata for the Skeleton component stories
const meta = {
  title: 'UI/Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Skeletons are used to display a placeholder preview of content before the data is loaded to reduce load-time frustration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select', options: ['text', 'rectangular', 'rounded', 'circular'] },
      description: 'The shape of the skeleton',
    },
    animation: {
      control: { type: 'select', options: ['pulse', 'wave', false] },
      description: 'The animation effect',
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Basic story for Skeleton
export const Default: Story = {
  args: {
    variant: 'text',
    width: 210,
    height: 40,
  },
};

// Skeleton Variants
export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons come in different shapes: text, rectangular, rounded, and circular.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="subtitle2">Text</Typography>
      <Skeleton variant="text" width={210} height={40} />

      <Typography variant="subtitle2">Circular</Typography>
      <Skeleton variant="circular" width={40} height={40} />

      <Typography variant="subtitle2">Rectangular</Typography>
      <Skeleton variant="rectangular" width={210} height={60} />

      <Typography variant="subtitle2">Rounded</Typography>
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
  ),
};

// Skeleton Animations
export const Animations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can have different animation effects: pulse, wave, or none.',
      },
    },
  },
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2">Pulse Animation (Default)</Typography>
        <Skeleton variant="text" width={210} height={40} animation="pulse" />
      </Box>

      <Box>
        <Typography variant="subtitle2">Wave Animation</Typography>
        <Skeleton variant="text" width={210} height={40} animation="wave" />
      </Box>

      <Box>
        <Typography variant="subtitle2">No Animation</Typography>
        <Skeleton variant="text" width={210} height={40} animation={false} />
      </Box>
    </Stack>
  ),
};

// Skeleton Typography
export const TypographySkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can be used for typography elements like paragraphs.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h4">
        <Skeleton />
      </Typography>
      <Typography variant="subtitle1">
        <Skeleton />
      </Typography>
      <Typography variant="body1">
        <Skeleton />
      </Typography>
      <Typography variant="body2">
        <Skeleton />
      </Typography>
      <Typography variant="caption">
        <Skeleton />
      </Typography>
    </Box>
  ),
};

// Card Skeleton
export const CardSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can be used for complex UI components like cards.',
      },
    },
  },
  render: () => (
    <Card sx={{ width: 345, maxWidth: '100%' }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton width="80%" />}
        subheader={<Skeleton width="40%" />}
      />
      <Skeleton variant="rectangular" height={190} />
      <CardContent>
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </CardContent>
    </Card>
  ),
};

// List Skeleton
export const ListSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can be used for lists of items.',
      },
    },
  },
  render: () => (
    <List sx={{ width: '100%', maxWidth: 360 }}>
      {Array.from(new Array(3)).map((_, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width="80%" />}
            secondary={<Skeleton width="60%" />}
          />
        </ListItem>
      ))}
    </List>
  ),
};

// Loading Card with Data
export const LoadingWithData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This example shows how to switch between skeleton and actual content after loading.',
      },
    },
  },
  render: function LoadingWithDataStory() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Box width={345} maxWidth="100%">
        <FormControlLabel
          control={<Switch checked={loading} onChange={() => setLoading(!loading)} />}
          label="Loading"
          sx={{ mb: 2 }}
        />

        <Card>
          {loading ? (
            <>
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="80%" />}
                subheader={<Skeleton width="40%" />}
              />
              <Skeleton variant="rectangular" height={190} />
              <CardContent>
                <Skeleton />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>JP</Avatar>}
                title="John Doe"
                subheader="September 14, 2023"
              />
              <Box
                sx={{
                  height: 190,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography>Image Content</Typography>
              </Box>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  This is the actual content of the card.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  It replaces the skeleton after loading is complete.
                </Typography>
                <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
                  <Rating value={4.5} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    4.5 (24 reviews)
                  </Typography>
                </Box>
              </CardContent>
            </>
          )}
        </Card>
      </Box>
    );
  },
};

// Complex Content Example
export const ComplexContentLoading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This example shows a complex layout with multiple skeletons.',
      },
    },
  },
  render: function ComplexContentLoadingStory() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <FormControlLabel
          control={<Switch checked={loading} onChange={() => setLoading(!loading)} />}
          label="Loading"
          sx={{ mb: 2 }}
        />

        <Paper sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width={150} height={32} />
                <Skeleton variant="rounded" width={80} height={36} />
              </>
            ) : (
              <>
                <Typography variant="h6">Product Dashboard</Typography>
                <Button variant="contained" size="small">Add New</Button>
              </>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Stats Row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={4} key={item}>
                <Paper elevation={1} sx={{ p: 1.5 }}>
                  {loading ? (
                    <>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" height={32} />
                    </>
                  ) : (
                    <>
                      <Typography variant="caption" color="text.secondary">
                        {item === 1 ? 'Total Sales' : item === 2 ? 'Revenue' : 'Customers'}
                      </Typography>
                      <Typography variant="h6">
                        {item === 1 ? '1,245' : item === 2 ? '$5,243' : '840'}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Content List */}
          <Typography variant="subtitle2" gutterBottom>
            {loading ? <Skeleton width={100} /> : 'Recent Products'}
          </Typography>

          <Stack spacing={1} divider={<Divider flexItem />}>
            {Array.from(new Array(3)).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', py: 1 }}>
                {loading ? (
                  <>
                    <Skeleton variant="rounded" width={60} height={60} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                    <Skeleton variant="text" width={80} />
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'grey.100',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        IMG
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {index === 0 ? 'Wireless Headphones' : index === 1 ? 'Smart Watch' : 'Bluetooth Speaker'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {index === 0 ? 'Electronics' : index === 1 ? 'Wearables' : 'Audio'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={index + 3} size="small" readOnly />
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" sx={{ alignSelf: 'center' }}>
                      ${index === 0 ? '129.99' : index === 1 ? '249.99' : '89.99'}
                    </Typography>
                  </>
                )}
              </Box>
            ))}
          </Stack>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {loading ? (
              <Skeleton variant="rounded" width={120} height={36} />
            ) : (
              <Button variant="outlined" size="small">View All</Button>
            )}
          </Box>
        </Paper>
      </Box>
    );
  },
};

// Responsive Text Skeleton
export const ResponsiveTextSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeleton width can be responsive to different screen sizes.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Skeleton variant="text" sx={{ width: { xs: '100%', sm: '80%', md: '60%' } }} />
      <Skeleton variant="text" sx={{ width: { xs: '80%', sm: '60%', md: '40%' } }} />
      <Skeleton variant="text" sx={{ width: { xs: '60%', sm: '40%', md: '20%' } }} />
    </Box>
  ),
};

// Color Variations
export const ColorVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can have different colors through the sx prop.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <Skeleton variant="text" width={210} height={40} sx={{ bgcolor: 'grey.100' }} />
      <Skeleton variant="text" width={210} height={40} sx={{ bgcolor: 'primary.light' }} />
      <Skeleton variant="text" width={210} height={40} sx={{ bgcolor: 'secondary.light' }} />
      <Skeleton variant="text" width={210} height={40} sx={{ bgcolor: 'success.light' }} />
      <Skeleton variant="text" width={210} height={40} sx={{ bgcolor: 'error.light' }} />
    </Stack>
  ),
};

// Table Skeleton
export const TableSkeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons can be used to represent loading tables.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      {/* Table Header */}
      <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="text" width={100} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={120} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={80} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={60} />
      </Box>

      {/* Table Rows */}
      {Array.from(new Array(5)).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" width={100} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={120} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={80} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={60} />
        </Box>
      ))}
    </Box>
  ),
};

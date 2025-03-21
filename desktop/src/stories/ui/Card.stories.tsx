import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CardMedia,
  Button,
  Typography,
  Avatar,
  IconButton,
  Box,
  Stack,
  Collapse,
  Divider,
} from '@mui/material';
import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Card stories
const meta = {
  title: 'UI/Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card is a surface that displays content and actions on a single topic. They can be used to group related information and actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    raised: {
      control: 'boolean',
      description: 'If true, the card will be raised (with a shadow)',
    },
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
      description: 'The variant to use',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Basic Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cards contain content and actions about a single subject. They are a
          convenient means of displaying information in a contained, readable format.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ),
};

export const WithMedia: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cards can include media like images.',
      },
    },
  },
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
        alt="Laptop with code on screen"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Card with Media
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card includes an image at the top. Images can help provide context
          and make the content more engaging.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ),
};

export const WithHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cards can have headers that include avatars, titles, and action buttons.',
      },
    },
  },
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" sx={{ bgcolor: 'primary.main' }}>
            KD
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Keyboard Dojo"
        subheader="March 19, 2023"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This card includes a header with an avatar, title, and action button.
          Headers can be used to provide context about the card content or to show
          who created the content.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cards can be interactive, with expandable content or other interactive elements.',
      },
    },
  },
  render: () => {
    const ExpandableCard = () => {
      const [expanded, setExpanded] = useState(false);

      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

      return (
        <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            title="Expandable Card"
            subheader="Click 'Show More' to expand"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              This card demonstrates interactive functionality. You can expand it
              to show additional content.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Additional Content:</Typography>
              <Typography paragraph>
                This is the expanded content that is shown when the user clicks
                the 'Show More' button. It can contain additional information,
                details, or actions related to the card topic.
              </Typography>
              <Typography>
                You could include rich content here, such as lists, images,
                or even nested components.
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      );
    };

    return <ExpandableCard />;
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cards come in two main variants: elevation (default) and outlined.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
      <Card variant="elevation" sx={{ maxWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Elevation Variant
          </Typography>
          <Typography variant="body2">
            This is the default card variant, with a shadow that creates an elevated effect.
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ maxWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Outlined Variant
          </Typography>
          <Typography variant="body2">
            This variant has a border instead of a shadow, creating a more subtle appearance.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
};

export const Complex: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complex cards can combine multiple elements to create rich, detailed displays.',
      },
    },
  },
  render: () => (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }} aria-label="user">
            U
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Advanced Keyboard Shortcuts"
        subheader="Productivity Lesson"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://images.unsplash.com/photo-1563191911-e65f8655ebf9"
        alt="Keyboard with glowing keys"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Master advanced keyboard shortcuts for your favorite code editor. This comprehensive
          lesson will teach you time-saving key combinations that will boost your
          coding speed and efficiency.
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            INTERMEDIATE
          </Box>
          <Typography variant="body2" color="text.secondary">
            45 minutes
          </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Start Lesson
        </Button>
        <Button size="small" color="secondary">
          Save for Later
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  ),
};

import GrainIcon from '@mui/icons-material/Grain';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {
  Breadcrumbs,
  Link,
  Typography,
  Stack,
  Box,
  Paper,
  Chip,
  emphasize,
  styled,
} from '@mui/material';
import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Breadcrumbs stories
const meta = {
  title: 'UI/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Breadcrumbs are a navigation aid that helps users understand where they are in a website hierarchy and navigate back through it.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Custom separator node',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of breadcrumbs to display',
    },
    itemsAfterCollapse: {
      control: 'number',
      description: 'Number of items after the collapse button',
    },
    itemsBeforeCollapse: {
      control: 'number',
      description: 'Number of items before the collapse button',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">Current Project</Typography>
      </Breadcrumbs>
    </Box>
  ),
};

export const WithCustomSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs can have custom separators, replacing the default slash.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Breadcrumbs separator="-" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">Current Project</Typography>
      </Breadcrumbs>

      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">Current Project</Typography>
      </Breadcrumbs>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="text.primary">Current Project</Typography>
      </Breadcrumbs>
    </Stack>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs can include icons to help identify links.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/projects"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Projects
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Current Project
        </Typography>
      </Breadcrumbs>
    </Box>
  ),
};

export const WithCollapsedItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When there are many breadcrumbs, they can be collapsed to save space.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Breadcrumbs maxItems={3} aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/category">
          Category
        </Link>
        <Link underline="hover" color="inherit" href="/category/subcategory">
          Subcategory
        </Link>
        <Link underline="hover" color="inherit" href="/category/subcategory/section">
          Section
        </Link>
        <Link underline="hover" color="inherit" href="/category/subcategory/section/subsection">
          Subsection
        </Link>
        <Typography color="text.primary">Current Page</Typography>
      </Breadcrumbs>
    </Box>
  ),
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs can be styled to match your design system.',
      },
    },
  },
  render: () => {
    // Define a styled version of the Breadcrumbs component
    const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: theme.palette.grey[800],
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[200],
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      },
    }));

    return (
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <StyledBreadcrumb
            sx={{
              a: { color: 'inherit', textDecoration: 'none' },
            }}
            label="Home"
            icon={<HomeIcon fontSize="small" />}
            onClick={(event) => {
              event.preventDefault();
              console.log('Home clicked');
            }}
          />
          <StyledBreadcrumb
            sx={{
              a: { color: 'inherit', textDecoration: 'none' },
            }}
            label="Projects"
            onClick={(event) => {
              event.preventDefault();
              console.log('Projects clicked');
            }}
          />
          <StyledBreadcrumb
            label="Current Project"
            onClick={(event) => {
              event.preventDefault();
              console.log('Current Project clicked');
            }}
          />
        </Breadcrumbs>
      </Paper>
    );
  },
};

export const InteractiveBreadcrumbs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs are typically interactive navigation elements.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Click on a breadcrumb to simulate navigation:
      </Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            alert('Home page');
          }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            alert('Projects page');
          }}
        >
          Projects
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            alert('Web Development page');
          }}
        >
          Web Development
        </Link>
        <Typography color="text.primary">React</Typography>
      </Breadcrumbs>
    </Box>
  ),
};

export const WithBackground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumbs can be displayed against different backgrounds.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Paper sx={{
        p: 2,
        mb: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
      }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/projects">
            Projects
          </Link>
          <Typography color="text.primary">Current Project</Typography>
        </Breadcrumbs>
      </Paper>

      <Paper sx={{
        p: 2,
        backgroundColor: 'primary.light',
        color: 'primary.contrastText',
      }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            color: 'inherit',
            '& .MuiBreadcrumbs-separator': {
              color: 'primary.contrastText',
            },
          }}
        >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/projects">
            Projects
          </Link>
          <Typography color="inherit" sx={{ fontWeight: 'bold' }}>
            Current Project
          </Typography>
        </Breadcrumbs>
      </Paper>
    </Box>
  ),
};

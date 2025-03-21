import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import Footer from '../../components/layout/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The Footer component displays copyright information, links, and application version.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => (
    <Box sx={{
      width: '100%',
      backgroundColor: (theme) => theme.palette.background.default,
      p: 2,
    }}>
      <Footer />
    </Box>
  ),
};

export const WithBackgroundColor: Story = {
  render: () => (
    <Box sx={{
      width: '100%',
      backgroundColor: (theme) => theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
      p: 2,
    }}>
      <Footer />
    </Box>
  ),
};

export const ResponsiveFooter: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'The Footer component adapts its layout on smaller screens.',
      },
    },
  },
  render: () => (
    <Box sx={{
      width: '100%',
      backgroundColor: (theme) => theme.palette.background.default,
      p: 2,
    }}>
      <Footer />
    </Box>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Container, Typography } from '@mui/material';
import CurriculumProgressChart from '../../components/statistics/CurriculumProgressChart';
import { 
  ProgressChartWrapper, 
  setupProgressChartGlobals 
} from './ProgressChart.mock';

// Interface for story props
interface ProgressChartStoryProps {
  showDetails?: boolean;
  loading?: boolean;
  noData?: boolean;
}

// Story wrapper component with container styling
const ProgressChartStory: React.FC<ProgressChartStoryProps> = ({
  showDetails = true,
  loading = false,
  noData = false
}) => {
  // Run setup to ensure global data is available
  if (typeof window !== 'undefined') {
    setupProgressChartGlobals();
  }
  
  return (
    <ProgressChartWrapper loading={loading} noData={noData}>
      <Box sx={{ 
        p: 3, 
        width: '100%', 
        maxWidth: '900px', 
        mx: 'auto',
        bgcolor: 'background.default' 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Curriculum Progress Overview
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            my: 2,
            bgcolor: 'background.paper',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <CurriculumProgressChart 
            showDetails={showDetails}
          />
        </Paper>
      </Box>
    </ProgressChartWrapper>
  );
};

// Define the metadata for the story
const meta = {
  title: 'Statistics/CurriculumProgressChart',
  component: CurriculumProgressChart,
  parameters: {
    layout: 'fullscreen',
    jest: {
      timeout: 60000,
    }
  },
  argTypes: {
    showDetails: {
      control: 'boolean',
      description: 'Show detailed completion information'
    }
  },
  decorators: [
    (Story: any) => (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Story />
      </Container>
    ),
  ],
  tags: ['autodocs']
} as Meta<typeof CurriculumProgressChart>;

// Export the meta object as the default export
export default meta;

// Define the Story type
type Story = StoryObj<typeof meta>;

// Default view with normal data
export const Default: Story = {
  render: () => (
    <ProgressChartStory />
  ),
  play: async () => {
    // Make sure global data is set up
    if (typeof window !== 'undefined') {
      setupProgressChartGlobals();
    }
  }
};

// Detailed view with extra information
export const WithDetails: Story = {
  render: () => (
    <ProgressChartStory showDetails={true} />
  ),
  play: async () => {
    // Make sure global data is set up
    if (typeof window !== 'undefined') {
      setupProgressChartGlobals();
    }
  }
};

// Simple view without details
export const WithoutDetails: Story = {
  render: () => (
    <ProgressChartStory showDetails={false} />
  ),
  play: async () => {
    // Make sure global data is set up
    if (typeof window !== 'undefined') {
      setupProgressChartGlobals();
    }
  }
};

// Loading state
export const Loading: Story = {
  render: () => (
    <ProgressChartStory loading={true} />
  ),
  play: async () => {
    // Make sure global data is set up
    if (typeof window !== 'undefined') {
      setupProgressChartGlobals();
    }
  }
};

// No data state
export const NoData: Story = {
  render: () => (
    <ProgressChartStory noData={true} />
  ),
  play: async () => {
    // Make sure global data is set up
    if (typeof window !== 'undefined') {
      setupProgressChartGlobals();
    }
  }
}; 
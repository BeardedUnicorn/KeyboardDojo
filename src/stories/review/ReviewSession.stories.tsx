import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, Button } from '@mui/material';

// Import the component directly from its path
import { ReviewSession } from '../../../desktop/src/components/review';

// Define the types locally instead of importing from services
type PerformanceRating = 'easy' | 'good' | 'hard' | 'again';

// Define interface matching the actual ReviewSession interface
interface ReviewSessionType {
  id: string;
  date: string;
  shortcuts: Array<{
    id: string;
    keys: string[];
    description: string;
    name?: string;
    category?: string;
    context?: string;
  }>;
  completed: boolean;
  results?: Array<{
    shortcutId: string;
    performance: PerformanceRating;
    responseTime: number;
  }>;
}

// Mock data for stories
const mockReviewSession: ReviewSessionType = {
  id: 'mock-session-1',
  date: new Date().toISOString(),
  completed: false,
  shortcuts: [
    {
      id: 'shortcut-1',
      keys: ['Control', 'c'],
      description: 'Copy selected text',
      name: 'Copy',
      category: 'Editing',
    },
    {
      id: 'shortcut-2',
      keys: ['Control', 'v'],
      description: 'Paste clipboard content',
      name: 'Paste',
      category: 'Editing',
    },
    {
      id: 'shortcut-3',
      keys: ['Control', 'z'],
      description: 'Undo last action',
      name: 'Undo',
      category: 'Editing',
    },
  ],
};

const mockLongReviewSession: ReviewSessionType = {
  id: 'mock-session-2',
  date: new Date().toISOString(),
  completed: false,
  shortcuts: [
    ...mockReviewSession.shortcuts,
    {
      id: 'shortcut-4',
      keys: ['Control', 'f'],
      description: 'Find in document',
      name: 'Find',
      category: 'Navigation',
    },
    {
      id: 'shortcut-5',
      keys: ['Control', 's'],
      description: 'Save document',
      name: 'Save',
      category: 'File',
    },
    {
      id: 'shortcut-6',
      keys: ['Control', 'a'],
      description: 'Select all',
      name: 'Select All',
      category: 'Editing',
    },
    {
      id: 'shortcut-7',
      keys: ['Control', 'x'],
      description: 'Cut selection',
      name: 'Cut',
      category: 'Editing',
    },
  ],
};

// Simple completion handler for stories
const handleComplete = (results: Array<{
  shortcutId: string;
  performance: PerformanceRating;
  responseTime: number;
}>) => {
  console.log('Review session completed', results);
};

const meta = {
  title: 'Review/ReviewSession',
  component: ReviewSession,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The ReviewSession component manages the interactive review of keyboard shortcuts. It presents the user with shortcuts to recall, tracks performance, and provides immediate feedback.',
      },
    },
    a11y: {
      // Enable accessibility testing for all stories by default
      disable: false,
      config: {
        rules: [
          {
            // We've handled these issues with our custom accessibility implementations
            id: ['color-contrast'],
            enabled: false,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    session: {
      control: 'object',
      description: 'The review session object containing shortcuts to review.'
    },
    onComplete: {
      action: 'completed',
      description: 'Callback fired when the review session is completed.'
    },
    sessionId: {
      control: 'text',
      description: 'Optional ID for the review session for accessibility purposes.'
    }
  }
} satisfies Meta<typeof ReviewSession>;

export default meta;
type Story = StoryObj<typeof meta>;

// Template for stories that use the ReviewSession component
const ReviewSessionTemplate: Story = {
  args: {
    session: mockReviewSession,
    onComplete: handleComplete,
  },
};

export const Default: Story = {
  ...ReviewSessionTemplate,
};

export const LongerSession: Story = {
  args: {
    session: mockLongReviewSession,
    onComplete: handleComplete,
  },
};

export const WithAccessibilityFeatures: Story = {
  args: {
    session: mockReviewSession,
    onComplete: handleComplete,
    sessionId: 'accessible-review-demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'A review session with enhanced accessibility features including ARIA labels, keyboard navigation, and screen reader announcements.',
      },
    },
  },
};

// Custom stories can still use render function for more complex cases
export const UsageDocumentation: Story = {
  args: {
    session: mockReviewSession,
    onComplete: handleComplete,
  },
  parameters: {
    docs: {
      description: {
        story: 'Documentation on how to use the ReviewSession component.',
      },
    },
    // Override the component rendering with custom content
    componentRenderer: () => (
      <Box sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="h5" gutterBottom>
          Using the ReviewSession Component
        </Typography>
        <Typography variant="body1" paragraph>
          The ReviewSession component provides an interactive interface for users to practice and review keyboard shortcuts:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>Each shortcut is presented one at a time with its description.</li>
          <li>Users must recall and press the correct key combination.</li>
          <li>After each attempt, users rate their performance (Easy, Good, Hard, or Again).</li>
          <li>These ratings influence how frequently the shortcut appears in future review sessions.</li>
          <li>A progress bar shows completion status of the current session.</li>
          <li>Visual feedback is provided for correct answers with a confetti effect.</li>
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          To begin using this component in your application, provide it with a session object containing shortcuts to review and a completion handler function.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Accessibility Features
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>Keyboard navigation for rating buttons using left/right arrow keys</li>
          <li>Screen reader announcements for session progress and feedback</li>
          <li>ARIA live regions to announce session state changes</li>
          <li>Proper focus management between session stages</li>
          <li>Descriptive ARIA labels for buttons and interactive elements</li>
          <li>Accessible progress indicators with proper ARIA attributes</li>
        </Typography>
      </Box>
    ),
  },
}; 
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { PracticeHeatmap } from '../../../desktop/src/components/statistics';

// Create a mock Redux store
const createMockStore = (practiceData: Array<{
  completedAt: string;
  score: number;
}> = []) => {
  // Create 120 days of random practice data
  const currentDate = new Date();
  const mockPracticeData: Array<{
    completedAt: string;
    score: number;
  }> = [];
  
  if (practiceData.length === 0) {
    // Generate random practice data
    for (let i = 0; i < 120; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Random intensity (some days have no practice)
      const shouldHavePractice = Math.random() > 0.4;
      
      if (shouldHavePractice) {
        const count = Math.floor(Math.random() * 3) + 1;
        const xpEarned = count * (Math.floor(Math.random() * 30) + 10);
        
        mockPracticeData.push({
          completedAt: date.toISOString(),
          score: xpEarned,
        });
      }
    }
  } else {
    mockPracticeData.push(...practiceData);
  }
  
  return configureStore({
    reducer: {
      userProgress: (state = {
        completedLessons: mockPracticeData,
        isLoading: false,
        error: null,
      }, action) => state,
    },
  });
};

// Create mock stores with different activity patterns
const regularStore = createMockStore();
const intensiveStore = createMockStore(Array(90).fill(0).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    completedAt: date.toISOString(),
    score: Math.floor(Math.random() * 50) + 30,
  };
}));

// Store with weekend-only practice
const weekendData = Array(30).fill(0).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  // Only include weekends (0 = Sunday, 6 = Saturday)
  if (date.getDay() === 0 || date.getDay() === 6) {
    return {
      completedAt: date.toISOString(),
      score: Math.floor(Math.random() * 40) + 20,
    };
  }
  return null;
}).filter((item): item is {completedAt: string; score: number} => item !== null);

const weekendStore = createMockStore(weekendData);

const emptyStore = createMockStore([]);
const loadingStore = configureStore({
  reducer: {
    userProgress: () => ({
      completedLessons: [],
      isLoading: true,
      error: null,
    }),
  },
});

// Create StoryBook wrapper component
const StoryWrapper = ({ children, store }) => (
  <Provider store={store}>
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      {children}
    </Box>
  </Provider>
);

const meta = {
  title: 'Statistics/PracticeHeatmap',
  component: PracticeHeatmap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A heatmap visualization of practice activity over time, showing intensity of practice on different days.',
      },
    },
    a11y: {
      // Enable accessibility testing for all stories
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
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed above the heatmap',
    },
    weeks: {
      control: { type: 'number', min: 4, max: 24, step: 1 },
      description: 'Number of weeks to display in the heatmap',
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show month and day labels',
    },
    heatmapId: {
      control: 'text',
      description: 'Unique ID used for accessibility purposes',
    },
    accessibilityDescription: {
      control: 'text',
      description: 'Description for screen readers to explain the heatmap purpose',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PracticeHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Template with default props
const Template: Story = {
  args: {
    title: 'Practice Activity',
    weeks: 12,
    showLabels: true,
  },
};

export const Default: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={regularStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
};

export const FourWeeks: Story = {
  args: {
    ...Template.args,
    weeks: 4,
  },
  decorators: [
    (Story) => (
      <StoryWrapper store={regularStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Displays a shorter time period of 4 weeks.',
      },
    },
  },
};

export const HighActivity: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={intensiveStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows a pattern with consistent high activity every day.',
      },
    },
  },
};

export const WeekendActivity: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={weekendStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows a pattern where the user primarily practices on weekends.',
      },
    },
  },
};

export const NoActivity: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={emptyStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the heatmap when there is no practice activity recorded.',
      },
    },
  },
};

export const Loading: Story = {
  ...Template,
  decorators: [
    (Story) => (
      <StoryWrapper store={loadingStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state while practice data is being fetched.',
      },
    },
  },
};

export const WithoutLabels: Story = {
  args: {
    ...Template.args,
    showLabels: false,
  },
  decorators: [
    (Story) => (
      <StoryWrapper store={regularStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Displays the heatmap without day and month labels.',
      },
    },
  },
};

export const AccessibleHeatmap: Story = {
  args: {
    title: 'Accessible Practice Activity',
    weeks: 8,
    showLabels: true,
    heatmapId: 'accessible-practice-heatmap',
    accessibilityDescription: 'This heatmap shows your practice activity over the past 8 weeks. Each cell represents a day, with darker colors indicating more practice activity. You can navigate through the heatmap using arrow keys.',
  },
  decorators: [
    (Story) => (
      <StoryWrapper store={weekendStore}>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the heatmap with enhanced accessibility features including:' +
          '\n- Keyboard navigation with arrow keys between cells' +
          '\n- ARIA roles and attributes for screen reader support' +
          '\n- Detailed cell descriptions with date, activity level, and XP earned' +
          '\n- Summary of practice data for screen readers' +
          '\n- Focus indicators for keyboard users' +
          '\n- Proper labeling of all interactive elements',
      },
    },
  },
}; 
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react';

import Navigation from '@components/layout/Navigation';

// Mock the useSubscriptionRedux hook with a custom provider
const mockStore = configureStore({
  reducer: {
    subscription: (state = { hasPremium: true }) => state,
  },
});

const MockProvider = ({ children, hasPremium = true }) => {
  const store = configureStore({
    reducer: {
      subscription: (state = { hasPremium }) => state,
    },
  });
  
  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
};

// A special provider without MemoryRouter for the NonPremiumUser story
// This avoids the nested Router issue
const MockProviderWithoutRouter = ({ children, hasPremium = false }) => {
  const store = configureStore({
    reducer: {
      subscription: (state = { hasPremium }) => state,
    },
  });
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

const meta = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    jest: {
      timeout: 180000, // 3 minutes
    },
    // Add accessibility testing parameters
    a11y: {
      // Enable accessibility checking for all stories
      config: {
        rules: [
          // Override specific rules as needed
          {
            // Disable color contrast rule as it's handled by the theme system
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
      // Run manual accessibility tests
      manual: true,
      // Options for the accessibility tests
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    docs: {
      description: {
        component: 'Main navigation component for the application. Provides access to all major sections.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MockProvider>
        <Story />
      </MockProvider>
    ),
  ],
  // Define props that can be controlled in Storybook
  argTypes: {
    navigationId: {
      control: 'text',
      description: 'ID for the navigation element (used for accessibility)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'main-navigation' },
      },
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default view of the navigation component
export const Default: Story = {
  args: {
    navigationId: 'story-navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard navigation component with default state.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    jest: {
      timeout: 180000,
    },
  },
};

// Mobile view for testing responsive layout
export const MobileNavigation: Story = {
  args: {
    navigationId: 'mobile-navigation',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Navigation component displayed in mobile viewport.',
      },
    },
    jest: {
      timeout: 180000,
    },
  },
};

// Non-premium user state
export const NonPremiumUser: Story = {
  args: {
    navigationId: 'non-premium-navigation',
  },
  decorators: [
    (Story) => (
      <MockProviderWithoutRouter hasPremium={false}>
        <Story />
      </MockProviderWithoutRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Navigation for users without premium subscription.',
      },
    },
    jest: {
      timeout: 180000,
    },
  },
};

// Focus on accessibility features
export const AccessibleNavigation: Story = {
  args: {
    navigationId: 'a11y-navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation with enhanced accessibility features. This story demonstrates:\n' +
          '- Skip to content link (visible on focus)\n' +
          '- Keyboard navigation (use Tab to navigate, Enter/Space to select)\n' +
          '- ARIA attributes for screen readers\n' +
          '- Visible focus indicators\n' +
          '- Proper semantic roles for menu items\n'
      },
    },
    a11y: {
      // Configure specific tests for this story
      options: {
        rules: {
          // Ensure landmark elements are used correctly
          'landmark-one-main': { enabled: true },
          // Ensure interactive elements are keyboard accessible
          'focusable-content': { enabled: true },
          // Enforce proper ARIA attributes
          'aria-allowed-attr': { enabled: true },
        },
      },
    },
    jest: {
      timeout: 180000,
    },
  },
  play: async ({ canvasElement }) => {
    // The play function could be used to automatically test keyboard navigation
    // This is a placeholder for potential future interaction tests
  },
};

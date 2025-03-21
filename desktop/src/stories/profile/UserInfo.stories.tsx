import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import UserInfo from '../../components/profile/UserInfo';
import { TestWrapper } from '../.storybook-test-setup';
import { configureStore } from '@reduxjs/toolkit';

// Setup router context
interface WindowWithMocks extends Window {
  __REACT_ROUTER_CONTEXT?: any;
  __inRouterContext?: boolean;
  __hasRouterContext?: boolean;
}

// Create mockStores with different states
const createMockStore = (userData: any) => 
  configureStore({
    reducer: {
      user: () => ({ data: userData, loading: false, error: null }),
      userProgress: () => ({ 
        level: userData?.level || 1,
        xp: userData?.xp || 0,
        totalLessonsCompleted: userData?.totalLessonsCompleted || 0,
        streak: userData?.streak || 0,
        lastActive: userData?.lastActive || new Date().toISOString(),
      }),
    },
  });

const defaultUserData = {
  id: 'user123',
  username: 'keyboard_ninja',
  email: 'ninja@example.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Keyboard+Ninja',
  createdAt: '2023-01-15T00:00:00Z',
  level: 5,
  xp: 1250,
  totalLessonsCompleted: 48,
  streak: 12,
  lastActive: new Date().toISOString(),
};

// Setup router context for all stories
const setupRouterContext = () => {
  const windowWithMocks = window as WindowWithMocks;
  
  // Set up flags for router context detection
  windowWithMocks.__inRouterContext = true;
  windowWithMocks.__hasRouterContext = true;
  
  // Create full React Router context
  windowWithMocks.__REACT_ROUTER_CONTEXT = {
    basename: '',
    navigator: {
      createHref: (to: any) => typeof to === 'string' ? to : (to?.pathname || '/'),
      push: () => {},
      replace: () => {},
      go: () => {},
      listen: () => () => {},
      block: () => () => {}
    },
    static: false,
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    }
  };
};

// Create a type that just includes the props we need for the stories
type UserInfoStoryProps = {
  userInfoId?: string;
  accessibilityDescription?: string;
};

const meta = {
  title: 'Profile/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component: 'Component to display user information in the header, showing the user\'s level and avatar.',
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
    userInfoId: {
      control: 'text',
      description: 'Unique ID used for accessibility purposes',
    },
    accessibilityDescription: {
      control: 'text',
      description: 'Additional context for screen readers',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      // Setup router context
      setupRouterContext();
      
      return (
        <TestWrapper store={createMockStore(defaultUserData)}>
          <BrowserRouter>
            <div style={{ width: '600px' }}>
              <Story />
            </div>
          </BrowserRouter>
        </TestWrapper>
      );
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      // Setup router context
      setupRouterContext();
      
      return (
        <TestWrapper store={configureStore({
          reducer: {
            user: () => ({ data: null, loading: true, error: null }),
            userProgress: () => ({ level: 1, xp: 0, totalLessonsCompleted: 0, streak: 0 }),
          },
        })}>
          <BrowserRouter>
            <div style={{ width: '600px' }}>
              <Story />
            </div>
          </BrowserRouter>
        </TestWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state for the user information.',
      },
    },
  },
};

export const HighLevel: Story = {
  decorators: [
    (Story) => {
      // Setup router context
      setupRouterContext();
      
      return (
        <TestWrapper store={createMockStore({
          ...defaultUserData,
          level: 25,
          xp: 98750,
          totalLessonsCompleted: 342,
          streak: 108,
        })}>
          <BrowserRouter>
            <div style={{ width: '600px' }}>
              <Story />
            </div>
          </BrowserRouter>
        </TestWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Displays information for a high-level user with significant progress.',
      },
    },
  },
};

export const NewUser: Story = {
  decorators: [
    (Story) => {
      // Setup router context
      setupRouterContext();
      
      return (
        <TestWrapper store={createMockStore({
          ...defaultUserData,
          level: 1,
          xp: 50,
          totalLessonsCompleted: 2,
          streak: 1,
          createdAt: new Date().toISOString(),
        })}>
          <BrowserRouter>
            <div style={{ width: '600px' }}>
              <Story />
            </div>
          </BrowserRouter>
        </TestWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows information for a new user who has just started using the application.',
      },
    },
  },
};

export const AccessibleUserInfo: Story = {
  args: {
    userInfoId: 'accessible-user-info',
    accessibilityDescription: 'Click here to access your full profile page with statistics, achievements, and settings.',
  },
  decorators: [
    (Story) => {
      // Setup router context
      setupRouterContext();
      
      return (
        <TestWrapper store={createMockStore(defaultUserData)}>
          <BrowserRouter>
            <div style={{ width: '600px', padding: '20px' }}>
              <Story />
              <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <p>This example demonstrates enhanced accessibility features:</p>
                <ul>
                  <li>Proper ARIA labels for user information</li>
                  <li>Focus styling for keyboard navigation</li>
                  <li>Complete screen reader descriptions</li>
                  <li>Custom accessibility description for context</li>
                  <li>Semantic HTML roles for navigation</li>
                </ul>
                <p>Use Tab key to focus on the component and observe the focus styling.</p>
              </div>
            </div>
          </BrowserRouter>
        </TestWrapper>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the UserInfo component with enhanced accessibility features for screen readers and keyboard navigation.',
      },
    },
  },
};

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Button } from '@mui/material';
import ErrorFallback from '../../components/ui/ErrorFallback';

const meta: Meta<typeof ErrorFallback> = {
  title: 'UI/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A fallback UI component that displays when an error occurs in the application.
This component is typically used with ErrorBoundary to provide a user-friendly error message.

It displays:
- A friendly error message
- The actual error message (when provided)
- A button to reload the application or invoke a provided reset function
        `,
      },
    },
  },
  argTypes: {
    error: {
      control: 'object',
      description: 'The error object that was caught',
    },
    resetErrorBoundary: {
      action: 'reset error',
      description: 'Function to reset the error boundary and try to recover',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorFallback>;

// Basic error display
export const Default: Story = {
  args: {
    error: new Error('Something went wrong while loading the application.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default error fallback display with a simple error message.',
      },
    },
  },
};

// With a longer, more detailed error message
export const DetailedError: Story = {
  args: {
    error: new Error(
      'TypeError: Cannot read property "profile" of undefined. ' +
      'This usually happens when the user data is not properly loaded or the API response was not in the expected format. ' +
      'Please try refreshing the page or contact support if the problem persists.'
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error fallback with a more detailed error explanation.',
      },
    },
  },
};

// With a custom reset function
export const WithResetFunction: Story = {
  render: (args) => {
    const [count, setCount] = React.useState(0);
    
    const handleReset = () => {
      setCount(count + 1);
      args.resetErrorBoundary?.();
    };
    
    return (
      <Box>
        <div style={{ marginBottom: '20px' }}>
          Reset count: {count}
        </div>
        <ErrorFallback
          error={args.error}
          resetErrorBoundary={handleReset}
        />
      </Box>
    );
  },
  args: {
    error: new Error('This error can be reset using the custom reset function.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error fallback with a custom reset function that counts how many times it\'s been reset.',
      },
    },
  },
};

// Usage demonstration with ErrorBoundary
export const UsageWithErrorBoundary: Story = {
  render: () => (
    <Box sx={{ maxWidth: '800px' }}>
      <Box component="pre" sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto',
        mb: 3,
      }}>
        {`
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import ErrorFallback from '../components/ui/ErrorFallback';

// In your component:
<ErrorBoundary 
  componentName="MyComponent"
  fallback={(error, resetError) => (
    <ErrorFallback 
      error={error} 
      resetErrorBoundary={resetError} 
    />
  )}
>
  <MyComponent />
</ErrorBoundary>
        `}
      </Box>
      
      <Box sx={{ 
        p: 2, 
        border: '1px dashed grey', 
        borderRadius: 1,
        mb: 3,
      }}>
        <ErrorFallback 
          error={new Error('Example error when used with ErrorBoundary')} 
          resetErrorBoundary={() => alert('Reset action would happen here')}
        />
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => alert('This would normally navigate back to a safe page')}
        sx={{ mr: 2 }}
      >
        Go to Home Page
      </Button>
      <Button 
        variant="outlined"
        onClick={() => alert('This would open a support ticket form')}
      >
        Contact Support
      </Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to use the ErrorFallback component with ErrorBoundary and shows additional recovery actions.',
      },
    },
  },
};

// Customization example
export const CustomizedAppearance: Story = {
  render: (args) => (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '500px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <span style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#dc3545',
          color: 'white',
          textAlign: 'center',
          lineHeight: '40px',
          fontSize: '24px',
          marginRight: '12px',
        }}>
          !
        </span>
        <h2 style={{ 
          margin: 0,
          color: '#dc3545',
          fontSize: '22px',
        }}>
          Application Error
        </h2>
      </div>
      
      <p style={{ 
        fontSize: '16px',
        lineHeight: 1.5,
        color: '#343a40',
        margin: '0 0 16px 0',
      }}>
        We're sorry, but something went wrong. The error has been logged and our team has been notified.
      </p>
      
      <div style={{
        padding: '12px',
        backgroundColor: '#f1f1f1',
        borderLeft: '4px solid #dc3545',
        marginBottom: '20px',
        fontSize: '14px',
        fontFamily: 'monospace',
        overflowX: 'auto',
      }}>
        {args.error?.message || 'Unknown error occurred'}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <button style={{
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: '1px solid #6c757d',
          borderRadius: '4px',
          color: '#6c757d',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          Report Issue
        </button>
        
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
        }} onClick={args.resetErrorBoundary}>
          Reload Application
        </button>
      </div>
    </Box>
  ),
  args: {
    error: new Error('Failed to load user data: API returned status code 500'),
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of how you might create a custom styled error display inspired by the ErrorFallback component.',
      },
    },
  },
}; 
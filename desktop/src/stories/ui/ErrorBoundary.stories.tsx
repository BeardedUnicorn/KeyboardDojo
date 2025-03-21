import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import ErrorFallback from '../../components/ui/ErrorFallback';

import type { ReactNode, ErrorInfo } from 'react';

// Props for BuggyCounter
interface BuggyCounterProps {
  shouldThrow?: boolean;
}

// Define a component that will throw an error
const BuggyCounter: React.FC<BuggyCounterProps> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('This is a simulated error in the BuggyCounter component');
  }
  
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Counter Component (Working Correctly)
      </Typography>
      <Typography>
        This is a component that would normally display a counter functionality.
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        Increment Counter
      </Button>
    </Box>
  );
};

// Props for custom fallback component
interface CustomFallbackProps {
  error: Error;
  resetError: () => void;
}

// Create a custom fallback component for testing
const CustomFallback: React.FC<CustomFallbackProps> = ({ error, resetError }) => (
  <Box 
    sx={{ 
      p: 3, 
      border: '2px solid purple', 
      borderRadius: 2,
      backgroundColor: 'rgba(128, 0, 128, 0.1)',
      maxWidth: '100%',
    }}
  >
    <Typography variant="h5" sx={{ color: 'purple', mb: 2 }}>
      Custom Error View
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      A custom error occurred: {error.message}
    </Typography>
    <Button 
      variant="contained" 
      color="secondary"
      onClick={resetError}
    >
      Reset Custom Error
    </Button>
  </Box>
);

// Props for ErrorToggle
interface ErrorToggleProps {
  children: React.ReactElement<BuggyCounterProps>;
  initialThrow?: boolean;
  componentName?: string;
  showErrorUI?: boolean;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// Wrapper to toggle throwing errors
const ErrorToggle: React.FC<ErrorToggleProps> = ({ 
  children, 
  initialThrow = false,
  componentName,
  showErrorUI = true,
  fallback,
  onError,
}) => {
  const [shouldThrow, setShouldThrow] = React.useState(initialThrow);
  
  const handleToggle = () => {
    setShouldThrow(!shouldThrow);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined" 
          color={shouldThrow ? "error" : "success"}
          onClick={handleToggle}
        >
          {shouldThrow ? "Fix Component" : "Break Component"}
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          Click the button to {shouldThrow ? "fix" : "break"} the component and {shouldThrow ? "recover from" : "trigger"} the error.
        </Typography>
      </Box>
      
      <ErrorBoundary
        componentName={componentName}
        showErrorUI={showErrorUI}
        fallback={fallback}
        onError={onError}
      >
        {React.cloneElement(children, { shouldThrow })}
      </ErrorBoundary>
    </Box>
  );
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A component that catches JavaScript errors anywhere in its child component tree,
logs those errors, and displays a fallback UI instead of crashing the component tree.

This ErrorBoundary integrates with Sentry for error tracking and provides several customization options:
- Custom fallback UI
- Optional error display
- Component name for better error tracking
- Error callback for custom handling
        `,
      },
    },
  },
  argTypes: {
    componentName: {
      control: 'text',
      description: 'Name of the component for logging purposes',
    },
    showErrorUI: {
      control: 'boolean',
      description: 'Whether to show the error UI when an error occurs',
    },
    fallback: {
      control: false,
      description: 'Custom fallback UI to display when an error occurs',
    },
    onError: {
      action: 'error caught',
      description: 'Callback function when an error is caught',
    },
    children: {
      control: false,
      description: 'Child components wrapped by the ErrorBoundary',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// Create a wrapper component for the ErrorFallback component to adapt its props
const ErrorFallbackWrapper = (error: Error, resetError: () => void) => (
  <ErrorFallback 
    error={error} 
    resetErrorBoundary={resetError} 
  />
);

// Basic example with default fallback
export const Default: Story = {
  render: (args) => (
    <ErrorToggle {...args}>
      <BuggyCounter />
    </ErrorToggle>
  ),
  args: {
    componentName: 'ExampleComponent',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of ErrorBoundary with the default fallback UI. Click "Break Component" to trigger an error.',
      },
    },
  },
};

// With custom fallback component
export const WithCustomFallback: Story = {
  render: (args) => (
    <ErrorToggle {...args}>
      <BuggyCounter />
    </ErrorToggle>
  ),
  args: {
    componentName: 'CustomFallbackExample',
    fallback: (error: Error, resetError: () => void) => (
      <CustomFallback error={error} resetError={resetError} />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundary with a custom fallback component to display when an error occurs.',
      },
    },
  },
};

// Using ErrorFallback component
export const WithErrorFallback: Story = {
  render: (args) => (
    <ErrorToggle {...args}>
      <BuggyCounter />
    </ErrorToggle>
  ),
  args: {
    componentName: 'ErrorFallbackExample',
    fallback: ErrorFallbackWrapper,
  },
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundary using the application\'s ErrorFallback component.',
      },
    },
  },
};

// Without error UI
export const WithoutErrorUI: Story = {
  render: (args) => (
    <ErrorToggle {...args}>
      <BuggyCounter />
    </ErrorToggle>
  ),
  args: {
    componentName: 'SilentErrorExample',
    showErrorUI: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundary that silently catches errors without showing an error UI. When an error occurs, nothing will be displayed.',
      },
    },
  },
};

// With error callback
export const WithErrorCallback: Story = {
  render: (args) => (
    <ErrorToggle 
      {...args}
      onError={(error, errorInfo) => {
        console.log('Error caught by ErrorBoundary:', error);
        console.log('Component stack:', errorInfo.componentStack);
        args.onError?.(error, errorInfo);
      }}
    >
      <BuggyCounter />
    </ErrorToggle>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ErrorBoundary with a custom error callback. Check the console logs when an error occurs.',
      },
    },
  },
};

// Usage documentation
export const UsageDocumentation: Story = {
  render: () => (
    <Box sx={{ maxWidth: '800px' }}>
      <Typography variant="h5" gutterBottom>ErrorBoundary Usage</Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Basic Usage</Typography>
      <Typography variant="body2" component="pre" sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto'
      }}>
        {`
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary componentName="MyComponent">
      <ChildComponent />
    </ErrorBoundary>
  );
}
        `}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>With Custom Fallback</Typography>
      <Typography variant="body2" component="pre" sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto'
      }}>
        {`
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

// As a component
const CustomFallback = ({ error, resetError }) => (
  <div>
    <h3>Something went wrong</h3>
    <p>{error.message}</p>
    <button onClick={resetError}>Try again</button>
  </div>
);

// Option 1: Pass a component
<ErrorBoundary 
  componentName="MyComponent"
  fallback={CustomFallback}
>
  <ChildComponent />
</ErrorBoundary>

// Option 2: Pass a function
<ErrorBoundary 
  componentName="MyComponent"
  fallback={(error, resetError) => (
    <div>
      <h3>Error occurred</h3>
      <p>{error.message}</p>
      <button onClick={resetError}>Reset</button>
    </div>
  )}
>
  <ChildComponent />
</ErrorBoundary>
        `}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>With Error Callback</Typography>
      <Typography variant="body2" component="pre" sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto'
      }}>
        {`
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

<ErrorBoundary 
  componentName="MyComponent"
  onError={(error, errorInfo) => {
    // Custom error handling
    console.error('Error caught:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // You could also send to your own logging service
    myLoggingService.logError(error, {
      component: 'MyComponent',
      stack: errorInfo.componentStack
    });
  }}
>
  <ChildComponent />
</ErrorBoundary>
        `}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Silent Error Handling</Typography>
      <Typography variant="body2" component="pre" sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto'
      }}>
        {`
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

<ErrorBoundary 
  componentName="MyComponent"
  showErrorUI={false}
  onError={(error) => {
    // Handle the error without showing UI
    console.error('Silent error handling:', error);
  }}
>
  <ChildComponent />
</ErrorBoundary>
        `}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Best Practices</Typography>
      <Typography variant="body1">
        • Place ErrorBoundaries strategically at important UI boundaries
      </Typography>
      <Typography variant="body1">
        • Always provide a componentName for better error tracking
      </Typography>
      <Typography variant="body1">
        • Consider using custom fallbacks for better user experience in critical sections
      </Typography>
      <Typography variant="body1">
        • Remember that ErrorBoundaries don't catch errors in event handlers, async code, or server-side rendering
      </Typography>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Documentation showing how to use the ErrorBoundary component in your application.',
      },
    },
  },
}; 
import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Button, Stack, Divider, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

import { FeedbackProvider } from '../../components/feedback/FeedbackProvider';
import { useFeedback } from '../../components/feedback';

// Demo component that showcases different feedback types
const FeedbackDemo = () => {
  const feedback = useFeedback();
  
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Feedback Component Demo
      </Typography>
      
      <Typography variant="body1" paragraph>
        This demo shows different types of feedback notifications provided by the FeedbackProvider component.
        Click the buttons below to trigger different types of toast messages.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Basic Toast Messages
        </Typography>
        
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => feedback.showSuccess('Operation completed successfully!')}
          >
            Success Toast
          </Button>
          
          <Button 
            variant="contained" 
            color="error"
            startIcon={<ErrorIcon />}
            onClick={() => feedback.showError('An error occurred while processing your request.')}
          >
            Error Toast
          </Button>
          
          <Button 
            variant="contained" 
            color="warning"
            startIcon={<WarningIcon />}
            onClick={() => feedback.showWarning('Warning: This action cannot be undone.')}
          >
            Warning Toast
          </Button>
          
          <Button 
            variant="contained" 
            color="info"
            startIcon={<InfoIcon />}
            onClick={() => feedback.showInfo('The system will be under maintenance today.')}
          >
            Info Toast
          </Button>
        </Stack>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Custom Duration
        </Typography>
        
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button 
            variant="outlined"
            onClick={() => feedback.showSuccess('Short-lived message', 1500)}
          >
            Short (1.5s)
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => feedback.showInfo('Medium-lived message', 4000)}
          >
            Medium (4s)
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => feedback.showWarning('Long-lived message', 8000)}
          >
            Long (8s)
          </Button>
        </Stack>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Multiple Messages
        </Typography>
        
        <Button 
          variant="contained"
          onClick={() => {
            feedback.showInfo('Processing your request...', 2000);
            setTimeout(() => {
              feedback.showSuccess('Step 1 completed', 2000);
            }, 2100);
            setTimeout(() => {
              feedback.showSuccess('All steps completed successfully!', 3000);
            }, 4200);
          }}
        >
          Show Sequence
        </Button>
      </Paper>
    </Box>
  );
};

// Auto Toast Demo - automatically shows toast messages when the story loads
const AutoToastDemo = ({ toastType = 'success' }) => {
  const feedback = useFeedback();
  
  useEffect(() => {
    const showToast = () => {
      switch(toastType) {
        case 'success':
          feedback.showSuccess('Success message example');
          break;
        case 'error':
          feedback.showError('Error message example');
          break;
        case 'warning':
          feedback.showWarning('Warning message example');
          break;
        case 'info':
        default:
          feedback.showInfo('Info message example');
          break;
      }
    };
    
    // Show the toast after a short delay to ensure the component is mounted
    const timer = setTimeout(showToast, 500);
    return () => clearTimeout(timer);
  }, [feedback, toastType]);
  
  return (
    <Box sx={{ p: 4, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" align="center">
        {toastType.charAt(0).toUpperCase() + toastType.slice(1)} toast will appear automatically.
      </Typography>
    </Box>
  );
};

const meta = {
  title: 'Special/FeedbackProvider',
  component: FeedbackProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A component that provides toast notifications and feedback messages to the user.'
      }
    }
  },
  tags: ['autodocs'],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    children: <FeedbackDemo />
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo that allows triggering different types of feedback notifications.'
      }
    }
  }
};

export const SuccessToast: Story = {
  args: {
    children: <AutoToastDemo toastType="success" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a success toast notification.'
      }
    }
  }
};

export const ErrorToast: Story = {
  args: {
    children: <AutoToastDemo toastType="error" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of an error toast notification.'
      }
    }
  }
};

export const WarningToast: Story = {
  args: {
    children: <AutoToastDemo toastType="warning" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a warning toast notification.'
      }
    }
  }
};

export const InfoToast: Story = {
  args: {
    children: <AutoToastDemo toastType="info" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of an info toast notification.'
      }
    }
  }
};

export const UsageDocumentation: Story = {
  args: {
    children: <FeedbackDemo />
  },
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the FeedbackProvider Component

The \`FeedbackProvider\` component provides a context for displaying toast notifications throughout your application.

#### Basic Setup

Wrap your application with the FeedbackProvider:

\`\`\`jsx
import { FeedbackProvider } from './components/feedback';

function App() {
  return (
    <FeedbackProvider>
      <YourApplication />
    </FeedbackProvider>
  );
}
\`\`\`

#### Using Feedback in Components

Use the \`useFeedback\` hook to access feedback functions:

\`\`\`jsx
import { useFeedback } from './components/feedback';

function MyComponent() {
  const feedback = useFeedback();
  
  const handleSubmit = async () => {
    try {
      await submitForm();
      feedback.showSuccess('Form submitted successfully!');
    } catch (error) {
      feedback.showError('Failed to submit form. Please try again.');
    }
  };
  
  return (
    <Button onClick={handleSubmit}>
      Submit
    </Button>
  );
}
\`\`\`

#### Available Methods

The \`useFeedback\` hook provides the following methods:

- \`showSuccess(message, duration)\`: Shows a success toast
- \`showError(message, duration)\`: Shows an error toast
- \`showWarning(message, duration)\`: Shows a warning toast
- \`showInfo(message, duration)\`: Shows an info toast
- \`showToast(message, type, duration)\`: Generic method for showing any type of toast

The \`duration\` parameter is optional and defaults to 4000ms (4 seconds).

#### Implementation Details

The FeedbackProvider:

1. Creates a context for feedback messages
2. Renders Material-UI Snackbar and Alert components
3. Provides helper methods for different alert types
4. Manages toast visibility and timing
5. Uses an animated slide transition for a smoother UX
        `
      }
    }
  }
}; 
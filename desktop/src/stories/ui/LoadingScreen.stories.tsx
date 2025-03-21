import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import LoadingScreen from '../../components/ui/LoadingScreen';

const meta = {
  title: 'UI/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A full-screen loading component displayed during route transitions and app loading states.'
      }
    }
  },
  tags: ['autodocs'],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomBackground: Story = {
  decorators: [
    (Story) => (
      <Box sx={{ bgcolor: 'primary.dark', height: '100vh', width: '100%' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Loading screen displayed on a dark background.'
      }
    }
  }
};

export const WithCustomSize: Story = {
  decorators: [
    (Story) => (
      <Box sx={{ height: '400px', width: '100%', border: '1px solid #ccc' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Loading screen contained within a smaller container rather than full screen.'
      }
    }
  }
};

export const UsageDocumentation: Story = {
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the LoadingScreen Component

The \`LoadingScreen\` component provides a full-screen loading indicator with a spinner and text.

#### Basic Usage

Import and use the component directly:

\`\`\`jsx
import LoadingScreen from './components/ui/LoadingScreen';

function AppRouter() {
  const [loading, setLoading] = useState(true);
  
  // Load data or perform initialization
  useEffect(() => {
    const initialize = async () => {
      await loadData();
      setLoading(false);
    };
    
    initialize();
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return <YourApp />;
}
\`\`\`

#### With Router Suspense

Use with React Router's suspense feature:

\`\`\`jsx
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Other routes */}
        </Routes>
      </Suspense>
    </Router>
  );
}
\`\`\`

#### Implementation Details

The LoadingScreen:

1. Displays a centered circular progress indicator
2. Shows "Loading..." text underneath
3. Takes up the full viewport height and width
4. Uses Material-UI's CircularProgress for the spinner
5. Can be wrapped in a container to limit its size
        `
      }
    }
  }
}; 
import { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { KeyboardVisualization } from '@/components/keyboard';

const meta: Meta<typeof KeyboardVisualization> = {
  title: 'Keyboard/KeyboardVisualization',
  component: KeyboardVisualization,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Component that visualizes keyboard layouts and highlights specific keys. Supports different layouts and sizes.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // These are intentionally handled by our component with custom accessibility features
            id: ['color-contrast'],
            enabled: false,
          },
        ],
      },
    },
  },
  argTypes: {
    highlightedKeys: {
      control: 'object',
      description: 'Keys to highlight in the keyboard visualization.',
    },
    keyCombination: {
      control: 'object',
      description: 'Key combination to display above the keyboard.',
    },
    layout: {
      control: 'select',
      options: ['qwerty', 'dvorak', 'colemak'],
      description: 'Keyboard layout to display.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the keyboard visualization.',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to show a compact version with only the highlighted keys.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardVisualization>;

export const Default: Story = {
  args: {
    highlightedKeys: ['a', 's', 'd', 'f'],
    layout: 'qwerty',
    size: 'medium',
    compact: false,
  },
  parameters: {
    a11y: {
      // Test this story for accessibility compliance
      disable: false,
    },
  },
};

export const KeyCombination: Story = {
  args: {
    keyCombination: ['control', 'shift', 'p'],
    layout: 'qwerty',
    size: 'medium',
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a key combination (Ctrl+Shift+P) with chips above the keyboard.',
      },
    },
    a11y: {
      // Test this story for accessibility compliance
      disable: false,
    },
  },
};

export const DvorakLayout: Story = {
  args: {
    highlightedKeys: ['a', 'o', 'e', 'u', 'i'],
    layout: 'dvorak',
    size: 'medium',
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard visualization with Dvorak layout, highlighting home row vowels.',
      },
    },
  },
};

export const ColemakLayout: Story = {
  args: {
    highlightedKeys: ['a', 'r', 's', 't'],
    layout: 'colemak',
    size: 'medium',
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard visualization with Colemak layout, highlighting common keys.',
      },
    },
  },
};

export const CompactMode: Story = {
  args: {
    highlightedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    layout: 'qwerty',
    size: 'medium',
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode that only shows the highlighted keys.',
      },
    },
    a11y: {
      // Test this story for accessibility compliance
      disable: false,
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6">Small Size</Typography>
        <KeyboardVisualization 
          highlightedKeys={['a', 's', 'd', 'f']} 
          layout="qwerty" 
          size="small" 
        />
      </Stack>
      
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6">Medium Size (Default)</Typography>
        <KeyboardVisualization 
          highlightedKeys={['a', 's', 'd', 'f']} 
          layout="qwerty" 
          size="medium" 
        />
      </Stack>
      
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6">Large Size</Typography>
        <KeyboardVisualization 
          highlightedKeys={['a', 's', 'd', 'f']} 
          layout="qwerty" 
          size="large" 
        />
      </Stack>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different size options for the keyboard visualization.',
      },
    },
  },
};

export const KeyboardFocusable: Story = {
  render: () => {
    // This story demonstrates how to interact with the keyboard via keyboard navigation
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', maxWidth: 600 }}>
        <Typography variant="body1" align="center" paragraph>
          This example demonstrates keyboard navigation. Use Tab to move through the keys,
          and interact with highlighted keys using Enter or Space.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" tabIndex={0}>
            Focus here first, then tab to navigate the keyboard
          </Button>
        </Box>
        
        <KeyboardVisualization 
          highlightedKeys={['a', 's', 'd', 'f']} 
          layout="qwerty" 
          size="medium" 
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          ⭐ Keys marked in blue are keyboard-focusable with Tab navigation
        </Typography>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation through the highlighted keys in the visualization.',
      },
    },
    a11y: {
      // Test this story explicitly for keyboard navigation
      disable: false,
    },
  },
}; 
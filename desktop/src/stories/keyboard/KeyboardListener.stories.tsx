import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { KeyboardListener } from '@/components/keyboard';

const meta: Meta<typeof KeyboardListener> = {
  title: 'Keyboard/KeyboardListener',
  component: KeyboardListener,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Component that listens for keyboard events and passes them to a callback function. Can be configured to only listen for specific keys.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Since KeyboardListener is a non-visual component, we can disable these rules
            id: ['aria-hidden-focus', 'no-aria-hidden-body'],
            enabled: false,
          },
        ],
      },
    },
  },
  argTypes: {
    onKeyboardEvent: { action: 'keyboardEvent' },
    targetKeys: {
      control: 'object',
      description: 'Array of keys to listen for. If empty, listens for all keys.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the keyboard listener is disabled.',
    },
    ariaDescription: {
      control: 'text',
      description: 'Description for screen readers about what keys are being listened for.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardListener>;

// Wrapper component to demonstrate KeyboardListener functionality
const KeyboardListenerDemo = ({
  targetKeys,
  disabled,
  ariaDescription,
}: {
  targetKeys?: string[];
  disabled?: boolean;
  ariaDescription?: string;
}) => {
  const [lastKey, setLastKey] = useState<string>('');
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  const handleKeyboardEvent = (event: KeyboardEvent) => {
    setLastKey(event.key);
    setKeyHistory((prev) => {
      const newHistory = [...prev, event.key];
      // Keep last 5 keys
      return newHistory.slice(-5);
    });
  };

  return (
    <Box sx={{ width: 500, maxWidth: '100%' }}>
      <KeyboardListener
        onKeyboardEvent={handleKeyboardEvent}
        targetKeys={targetKeys}
        disabled={disabled}
        ariaDescription={ariaDescription}
      />
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Keyboard Listener Demo
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {disabled
            ? 'Keyboard listener is disabled'
            : targetKeys && targetKeys.length > 0
            ? `Listening for keys: ${targetKeys.join(', ')}`
            : 'Listening for all keys. Press any key to see it detected.'}
        </Typography>

        {ariaDescription && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'info.light', 
              color: 'info.contrastText',
              borderRadius: 1
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Screen Reader Announcement:
            </Typography>
            <Typography variant="body2">
              "{ariaDescription}"
            </Typography>
          </Paper>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Last key pressed:
        </Typography>
        <Chip
          label={lastKey || 'None yet'}
          color="primary"
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Recent key history:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {keyHistory.length > 0 ? (
            keyHistory.map((key, index) => (
              <Chip key={index} label={key} variant="outlined" size="small" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No keys pressed yet
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export const Default: Story = {
  render: () => <KeyboardListenerDemo />,
};

export const TargetSpecificKeys: Story = {
  render: () => <KeyboardListenerDemo targetKeys={['a', 's', 'd', 'f']} />,
  parameters: {
    docs: {
      description: {
        story: 'KeyboardListener configured to only respond to the A, S, D, and F keys.',
      },
    },
  },
};

export const DisabledListener: Story = {
  render: () => <KeyboardListenerDemo disabled={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Keyboard listener in disabled state - will not respond to any key presses.',
      },
    },
  },
};

export const ModifierKeys: Story = {
  render: () => <KeyboardListenerDemo targetKeys={['control', 'alt', 'shift', 'meta']} />,
  parameters: {
    docs: {
      description: {
        story: 'KeyboardListener configured to detect modifier keys only.',
      },
    },
  },
};

export const WithAccessibilityAnnouncement: Story = {
  render: () => (
    <KeyboardListenerDemo 
      targetKeys={['a', 's', 'd', 'f']}
      ariaDescription="Home row keys A, S, D, and F are active for this exercise. Press these keys to continue."
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'KeyboardListener with an ARIA description that will be announced to screen readers, making the keyboard interaction more accessible.',
      },
    },
    a11y: {
      // This story demonstrates accessibility features
      disable: false,
    }
  },
}; 
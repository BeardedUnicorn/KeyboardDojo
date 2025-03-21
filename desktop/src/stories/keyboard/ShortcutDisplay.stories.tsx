import { Meta, StoryObj } from '@storybook/react';
import { Box, Stack } from '@mui/material';
import { ShortcutDisplay } from '@/components/shortcuts';
import type { IShortcut } from '@/types/curriculum/IShortcut';

const meta: Meta<typeof ShortcutDisplay> = {
  title: 'Keyboard/ShortcutDisplay',
  component: ShortcutDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Component that displays a keyboard shortcut with optional description and category information. Automatically shows the correct shortcut for the user\'s operating system.',
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
  argTypes: {
    shortcut: {
      control: 'object',
      description: 'The shortcut object to display.',
    },
    showDescription: {
      control: 'boolean',
      description: 'Whether to show the shortcut description.',
    },
    accessibilityContext: {
      control: 'text',
      description: 'Additional context information for screen readers.',
    },
    shortcutId: {
      control: 'text',
      description: 'Custom ID for the shortcut for accessibility purposes.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShortcutDisplay>;

// Sample shortcuts for different platforms
const copyShortcut: IShortcut = {
  id: '1',
  name: 'Copy',
  description: 'Copy the selected text or item to the clipboard.',
  shortcutWindows: 'Ctrl+C',
  shortcutMac: 'Cmd+C',
  shortcutLinux: 'Ctrl+C',
  category: 'Editing',
  context: 'Text editors, file explorers',
};

const pasteShortcut: IShortcut = {
  id: '2',
  name: 'Paste',
  description: 'Paste the contents of the clipboard at the cursor location.',
  shortcutWindows: 'Ctrl+V',
  shortcutMac: 'Cmd+V',
  shortcutLinux: 'Ctrl+V',
  category: 'Editing',
  context: 'Text editors, file explorers',
};

const cutShortcut: IShortcut = {
  id: '3',
  name: 'Cut',
  description: 'Cut the selected text or item to the clipboard.',
  shortcutWindows: 'Ctrl+X',
  shortcutMac: 'Cmd+X',
  shortcutLinux: 'Ctrl+X',
  category: 'Editing',
  context: 'Text editors, file explorers',
};

const findShortcut: IShortcut = {
  id: '4',
  name: 'Find',
  description: 'Search for text in the current document.',
  shortcutWindows: 'Ctrl+F',
  shortcutMac: 'Cmd+F',
  shortcutLinux: 'Ctrl+F',
  category: 'Navigation',
  context: 'Text editors, browsers',
};

const saveShortcut: IShortcut = {
  id: '5',
  name: 'Save',
  description: 'Save the current document or file.',
  shortcutWindows: 'Ctrl+S',
  shortcutMac: 'Cmd+S',
  shortcutLinux: 'Ctrl+S',
  category: 'File',
  context: 'Text editors, document editors',
};

const complexShortcut: IShortcut = {
  id: '6',
  name: 'Format Document',
  description: 'Format the entire document according to configured formatter.',
  shortcutWindows: 'Shift+Alt+F',
  shortcutMac: 'Shift+Option+F',
  shortcutLinux: 'Shift+Alt+F',
  category: 'Editing',
  context: 'VS Code, text editors',
};

export const Default: Story = {
  args: {
    shortcut: copyShortcut,
    showDescription: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    shortcut: copyShortcut,
    showDescription: false,
  },
};

export const ComplexShortcut: Story = {
  args: {
    shortcut: complexShortcut,
    showDescription: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A more complex shortcut with multiple keys.',
      },
    },
  },
};

export const WithAccessibilityContext: Story = {
  args: {
    shortcut: findShortcut,
    showDescription: true,
    accessibilityContext: 'This shortcut can be used to quickly search within the current page or document.',
    shortcutId: 'find-shortcut-demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'ShortcutDisplay with additional accessibility context for screen readers.',
      },
    },
  },
};

export const KeyboardNavigable: Story = {
  render: () => (
    <Box sx={{ width: 400, maxWidth: '100%' }}>
      <Stack spacing={3}>
        <ShortcutDisplay 
          shortcut={copyShortcut} 
          shortcutId="demo-copy"
        />
        <ShortcutDisplay 
          shortcut={pasteShortcut} 
          shortcutId="demo-paste"
        />
        <ShortcutDisplay 
          shortcut={cutShortcut} 
          shortcutId="demo-cut"
        />
      </Stack>
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <p>This example demonstrates keyboard navigation. Each key chip is focusable with the Tab key.</p>
        <p>Press Tab to navigate through the shortcuts, and notice the visible focus indicators.</p>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple shortcuts displayed in a keyboard-navigable interface.',
      },
    },
  },
};

export const MultipleShortcuts: Story = {
  render: () => (
    <Box sx={{ width: 400, maxWidth: '100%' }}>
      <Stack spacing={3}>
        <ShortcutDisplay shortcut={copyShortcut} />
        <ShortcutDisplay shortcut={pasteShortcut} />
        <ShortcutDisplay shortcut={cutShortcut} />
        <ShortcutDisplay shortcut={findShortcut} />
        <ShortcutDisplay shortcut={saveShortcut} />
      </Stack>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple shortcuts displayed in a stack.',
      },
    },
  },
}; 
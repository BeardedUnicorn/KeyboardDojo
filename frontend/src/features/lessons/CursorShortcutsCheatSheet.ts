interface ShortcutCategory {
  category: string;
  shortcuts: {
    action: string;
    shortcut: string;
    description?: string;
  }[];
}

const cursorShortcutsCheatSheet: ShortcutCategory[] = [
  {
    category: 'General',
    shortcuts: [
      { action: 'Open Agent', shortcut: 'Cmd + I', description: 'Opens the Cursor AI Agent for assistance' },
      { action: 'Open Ask', shortcut: 'Cmd + L', description: 'Opens the Ask interface to query the AI' },
      { action: 'Toggle Chat Modes', shortcut: 'Cmd + .', description: 'Switch between different chat modes' },
      { action: 'Loop between AI models', shortcut: 'Cmd + /', description: 'Cycle through available AI models' },
      { action: 'Open Cursor settings', shortcut: 'Cmd + Shift + J', description: 'Access Cursor-specific settings' },
      { action: 'Open General settings', shortcut: 'Cmd + ,', description: 'Access general editor settings' },
      { action: 'Open command palette', shortcut: 'Cmd + Shift + P', description: 'Access all available commands' }
    ]
  },
  {
    category: 'Chat - Agent, Edit & Ask',
    shortcuts: [
      { action: 'Submit', shortcut: 'Enter', description: 'Submit your message or query' },
      { action: 'Cancel generation', shortcut: 'Cmd + Backspace', description: 'Stop the AI generation' },
      { action: 'Add selected code as context', shortcut: 'Cmd + L (with code selected)', description: 'Add code to chat' },
      { action: 'Add selected code as context (alt)', shortcut: 'Cmd + Shift + L (with code selected)', description: 'Alternative way to add code' },
      { action: 'Accept all changes', shortcut: 'Cmd + Enter', description: 'Accept all AI suggestions' },
      { action: 'Reject all changes', shortcut: 'Cmd + Backspace', description: 'Reject all AI suggestions' },
      { action: 'Cycle to next message', shortcut: 'Tab', description: 'Navigate to next message' },
      { action: 'Cycle to previous message', shortcut: 'Shift + Tab', description: 'Navigate to previous message' },
      { action: 'Open model toggle', shortcut: 'Cmd + Alt + /', description: 'Open AI model selection' },
      { action: 'Create new chat', shortcut: 'Cmd + N / Cmd + R', description: 'Start a new chat session' },
      { action: 'Open composer as bar', shortcut: 'Cmd + Shift + K', description: 'Open composer interface' },
      { action: 'Open previous chat', shortcut: 'Cmd + [', description: 'Go to previous chat' },
      { action: 'Open next chat', shortcut: 'Cmd + ]', description: 'Go to next chat' },
      { action: 'Close chat', shortcut: 'Cmd + W', description: 'Close current chat' },
      { action: 'Unfocus the field', shortcut: 'Esc', description: 'Remove focus from chat input' }
    ]
  },
  {
    category: 'Cmd+K',
    shortcuts: [
      { action: 'Open', shortcut: 'Cmd + K', description: 'Open command palette' },
      { action: 'Toggle input focus', shortcut: 'Cmd + Shift + K', description: 'Focus on command input' },
      { action: 'Submit', shortcut: 'Enter', description: 'Submit command' },
      { action: 'Cancel', shortcut: 'Cmd + Backspace', description: 'Cancel command' },
      { action: 'Ask quick question', shortcut: 'Option + Enter', description: 'Ask without full chat' }
    ]
  },
  {
    category: 'Code Selection & Context',
    shortcuts: [
      { action: '@-symbols', shortcut: '@', description: 'Access context symbols' },
      { action: 'Files', shortcut: '#', description: 'Access file references' },
      { action: 'Shortcut Commands', shortcut: '/', description: 'Access shortcut commands' },
      { action: 'Add selection to Chat', shortcut: 'Cmd + Shift + L', description: 'Add code to current chat' },
      { action: 'Add selection to Edit', shortcut: 'Cmd + Shift + K', description: 'Add code to Edit mode' },
      { action: 'Add selection to new chat', shortcut: 'Cmd + L', description: 'Add code to new chat' },
      { action: 'Toggle file reading strategies', shortcut: 'Cmd + M', description: 'Switch reading modes' },
      { action: 'Accept next word of suggestion', shortcut: 'Cmd + →', description: 'Accept only next word' },
      { action: 'Search codebase in chat', shortcut: 'Cmd + Enter', description: 'Search through codebase' },
      { action: 'Add copied reference code as context', shortcut: 'Select code, Cmd + C, Cmd + V', description: 'Add as reference' },
      { action: 'Add copied code as text context', shortcut: 'Select code, Cmd + C, Cmd + Shift + V', description: 'Add as text' }
    ]
  },
  {
    category: 'Tab',
    shortcuts: [
      { action: 'Accept suggestion', shortcut: 'Tab', description: 'Accept AI suggestion' },
      { action: 'Accept next word', shortcut: 'Cmd + →', description: 'Accept only next word' }
    ]
  },
  {
    category: 'Terminal',
    shortcuts: [
      { action: 'Open terminal prompt bar', shortcut: 'Cmd + K', description: 'Open AI prompt in terminal' },
      { action: 'Run generated command', shortcut: 'Cmd + Enter', description: 'Execute AI command' },
      { action: 'Accept command', shortcut: 'Esc', description: 'Accept without running' }
    ]
  }
];

export default cursorShortcutsCheatSheet; 
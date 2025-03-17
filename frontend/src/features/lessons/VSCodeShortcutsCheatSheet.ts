interface ShortcutCategory {
  category: string;
  shortcuts: {
    action: string;
    shortcut: string;
    description?: string;
  }[];
}

const vsCodeShortcutsCheatSheet: ShortcutCategory[] = [
  {
    category: 'Essential Navigation',
    shortcuts: [
      { action: 'Quick Open', shortcut: 'Ctrl + P / Cmd + P', description: 'Quickly open files by name' },
      { action: 'Command Palette', shortcut: 'Ctrl + Shift + P / Cmd + Shift + P', description: 'Access all commands' },
      { action: 'Go to Line', shortcut: 'Ctrl + G / Cmd + G', description: 'Jump to a specific line number' },
      { action: 'Go to Symbol', shortcut: 'Ctrl + Shift + O / Cmd + Shift + O', description: 'Navigate to symbols in file' },
      { action: 'Go to Definition', shortcut: 'F12', description: 'Jump to definition of symbol' },
      { action: 'Go Back', shortcut: 'Alt + Left / Cmd + [', description: 'Navigate back to previous location' },
      { action: 'Go Forward', shortcut: 'Alt + Right / Cmd + ]', description: 'Navigate forward to next location' }
    ]
  },
  {
    category: 'Cursor AI Features',
    shortcuts: [
      { action: 'Open Agent', shortcut: 'Ctrl + I / Cmd + I', description: 'Opens the Cursor AI Agent for assistance' },
      { action: 'Open Ask', shortcut: 'Ctrl + L / Cmd + L', description: 'Opens the Ask interface to query the AI' },
      { action: 'Toggle Chat Modes', shortcut: 'Ctrl + . / Cmd + .', description: 'Switch between different chat modes' },
      { action: 'Loop between AI models', shortcut: 'Ctrl + / / Cmd + /', description: 'Cycle through available AI models' },
      { action: 'Open Cursor settings', shortcut: 'Ctrl + Shift + J / Cmd + Shift + J', description: 'Access Cursor-specific settings' },
      { action: 'Add selected code as context', shortcut: 'Ctrl + Shift + L / Cmd + Shift + L', description: 'Add code to chat' },
      { action: 'Accept all changes', shortcut: 'Ctrl + Enter / Cmd + Enter', description: 'Accept all AI suggestions' },
      { action: 'Reject all changes', shortcut: 'Ctrl + Backspace / Cmd + Backspace', description: 'Reject all AI suggestions' },
      { action: 'Open command palette', shortcut: 'Ctrl + K / Cmd + K', description: 'Open AI command palette' }
    ]
  },
  {
    category: 'Editing',
    shortcuts: [
      { action: 'Multi-cursor (click)', shortcut: 'Alt + Click / Option + Click', description: 'Add cursor at click position' },
      { action: 'Multi-cursor (line)', shortcut: 'Ctrl + Alt + Up/Down / Cmd + Option + Up/Down', description: 'Add cursor above/below' },
      { action: 'Select Current Line', shortcut: 'Ctrl + L / Cmd + L', description: 'Select the entire current line' },
      { action: 'Duplicate Line', shortcut: 'Shift + Alt + Down / Shift + Option + Down', description: 'Duplicate current line or selection' },
      { action: 'Move Line Up/Down', shortcut: 'Alt + Up/Down / Option + Up/Down', description: 'Move current line or selection up/down' },
      { action: 'Delete Line', shortcut: 'Ctrl + Shift + K / Cmd + Shift + K', description: 'Delete the current line' },
      { action: 'Insert Line Below', shortcut: 'Ctrl + Enter / Cmd + Enter', description: 'Insert new line below current line' },
      { action: 'Insert Line Above', shortcut: 'Ctrl + Shift + Enter / Cmd + Shift + Enter', description: 'Insert new line above current line' }
    ]
  },
  {
    category: 'Search and Replace',
    shortcuts: [
      { action: 'Find', shortcut: 'Ctrl + F / Cmd + F', description: 'Search in current file' },
      { action: 'Replace', shortcut: 'Ctrl + H / Cmd + Option + F', description: 'Replace in current file' },
      { action: 'Find Next', shortcut: 'F3 / Cmd + G', description: 'Find next occurrence' },
      { action: 'Find Previous', shortcut: 'Shift + F3 / Cmd + Shift + G', description: 'Find previous occurrence' },
      { action: 'Find in Files', shortcut: 'Ctrl + Shift + F / Cmd + Shift + F', description: 'Search across all files' },
      { action: 'Replace in Files', shortcut: 'Ctrl + Shift + H / Cmd + Shift + H', description: 'Replace across all files' }
    ]
  },
  {
    category: 'Code Navigation',
    shortcuts: [
      { action: 'Go to Definition', shortcut: 'F12', description: 'Jump to definition of symbol' },
      { action: 'Peek Definition', shortcut: 'Alt + F12 / Option + F12', description: 'Show definition inline' },
      { action: 'Find All References', shortcut: 'Shift + F12', description: 'Find all references to symbol' },
      { action: 'Go to Symbol in Workspace', shortcut: 'Ctrl + T / Cmd + T', description: 'Navigate to symbol in workspace' },
      { action: 'Go to Implementation', shortcut: 'Ctrl + F12 / Cmd + F12', description: 'Go to implementation of interface' },
      { action: 'Go to Type Definition', shortcut: 'Ctrl + Shift + T / Cmd + Shift + T', description: 'Go to type definition' }
    ]
  },
  {
    category: 'Workspace Management',
    shortcuts: [
      { action: 'Split Editor', shortcut: 'Ctrl + \\ / Cmd + \\', description: 'Split editor to view files side by side' },
      { action: 'Toggle Sidebar', shortcut: 'Ctrl + B / Cmd + B', description: 'Show or hide sidebar' },
      { action: 'Toggle Terminal', shortcut: 'Ctrl + ` / Cmd + `', description: 'Show or hide terminal' },
      { action: 'New Window', shortcut: 'Ctrl + Shift + N / Cmd + Shift + N', description: 'Open new window/instance' },
      { action: 'Close Window', shortcut: 'Alt + F4 / Cmd + W', description: 'Close current window' },
      { action: 'Switch Editor', shortcut: 'Ctrl + Tab / Cmd + Tab', description: 'Switch between open editors' }
    ]
  },
  {
    category: 'Debugging',
    shortcuts: [
      { action: 'Start Debugging', shortcut: 'F5', description: 'Start debugging session' },
      { action: 'Stop Debugging', shortcut: 'Shift + F5', description: 'Stop debugging session' },
      { action: 'Toggle Breakpoint', shortcut: 'F9', description: 'Add/remove breakpoint at current line' },
      { action: 'Step Over', shortcut: 'F10', description: 'Execute current line and move to next line' },
      { action: 'Step Into', shortcut: 'F11', description: 'Step into function call' },
      { action: 'Step Out', shortcut: 'Shift + F11', description: 'Step out of current function' },
      { action: 'Continue', shortcut: 'F5', description: 'Continue execution to next breakpoint' }
    ]
  },
  {
    category: 'File Operations',
    shortcuts: [
      { action: 'New File', shortcut: 'Ctrl + N / Cmd + N', description: 'Create new file' },
      { action: 'Open File', shortcut: 'Ctrl + O / Cmd + O', description: 'Open file' },
      { action: 'Save', shortcut: 'Ctrl + S / Cmd + S', description: 'Save current file' },
      { action: 'Save As', shortcut: 'Ctrl + Shift + S / Cmd + Shift + S', description: 'Save file with new name' },
      { action: 'Save All', shortcut: 'Ctrl + K S / Cmd + Option + S', description: 'Save all open files' },
      { action: 'Close Editor', shortcut: 'Ctrl + F4 / Cmd + W', description: 'Close current editor' },
      { action: 'Close All', shortcut: 'Ctrl + K W / Cmd + K W', description: 'Close all editors' }
    ]
  }
];

export default vsCodeShortcutsCheatSheet; 
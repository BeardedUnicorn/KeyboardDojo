interface ShortcutCategory {
  category: string;
  shortcuts: {
    action: string;
    shortcut: string;
    description?: string;
  }[];
}

const intelliJShortcutsCheatSheet: ShortcutCategory[] = [
  {
    category: 'Essential Navigation',
    shortcuts: [
      { action: 'Search Everywhere', shortcut: 'Shift + Shift', description: 'Search for any file, class, symbol, or action' },
      { action: 'Find Action', shortcut: 'Ctrl + Shift + A / Cmd + Shift + A', description: 'Search for IDE actions and settings' },
      { action: 'Go to Class', shortcut: 'Ctrl + N / Cmd + O', description: 'Navigate to a class by name' },
      { action: 'Go to File', shortcut: 'Ctrl + Shift + N / Cmd + Shift + O', description: 'Navigate to a file by name' },
      { action: 'Go to Symbol', shortcut: 'Ctrl + Alt + Shift + N / Cmd + Option + O', description: 'Navigate to a symbol by name' },
      { action: 'Recent Files', shortcut: 'Ctrl + E / Cmd + E', description: 'Show recently opened files' },
      { action: 'Navigate Back', shortcut: 'Ctrl + Alt + Left / Cmd + Option + Left', description: 'Navigate to previous location' },
      { action: 'Navigate Forward', shortcut: 'Ctrl + Alt + Right / Cmd + Option + Right', description: 'Navigate to next location' }
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
      { action: 'Basic Completion', shortcut: 'Ctrl + Space', description: 'Show basic code completion suggestions' },
      { action: 'Smart Completion', shortcut: 'Ctrl + Shift + Space', description: 'Show context-aware completion suggestions' },
      { action: 'Statement Completion', shortcut: 'Ctrl + Shift + Enter', description: 'Complete current statement' },
      { action: 'Duplicate Line', shortcut: 'Ctrl + D / Cmd + D', description: 'Duplicate current line or selection' },
      { action: 'Delete Line', shortcut: 'Ctrl + Y / Cmd + Delete', description: 'Delete current line' },
      { action: 'Comment Line', shortcut: 'Ctrl + / / Cmd + /', description: 'Comment/uncomment current line' },
      { action: 'Comment Block', shortcut: 'Ctrl + Shift + / / Cmd + Option + /', description: 'Comment/uncomment code block' },
      { action: 'Extend/Shrink Selection', shortcut: 'Ctrl + W / Cmd + W', description: 'Extend selection incrementally' }
    ]
  },
  {
    category: 'Code Refactoring',
    shortcuts: [
      { action: 'Rename', shortcut: 'Shift + F6', description: 'Rename symbol and update all references' },
      { action: 'Extract Method', shortcut: 'Ctrl + Alt + M / Cmd + Option + M', description: 'Extract selected code into a method' },
      { action: 'Extract Variable', shortcut: 'Ctrl + Alt + V / Cmd + Option + V', description: 'Extract selected expression into a variable' },
      { action: 'Extract Field', shortcut: 'Ctrl + Alt + F / Cmd + Option + F', description: 'Extract selected expression into a field' },
      { action: 'Extract Parameter', shortcut: 'Ctrl + Alt + P / Cmd + Option + P', description: 'Extract selected expression into a parameter' },
      { action: 'Extract Constant', shortcut: 'Ctrl + Alt + C / Cmd + Option + C', description: 'Extract selected expression into a constant' },
      { action: 'Inline', shortcut: 'Ctrl + Alt + N / Cmd + Option + N', description: 'Inline variable, method, or parameter' }
    ]
  },
  {
    category: 'Code Navigation',
    shortcuts: [
      { action: 'Go to Declaration', shortcut: 'Ctrl + B / Cmd + B', description: 'Navigate to declaration of symbol' },
      { action: 'Go to Implementation', shortcut: 'Ctrl + Alt + B / Cmd + Option + B', description: 'Navigate to implementation of interface or abstract method' },
      { action: 'Go to Super Method', shortcut: 'Ctrl + U / Cmd + U', description: 'Navigate to super method or class' },
      { action: 'Find Usages', shortcut: 'Alt + F7 / Option + F7', description: 'Find all usages of symbol' },
      { action: 'Show Usages', shortcut: 'Ctrl + Alt + F7 / Cmd + Option + F7', description: 'Show usages of symbol in popup' },
      { action: 'File Structure', shortcut: 'Ctrl + F12 / Cmd + F12', description: 'Show structure of current file' }
    ]
  },
  {
    category: 'Search and Replace',
    shortcuts: [
      { action: 'Find', shortcut: 'Ctrl + F / Cmd + F', description: 'Search in current file' },
      { action: 'Replace', shortcut: 'Ctrl + R / Cmd + R', description: 'Replace in current file' },
      { action: 'Find Next', shortcut: 'F3', description: 'Find next occurrence' },
      { action: 'Find Previous', shortcut: 'Shift + F3', description: 'Find previous occurrence' },
      { action: 'Find in Path', shortcut: 'Ctrl + Shift + F / Cmd + Shift + F', description: 'Search across all files' },
      { action: 'Replace in Path', shortcut: 'Ctrl + Shift + R / Cmd + Shift + R', description: 'Replace across all files' }
    ]
  },
  {
    category: 'Debugging',
    shortcuts: [
      { action: 'Debug', shortcut: 'Shift + F9 / Ctrl + D', description: 'Start debugging session' },
      { action: 'Run', shortcut: 'Shift + F10 / Ctrl + R', description: 'Run application without debugging' },
      { action: 'Toggle Breakpoint', shortcut: 'Ctrl + F8 / Cmd + F8', description: 'Add/remove breakpoint at current line' },
      { action: 'Step Over', shortcut: 'F8', description: 'Execute current line and move to next line' },
      { action: 'Step Into', shortcut: 'F7', description: 'Step into method call' },
      { action: 'Step Out', shortcut: 'Shift + F8', description: 'Step out of current method' },
      { action: 'Resume Program', shortcut: 'F9', description: 'Continue execution to next breakpoint' },
      { action: 'Evaluate Expression', shortcut: 'Alt + F8 / Option + F8', description: 'Evaluate expression during debugging' }
    ]
  },
  {
    category: 'Version Control',
    shortcuts: [
      { action: 'Commit Changes', shortcut: 'Ctrl + K / Cmd + K', description: 'Open commit dialog' },
      { action: 'Update Project', shortcut: 'Ctrl + T / Cmd + T', description: 'Update project from version control' },
      { action: 'Show Diff', shortcut: 'Ctrl + D / Cmd + D', description: 'Show diff for selected file' },
      { action: 'VCS Operations Popup', shortcut: 'Alt + ` / Ctrl + V', description: 'Show VCS operations popup' },
      { action: 'Show History', shortcut: 'Ctrl + Shift + H / Cmd + Shift + H', description: 'Show history for selected file or directory' },
      { action: 'Annotate', shortcut: 'Ctrl + Alt + A / Cmd + Option + A', description: 'Show annotations (blame) for current file' }
    ]
  },
  {
    category: 'Code Generation',
    shortcuts: [
      { action: 'Generate Code', shortcut: 'Alt + Insert / Cmd + N', description: 'Generate code (constructors, methods, etc.)' },
      { action: 'Override Methods', shortcut: 'Ctrl + O / Ctrl + O', description: 'Override methods from superclass' },
      { action: 'Implement Methods', shortcut: 'Ctrl + I / Ctrl + I', description: 'Implement methods from interfaces' },
      { action: 'Surround With', shortcut: 'Ctrl + Alt + T / Cmd + Option + T', description: 'Surround code with constructs (try/catch, if, etc.)' },
      { action: 'Complete Current Statement', shortcut: 'Ctrl + Shift + Enter / Cmd + Shift + Enter', description: 'Complete statement with necessary syntax' }
    ]
  }
];

export default intelliJShortcutsCheatSheet; 
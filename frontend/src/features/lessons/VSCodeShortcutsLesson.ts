import { Lesson } from '../../api/lessonsService';

const vsCodeShortcutsLesson: Lesson = {
  lessonId: 'vscode-shortcuts',
  id: 'vscode-shortcuts-2023',
  title: 'VS Code Keyboard Shortcuts Mastery',
  description: 'Master the essential keyboard shortcuts in Visual Studio Code to boost your coding productivity.',
  category: 'tools',
  difficulty: 'beginner',
  order: 2,
  isPremium: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# VS Code Keyboard Shortcuts Mastery

## Introduction

Visual Studio Code (VS Code) is one of the most popular code editors used by developers worldwide. Mastering keyboard shortcuts is essential for maximizing your productivity with VS Code.

This lesson will guide you through all the important shortcuts in VS Code, organized by category. You'll learn when and how to use each shortcut, practice with interactive exercises, and build the muscle memory needed to code efficiently.

> **Note:** On Mac, shortcuts use the Command (⌘) key, while on Windows, they use the Control (Ctrl) key. Throughout this lesson, we'll use both notations where applicable.

Let's get started with mastering VS Code shortcuts!
    `,
    shortcuts: [
      // Essential Navigation Shortcuts
      {
        id: 'navigation-quick-open',
        name: 'Quick Open',
        description: 'Quickly open files in your project by typing their name.',
        keyCombination: ['Ctrl', 'P'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'navigation-quick-open-mac',
        name: 'Quick Open',
        description: 'Quickly open files in your project by typing their name.',
        keyCombination: ['Cmd', 'P'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'navigation-quick-open-linux',
        name: 'Quick Open',
        description: 'Quickly open files in your project by typing their name.',
        keyCombination: ['Ctrl', 'P'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'navigation-go-to-line',
        name: 'Go to Line',
        description: 'Jump to a specific line number in the current file.',
        keyCombination: ['Ctrl', 'G'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'navigation-go-to-line-mac',
        name: 'Go to Line',
        description: 'Jump to a specific line number in the current file.',
        keyCombination: ['Cmd', 'G'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'navigation-go-to-line-linux',
        name: 'Go to Line',
        description: 'Jump to a specific line number in the current file.',
        keyCombination: ['Ctrl', 'G'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'navigation-command-palette',
        name: 'Command Palette',
        description: 'Access all available commands based on your current context.',
        keyCombination: ['Ctrl', 'Shift', 'P'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'navigation-command-palette-mac',
        name: 'Command Palette',
        description: 'Access all available commands based on your current context.',
        keyCombination: ['Cmd', 'Shift', 'P'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'navigation-command-palette-linux',
        name: 'Command Palette',
        description: 'Access all available commands based on your current context.',
        keyCombination: ['Ctrl', 'Shift', 'P'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      
      // Essential Editing Shortcuts
      {
        id: 'editing-multi-cursor',
        name: 'Add Cursor at Position',
        description: 'Add additional cursors to edit multiple lines simultaneously.',
        keyCombination: ['Alt', 'Click'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-multi-cursor-mac',
        name: 'Add Cursor at Position',
        description: 'Add additional cursors to edit multiple lines simultaneously.',
        keyCombination: ['Option', 'Click'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-multi-cursor-linux',
        name: 'Add Cursor at Position',
        description: 'Add additional cursors to edit multiple lines simultaneously.',
        keyCombination: ['Alt', 'Click'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'editing-select-line',
        name: 'Select Current Line',
        description: 'Select the entire current line.',
        keyCombination: ['Ctrl', 'L'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-select-line-mac',
        name: 'Select Current Line',
        description: 'Select the entire current line.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-select-line-linux',
        name: 'Select Current Line',
        description: 'Select the entire current line.',
        keyCombination: ['Ctrl', 'L'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line',
        name: 'Duplicate Line',
        description: 'Duplicate the current line or selection.',
        keyCombination: ['Shift', 'Alt', 'Down'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line-mac',
        name: 'Duplicate Line',
        description: 'Duplicate the current line or selection.',
        keyCombination: ['Shift', 'Option', 'Down'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line-linux',
        name: 'Duplicate Line',
        description: 'Duplicate the current line or selection.',
        keyCombination: ['Shift', 'Alt', 'Down'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Code Navigation Shortcuts
      {
        id: 'code-nav-definition',
        name: 'Go to Definition',
        description: 'Jump to the definition of a symbol.',
        keyCombination: ['F12'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'code-nav-definition-mac',
        name: 'Go to Definition',
        description: 'Jump to the definition of a symbol.',
        keyCombination: ['F12'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'code-nav-definition-linux',
        name: 'Go to Definition',
        description: 'Jump to the definition of a symbol.',
        keyCombination: ['F12'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'code-nav-references',
        name: 'Find All References',
        description: 'Find all references to a symbol.',
        keyCombination: ['Shift', 'F12'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'code-nav-references-mac',
        name: 'Find All References',
        description: 'Find all references to a symbol.',
        keyCombination: ['Shift', 'F12'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'code-nav-references-linux',
        name: 'Find All References',
        description: 'Find all references to a symbol.',
        keyCombination: ['Shift', 'F12'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Search and Replace Shortcuts
      {
        id: 'search-find',
        name: 'Find',
        description: 'Search for text in the current file.',
        keyCombination: ['Ctrl', 'F'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'search-find-mac',
        name: 'Find',
        description: 'Search for text in the current file.',
        keyCombination: ['Cmd', 'F'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'search-find-linux',
        name: 'Find',
        description: 'Search for text in the current file.',
        keyCombination: ['Ctrl', 'F'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'search-replace',
        name: 'Replace',
        description: 'Search and replace text in the current file.',
        keyCombination: ['Ctrl', 'H'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'search-replace-mac',
        name: 'Replace',
        description: 'Search and replace text in the current file.',
        keyCombination: ['Cmd', 'Option', 'F'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'search-replace-linux',
        name: 'Replace',
        description: 'Search and replace text in the current file.',
        keyCombination: ['Ctrl', 'H'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Workspace Management Shortcuts
      {
        id: 'workspace-split-editor',
        name: 'Split Editor',
        description: 'Split the editor to view multiple files side by side.',
        keyCombination: ['Ctrl', '\\'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'workspace-split-editor-mac',
        name: 'Split Editor',
        description: 'Split the editor to view multiple files side by side.',
        keyCombination: ['Cmd', '\\'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'workspace-split-editor-linux',
        name: 'Split Editor',
        description: 'Split the editor to view multiple files side by side.',
        keyCombination: ['Ctrl', '\\'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'workspace-toggle-sidebar',
        name: 'Toggle Sidebar',
        description: 'Show or hide the sidebar.',
        keyCombination: ['Ctrl', 'B'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'workspace-toggle-sidebar-mac',
        name: 'Toggle Sidebar',
        description: 'Show or hide the sidebar.',
        keyCombination: ['Cmd', 'B'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'workspace-toggle-sidebar-linux',
        name: 'Toggle Sidebar',
        description: 'Show or hide the sidebar.',
        keyCombination: ['Ctrl', 'B'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      
      // Debugging Shortcuts
      {
        id: 'debug-start',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['F5'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'debug-start-mac',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['F5'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'debug-start-linux',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['F5'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'debug-toggle-breakpoint',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['F9'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'debug-toggle-breakpoint-mac',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['F9'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'debug-toggle-breakpoint-linux',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['F9'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Cursor AI-Specific Shortcuts
      {
        id: 'cursor-agent',
        name: 'Open Agent',
        description: 'Opens the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Ctrl', 'I'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'cursor-agent-mac',
        name: 'Open Agent',
        description: 'Opens the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Cmd', 'I'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'cursor-agent-linux',
        name: 'Open Agent',
        description: 'Opens the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Ctrl', 'I'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'cursor-ask',
        name: 'Open Ask',
        description: 'Opens the Ask interface to query the AI about code.',
        keyCombination: ['Ctrl', 'L'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'cursor-ask-mac',
        name: 'Open Ask',
        description: 'Opens the Ask interface to query the AI about code.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'cursor-ask-linux',
        name: 'Open Ask',
        description: 'Opens the Ask interface to query the AI about code.',
        keyCombination: ['Ctrl', 'L'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'cursor-toggle-chat',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Ctrl', '.'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'cursor-toggle-chat-mac',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Cmd', '.'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'cursor-toggle-chat-linux',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Ctrl', '.'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'cursor-loop-models',
        name: 'Loop between AI models',
        description: 'Cycle through available AI models for different capabilities.',
        keyCombination: ['Ctrl', '/'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'cursor-loop-models-mac',
        name: 'Loop between AI models',
        description: 'Cycle through available AI models for different capabilities.',
        keyCombination: ['Cmd', '/'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'cursor-loop-models-linux',
        name: 'Loop between AI models',
        description: 'Cycle through available AI models for different capabilities.',
        keyCombination: ['Ctrl', '/'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'cursor-settings',
        name: 'Open Cursor settings',
        description: 'Access Cursor-specific settings and configurations.',
        keyCombination: ['Ctrl', 'Shift', 'J'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'cursor-settings-mac',
        name: 'Open Cursor settings',
        description: 'Access Cursor-specific settings and configurations.',
        keyCombination: ['Cmd', 'Shift', 'J'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'cursor-settings-linux',
        name: 'Open Cursor settings',
        description: 'Access Cursor-specific settings and configurations.',
        keyCombination: ['Ctrl', 'Shift', 'J'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'cursor-add-code-context',
        name: 'Add selected code as context',
        description: 'Add selected code to chat for context.',
        keyCombination: ['Ctrl', 'Shift', 'L'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'cursor-add-code-context-mac',
        name: 'Add selected code as context',
        description: 'Add selected code to chat for context.',
        keyCombination: ['Cmd', 'Shift', 'L'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'cursor-add-code-context-linux',
        name: 'Add selected code as context',
        description: 'Add selected code to chat for context.',
        keyCombination: ['Ctrl', 'Shift', 'L'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'cursor-accept-changes',
        name: 'Accept all changes',
        description: 'Accept all AI suggestions.',
        keyCombination: ['Ctrl', 'Enter'],
        operatingSystem: 'windows',
        context: 'Chat'
      },
      {
        id: 'cursor-accept-changes-mac',
        name: 'Accept all changes',
        description: 'Accept all AI suggestions.',
        keyCombination: ['Cmd', 'Enter'],
        operatingSystem: 'mac',
        context: 'Chat'
      },
      {
        id: 'cursor-accept-changes-linux',
        name: 'Accept all changes',
        description: 'Accept all AI suggestions.',
        keyCombination: ['Ctrl', 'Enter'],
        operatingSystem: 'linux',
        context: 'Chat'
      },
      {
        id: 'cursor-reject-changes',
        name: 'Reject all changes',
        description: 'Reject all AI suggestions.',
        keyCombination: ['Ctrl', 'Backspace'],
        operatingSystem: 'windows',
        context: 'Chat'
      },
      {
        id: 'cursor-reject-changes-mac',
        name: 'Reject all changes',
        description: 'Reject all AI suggestions.',
        keyCombination: ['Cmd', 'Backspace'],
        operatingSystem: 'mac',
        context: 'Chat'
      },
      {
        id: 'cursor-reject-changes-linux',
        name: 'Reject all changes',
        description: 'Reject all AI suggestions.',
        keyCombination: ['Ctrl', 'Backspace'],
        operatingSystem: 'linux',
        context: 'Chat'
      }
    ],
    tips: [
      "Use Quick Open (Ctrl+P/Cmd+P) to navigate between files without using the mouse.",
      "The Command Palette (Ctrl+Shift+P/Cmd+Shift+P) gives you access to all VS Code commands.",
      "Multi-cursor editing (Alt+Click/Option+Click) is powerful for making the same edit in multiple places.",
      "Learn to use Go to Definition (F12) to navigate your codebase efficiently.",
      "Split editors (Ctrl+\\/Cmd+\\) to view multiple files side by side.",
      "Use keyboard shortcuts for debugging to step through code without reaching for the mouse.",
      "Customize your keyboard shortcuts in the Keyboard Shortcuts editor (Ctrl+K Ctrl+S/Cmd+K Cmd+S).",
      "Practice these shortcuts regularly to build muscle memory.",
      "Start with the most common shortcuts first, then gradually learn more advanced ones.",
      "In Cursor, use Cmd+I/Ctrl+I to open the AI Agent for assistance with coding tasks.",
      "Use Cmd+L/Ctrl+L to open the Ask interface to query the AI about code.",
      "Switch between different chat modes with Cmd+./Ctrl+."
    ]
  }
};

export default vsCodeShortcutsLesson; 
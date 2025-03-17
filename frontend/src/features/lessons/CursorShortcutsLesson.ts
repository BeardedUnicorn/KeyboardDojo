import { Lesson } from '../../api/lessonsService';

const cursorShortcutsLesson: Lesson = {
  lessonId: 'cursor-shortcuts',
  id: 'cursor-shortcuts-2023',
  title: 'Cursor Keyboard Shortcuts Mastery',
  description: 'Master the essential keyboard shortcuts in Cursor to boost your coding productivity with AI assistance.',
  category: 'tools',
  difficulty: 'beginner',
  order: 1,
  isPremium: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# Cursor Keyboard Shortcuts Mastery

## Introduction

Cursor is an AI-powered code editor built on VS Code that enhances your coding experience with intelligent features. Mastering keyboard shortcuts is essential for maximizing your productivity with Cursor.

This lesson will guide you through all the important shortcuts in Cursor, organized by category. You'll learn when and how to use each shortcut, practice with interactive exercises, and build the muscle memory needed to code efficiently.

> **Note:** On Mac, shortcuts use the Command (⌘) key, while on Windows, they use the Control (Ctrl) key. Throughout this lesson, we'll use the Mac notation (Cmd), but Windows users should substitute Ctrl.

Let's get started with mastering Cursor shortcuts!
    `,
    shortcuts: [
      // General Shortcuts
      {
        id: 'general-agent',
        name: 'Open Agent',
        description: 'Opens the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Cmd', 'I'],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-ask',
        name: 'Open Ask',
        description: 'Opens the Ask interface to query the AI about code.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-toggle-chat',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Cmd', '.'],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-loop-models',
        name: 'Loop between AI models',
        description: 'Cycle through available AI models for different capabilities.',
        keyCombination: ['Cmd', '/'],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-cursor-settings',
        name: 'Open Cursor settings',
        description: 'Access Cursor-specific settings and configurations.',
        keyCombination: ['Cmd', 'Shift', 'J'],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-settings',
        name: 'Open General settings',
        description: 'Access general editor settings.',
        keyCombination: ['Cmd', ','],
        operatingSystem: 'all',
        context: 'general'
      },
      {
        id: 'general-command-palette',
        name: 'Open command palette',
        description: 'Access all available commands in Cursor.',
        keyCombination: ['Cmd', 'Shift', 'P'],
        operatingSystem: 'all',
        context: 'general'
      },
      
      // Chat Shortcuts
      {
        id: 'chat-submit',
        name: 'Submit',
        description: 'Submit your message or query to the AI.',
        keyCombination: ['Enter'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-cancel',
        name: 'Cancel generation',
        description: 'Stop the AI from generating more content.',
        keyCombination: ['Cmd', 'Backspace'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-add-code',
        name: 'Add selected code as context',
        description: 'Add currently selected code to the chat as context.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-add-code-alt',
        name: 'Add selected code as context (alternative)',
        description: 'Alternative way to add selected code to chat as context.',
        keyCombination: ['Cmd', 'Shift', 'L'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-accept-changes',
        name: 'Accept all changes',
        description: 'Accept all changes suggested by the AI.',
        keyCombination: ['Cmd', 'Enter'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-reject-changes',
        name: 'Reject all changes',
        description: 'Reject all changes suggested by the AI.',
        keyCombination: ['Cmd', 'Backspace'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-next-message',
        name: 'Cycle to next message',
        description: 'Navigate to the next message in the chat.',
        keyCombination: ['Tab'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-prev-message',
        name: 'Cycle to previous message',
        description: 'Navigate to the previous message in the chat.',
        keyCombination: ['Shift', 'Tab'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-model-toggle',
        name: 'Open model toggle',
        description: 'Open the AI model selection menu.',
        keyCombination: ['Cmd', 'Alt', '/'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-new',
        name: 'Create new chat',
        description: 'Start a new chat session with the AI.',
        keyCombination: ['Cmd', 'N'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-composer',
        name: 'Open composer as bar',
        description: 'Open the composer interface as a bar.',
        keyCombination: ['Cmd', 'Shift', 'K'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-prev',
        name: 'Open previous chat',
        description: 'Navigate to the previous chat session.',
        keyCombination: ['Cmd', '['],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-next',
        name: 'Open next chat',
        description: 'Navigate to the next chat session.',
        keyCombination: ['Cmd', ']'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-close',
        name: 'Close chat',
        description: 'Close the current chat session.',
        keyCombination: ['Cmd', 'W'],
        operatingSystem: 'all',
        context: 'chat'
      },
      {
        id: 'chat-unfocus',
        name: 'Unfocus the field',
        description: 'Remove focus from the chat input field.',
        keyCombination: ['Esc'],
        operatingSystem: 'all',
        context: 'chat'
      },
      
      // Cmd+K Shortcuts
      {
        id: 'cmdk-open',
        name: 'Open',
        description: 'Open the command palette (Cmd+K interface).',
        keyCombination: ['Cmd', 'K'],
        operatingSystem: 'all',
        context: 'cmdk'
      },
      {
        id: 'cmdk-toggle-focus',
        name: 'Toggle input focus',
        description: 'Toggle focus on the command input field.',
        keyCombination: ['Cmd', 'Shift', 'K'],
        operatingSystem: 'all',
        context: 'cmdk'
      },
      {
        id: 'cmdk-submit',
        name: 'Submit',
        description: 'Submit the current command.',
        keyCombination: ['Enter'],
        operatingSystem: 'all',
        context: 'cmdk'
      },
      {
        id: 'cmdk-cancel',
        name: 'Cancel',
        description: 'Cancel the current command or close the palette.',
        keyCombination: ['Cmd', 'Backspace'],
        operatingSystem: 'all',
        context: 'cmdk'
      },
      {
        id: 'cmdk-quick-question',
        name: 'Ask quick question',
        description: 'Quickly ask a question without opening a full chat.',
        keyCombination: ['Option', 'Enter'],
        operatingSystem: 'all',
        context: 'cmdk'
      },
      
      // Code Selection & Context Shortcuts
      {
        id: 'code-at-symbols',
        name: '@-symbols',
        description: 'Access @-symbols for adding context to chats.',
        keyCombination: ['@'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-files',
        name: 'Files',
        description: 'Access file references in chat.',
        keyCombination: ['#'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-commands',
        name: 'Shortcut Commands',
        description: 'Access shortcut commands in chat.',
        keyCombination: ['/'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-add-to-chat',
        name: 'Add selection to Chat',
        description: 'Add selected code to the current chat.',
        keyCombination: ['Cmd', 'Shift', 'L'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-add-to-edit',
        name: 'Add selection to Edit',
        description: 'Add selected code to Edit mode.',
        keyCombination: ['Cmd', 'Shift', 'K'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-add-to-new-chat',
        name: 'Add selection to new chat',
        description: 'Add selected code to a new chat session.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-toggle-reading',
        name: 'Toggle file reading strategies',
        description: 'Switch between different file reading modes.',
        keyCombination: ['Cmd', 'M'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-accept-next-word',
        name: 'Accept next word of suggestion',
        description: 'Accept only the next word of an AI suggestion.',
        keyCombination: ['Cmd', '→'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-search-codebase',
        name: 'Search codebase in chat',
        description: 'Search through your codebase from within chat.',
        keyCombination: ['Cmd', 'Enter'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-add-reference',
        name: 'Add copied reference code as context',
        description: 'Add copied code as a reference in chat.',
        keyCombination: ['Select code', 'Cmd', 'C', 'Cmd', 'V'],
        operatingSystem: 'all',
        context: 'code'
      },
      {
        id: 'code-add-text',
        name: 'Add copied code as text context',
        description: 'Add copied code as text context in chat.',
        keyCombination: ['Select code', 'Cmd', 'C', 'Cmd', 'Shift', 'V'],
        operatingSystem: 'all',
        context: 'code'
      },
      
      // Tab Shortcuts
      {
        id: 'tab-accept',
        name: 'Accept suggestion',
        description: 'Accept the current AI code suggestion.',
        keyCombination: ['Tab'],
        operatingSystem: 'all',
        context: 'tab'
      },
      {
        id: 'tab-accept-word',
        name: 'Accept next word',
        description: 'Accept only the next word of an AI suggestion.',
        keyCombination: ['Cmd', '→'],
        operatingSystem: 'all',
        context: 'tab'
      },
      
      // Terminal Shortcuts
      {
        id: 'terminal-prompt',
        name: 'Open terminal prompt bar',
        description: 'Open the AI prompt bar in the terminal.',
        keyCombination: ['Cmd', 'K'],
        operatingSystem: 'all',
        context: 'terminal'
      },
      {
        id: 'terminal-run',
        name: 'Run generated command',
        description: 'Execute the command generated by the AI.',
        keyCombination: ['Cmd', 'Enter'],
        operatingSystem: 'all',
        context: 'terminal'
      },
      {
        id: 'terminal-accept',
        name: 'Accept command',
        description: 'Accept the current command without running it.',
        keyCombination: ['Esc'],
        operatingSystem: 'all',
        context: 'terminal'
      }
    ],
    tips: [
      "Remember that all `Cmd` keys can be replaced with `Ctrl` on Windows.",
      "You can see all keyboard shortcuts in Cursor by pressing `Cmd + R` then `Cmd + S`.",
      "Cursor's keybindings are based on VS Code, so many shortcuts will be familiar if you've used VS Code.",
      "All of Cursor's keybindings can be remapped in the Keyboard Shortcuts settings page.",
      "Practice using shortcuts regularly to build muscle memory.",
      "Start with the most common shortcuts first, then gradually learn more advanced ones.",
      "The `Cmd + I` (Agent) and `Cmd + L` (Ask) shortcuts are among the most useful for AI interactions.",
      "Use `Cmd + .` to quickly toggle between different chat modes.",
      "When working with code, `Cmd + Shift + L` is great for adding selections to chat.",
      "In the terminal, `Cmd + K` opens the AI prompt bar for generating commands."
    ]
  }
};

export default cursorShortcutsLesson; 
import { Lesson } from '../../api/lessonsService';

const intelliJShortcutsLesson: Lesson = {
  lessonId: 'intellij-shortcuts',
  id: 'intellij-shortcuts-2023',
  title: 'IntelliJ IDEA Keyboard Shortcuts Mastery',
  description: 'Master the essential keyboard shortcuts in IntelliJ IDEA to boost your coding productivity.',
  category: 'tools',
  difficulty: 'beginner',
  order: 3,
  isPremium: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# IntelliJ IDEA Keyboard Shortcuts Mastery

## Introduction

IntelliJ IDEA is a powerful IDE used by Java and other JVM language developers worldwide. Mastering keyboard shortcuts is essential for maximizing your productivity with IntelliJ IDEA.

This lesson will guide you through all the important shortcuts in IntelliJ IDEA, organized by category. You'll learn when and how to use each shortcut, practice with interactive exercises, and build the muscle memory needed to code efficiently.

> **Note:** On Mac, shortcuts use the Command (⌘) key, while on Windows, they use the Control (Ctrl) key. Throughout this lesson, we'll use both notations where applicable.

Let's get started with mastering IntelliJ IDEA shortcuts!
    `,
    shortcuts: [
      // Essential Navigation Shortcuts
      {
        id: 'navigation-search-everywhere',
        name: 'Search Everywhere',
        description: 'Search for any file, class, symbol, or action in your project.',
        keyCombination: ['Shift', 'Shift'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'navigation-search-everywhere-mac',
        name: 'Search Everywhere',
        description: 'Search for any file, class, symbol, or action in your project.',
        keyCombination: ['Shift', 'Shift'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'navigation-search-everywhere-linux',
        name: 'Search Everywhere',
        description: 'Search for any file, class, symbol, or action in your project.',
        keyCombination: ['Shift', 'Shift'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'navigation-find-action',
        name: 'Find Action',
        description: 'Search for IDE actions and settings.',
        keyCombination: ['Ctrl', 'Shift', 'A'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'navigation-find-action-mac',
        name: 'Find Action',
        description: 'Search for IDE actions and settings.',
        keyCombination: ['Cmd', 'Shift', 'A'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'navigation-find-action-linux',
        name: 'Find Action',
        description: 'Search for IDE actions and settings.',
        keyCombination: ['Ctrl', 'Shift', 'A'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'navigation-go-to-class',
        name: 'Go to Class',
        description: 'Quickly navigate to a class by name.',
        keyCombination: ['Ctrl', 'N'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'navigation-go-to-class-mac',
        name: 'Go to Class',
        description: 'Quickly navigate to a class by name.',
        keyCombination: ['Cmd', 'O'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'navigation-go-to-class-linux',
        name: 'Go to Class',
        description: 'Quickly navigate to a class by name.',
        keyCombination: ['Ctrl', 'N'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      
      // Essential Editing Shortcuts
      {
        id: 'editing-basic-completion',
        name: 'Basic Code Completion',
        description: 'Show basic code completion suggestions.',
        keyCombination: ['Ctrl', 'Space'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-basic-completion-mac',
        name: 'Basic Code Completion',
        description: 'Show basic code completion suggestions.',
        keyCombination: ['Ctrl', 'Space'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-basic-completion-linux',
        name: 'Basic Code Completion',
        description: 'Show basic code completion suggestions.',
        keyCombination: ['Ctrl', 'Space'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'editing-smart-completion',
        name: 'Smart Code Completion',
        description: 'Show context-aware code completion suggestions.',
        keyCombination: ['Ctrl', 'Shift', 'Space'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-smart-completion-mac',
        name: 'Smart Code Completion',
        description: 'Show context-aware code completion suggestions.',
        keyCombination: ['Ctrl', 'Shift', 'Space'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-smart-completion-linux',
        name: 'Smart Code Completion',
        description: 'Show context-aware code completion suggestions.',
        keyCombination: ['Ctrl', 'Shift', 'Space'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line',
        name: 'Duplicate Line or Selection',
        description: 'Duplicate the current line or selected block of code.',
        keyCombination: ['Ctrl', 'D'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line-mac',
        name: 'Duplicate Line or Selection',
        description: 'Duplicate the current line or selected block of code.',
        keyCombination: ['Cmd', 'D'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'editing-duplicate-line-linux',
        name: 'Duplicate Line or Selection',
        description: 'Duplicate the current line or selected block of code.',
        keyCombination: ['Ctrl', 'D'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Code Refactoring Shortcuts
      {
        id: 'refactoring-rename',
        name: 'Rename',
        description: 'Rename a symbol and update all references.',
        keyCombination: ['Shift', 'F6'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'refactoring-rename-mac',
        name: 'Rename',
        description: 'Rename a symbol and update all references.',
        keyCombination: ['Shift', 'F6'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'refactoring-rename-linux',
        name: 'Rename',
        description: 'Rename a symbol and update all references.',
        keyCombination: ['Shift', 'F6'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-method',
        name: 'Extract Method',
        description: 'Extract selected code into a new method.',
        keyCombination: ['Ctrl', 'Alt', 'M'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-method-mac',
        name: 'Extract Method',
        description: 'Extract selected code into a new method.',
        keyCombination: ['Cmd', 'Option', 'M'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-method-linux',
        name: 'Extract Method',
        description: 'Extract selected code into a new method.',
        keyCombination: ['Ctrl', 'Alt', 'M'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-variable',
        name: 'Extract Variable',
        description: 'Extract selected expression into a variable.',
        keyCombination: ['Ctrl', 'Alt', 'V'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-variable-mac',
        name: 'Extract Variable',
        description: 'Extract selected expression into a variable.',
        keyCombination: ['Cmd', 'Option', 'V'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'refactoring-extract-variable-linux',
        name: 'Extract Variable',
        description: 'Extract selected expression into a variable.',
        keyCombination: ['Ctrl', 'Alt', 'V'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Code Navigation Shortcuts
      {
        id: 'code-nav-declaration',
        name: 'Go to Declaration',
        description: 'Navigate to the declaration of a symbol.',
        keyCombination: ['Ctrl', 'B'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'code-nav-declaration-mac',
        name: 'Go to Declaration',
        description: 'Navigate to the declaration of a symbol.',
        keyCombination: ['Cmd', 'B'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'code-nav-declaration-linux',
        name: 'Go to Declaration',
        description: 'Navigate to the declaration of a symbol.',
        keyCombination: ['Ctrl', 'B'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      {
        id: 'code-nav-implementation',
        name: 'Go to Implementation',
        description: 'Navigate to the implementation of an interface or abstract method.',
        keyCombination: ['Ctrl', 'Alt', 'B'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'code-nav-implementation-mac',
        name: 'Go to Implementation',
        description: 'Navigate to the implementation of an interface or abstract method.',
        keyCombination: ['Cmd', 'Option', 'B'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'code-nav-implementation-linux',
        name: 'Go to Implementation',
        description: 'Navigate to the implementation of an interface or abstract method.',
        keyCombination: ['Ctrl', 'Alt', 'B'],
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
        keyCombination: ['Ctrl', 'R'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'search-replace-mac',
        name: 'Replace',
        description: 'Search and replace text in the current file.',
        keyCombination: ['Cmd', 'R'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'search-replace-linux',
        name: 'Replace',
        description: 'Search and replace text in the current file.',
        keyCombination: ['Ctrl', 'R'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Debugging Shortcuts
      {
        id: 'debug-start',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['Shift', 'F9'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'debug-start-mac',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['Ctrl', 'D'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'debug-start-linux',
        name: 'Start Debugging',
        description: 'Start the debugging session.',
        keyCombination: ['Shift', 'F9'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'debug-toggle-breakpoint',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['Ctrl', 'F8'],
        operatingSystem: 'windows',
        context: 'Editor'
      },
      {
        id: 'debug-toggle-breakpoint-mac',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['Cmd', 'F8'],
        operatingSystem: 'mac',
        context: 'Editor'
      },
      {
        id: 'debug-toggle-breakpoint-linux',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['Ctrl', 'F8'],
        operatingSystem: 'linux',
        context: 'Editor'
      },
      
      // Version Control Shortcuts
      {
        id: 'vcs-commit',
        name: 'Commit Changes',
        description: 'Open the commit dialog to commit changes to version control.',
        keyCombination: ['Ctrl', 'K'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'vcs-commit-mac',
        name: 'Commit Changes',
        description: 'Open the commit dialog to commit changes to version control.',
        keyCombination: ['Cmd', 'K'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'vcs-commit-linux',
        name: 'Commit Changes',
        description: 'Open the commit dialog to commit changes to version control.',
        keyCombination: ['Ctrl', 'K'],
        operatingSystem: 'linux',
        context: 'Global'
      },
      {
        id: 'vcs-update',
        name: 'Update Project',
        description: 'Update project from version control.',
        keyCombination: ['Ctrl', 'T'],
        operatingSystem: 'windows',
        context: 'Global'
      },
      {
        id: 'vcs-update-mac',
        name: 'Update Project',
        description: 'Update project from version control.',
        keyCombination: ['Cmd', 'T'],
        operatingSystem: 'mac',
        context: 'Global'
      },
      {
        id: 'vcs-update-linux',
        name: 'Update Project',
        description: 'Update project from version control.',
        keyCombination: ['Ctrl', 'T'],
        operatingSystem: 'linux',
        context: 'Global'
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
      "Double-press Shift (Search Everywhere) is one of the most powerful navigation shortcuts in IntelliJ IDEA.",
      "Use Ctrl+Space (Basic Completion) and Ctrl+Shift+Space (Smart Completion) to write code faster.",
      "Learn refactoring shortcuts like Shift+F6 (Rename) and Ctrl+Alt+M (Extract Method) to improve your code quality.",
      "Use Ctrl+B/Cmd+B (Go to Declaration) to navigate your codebase efficiently.",
      "The Find Action shortcut (Ctrl+Shift+A/Cmd+Shift+A) helps you discover other shortcuts and actions.",
      "IntelliJ IDEA's refactoring shortcuts can save you hours of manual code changes.",
      "Customize your keyboard shortcuts in Settings > Keymap.",
      "Practice these shortcuts regularly to build muscle memory.",
      "Start with the most common shortcuts first, then gradually learn more advanced ones.",
      "In Cursor, use Cmd+I/Ctrl+I to open the AI Agent for assistance with coding tasks.",
      "Use Cmd+L/Ctrl+L to open the Ask interface to query the AI about code.",
      "Switch between different chat modes with Cmd+./Ctrl+."
    ]
  }
};

export default intelliJShortcutsLesson; 
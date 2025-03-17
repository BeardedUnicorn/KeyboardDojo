import { Lesson } from '../../api/lessonsService';

const vscodeAdvancedMastery: Lesson = {
  lessonId: 'vscode-advanced-mastery',
  id: 'vscode-mastery-2023',
  title: 'VS Code Advanced Mastery',
  description: 'Take your VS Code skills to the next level with advanced shortcuts, techniques, and workflows.',
  category: 'mastery',
  difficulty: 'advanced',
  order: 1,
  isPremium: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# VS Code Advanced Mastery

## Introduction

Welcome to the VS Code Advanced Mastery curriculum! This course is designed for developers who already know the basics of VS Code and want to take their productivity to the next level.

In this advanced curriculum, you'll learn powerful shortcuts, techniques, and workflows that will transform how you code. We'll focus on:

1. **Advanced Navigation** - Move through your codebase with unprecedented speed
2. **Refactoring Techniques** - Restructure code efficiently without breaking functionality
3. **Multi-cursor Mastery** - Edit multiple locations simultaneously with precision
4. **Integrated Terminal Workflows** - Seamlessly combine coding and command-line operations
5. **Customization & Extensions** - Tailor VS Code to your specific needs

By the end of this curriculum, you'll have mastered techniques that will significantly boost your coding efficiency and make you a VS Code power user.

Let's dive in and unlock the full potential of VS Code!
    `,
    shortcuts: [
      // Advanced Navigation
      {
        id: 'nav-goto-symbol',
        name: 'Go to Symbol in Workspace',
        description: 'Quickly navigate to any symbol (function, class, etc.) across your entire workspace.',
        keyCombination: ['Ctrl', 'T'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-symbol-mac',
        name: 'Go to Symbol in Workspace',
        description: 'Quickly navigate to any symbol (function, class, etc.) across your entire workspace.',
        keyCombination: ['Cmd', 'T'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-breadcrumbs',
        name: 'Focus Breadcrumbs',
        description: 'Navigate file structure using the breadcrumbs at the top of the editor.',
        keyCombination: ['Ctrl', 'Shift', '.'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-breadcrumbs-mac',
        name: 'Focus Breadcrumbs',
        description: 'Navigate file structure using the breadcrumbs at the top of the editor.',
        keyCombination: ['Cmd', 'Shift', '.'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-goto-bracket',
        name: 'Go to Bracket',
        description: 'Jump to the matching bracket, useful for navigating nested code blocks.',
        keyCombination: ['Ctrl', 'Shift', '\\'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-bracket-mac',
        name: 'Go to Bracket',
        description: 'Jump to the matching bracket, useful for navigating nested code blocks.',
        keyCombination: ['Cmd', 'Shift', '\\'],
        operatingSystem: 'mac',
        context: 'navigation'
      },

      // Advanced Refactoring
      {
        id: 'refactor-extract-method',
        name: 'Extract Method',
        description: 'Extract selected code into a separate method/function.',
        keyCombination: ['Ctrl', 'Shift', 'R'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-method-mac',
        name: 'Extract Method',
        description: 'Extract selected code into a separate method/function.',
        keyCombination: ['Cmd', 'Shift', 'R'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },
      {
        id: 'refactor-rename-symbol',
        name: 'Rename Symbol',
        description: 'Rename a variable, function, or class across your entire codebase.',
        keyCombination: ['F2'],
        operatingSystem: 'all',
        context: 'refactoring'
      },
      {
        id: 'refactor-organize-imports',
        name: 'Organize Imports',
        description: 'Automatically organize and clean up import statements.',
        keyCombination: ['Shift', 'Alt', 'O'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-organize-imports-mac',
        name: 'Organize Imports',
        description: 'Automatically organize and clean up import statements.',
        keyCombination: ['Shift', 'Option', 'O'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },

      // Multi-cursor Techniques
      {
        id: 'multi-add-cursor-above',
        name: 'Add Cursor Above',
        description: 'Add an additional cursor one line above the current cursor.',
        keyCombination: ['Ctrl', 'Alt', 'Up'],
        operatingSystem: 'windows',
        context: 'multi-cursor'
      },
      {
        id: 'multi-add-cursor-above-mac',
        name: 'Add Cursor Above',
        description: 'Add an additional cursor one line above the current cursor.',
        keyCombination: ['Cmd', 'Option', 'Up'],
        operatingSystem: 'mac',
        context: 'multi-cursor'
      },
      {
        id: 'multi-add-cursor-below',
        name: 'Add Cursor Below',
        description: 'Add an additional cursor one line below the current cursor.',
        keyCombination: ['Ctrl', 'Alt', 'Down'],
        operatingSystem: 'windows',
        context: 'multi-cursor'
      },
      {
        id: 'multi-add-cursor-below-mac',
        name: 'Add Cursor Below',
        description: 'Add an additional cursor one line below the current cursor.',
        keyCombination: ['Cmd', 'Option', 'Down'],
        operatingSystem: 'mac',
        context: 'multi-cursor'
      },
      {
        id: 'multi-select-all-occurrences',
        name: 'Select All Occurrences',
        description: 'Select all occurrences of the current selection or word.',
        keyCombination: ['Ctrl', 'Shift', 'L'],
        operatingSystem: 'windows',
        context: 'multi-cursor'
      },
      {
        id: 'multi-select-all-occurrences-mac',
        name: 'Select All Occurrences',
        description: 'Select all occurrences of the current selection or word.',
        keyCombination: ['Cmd', 'Shift', 'L'],
        operatingSystem: 'mac',
        context: 'multi-cursor'
      },
      {
        id: 'multi-column-select',
        name: 'Column (Box) Selection',
        description: 'Select a rectangular block of text across multiple lines.',
        keyCombination: ['Shift', 'Alt', 'drag'],
        operatingSystem: 'windows',
        context: 'multi-cursor'
      },
      {
        id: 'multi-column-select-mac',
        name: 'Column (Box) Selection',
        description: 'Select a rectangular block of text across multiple lines.',
        keyCombination: ['Shift', 'Option', 'drag'],
        operatingSystem: 'mac',
        context: 'multi-cursor'
      },

      // Terminal Integration
      {
        id: 'terminal-toggle',
        name: 'Toggle Integrated Terminal',
        description: 'Show or hide the integrated terminal.',
        keyCombination: ['Ctrl', '`'],
        operatingSystem: 'windows',
        context: 'terminal'
      },
      {
        id: 'terminal-toggle-mac',
        name: 'Toggle Integrated Terminal',
        description: 'Show or hide the integrated terminal.',
        keyCombination: ['Cmd', '`'],
        operatingSystem: 'mac',
        context: 'terminal'
      },
      {
        id: 'terminal-new',
        name: 'Create New Terminal',
        description: 'Open a new terminal instance.',
        keyCombination: ['Ctrl', 'Shift', '`'],
        operatingSystem: 'windows',
        context: 'terminal'
      },
      {
        id: 'terminal-new-mac',
        name: 'Create New Terminal',
        description: 'Open a new terminal instance.',
        keyCombination: ['Cmd', 'Shift', '`'],
        operatingSystem: 'mac',
        context: 'terminal'
      },
      {
        id: 'terminal-split',
        name: 'Split Terminal',
        description: 'Split the terminal to have multiple terminals side by side.',
        keyCombination: ['Ctrl', 'Shift', '5'],
        operatingSystem: 'windows',
        context: 'terminal'
      },
      {
        id: 'terminal-split-mac',
        name: 'Split Terminal',
        description: 'Split the terminal to have multiple terminals side by side.',
        keyCombination: ['Cmd', 'Shift', '5'],
        operatingSystem: 'mac',
        context: 'terminal'
      },

      // Advanced Customization
      {
        id: 'custom-settings-json',
        name: 'Open Settings (JSON)',
        description: 'Open the settings.json file to customize VS Code settings.',
        keyCombination: ['Ctrl', 'Shift', 'P', 'then type "Open Settings (JSON)"'],
        operatingSystem: 'windows',
        context: 'customization'
      },
      {
        id: 'custom-settings-json-mac',
        name: 'Open Settings (JSON)',
        description: 'Open the settings.json file to customize VS Code settings.',
        keyCombination: ['Cmd', 'Shift', 'P', 'then type "Open Settings (JSON)"'],
        operatingSystem: 'mac',
        context: 'customization'
      },
      {
        id: 'custom-keybindings',
        name: 'Open Keyboard Shortcuts',
        description: 'Customize keyboard shortcuts to match your preferences.',
        keyCombination: ['Ctrl', 'K', 'Ctrl', 'S'],
        operatingSystem: 'windows',
        context: 'customization'
      },
      {
        id: 'custom-keybindings-mac',
        name: 'Open Keyboard Shortcuts',
        description: 'Customize keyboard shortcuts to match your preferences.',
        keyCombination: ['Cmd', 'K', 'Cmd', 'S'],
        operatingSystem: 'mac',
        context: 'customization'
      }
    ],
    tips: [
      "Create custom snippets for code patterns you use frequently (File > Preferences > User Snippets).",
      "Use workspaces to group related projects and maintain separate settings for each.",
      "Learn to use the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) to access almost any VS Code feature without memorizing shortcuts.",
      "Set up task automation for repetitive tasks like building, testing, or deploying your code.",
      "Customize your status bar to show only the information that's relevant to your workflow.",
      "Use the 'Zen Mode' (Ctrl+K Z or Cmd+K Z) to eliminate distractions when you need to focus.",
      "Master the art of search and replace with regular expressions for powerful text manipulation.",
      "Set up custom color themes and icon themes to reduce eye strain and improve file recognition.",
      "Use the 'Compare with Saved' feature to see what changes you've made since your last save.",
      "Learn to use the built-in Git integration to streamline your version control workflow."
    ]
  }
};

export default vscodeAdvancedMastery; 
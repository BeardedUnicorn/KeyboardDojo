import { Lesson } from '../../api/lessonsService';

const intellijAdvancedMastery: Lesson = {
  lessonId: 'intellij-advanced-mastery',
  id: 'intellij-mastery-2023',
  title: 'IntelliJ IDEA Advanced Mastery',
  description: 'Master advanced IntelliJ IDEA techniques to dramatically improve your Java and Kotlin development workflow.',
  category: 'mastery',
  difficulty: 'advanced',
  order: 2,
  isPremium: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# IntelliJ IDEA Advanced Mastery

## Introduction

Welcome to the IntelliJ IDEA Advanced Mastery curriculum! This course is designed for developers who want to harness the full power of JetBrains' flagship IDE.

IntelliJ IDEA is renowned for its intelligent code assistance and ergonomic design, but most developers only scratch the surface of its capabilities. In this advanced curriculum, you'll learn:

1. **Advanced Code Navigation** - Move through complex codebases with precision and speed
2. **Powerful Refactoring Techniques** - Restructure code safely with IntelliJ's robust refactoring tools
3. **Code Generation Mastery** - Let the IDE write boilerplate code for you
4. **Advanced Debugging** - Debug like a pro with conditional breakpoints, watches, and more
5. **Custom Live Templates** - Create your own code snippets to boost productivity

By mastering these advanced techniques, you'll significantly reduce the time spent on routine tasks and focus more on solving complex problems.

Let's elevate your IntelliJ IDEA skills to the expert level!
    `,
    shortcuts: [
      // Advanced Navigation
      {
        id: 'nav-goto-class',
        name: 'Navigate to Class',
        description: 'Quickly find and open any class in your project.',
        keyCombination: ['Ctrl', 'N'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-class-mac',
        name: 'Navigate to Class',
        description: 'Quickly find and open any class in your project.',
        keyCombination: ['Cmd', 'O'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-goto-file',
        name: 'Navigate to File',
        description: 'Find and open any file in your project by name.',
        keyCombination: ['Ctrl', 'Shift', 'N'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-file-mac',
        name: 'Navigate to File',
        description: 'Find and open any file in your project by name.',
        keyCombination: ['Cmd', 'Shift', 'O'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-goto-symbol',
        name: 'Navigate to Symbol',
        description: 'Jump directly to a method, field, or other symbol in your project.',
        keyCombination: ['Ctrl', 'Alt', 'Shift', 'N'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-symbol-mac',
        name: 'Navigate to Symbol',
        description: 'Jump directly to a method, field, or other symbol in your project.',
        keyCombination: ['Cmd', 'Option', 'O'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-recent-files',
        name: 'Recent Files',
        description: 'Show a list of recently opened files for quick navigation.',
        keyCombination: ['Ctrl', 'E'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-recent-files-mac',
        name: 'Recent Files',
        description: 'Show a list of recently opened files for quick navigation.',
        keyCombination: ['Cmd', 'E'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-recent-locations',
        name: 'Recent Locations',
        description: 'Show a list of recently visited code locations.',
        keyCombination: ['Ctrl', 'Shift', 'E'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-recent-locations-mac',
        name: 'Recent Locations',
        description: 'Show a list of recently visited code locations.',
        keyCombination: ['Cmd', 'Shift', 'E'],
        operatingSystem: 'mac',
        context: 'navigation'
      },

      // Advanced Refactoring
      {
        id: 'refactor-extract-method',
        name: 'Extract Method',
        description: 'Extract selected code into a new method.',
        keyCombination: ['Ctrl', 'Alt', 'M'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-method-mac',
        name: 'Extract Method',
        description: 'Extract selected code into a new method.',
        keyCombination: ['Cmd', 'Option', 'M'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-variable',
        name: 'Extract Variable',
        description: 'Extract selected expression into a variable.',
        keyCombination: ['Ctrl', 'Alt', 'V'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-variable-mac',
        name: 'Extract Variable',
        description: 'Extract selected expression into a variable.',
        keyCombination: ['Cmd', 'Option', 'V'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-field',
        name: 'Extract Field',
        description: 'Extract selected expression into a field.',
        keyCombination: ['Ctrl', 'Alt', 'F'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-field-mac',
        name: 'Extract Field',
        description: 'Extract selected expression into a field.',
        keyCombination: ['Cmd', 'Option', 'F'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-constant',
        name: 'Extract Constant',
        description: 'Extract selected expression into a constant.',
        keyCombination: ['Ctrl', 'Alt', 'C'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-extract-constant-mac',
        name: 'Extract Constant',
        description: 'Extract selected expression into a constant.',
        keyCombination: ['Cmd', 'Option', 'C'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },
      {
        id: 'refactor-inline',
        name: 'Inline',
        description: 'Inline a variable, method, or parameter into its usage.',
        keyCombination: ['Ctrl', 'Alt', 'N'],
        operatingSystem: 'windows',
        context: 'refactoring'
      },
      {
        id: 'refactor-inline-mac',
        name: 'Inline',
        description: 'Inline a variable, method, or parameter into its usage.',
        keyCombination: ['Cmd', 'Option', 'N'],
        operatingSystem: 'mac',
        context: 'refactoring'
      },

      // Code Generation
      {
        id: 'gen-generate-code',
        name: 'Generate Code',
        description: 'Open the code generation menu to create constructors, getters, setters, etc.',
        keyCombination: ['Alt', 'Insert'],
        operatingSystem: 'windows',
        context: 'generation'
      },
      {
        id: 'gen-generate-code-mac',
        name: 'Generate Code',
        description: 'Open the code generation menu to create constructors, getters, setters, etc.',
        keyCombination: ['Cmd', 'N'],
        operatingSystem: 'mac',
        context: 'generation'
      },
      {
        id: 'gen-override-methods',
        name: 'Override Methods',
        description: 'Generate method overrides for methods from superclasses or interfaces.',
        keyCombination: ['Ctrl', 'O'],
        operatingSystem: 'windows',
        context: 'generation'
      },
      {
        id: 'gen-override-methods-mac',
        name: 'Override Methods',
        description: 'Generate method overrides for methods from superclasses or interfaces.',
        keyCombination: ['Ctrl', 'O'],
        operatingSystem: 'mac',
        context: 'generation'
      },
      {
        id: 'gen-implement-methods',
        name: 'Implement Methods',
        description: 'Generate implementations for methods from interfaces.',
        keyCombination: ['Ctrl', 'I'],
        operatingSystem: 'windows',
        context: 'generation'
      },
      {
        id: 'gen-implement-methods-mac',
        name: 'Implement Methods',
        description: 'Generate implementations for methods from interfaces.',
        keyCombination: ['Ctrl', 'I'],
        operatingSystem: 'mac',
        context: 'generation'
      },

      // Advanced Debugging
      {
        id: 'debug-toggle-breakpoint',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['Ctrl', 'F8'],
        operatingSystem: 'windows',
        context: 'debugging'
      },
      {
        id: 'debug-toggle-breakpoint-mac',
        name: 'Toggle Breakpoint',
        description: 'Add or remove a breakpoint at the current line.',
        keyCombination: ['Cmd', 'F8'],
        operatingSystem: 'mac',
        context: 'debugging'
      },
      {
        id: 'debug-conditional-breakpoint',
        name: 'Add Conditional Breakpoint',
        description: 'Add a breakpoint that only triggers when a condition is met.',
        keyCombination: ['Ctrl', 'Shift', 'F8'],
        operatingSystem: 'windows',
        context: 'debugging'
      },
      {
        id: 'debug-conditional-breakpoint-mac',
        name: 'Add Conditional Breakpoint',
        description: 'Add a breakpoint that only triggers when a condition is met.',
        keyCombination: ['Cmd', 'Shift', 'F8'],
        operatingSystem: 'mac',
        context: 'debugging'
      },
      {
        id: 'debug-evaluate-expression',
        name: 'Evaluate Expression',
        description: 'Evaluate an expression during debugging.',
        keyCombination: ['Alt', 'F8'],
        operatingSystem: 'windows',
        context: 'debugging'
      },
      {
        id: 'debug-evaluate-expression-mac',
        name: 'Evaluate Expression',
        description: 'Evaluate an expression during debugging.',
        keyCombination: ['Option', 'F8'],
        operatingSystem: 'mac',
        context: 'debugging'
      },
      {
        id: 'debug-step-over',
        name: 'Step Over',
        description: 'Execute the current line and move to the next line.',
        keyCombination: ['F8'],
        operatingSystem: 'all',
        context: 'debugging'
      },
      {
        id: 'debug-step-into',
        name: 'Step Into',
        description: 'Step into the method call at the current line.',
        keyCombination: ['F7'],
        operatingSystem: 'all',
        context: 'debugging'
      },
      {
        id: 'debug-smart-step-into',
        name: 'Smart Step Into',
        description: 'Choose which method to step into when multiple method calls are on the same line.',
        keyCombination: ['Shift', 'F7'],
        operatingSystem: 'all',
        context: 'debugging'
      },

      // Live Templates
      {
        id: 'template-expand',
        name: 'Expand Live Template',
        description: 'Expand a live template abbreviation.',
        keyCombination: ['Tab'],
        operatingSystem: 'all',
        context: 'templates'
      },
      {
        id: 'template-surround',
        name: 'Surround with Live Template',
        description: 'Surround selected code with a live template.',
        keyCombination: ['Ctrl', 'Alt', 'J'],
        operatingSystem: 'windows',
        context: 'templates'
      },
      {
        id: 'template-surround-mac',
        name: 'Surround with Live Template',
        description: 'Surround selected code with a live template.',
        keyCombination: ['Cmd', 'Option', 'J'],
        operatingSystem: 'mac',
        context: 'templates'
      },
      {
        id: 'template-settings',
        name: 'Edit Live Templates',
        description: 'Open the Live Templates settings to create or edit templates.',
        keyCombination: ['Ctrl', 'Alt', 'S', 'then navigate to Editor > Live Templates'],
        operatingSystem: 'windows',
        context: 'templates'
      },
      {
        id: 'template-settings-mac',
        name: 'Edit Live Templates',
        description: 'Open the Live Templates settings to create or edit templates.',
        keyCombination: ['Cmd', ',', 'then navigate to Editor > Live Templates'],
        operatingSystem: 'mac',
        context: 'templates'
      }
    ],
    tips: [
      "Use 'Structural Search and Replace' for complex code pattern matching and replacement.",
      "Set up 'External Tools' for frequently used command-line operations.",
      "Create 'File and Code Templates' for new files to include your preferred boilerplate.",
      "Use 'Scratches' for temporary code that you don't want to save as files.",
      "Learn to use 'Local History' to recover changes even when they're not committed to version control.",
      "Set up 'Postfix Completion' templates for common code patterns.",
      "Use 'Parameter Info' (Ctrl+P/Cmd+P) to see method parameter details without looking at documentation.",
      "Configure 'Scopes' to limit searches and refactorings to specific parts of your codebase.",
      "Use 'Structural Navigation' to jump between related code elements (e.g., between a method and its usages).",
      "Master 'Intention Actions' (Alt+Enter/Option+Enter) to quickly fix problems and improve code."
    ]
  }
};

export default intellijAdvancedMastery; 
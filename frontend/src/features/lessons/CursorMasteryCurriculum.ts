import { Lesson } from '../../api/lessonsService';

const cursorAdvancedMastery: Lesson = {
  lessonId: 'cursor-advanced-mastery',
  id: 'cursor-mastery-2023',
  title: 'Cursor Advanced Mastery',
  description: 'Master advanced Cursor techniques to leverage AI-powered coding and dramatically improve your development workflow.',
  category: 'mastery',
  difficulty: 'advanced',
  order: 3,
  isPremium: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  shortcuts: [],
  content: {
    introduction: `
# Cursor Advanced Mastery

## Introduction

Welcome to the Cursor Advanced Mastery curriculum! This course is designed for developers who want to harness the full power of AI-assisted coding with Cursor.

Cursor combines the robust foundation of VS Code with cutting-edge AI capabilities, creating a uniquely powerful development environment. In this advanced curriculum, you'll learn:

1. **AI-Powered Code Generation** - Efficiently generate code with precise prompts
2. **Advanced Chat Interactions** - Master different chat modes for various coding tasks
3. **Context-Aware Editing** - Leverage AI to understand and modify complex codebases
4. **Refactoring with AI** - Transform your code with intelligent assistance
5. **Custom Workflows** - Create personalized AI-assisted development workflows

By mastering these advanced techniques, you'll significantly reduce the time spent on routine tasks and focus more on solving complex problems, all while leveraging the power of AI.

Let's elevate your Cursor skills to the expert level!
    `,
    shortcuts: [
      // AI Chat Modes
      {
        id: 'ai-open-agent',
        name: 'Open Agent',
        description: 'Open the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Ctrl', 'I'],
        operatingSystem: 'windows',
        context: 'ai-chat'
      },
      {
        id: 'ai-open-agent-mac',
        name: 'Open Agent',
        description: 'Open the Cursor AI Agent for assistance with coding tasks.',
        keyCombination: ['Cmd', 'I'],
        operatingSystem: 'mac',
        context: 'ai-chat'
      },
      {
        id: 'ai-open-ask',
        name: 'Open Ask',
        description: 'Open the Ask interface to query the AI about code.',
        keyCombination: ['Ctrl', 'L'],
        operatingSystem: 'windows',
        context: 'ai-chat'
      },
      {
        id: 'ai-open-ask-mac',
        name: 'Open Ask',
        description: 'Open the Ask interface to query the AI about code.',
        keyCombination: ['Cmd', 'L'],
        operatingSystem: 'mac',
        context: 'ai-chat'
      },
      {
        id: 'ai-toggle-chat',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Ctrl', 'Shift', 'L'],
        operatingSystem: 'windows',
        context: 'ai-chat'
      },
      {
        id: 'ai-toggle-chat-mac',
        name: 'Toggle Chat Modes',
        description: 'Switch between different chat modes (Ask, Edit, Agent).',
        keyCombination: ['Cmd', 'Shift', 'L'],
        operatingSystem: 'mac',
        context: 'ai-chat'
      },
      {
        id: 'ai-focus-chat',
        name: 'Focus Chat',
        description: 'Focus on the chat input to start typing a prompt.',
        keyCombination: ['Alt', 'C'],
        operatingSystem: 'windows',
        context: 'ai-chat'
      },
      {
        id: 'ai-focus-chat-mac',
        name: 'Focus Chat',
        description: 'Focus on the chat input to start typing a prompt.',
        keyCombination: ['Option', 'C'],
        operatingSystem: 'mac',
        context: 'ai-chat'
      },

      // AI Code Generation
      {
        id: 'ai-generate-code',
        name: 'Generate Code',
        description: 'Generate code based on a natural language description.',
        keyCombination: ['Ctrl', 'Shift', 'I'],
        operatingSystem: 'windows',
        context: 'ai-generation'
      },
      {
        id: 'ai-generate-code-mac',
        name: 'Generate Code',
        description: 'Generate code based on a natural language description.',
        keyCombination: ['Cmd', 'Shift', 'I'],
        operatingSystem: 'mac',
        context: 'ai-generation'
      },
      {
        id: 'ai-explain-code',
        name: 'Explain Code',
        description: 'Get an explanation of the selected code.',
        keyCombination: ['Ctrl', 'Shift', 'E'],
        operatingSystem: 'windows',
        context: 'ai-generation'
      },
      {
        id: 'ai-explain-code-mac',
        name: 'Explain Code',
        description: 'Get an explanation of the selected code.',
        keyCombination: ['Cmd', 'Shift', 'E'],
        operatingSystem: 'mac',
        context: 'ai-generation'
      },
      {
        id: 'ai-generate-tests',
        name: 'Generate Tests',
        description: 'Generate unit tests for the selected code.',
        keyCombination: ['Ctrl', 'Shift', 'T'],
        operatingSystem: 'windows',
        context: 'ai-generation'
      },
      {
        id: 'ai-generate-tests-mac',
        name: 'Generate Tests',
        description: 'Generate unit tests for the selected code.',
        keyCombination: ['Cmd', 'Shift', 'T'],
        operatingSystem: 'mac',
        context: 'ai-generation'
      },

      // AI Refactoring
      {
        id: 'ai-refactor-code',
        name: 'Refactor Code',
        description: 'Refactor the selected code with AI assistance.',
        keyCombination: ['Ctrl', 'Shift', 'R'],
        operatingSystem: 'windows',
        context: 'ai-refactoring'
      },
      {
        id: 'ai-refactor-code-mac',
        name: 'Refactor Code',
        description: 'Refactor the selected code with AI assistance.',
        keyCombination: ['Cmd', 'Shift', 'R'],
        operatingSystem: 'mac',
        context: 'ai-refactoring'
      },
      {
        id: 'ai-optimize-code',
        name: 'Optimize Code',
        description: 'Optimize the selected code for performance.',
        keyCombination: ['Ctrl', 'Shift', 'O'],
        operatingSystem: 'windows',
        context: 'ai-refactoring'
      },
      {
        id: 'ai-optimize-code-mac',
        name: 'Optimize Code',
        description: 'Optimize the selected code for performance.',
        keyCombination: ['Cmd', 'Shift', 'O'],
        operatingSystem: 'mac',
        context: 'ai-refactoring'
      },
      {
        id: 'ai-fix-code',
        name: 'Fix Code',
        description: 'Fix issues in the selected code with AI assistance.',
        keyCombination: ['Ctrl', 'Shift', 'F'],
        operatingSystem: 'windows',
        context: 'ai-refactoring'
      },
      {
        id: 'ai-fix-code-mac',
        name: 'Fix Code',
        description: 'Fix issues in the selected code with AI assistance.',
        keyCombination: ['Cmd', 'Shift', 'F'],
        operatingSystem: 'mac',
        context: 'ai-refactoring'
      },

      // Advanced Navigation
      {
        id: 'nav-goto-symbol',
        name: 'Go to Symbol in Workspace',
        description: 'Quickly navigate to any symbol across your entire workspace.',
        keyCombination: ['Ctrl', 'T'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-symbol-mac',
        name: 'Go to Symbol in Workspace',
        description: 'Quickly navigate to any symbol across your entire workspace.',
        keyCombination: ['Cmd', 'T'],
        operatingSystem: 'mac',
        context: 'navigation'
      },
      {
        id: 'nav-goto-definition',
        name: 'Go to Definition',
        description: 'Jump to the definition of a symbol.',
        keyCombination: ['F12'],
        operatingSystem: 'all',
        context: 'navigation'
      },
      {
        id: 'nav-goto-references',
        name: 'Find All References',
        description: 'Find all references to a symbol.',
        keyCombination: ['Shift', 'F12'],
        operatingSystem: 'all',
        context: 'navigation'
      },
      {
        id: 'nav-goto-implementation',
        name: 'Go to Implementation',
        description: 'Jump to the implementation of an interface or abstract method.',
        keyCombination: ['Ctrl', 'F12'],
        operatingSystem: 'windows',
        context: 'navigation'
      },
      {
        id: 'nav-goto-implementation-mac',
        name: 'Go to Implementation',
        description: 'Jump to the implementation of an interface or abstract method.',
        keyCombination: ['Cmd', 'F12'],
        operatingSystem: 'mac',
        context: 'navigation'
      },

      // Terminal Integration
      {
        id: 'terminal-toggle',
        name: 'Toggle Terminal',
        description: 'Show or hide the integrated terminal.',
        keyCombination: ['Ctrl', '`'],
        operatingSystem: 'windows',
        context: 'terminal'
      },
      {
        id: 'terminal-toggle-mac',
        name: 'Toggle Terminal',
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
        id: 'terminal-run-selected',
        name: 'Run Selected Text in Terminal',
        description: 'Run the selected text in the terminal.',
        keyCombination: ['Ctrl', 'Shift', 'Enter'],
        operatingSystem: 'windows',
        context: 'terminal'
      },
      {
        id: 'terminal-run-selected-mac',
        name: 'Run Selected Text in Terminal',
        description: 'Run the selected text in the terminal.',
        keyCombination: ['Cmd', 'Shift', 'Enter'],
        operatingSystem: 'mac',
        context: 'terminal'
      }
    ],
    tips: [
      "Use specific, detailed prompts for better AI code generation results.",
      "Combine AI assistance with traditional coding techniques for optimal productivity.",
      "Learn to edit the AI's generated code rather than regenerating from scratch.",
      "Use the 'Ask' mode when you need explanations or have questions about code.",
      "Use the 'Edit' mode when you want the AI to modify existing code.",
      "Use the 'Agent' mode for more complex, multi-step coding tasks.",
      "Provide context in your prompts by mentioning relevant files, functions, or concepts.",
      "Break down complex tasks into smaller, more manageable prompts.",
      "Use AI to generate documentation for your code to improve maintainability.",
      "Experiment with different phrasings in your prompts to get the best results."
    ]
  }
};

export default cursorAdvancedMastery; 
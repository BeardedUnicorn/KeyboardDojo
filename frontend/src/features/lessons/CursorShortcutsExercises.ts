interface Exercise {
  id: string;
  type: 'scenario' | 'fill-in-blank' | 'matching' | 'speed-drill' | 'sequence';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  context: 'general' | 'chat' | 'cmdk' | 'code' | 'tab' | 'terminal';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const cursorShortcutsExercises: Exercise[] = [
  // General Shortcuts Exercises
  {
    id: 'general-exercise-1',
    type: 'scenario',
    question: 'You want to ask the AI about a code snippet. Which shortcut would you use?',
    options: ['Cmd + I', 'Cmd + L', 'Cmd + K', 'Cmd + P'],
    correctAnswer: 'Cmd + L',
    explanation: 'Cmd + L opens the Ask interface, which allows you to query the AI about code.',
    context: 'general',
    difficulty: 'beginner'
  },
  {
    id: 'general-exercise-2',
    type: 'scenario',
    question: 'You want to switch to a different AI model. What\'s the shortcut?',
    options: ['Cmd + /', 'Cmd + .', 'Cmd + Shift + P', 'Cmd + Alt + /'],
    correctAnswer: 'Cmd + /',
    explanation: 'Cmd + / allows you to loop between available AI models.',
    context: 'general',
    difficulty: 'beginner'
  },
  {
    id: 'general-exercise-3',
    type: 'matching',
    question: 'Match the shortcut to its function:',
    options: [
      'Cmd + I - Open Agent',
      'Cmd + L - Open Ask',
      'Cmd + . - Toggle Chat Modes',
      'Cmd + / - Loop between AI models',
      'Cmd + Shift + J - Open Cursor settings'
    ],
    correctAnswer: [
      'Cmd + I - Open Agent',
      'Cmd + L - Open Ask',
      'Cmd + . - Toggle Chat Modes',
      'Cmd + / - Loop between AI models',
      'Cmd + Shift + J - Open Cursor settings'
    ],
    explanation: 'These are the basic general shortcuts in Cursor for accessing AI features and settings.',
    context: 'general',
    difficulty: 'beginner'
  },
  
  // Chat Shortcuts Exercises
  {
    id: 'chat-exercise-1',
    type: 'scenario',
    question: 'You\'re in the middle of a chat and want to cancel the current generation. What shortcut do you use?',
    options: ['Esc', 'Cmd + Backspace', 'Cmd + W', 'Cmd + Z'],
    correctAnswer: 'Cmd + Backspace',
    explanation: 'Cmd + Backspace cancels the current AI generation in chat.',
    context: 'chat',
    difficulty: 'beginner'
  },
  {
    id: 'chat-exercise-2',
    type: 'scenario',
    question: 'You\'ve selected some code and want to add it to the current chat. What\'s the shortcut?',
    options: ['Cmd + L', 'Cmd + Shift + L', 'Cmd + C, Cmd + V', 'Cmd + Shift + K'],
    correctAnswer: 'Cmd + Shift + L',
    explanation: 'Cmd + Shift + L adds the selected code to the current chat as context.',
    context: 'chat',
    difficulty: 'beginner'
  },
  {
    id: 'chat-exercise-3',
    type: 'fill-in-blank',
    question: 'To accept all changes in chat, press _______.',
    options: ['Cmd + Enter', 'Cmd + S', 'Enter', 'Cmd + A'],
    correctAnswer: 'Cmd + Enter',
    explanation: 'Cmd + Enter accepts all changes suggested by the AI in chat.',
    context: 'chat',
    difficulty: 'beginner'
  },
  {
    id: 'chat-exercise-4',
    type: 'sequence',
    question: 'Describe the sequence of shortcuts to select code, add it to chat, and submit.',
    options: [
      'Select code → Cmd + Shift + L → Enter',
      'Select code → Cmd + C → Cmd + V → Enter',
      'Select code → Cmd + L → Enter',
      'Select code → Cmd + Shift + K → Enter'
    ],
    correctAnswer: 'Select code → Cmd + Shift + L → Enter',
    explanation: 'First select the code, then use Cmd + Shift + L to add it to chat, and finally press Enter to submit.',
    context: 'chat',
    difficulty: 'intermediate'
  },
  
  // Cmd+K Shortcuts Exercises
  {
    id: 'cmdk-exercise-1',
    type: 'scenario',
    question: 'You want to quickly access the command palette. What do you press?',
    options: ['Cmd + K', 'Cmd + P', 'Cmd + Shift + P', 'Cmd + Space'],
    correctAnswer: 'Cmd + K',
    explanation: 'Cmd + K opens the Cmd+K interface, which is a command palette for quick access to commands.',
    context: 'cmdk',
    difficulty: 'beginner'
  },
  {
    id: 'cmdk-exercise-2',
    type: 'scenario',
    question: 'What\'s the shortcut to ask a quick question using Cmd+K?',
    options: ['Option + Enter', 'Cmd + Enter', 'Shift + Enter', 'Alt + /'],
    correctAnswer: 'Option + Enter',
    explanation: 'Option + Enter allows you to ask a quick question without opening a full chat when using Cmd+K.',
    context: 'cmdk',
    difficulty: 'intermediate'
  },
  
  // Code Selection & Context Exercises
  {
    id: 'code-exercise-1',
    type: 'scenario',
    question: 'You want to add the current selection to a new chat. What shortcut do you use?',
    options: ['Cmd + L', 'Cmd + Shift + L', 'Cmd + N', 'Cmd + Shift + K'],
    correctAnswer: 'Cmd + L',
    explanation: 'Cmd + L adds the selected code to a new chat session.',
    context: 'code',
    difficulty: 'beginner'
  },
  {
    id: 'code-exercise-2',
    type: 'scenario',
    question: 'What symbol do you type to access @-symbols in chat?',
    options: ['@', '#', '/', '$'],
    correctAnswer: '@',
    explanation: 'Typing @ in chat allows you to access @-symbols for adding context.',
    context: 'code',
    difficulty: 'beginner'
  },
  {
    id: 'code-exercise-3',
    type: 'sequence',
    question: 'Describe how to select code, copy it, and add it as context.',
    options: [
      'Select code → Cmd + C → Cmd + V',
      'Select code → Cmd + C → Cmd + Shift + V',
      'Select code → Cmd + Shift + L',
      'Select code → Cmd + L'
    ],
    correctAnswer: 'Select code → Cmd + C → Cmd + V',
    explanation: 'Select the code, copy it with Cmd + C, and then paste it with Cmd + V to add it as reference code context.',
    context: 'code',
    difficulty: 'intermediate'
  },
  
  // Tab Shortcuts Exercises
  {
    id: 'tab-exercise-1',
    type: 'scenario',
    question: 'The AI suggests code completion. How do you accept it?',
    options: ['Tab', 'Enter', 'Cmd + Enter', 'Space'],
    correctAnswer: 'Tab',
    explanation: 'Pressing Tab accepts the current AI code suggestion.',
    context: 'tab',
    difficulty: 'beginner'
  },
  {
    id: 'tab-exercise-2',
    type: 'scenario',
    question: 'You only want to accept the next word of a suggestion. What\'s the shortcut?',
    options: ['Cmd + →', 'Tab', 'Cmd + Space', 'Alt + →'],
    correctAnswer: 'Cmd + →',
    explanation: 'Cmd + → accepts only the next word of an AI suggestion.',
    context: 'tab',
    difficulty: 'intermediate'
  },
  
  // Terminal Shortcuts Exercises
  {
    id: 'terminal-exercise-1',
    type: 'scenario',
    question: 'You\'re in the terminal and want to use AI to generate a command. What shortcut do you use?',
    options: ['Cmd + K', 'Cmd + I', 'Cmd + L', 'Cmd + T'],
    correctAnswer: 'Cmd + K',
    explanation: 'Cmd + K opens the terminal prompt bar for AI-assisted command generation.',
    context: 'terminal',
    difficulty: 'beginner'
  },
  {
    id: 'terminal-exercise-2',
    type: 'scenario',
    question: 'What shortcut runs a generated command in the terminal?',
    options: ['Cmd + Enter', 'Enter', 'Cmd + R', 'Cmd + Shift + Enter'],
    correctAnswer: 'Cmd + Enter',
    explanation: 'Cmd + Enter executes the command generated by the AI in the terminal.',
    context: 'terminal',
    difficulty: 'beginner'
  },
  
  // Final Challenge
  {
    id: 'final-challenge',
    type: 'sequence',
    question: 'You need to open a file, select some code, add it to chat, ask the AI about it, accept its suggestions, and then run a terminal command based on the AI\'s advice. What sequence of shortcuts would you use?',
    options: [
      'Cmd + P (open file) → Select code → Cmd + Shift + L → Enter → Tab (accept suggestion) → Cmd + ` (open terminal) → Cmd + K → Cmd + Enter',
      'Cmd + O (open file) → Select code → Cmd + C → Cmd + V → Enter → Tab → Cmd + J → Cmd + K → Enter',
      'Cmd + P (open file) → Select code → Cmd + L → Enter → Cmd + Enter → Cmd + ` → Enter',
      'Cmd + O (open file) → Select code → Cmd + Shift + K → Enter → Tab → Cmd + T → Cmd + Enter'
    ],
    correctAnswer: 'Cmd + P (open file) → Select code → Cmd + Shift + L → Enter → Tab (accept suggestion) → Cmd + ` (open terminal) → Cmd + K → Cmd + Enter',
    explanation: 'This sequence efficiently navigates through opening a file, adding code to chat, interacting with the AI, and executing a terminal command.',
    context: 'general',
    difficulty: 'advanced'
  }
];

export default cursorShortcutsExercises; 
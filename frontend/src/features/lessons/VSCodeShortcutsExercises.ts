interface Exercise {
  id: string;
  type: 'scenario' | 'fill-in-blank' | 'matching' | 'speed-drill' | 'sequence';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  context: 'navigation' | 'editing' | 'code-nav' | 'search' | 'workspace' | 'debug';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const vsCodeShortcutsExercises: Exercise[] = [
  // Navigation Shortcuts Exercises
  {
    id: 'navigation-exercise-1',
    type: 'scenario',
    question: 'You need to quickly open a file in your project but don\'t want to use the file explorer. Which shortcut would you use?',
    options: ['Ctrl + P', 'Ctrl + O', 'Ctrl + N', 'Ctrl + F'],
    correctAnswer: 'Ctrl + P',
    explanation: 'Ctrl + P (Quick Open) allows you to quickly open files in your project by typing their name.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  {
    id: 'navigation-exercise-2',
    type: 'scenario',
    question: 'You want to access VS Code commands without navigating through menus. Which shortcut would you use?',
    options: ['Ctrl + Shift + P', 'Ctrl + P', 'Ctrl + Shift + O', 'Ctrl + Shift + F'],
    correctAnswer: 'Ctrl + Shift + P',
    explanation: 'Ctrl + Shift + P opens the Command Palette, giving you access to all VS Code commands.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  {
    id: 'navigation-exercise-3',
    type: 'scenario',
    question: 'You need to jump to line 157 in a large file. What\'s the fastest way to do this?',
    options: ['Ctrl + G', 'Ctrl + L', 'Ctrl + Shift + G', 'Ctrl + F then type 157'],
    correctAnswer: 'Ctrl + G',
    explanation: 'Ctrl + G (Go to Line) allows you to jump directly to a specific line number in the current file.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  
  // Editing Shortcuts Exercises
  {
    id: 'editing-exercise-1',
    type: 'scenario',
    question: 'You need to make the same edit in multiple places at once. Which shortcut would help you do this?',
    options: ['Alt + Click', 'Ctrl + D', 'Ctrl + Alt + Down', 'Shift + Alt + I'],
    correctAnswer: 'Alt + Click',
    explanation: 'Alt + Click allows you to place multiple cursors at different positions to edit them simultaneously.',
    context: 'editing',
    difficulty: 'intermediate'
  },
  {
    id: 'editing-exercise-2',
    type: 'scenario',
    question: 'You want to duplicate the current line. Which shortcut would you use?',
    options: ['Shift + Alt + Down', 'Ctrl + D', 'Ctrl + Shift + D', 'Alt + Down'],
    correctAnswer: 'Shift + Alt + Down',
    explanation: 'Shift + Alt + Down duplicates the current line or selection and places it below.',
    context: 'editing',
    difficulty: 'beginner'
  },
  {
    id: 'editing-exercise-3',
    type: 'fill-in-blank',
    question: 'To select the entire current line in VS Code, you would press _____.',
    correctAnswer: 'Ctrl + L',
    explanation: 'Ctrl + L selects the entire current line, allowing you to quickly manipulate whole lines.',
    context: 'editing',
    difficulty: 'beginner'
  },
  
  // Code Navigation Exercises
  {
    id: 'code-nav-exercise-1',
    type: 'scenario',
    question: 'You want to see the definition of a function that\'s being called. Which shortcut would you use?',
    options: ['F12', 'Ctrl + Click', 'Alt + F12', 'Ctrl + F12'],
    correctAnswer: ['F12', 'Ctrl + Click'],
    explanation: 'F12 or Ctrl + Click (Go to Definition) jumps to the definition of a symbol, allowing you to see how a function is implemented.',
    context: 'code-nav',
    difficulty: 'intermediate'
  },
  {
    id: 'code-nav-exercise-2',
    type: 'scenario',
    question: 'You need to find all places where a particular function is used. Which shortcut would help?',
    options: ['Shift + F12', 'Ctrl + F12', 'Alt + F12', 'Ctrl + Shift + F12'],
    correctAnswer: 'Shift + F12',
    explanation: 'Shift + F12 (Find All References) shows all places where a symbol is referenced throughout your codebase.',
    context: 'code-nav',
    difficulty: 'intermediate'
  },
  
  // Search and Replace Exercises
  {
    id: 'search-exercise-1',
    type: 'sequence',
    question: 'What is the sequence of shortcuts to find and replace all occurrences of a word in the current file?',
    correctAnswer: ['Ctrl + H', 'Enter text to find', 'Tab', 'Enter replacement text', 'Alt + A'],
    explanation: 'Ctrl + H opens the replace dialog, then you enter the search text, Tab to the replace field, enter the replacement, and Alt + A to replace all.',
    context: 'search',
    difficulty: 'intermediate'
  },
  {
    id: 'search-exercise-2',
    type: 'scenario',
    question: 'You need to search for a specific text across all files in your project. Which shortcut would you use?',
    options: ['Ctrl + Shift + F', 'Ctrl + F', 'Ctrl + H', 'Ctrl + Shift + H'],
    correctAnswer: 'Ctrl + Shift + F',
    explanation: 'Ctrl + Shift + F opens the search across all files in your project, allowing you to find text in multiple files.',
    context: 'search',
    difficulty: 'intermediate'
  },
  
  // Workspace Management Exercises
  {
    id: 'workspace-exercise-1',
    type: 'scenario',
    question: 'You want to view two files side by side. Which shortcut would help you do this?',
    options: ['Ctrl + \\', 'Ctrl + K Ctrl + \\', 'Ctrl + Alt + \\', 'Ctrl + Shift + \\'],
    correctAnswer: 'Ctrl + \\',
    explanation: 'Ctrl + \\ (Split Editor) splits the editor to view multiple files side by side, enhancing your ability to compare or reference code.',
    context: 'workspace',
    difficulty: 'beginner'
  },
  {
    id: 'workspace-exercise-2',
    type: 'scenario',
    question: 'The sidebar is taking up too much space. How would you quickly hide it?',
    options: ['Ctrl + B', 'Ctrl + Shift + E', 'Ctrl + J', 'Ctrl + Shift + B'],
    correctAnswer: 'Ctrl + B',
    explanation: 'Ctrl + B toggles the sidebar visibility, giving you more space for your editor when needed.',
    context: 'workspace',
    difficulty: 'beginner'
  },
  
  // Debugging Exercises
  {
    id: 'debug-exercise-1',
    type: 'scenario',
    question: 'You want to start debugging your application. Which shortcut would you use?',
    options: ['F5', 'F9', 'Ctrl + F5', 'Shift + F5'],
    correctAnswer: 'F5',
    explanation: 'F5 starts the debugging session, allowing you to step through your code and inspect variables.',
    context: 'debug',
    difficulty: 'intermediate'
  },
  {
    id: 'debug-exercise-2',
    type: 'scenario',
    question: 'You need to add a breakpoint at the current line. Which shortcut would you use?',
    options: ['F9', 'F5', 'Ctrl + F9', 'Shift + F9'],
    correctAnswer: 'F9',
    explanation: 'F9 toggles a breakpoint at the current line, allowing you to pause execution at that point during debugging.',
    context: 'debug',
    difficulty: 'intermediate'
  },
  
  // Advanced Exercises
  {
    id: 'advanced-exercise-1',
    type: 'sequence',
    question: 'You need to refactor a piece of code by extracting it into a new method. What\'s the most efficient way to do this in VS Code?',
    correctAnswer: ['Select the code', 'Ctrl + Shift + P', 'Type "Extract Method"', 'Enter', 'Type method name'],
    explanation: 'Select the code you want to extract, open the Command Palette with Ctrl + Shift + P, search for "Extract Method", and then name your new method.',
    context: 'editing',
    difficulty: 'advanced'
  },
  {
    id: 'advanced-exercise-2',
    type: 'scenario',
    question: 'You\'re working on a large codebase and need to navigate between recently visited files. Which shortcut would help?',
    options: ['Ctrl + Tab', 'Alt + Left/Right', 'Ctrl + P then type @', 'Ctrl + Alt + Left/Right'],
    correctAnswer: 'Ctrl + Tab',
    explanation: 'Ctrl + Tab opens a list of recently visited files, allowing you to quickly switch between them.',
    context: 'navigation',
    difficulty: 'advanced'
  }
];

export default vsCodeShortcutsExercises; 
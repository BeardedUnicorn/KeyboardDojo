interface Exercise {
  id: string;
  type: 'scenario' | 'fill-in-blank' | 'matching' | 'speed-drill' | 'sequence';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  context: 'navigation' | 'editing' | 'refactoring' | 'code-nav' | 'search' | 'debug' | 'vcs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const intelliJShortcutsExercises: Exercise[] = [
  // Navigation Shortcuts Exercises
  {
    id: 'navigation-exercise-1',
    type: 'scenario',
    question: 'You need to quickly find any file, class, or action in your project. Which shortcut would you use?',
    options: ['Shift + Shift', 'Ctrl + N', 'Ctrl + Shift + N', 'Ctrl + F'],
    correctAnswer: 'Shift + Shift',
    explanation: 'Double-pressing Shift (Search Everywhere) allows you to search for any file, class, symbol, or action in your project.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  {
    id: 'navigation-exercise-2',
    type: 'scenario',
    question: 'You want to find a specific IDE action or setting. Which shortcut would you use?',
    options: ['Ctrl + Shift + A', 'Ctrl + Alt + S', 'Ctrl + Shift + S', 'Alt + Enter'],
    correctAnswer: 'Ctrl + Shift + A',
    explanation: 'Ctrl + Shift + A (Find Action) allows you to search for IDE actions and settings by name.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  {
    id: 'navigation-exercise-3',
    type: 'scenario',
    question: 'You need to quickly navigate to a specific Java class. Which shortcut would you use?',
    options: ['Ctrl + N', 'Ctrl + Shift + N', 'Ctrl + Alt + N', 'Ctrl + F12'],
    correctAnswer: 'Ctrl + N',
    explanation: 'Ctrl + N (Go to Class) allows you to quickly navigate to a class by name.',
    context: 'navigation',
    difficulty: 'beginner'
  },
  
  // Editing Shortcuts Exercises
  {
    id: 'editing-exercise-1',
    type: 'scenario',
    question: 'You want to see code completion suggestions. Which shortcut would you use?',
    options: ['Ctrl + Space', 'Alt + Enter', 'Ctrl + Shift + Space', 'Ctrl + J'],
    correctAnswer: 'Ctrl + Space',
    explanation: 'Ctrl + Space (Basic Code Completion) shows basic code completion suggestions.',
    context: 'editing',
    difficulty: 'beginner'
  },
  {
    id: 'editing-exercise-2',
    type: 'scenario',
    question: 'You want to see context-aware code completion suggestions. Which shortcut would you use?',
    options: ['Ctrl + Shift + Space', 'Ctrl + Space', 'Alt + Space', 'Ctrl + Alt + Space'],
    correctAnswer: 'Ctrl + Shift + Space',
    explanation: 'Ctrl + Shift + Space (Smart Code Completion) shows context-aware code completion suggestions based on the expected type.',
    context: 'editing',
    difficulty: 'intermediate'
  },
  {
    id: 'editing-exercise-3',
    type: 'scenario',
    question: 'You want to duplicate the current line. Which shortcut would you use?',
    options: ['Ctrl + D', 'Ctrl + Shift + D', 'Ctrl + Alt + Down', 'Shift + Alt + Down'],
    correctAnswer: 'Ctrl + D',
    explanation: 'Ctrl + D duplicates the current line or selected block of code.',
    context: 'editing',
    difficulty: 'beginner'
  },
  
  // Refactoring Shortcuts Exercises
  {
    id: 'refactoring-exercise-1',
    type: 'scenario',
    question: 'You want to rename a variable and update all references. Which shortcut would you use?',
    options: ['Shift + F6', 'Ctrl + F6', 'Alt + Shift + R', 'Ctrl + R'],
    correctAnswer: 'Shift + F6',
    explanation: 'Shift + F6 (Rename) allows you to rename a symbol and automatically update all references.',
    context: 'refactoring',
    difficulty: 'intermediate'
  },
  {
    id: 'refactoring-exercise-2',
    type: 'scenario',
    question: 'You want to extract a block of code into a new method. Which shortcut would you use?',
    options: ['Ctrl + Alt + M', 'Ctrl + Alt + E', 'Ctrl + Alt + N', 'Ctrl + Alt + C'],
    correctAnswer: 'Ctrl + Alt + M',
    explanation: 'Ctrl + Alt + M (Extract Method) allows you to extract selected code into a new method.',
    context: 'refactoring',
    difficulty: 'intermediate'
  },
  {
    id: 'refactoring-exercise-3',
    type: 'scenario',
    question: 'You want to extract a value into a variable. Which shortcut would you use?',
    options: ['Ctrl + Alt + V', 'Ctrl + Alt + C', 'Ctrl + Alt + F', 'Ctrl + Alt + P'],
    correctAnswer: 'Ctrl + Alt + V',
    explanation: 'Ctrl + Alt + V (Extract Variable) allows you to extract a selected expression into a variable.',
    context: 'refactoring',
    difficulty: 'intermediate'
  },
  
  // Code Navigation Exercises
  {
    id: 'code-nav-exercise-1',
    type: 'scenario',
    question: 'You want to navigate to the declaration of a method or class. Which shortcut would you use?',
    options: ['Ctrl + B', 'Ctrl + Alt + B', 'Ctrl + U', 'Ctrl + Shift + B'],
    correctAnswer: 'Ctrl + B',
    explanation: 'Ctrl + B (Go to Declaration) navigates to the declaration of a symbol.',
    context: 'code-nav',
    difficulty: 'intermediate'
  },
  {
    id: 'code-nav-exercise-2',
    type: 'scenario',
    question: 'You want to see all implementations of an interface method. Which shortcut would you use?',
    options: ['Ctrl + Alt + B', 'Ctrl + B', 'Ctrl + Shift + B', 'Alt + F7'],
    correctAnswer: 'Ctrl + Alt + B',
    explanation: 'Ctrl + Alt + B (Go to Implementation) navigates to the implementation of an interface or abstract method.',
    context: 'code-nav',
    difficulty: 'intermediate'
  },
  {
    id: 'code-nav-exercise-3',
    type: 'scenario',
    question: 'You want to find all usages of a method or class. Which shortcut would you use?',
    options: ['Alt + F7', 'Ctrl + F7', 'Shift + F7', 'Ctrl + Alt + F7'],
    correctAnswer: 'Alt + F7',
    explanation: 'Alt + F7 (Find Usages) finds all places where a symbol is used throughout your codebase.',
    context: 'code-nav',
    difficulty: 'intermediate'
  },
  
  // Search and Replace Exercises
  {
    id: 'search-exercise-1',
    type: 'scenario',
    question: 'You want to search for text in the current file. Which shortcut would you use?',
    options: ['Ctrl + F', 'Ctrl + Shift + F', 'Ctrl + R', 'Ctrl + Shift + R'],
    correctAnswer: 'Ctrl + F',
    explanation: 'Ctrl + F (Find) allows you to search for text in the current file.',
    context: 'search',
    difficulty: 'beginner'
  },
  {
    id: 'search-exercise-2',
    type: 'scenario',
    question: 'You want to replace text in the current file. Which shortcut would you use?',
    options: ['Ctrl + R', 'Ctrl + H', 'Ctrl + Shift + R', 'Ctrl + F then Tab'],
    correctAnswer: 'Ctrl + R',
    explanation: 'Ctrl + R (Replace) allows you to search and replace text in the current file.',
    context: 'search',
    difficulty: 'beginner'
  },
  {
    id: 'search-exercise-3',
    type: 'scenario',
    question: 'You want to search for text across all files in your project. Which shortcut would you use?',
    options: ['Ctrl + Shift + F', 'Ctrl + F', 'Ctrl + Shift + R', 'Ctrl + R'],
    correctAnswer: 'Ctrl + Shift + F',
    explanation: 'Ctrl + Shift + F (Find in Path) allows you to search for text across all files in your project.',
    context: 'search',
    difficulty: 'intermediate'
  },
  
  // Debugging Exercises
  {
    id: 'debug-exercise-1',
    type: 'scenario',
    question: 'You want to start debugging your application. Which shortcut would you use?',
    options: ['Shift + F9', 'F9', 'Ctrl + F9', 'Shift + F10'],
    correctAnswer: 'Shift + F9',
    explanation: 'Shift + F9 (Debug) starts the debugging session.',
    context: 'debug',
    difficulty: 'intermediate'
  },
  {
    id: 'debug-exercise-2',
    type: 'scenario',
    question: 'You want to add a breakpoint at the current line. Which shortcut would you use?',
    options: ['Ctrl + F8', 'F8', 'Shift + F8', 'Alt + F8'],
    correctAnswer: 'Ctrl + F8',
    explanation: 'Ctrl + F8 (Toggle Breakpoint) adds or removes a breakpoint at the current line.',
    context: 'debug',
    difficulty: 'intermediate'
  },
  {
    id: 'debug-exercise-3',
    type: 'scenario',
    question: 'While debugging, you want to step over the current line. Which shortcut would you use?',
    options: ['F8', 'F7', 'Shift + F8', 'Shift + F7'],
    correctAnswer: 'F8',
    explanation: 'F8 (Step Over) executes the current line and moves to the next line without stepping into methods.',
    context: 'debug',
    difficulty: 'intermediate'
  },
  
  // Version Control Exercises
  {
    id: 'vcs-exercise-1',
    type: 'scenario',
    question: 'You want to commit your changes to version control. Which shortcut would you use?',
    options: ['Ctrl + K', 'Ctrl + Shift + K', 'Alt + K', 'Ctrl + Alt + K'],
    correctAnswer: 'Ctrl + K',
    explanation: 'Ctrl + K (Commit) opens the commit dialog to commit changes to version control.',
    context: 'vcs',
    difficulty: 'intermediate'
  },
  {
    id: 'vcs-exercise-2',
    type: 'scenario',
    question: 'You want to update your project from version control. Which shortcut would you use?',
    options: ['Ctrl + T', 'Ctrl + Shift + T', 'Alt + T', 'Ctrl + Alt + T'],
    correctAnswer: 'Ctrl + T',
    explanation: 'Ctrl + T (Update Project) updates your project from version control.',
    context: 'vcs',
    difficulty: 'intermediate'
  },
  
  // Advanced Exercises
  {
    id: 'advanced-exercise-1',
    type: 'sequence',
    question: 'What is the sequence of shortcuts to extract a method parameter from a hardcoded value in a method call?',
    correctAnswer: ['Place cursor on value', 'Ctrl + Alt + P', 'Enter parameter name', 'Enter'],
    explanation: 'Place your cursor on the value, press Ctrl + Alt + P (Extract Parameter), enter a name for the parameter, and press Enter to complete the refactoring.',
    context: 'refactoring',
    difficulty: 'advanced'
  },
  {
    id: 'advanced-exercise-2',
    type: 'scenario',
    question: 'You want to quickly generate common code (getters, setters, constructors, etc.). Which shortcut would you use?',
    options: ['Alt + Insert', 'Ctrl + Insert', 'Shift + Insert', 'Ctrl + Alt + Insert'],
    correctAnswer: 'Alt + Insert',
    explanation: 'Alt + Insert (Generate) opens the Generate menu, allowing you to quickly generate common code structures like getters, setters, constructors, etc.',
    context: 'editing',
    difficulty: 'advanced'
  }
];

export default intelliJShortcutsExercises; 
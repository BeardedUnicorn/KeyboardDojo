import { APIGatewayProxyHandler } from 'aws-lambda';
import { extractAndVerifyToken, unauthorizedResponse } from '../../utils/auth';
import { createLesson } from '../../utils/lessons';
import { v4 as uuidv4 } from 'uuid';
import { Lesson, Shortcut } from '../../models/lesson';

// Define a type for the result items
interface SeedResult {
  id?: string;
  title: string;
  status: 'created' | 'failed';
}

/**
 * Initial seed data for keyboard shortcuts lessons
 */
const seedData = [
  // VSCode Lessons
  {
    title: 'VS Code: Basic Navigation',
    description: 'Learn the essential shortcuts for navigating in VS Code',
    category: 'vscode',
    difficulty: 'beginner',
    order: 1,
    content: {
      introduction: 'Visual Studio Code (VS Code) is a popular code editor that offers powerful features to enhance your productivity. In this lesson, you\'ll learn the basic navigation shortcuts that will help you move around your code more efficiently.',
      shortcuts: [
        {
          id: uuidv4(),
          name: 'Go to Line',
          description: 'Jump to a specific line number in the current file',
          keyCombination: ['Ctrl', 'G'],
          operatingSystem: 'windows',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Go to Line',
          description: 'Jump to a specific line number in the current file',
          keyCombination: ['Cmd', 'G'],
          operatingSystem: 'mac',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Quick Open',
          description: 'Open file by name',
          keyCombination: ['Ctrl', 'P'],
          operatingSystem: 'windows',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Quick Open',
          description: 'Open file by name',
          keyCombination: ['Cmd', 'P'],
          operatingSystem: 'mac',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Command Palette',
          description: 'Show all commands',
          keyCombination: ['Ctrl', 'Shift', 'P'],
          operatingSystem: 'windows',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Command Palette',
          description: 'Show all commands',
          keyCombination: ['Cmd', 'Shift', 'P'],
          operatingSystem: 'mac',
          context: 'Global'
        }
      ],
      tips: [
        'Practice these shortcuts regularly until they become muscle memory',
        'The Command Palette gives you access to almost all VS Code functionality',
        'Quick Open allows fuzzy search - you don\'t need to type the exact file name'
      ]
    },
    isPremium: false
  },
  {
    title: 'VS Code: Text Editing Basics',
    description: 'Master the fundamentals of text manipulation in VS Code',
    category: 'vscode',
    difficulty: 'beginner',
    order: 2,
    content: {
      introduction: 'Efficient text editing is essential for coding productivity. This lesson covers the basic shortcuts for selecting, copying, moving, and manipulating text in VS Code.',
      shortcuts: [
        {
          id: uuidv4(),
          name: 'Copy Line (Empty Selection)',
          description: 'Copy the current line when no text is selected',
          keyCombination: ['Ctrl', 'C'],
          operatingSystem: 'windows',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Copy Line (Empty Selection)',
          description: 'Copy the current line when no text is selected',
          keyCombination: ['Cmd', 'C'],
          operatingSystem: 'mac',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Cut Line (Empty Selection)',
          description: 'Cut the current line when no text is selected',
          keyCombination: ['Ctrl', 'X'],
          operatingSystem: 'windows',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Cut Line (Empty Selection)',
          description: 'Cut the current line when no text is selected',
          keyCombination: ['Cmd', 'X'],
          operatingSystem: 'mac',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Move Line Up',
          description: 'Move the current line up',
          keyCombination: ['Alt', 'Up'],
          operatingSystem: 'windows',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Move Line Up',
          description: 'Move the current line up',
          keyCombination: ['Option', 'Up'],
          operatingSystem: 'mac',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Move Line Down',
          description: 'Move the current line down',
          keyCombination: ['Alt', 'Down'],
          operatingSystem: 'windows',
          context: 'Editor'
        },
        {
          id: uuidv4(),
          name: 'Move Line Down',
          description: 'Move the current line down',
          keyCombination: ['Option', 'Down'],
          operatingSystem: 'mac',
          context: 'Editor'
        }
      ],
      tips: [
        'VS Code automatically copies or cuts the entire line if no text is selected',
        'Moving lines up or down is great for reorganizing your code quickly',
        'You can also move blocks of code by selecting multiple lines first'
      ]
    },
    isPremium: false
  },
  
  // Photoshop Lessons
  {
    title: 'Photoshop: Essential Tools',
    description: 'Learn the shortcuts for essential Photoshop tools',
    category: 'photoshop',
    difficulty: 'beginner',
    order: 1,
    content: {
      introduction: 'Adobe Photoshop is a powerful image editing software. Learning the keyboard shortcuts for its essential tools will significantly speed up your workflow. This lesson covers the most commonly used tool shortcuts.',
      shortcuts: [
        {
          id: uuidv4(),
          name: 'Move Tool',
          description: 'Select the Move tool for moving layers',
          keyCombination: ['V'],
          operatingSystem: 'all',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Marquee Selection Tool',
          description: 'Select the rectangular or elliptical marquee selection tool',
          keyCombination: ['M'],
          operatingSystem: 'all',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Lasso Tool',
          description: 'Select the lasso tool for freeform selections',
          keyCombination: ['L'],
          operatingSystem: 'all',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Brush Tool',
          description: 'Select the brush tool for painting',
          keyCombination: ['B'],
          operatingSystem: 'all',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Clone Stamp Tool',
          description: 'Select the clone stamp tool for duplicating areas',
          keyCombination: ['S'],
          operatingSystem: 'all',
          context: 'Global'
        },
        {
          id: uuidv4(),
          name: 'Eraser Tool',
          description: 'Select the eraser tool for erasing pixels',
          keyCombination: ['E'],
          operatingSystem: 'all',
          context: 'Global'
        }
      ],
      tips: [
        'You can cycle through tool variations by pressing Shift + the tool shortcut',
        'Adjust brush size quickly with [ and ] brackets',
        'Temporarily switch to the Hand tool by holding the spacebar'
      ]
    },
    isPremium: false
  }
];

/**
 * Lambda handler to seed initial lessons data (admin only)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extract token and verify admin
    const tokenPayload = extractAndVerifyToken(event);
    
    if (!tokenPayload || !tokenPayload.isAdmin) {
      return unauthorizedResponse();
    }
    
    const results: SeedResult[] = [];
    
    // Create each lesson from seed data
    for (const lessonData of seedData) {
      // Cast difficulty and operatingSystem to the correct types
      const typedLessonData = {
        ...lessonData,
        difficulty: lessonData.difficulty as 'beginner' | 'intermediate' | 'advanced',
        content: {
          ...lessonData.content,
          shortcuts: lessonData.content.shortcuts.map(shortcut => ({
            ...shortcut,
            operatingSystem: shortcut.operatingSystem as 'windows' | 'mac' | 'linux' | 'all',
            keyCombination: shortcut.keyCombination
          }))
        }
      };
      
      const lesson = await createLesson(typedLessonData);
      
      if (lesson) {
        results.push({
          id: lesson.lessonId,
          title: lesson.title,
          status: 'created'
        });
      } else {
        results.push({
          title: lessonData.title,
          status: 'failed'
        });
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Seed completed',
        results,
      }),
    };
  } catch (error) {
    console.error('Error seeding lessons:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error seeding lessons',
      }),
    };
  }
}; 
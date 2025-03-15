/**
 * Lesson interface representing the structure of lesson documents in DynamoDB
 */
export interface Lesson {
  lessonId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  content: {
    introduction: string;
    shortcuts: Shortcut[];
    tips: string[];
  };
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Interface representing a keyboard shortcut with key combinations and descriptions
 */
export interface Shortcut {
  id: string;
  name: string;
  description: string;
  keyCombination: string[];
  operatingSystem?: 'windows' | 'mac' | 'linux' | 'all';
  context?: string;
} 
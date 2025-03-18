// Lesson step definition
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { CodeContext, QuizOption } from '@/types/ICurriculum';

export interface ILessonStep {
  id: string;
  type: 'shortcut' | 'quiz' | 'info';
  title?: string;
  description?: string;
  shortcut?: IShortcut;
  question?: string;
  options?: QuizOption[];
  timeLimit?: number;
  explanation?: string;
  imageUrl?: string;
  context?: string;
  codeContext?: CodeContext;
  hint?: string;
  instructions?: string;
  correctAnswer?: number;
}

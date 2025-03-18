// Enhanced Lesson Exercise structure
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { LessonStepType } from '@/types/curriculum/LessonStepType';
import type { QuizOption } from '@/types/ICurriculum';

export interface ILessonExercise {
  id: string;
  type: LessonStepType;
  title: string;
  description: string;
  context: string; // Real-world scenario
  difficulty: DifficultyLevel;
  shortcut?: IShortcut;
  options?: QuizOption[]; // For quiz exercises
  correctAnswer?: number; // For quiz exercises
  codeContext?: {
    beforeCode: string;
    afterCode: string; // How code looks after shortcut is applied
    highlightLines?: number[];
  };
  feedbackSuccess: {
    message: string;
    animation?: string;
    sound?: string;
    mascotReaction?: string;
  };
  feedbackFailure: {
    message: string;
    animation?: string;
    sound?: string;
    mascotReaction?: string;
    hint?: string;
  };
} // Enhanced Lesson definition

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ILessonExercise } from '@/types/curriculum/lesson/ILessonExercise';
import type { ILessonStep } from '@/types/curriculum/lesson/ILessonStep';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';

export interface ILesson {
  id: string;
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  xpReward: number;
  steps: ILessonStep[];
  prerequisites?: string[];
  estimatedTime?: number; // in minutes
  tags?: string[];
  shortcuts?: IShortcut[];
  category?: ShortcutCategory;
  currencyReward?: number;
  heartsRequired?: number;
  maxStars?: number;
  order?: number;
  introduction?: {
    title: string;
    description: string;
  };
  exercises?: ILessonExercise[];
  summary?: {
    title: string;
    description: string;
  };
}

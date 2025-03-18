import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';

export interface ILessonNode {
  id: string;
  type: 'lesson';
  lessonId?: string;
  title?: string;
  description?: string;
  position: {
    x: number;
    y: number;
  };
  connections?: string[];
  unlockRequirements: {
    previousNodes?: string[];
    xpRequired?: number;
    levelRequired?: number;
  };
  content?: string;
  status?: 'locked' | 'unlocked' | 'completed';
  difficulty?: DifficultyLevel;
  category?: ShortcutCategory;
  order?: number;
}

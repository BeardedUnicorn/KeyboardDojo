import { Lesson } from '../../api/lessonsService';

export type { Lesson };

export interface LessonsState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  filteredLessons: Lesson[];
  categories: string[];
  error: string | null;
  isLoading: boolean;
} 
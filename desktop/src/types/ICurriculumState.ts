// Define types
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type {
  ApplicationType,
  IApplicationTrack,
  ICurriculum,
  IModule,
  IPath,
  PathNode,
} from '@/types/progress/ICurriculum';

export interface ICurriculumState {
  curriculums: ICurriculum[];
  activeCurriculumId: string | null;
  tracks: IApplicationTrack[];
  activeTrackId: ApplicationType | null;
  modules: IModule[];
  lessons: ILesson[];
  paths: IPath[];
  pathNodes: PathNode[];
  isLoading: boolean;
  error: string | null;
}

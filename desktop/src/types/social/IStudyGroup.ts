import type { StudyGroupType } from '@/types/social/studyGroupType';

/**
 * Study group
 */
export interface IStudyGroup {
  id: string;
  name: string;
  description: string;
  type: StudyGroupType;
  ownerId: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  applicationTrack?: string; // Optional focus on a specific IDE
  tags: string[];
}

import type { StudyGroupRole } from '@/types/social/studyGroupRole';

/**
 * Study group member
 */
export interface IStudyGroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: StudyGroupRole;
  joinedAt: string;
  lastActive: string;
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    level: number;
  };
}

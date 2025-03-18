import type { IFriend } from '@/types/social/IFriend';

/**
 * Friend with user details
 */
export interface IFriendWithDetails extends IFriend {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    level: number;
    lastActive: string;
    isOnline: boolean;
  };
}

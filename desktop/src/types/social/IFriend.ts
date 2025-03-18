import type { FriendStatus } from '@/types/social/FriendStatus';

/**
 * Friend relationship
 */
export interface IFriend {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt: string;
}

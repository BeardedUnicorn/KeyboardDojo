import type { ConversationType } from '@/types/social/ConversationType';

/**
 * Conversation
 */
export interface IConversation {
  id: string;
  type: ConversationType;
  participantIds: string[];
  lastMessageId?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

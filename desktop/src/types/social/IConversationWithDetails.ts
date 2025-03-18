import type { IConversation } from '@/types/social/IConversation';
import type { IMessage } from '@/types/social/IMessage';

/**
 * Conversation with details
 */
export interface IConversationWithDetails extends IConversation {
  participants: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isOnline: boolean;
  }[];
  lastMessage?: IMessage;
}

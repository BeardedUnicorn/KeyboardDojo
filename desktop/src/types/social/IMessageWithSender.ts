import type { IMessage } from '@/types/social/IMessage';

/**
 * Message with sender details
 */
export interface IMessageWithSender extends IMessage {
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
}

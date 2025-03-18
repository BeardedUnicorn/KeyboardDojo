import type { MessageType } from '@/types/social/MessageType';

/**
 * Message
 */
export interface IMessage {
  id: string;
  senderId: string;
  recipientId?: string; // For direct messages
  groupId?: string; // For group messages
  type: MessageType;
  content: string;
  metadata?: Record<string, any>; // Additional data based on message type
  createdAt: string;
  updatedAt: string;
  readBy: string[]; // Array of user IDs who have read the message
}

/**
 * Challenge participant
 */
export interface IChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  skipCount: number;
  completedAt?: string;
  rank?: number;
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    level: number;
  };
}

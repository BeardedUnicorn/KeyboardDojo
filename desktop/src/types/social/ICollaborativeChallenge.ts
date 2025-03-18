import type { ChallengeDifficulty } from '@/types/social/ChallengeDifficulty';
import type { ChallengeStatus } from '@/types/social/ChallengeStatus';

/**
 * Collaborative challenge
 */
export interface ICollaborativeChallenge {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  applicationTrack: string;
  shortcutCategories: string[];
  participantIds: string[];
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
  rules: {
    timeLimit?: number; // In minutes, optional
    shortcutCount: number;
    pointsPerCorrect: number;
    bonusPoints?: number;
    penaltyPerSkip?: number;
  };
}

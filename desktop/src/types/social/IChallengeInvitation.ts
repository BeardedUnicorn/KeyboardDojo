/**
 * Challenge invitation
 */
export interface IChallengeInvitation {
  id: string;
  challengeId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  expiresAt: string;
}

// User types
export interface User {
  userId: string;
  email: string;
  name: string;
  authProvider: 'google' | 'apple' | 'github' | 'email';
  providerId?: string;
  hashedPassword?: string;
  salt?: string;
  createdAt: number;
  isAdmin: boolean;
  isPremium: boolean;
  stripeCustomerId?: string;
}

// Lesson types
export interface Lesson {
  lessonId: string;
  title: string;
  description: string;
  content: {
    shortcuts: Shortcut[];
    instructions: string;
  };
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  isPremium: boolean;
}

export interface Shortcut {
  id: string;
  name: string;
  description: string;
  keys: string[];
  context?: string;
}

// Progress types
export interface Progress {
  userId: string;
  completedLessons: {
    [lessonId: string]: {
      completedAt: number;
      score?: number;
      attempts: number;
    };
  };
  totalLessonsCompleted: number;
  streakDays: number;
  lastActivityDate: number;
}

// Subscription types
export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  PAUSED = 'paused'
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
  updatedAt: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'hashedPassword'>;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  isPremium: boolean;
}

// Auth types
export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  exp: number;
  iat: number;
} 
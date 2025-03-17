import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  secret?: boolean;
  criteria?: {
    type: string;
    value: number;
  };
  xpReward?: number;
}

export interface AchievementWithProgress {
  achievement: Achievement;
  completed: boolean;
  completedDate?: string;
  progress?: number;
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  completedAchievements: AchievementWithProgress[];
  awardAchievement: (achievementId: string) => void;
  hasAchievement: (achievementId: string) => boolean;
  refreshAchievements: () => void;
  isLoading: boolean;
}

// Define available achievements
const availableAchievements: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎓',
    unlockedAt: null,
    category: 'practice',
    rarity: 'common',
    xpReward: 10,
  },
  {
    id: 'complete_lesson',
    title: 'Quick Learner',
    description: 'Complete a lesson without any mistakes',
    icon: '⚡',
    unlockedAt: null,
    category: 'practice',
    rarity: 'uncommon',
    xpReward: 20,
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    unlockedAt: null,
    category: 'streak',
    rarity: 'uncommon',
    xpReward: 30,
  },
  {
    id: 'complete_module',
    title: 'Module Master',
    description: 'Complete all lessons in a module',
    icon: '🏆',
    unlockedAt: null,
    category: 'mastery',
    rarity: 'rare',
    xpReward: 50,
  },
  {
    id: 'complete_track',
    title: 'Track Champion',
    description: 'Complete all modules in a track',
    icon: '🥇',
    unlockedAt: null,
    category: 'mastery',
    rarity: 'epic',
    xpReward: 100,
  },
  {
    id: 'perfect_score',
    title: 'Perfectionist',
    description: 'Get a perfect score in a challenge',
    icon: '💯',
    unlockedAt: null,
    category: 'mastery',
    rarity: 'legendary',
    xpReward: 200,
  },
];

export const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(availableAchievements);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load achievements from localStorage on mount
  useEffect(() => {
    loadAchievements();
  }, []);
  
  const loadAchievements = () => {
    setIsLoading(true);
    try {
      const savedAchievements = localStorage.getItem('user-achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save achievements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user-achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(achievement => achievement.unlockedAt !== null);
  
  // Get completed achievements with progress info
  const completedAchievements: AchievementWithProgress[] = unlockedAchievements.map(achievement => ({
    achievement,
    completed: true,
    completedDate: achievement.unlockedAt || undefined,
    progress: 100,
  }));
  
  // Award an achievement
  const awardAchievement = (achievementId: string) => {
    setAchievements(prev => {
      return prev.map(achievement => {
        if (achievement.id === achievementId && achievement.unlockedAt === null) {
          return {
            ...achievement,
            unlockedAt: new Date().toISOString(),
          };
        }
        return achievement;
      });
    });
  };
  
  // Check if user has an achievement
  const hasAchievement = (achievementId: string): boolean => {
    return achievements.some(achievement => achievement.id === achievementId && achievement.unlockedAt !== null);
  };
  
  // Refresh achievements
  const refreshAchievements = () => {
    loadAchievements();
  };
  
  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        unlockedAchievements,
        completedAchievements,
        awardAchievement,
        hasAchievement,
        refreshAchievements,
        isLoading,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = (): AchievementsContextType => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
}; 
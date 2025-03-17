import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { achievementsService, AchievementProgress } from '../services/achievementsService';
import { userProgressService } from '../services/userProgressService';
import { AchievementNotification } from '../components';

export interface AchievementsContextType {
  achievements: AchievementProgress[];
  completedAchievements: AchievementProgress[];
  refreshAchievements: () => void;
  isLoading: boolean;
}

export const AchievementsContext = createContext<AchievementsContextType | null>(null);

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

interface AchievementsProviderProps {
  children: ReactNode;
}

export const AchievementsProvider: React.FC<AchievementsProviderProps> = ({ children }) => {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState<AchievementProgress | null>(null);
  
  const refreshAchievements = () => {
    // Get current user progress
    const progress = userProgressService.getProgress();
    
    if (progress) {
      // Check for streak achievements
      const streakAchievements = achievementsService.checkAchievements(
        'streak', 
        progress.streakDays
      );
      
      // Check for practice achievements
      const practiceAchievements = achievementsService.checkAchievements(
        'practice', 
        progress.completedLessons.length
      );
      
      // Check for mastery achievements
      const masteryAchievements = achievementsService.checkAchievements(
        'mastery', 
        progress.completedModules.length
      );
      
      // Set the most recently unlocked achievement for notification
      const allUnlocked = [...streakAchievements, ...practiceAchievements, ...masteryAchievements];
      if (allUnlocked.length > 0) {
        setUnlockedAchievement(allUnlocked[allUnlocked.length - 1]);
      }
    }
    
    // Update achievements list
    setAchievements(achievementsService.getAchievements());
  };
  
  useEffect(() => {
    // Initialize achievements
    setIsLoading(true);
    setAchievements(achievementsService.getAchievements());
    setIsLoading(false);
    
    // Add listener for achievement updates
    const handleAchievementsUpdate = (updatedAchievements: AchievementProgress[]) => {
      setAchievements(updatedAchievements);
    };
    
    achievementsService.addListener(handleAchievementsUpdate);
    
    // Check for achievements on mount
    refreshAchievements();
    
    return () => {
      achievementsService.removeListener(handleAchievementsUpdate);
    };
  }, []);
  
  // Filter completed achievements
  const completedAchievements = achievements.filter(a => a.completed);
  
  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        completedAchievements,
        refreshAchievements,
        isLoading
      }}
    >
      {children}
      
      {unlockedAchievement && (
        <AchievementNotification
          achievement={unlockedAchievement.achievement}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}
    </AchievementsContext.Provider>
  );
}; 
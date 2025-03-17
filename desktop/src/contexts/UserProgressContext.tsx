import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userProgressService } from '../services/userProgressService';
import { UserProgress } from '../types/curriculum';
import { LevelUpNotification } from '../components';

interface UserProgressContextType {
  progress: UserProgress | null;
  refreshProgress: () => void;
  isLoading: boolean;
}

const UserProgressContext = createContext<UserProgressContextType>({
  progress: null,
  refreshProgress: () => {},
  isLoading: true,
});

export const useUserProgress = () => useContext(UserProgressContext);

interface UserProgressProviderProps {
  children: ReactNode;
}

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  const refreshProgress = () => {
    // Get current progress
    const currentProgress = progress;
    
    // Get updated progress
    const updatedProgress = userProgressService.getProgress() || 
      userProgressService.initializeProgress('user1');
    
    // Check if user leveled up
    if (currentProgress && updatedProgress.level > currentProgress.level) {
      setNewLevel(updatedProgress.level);
      setShowLevelUp(true);
    }
    
    setProgress(updatedProgress);
  };
  
  useEffect(() => {
    // Initialize user progress
    setIsLoading(true);
    
    const userProgress = userProgressService.getProgress() || 
      userProgressService.initializeProgress('user1');
    
    setProgress(userProgress);
    setIsLoading(false);
    
    // Set up interval to check for streak updates
    const intervalId = setInterval(() => {
      userProgressService.updateStreak();
      refreshProgress();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <UserProgressContext.Provider
      value={{
        progress,
        refreshProgress,
        isLoading,
      }}
    >
      {children}
      
      {showLevelUp && (
        <LevelUpNotification 
          level={newLevel} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}
    </UserProgressContext.Provider>
  );
}; 
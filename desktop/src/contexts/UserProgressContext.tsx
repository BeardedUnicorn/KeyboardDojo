import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userProgressService } from '../services/userProgressService';
import { UserProgress } from '../types/curriculum';
import { LevelUpNotification } from '../components';
import { ApplicationType } from '../types/curriculum';

interface CompletedLesson {
  curriculumId: string;
  trackId: ApplicationType;
  lessonId: string;
  completedAt: string;
  score: number;
  timeSpent: number; // in seconds
}

interface UserProgressState {
  completedLessons: CompletedLesson[];
  completedModules: {
    curriculumId: string;
    trackId: ApplicationType;
    moduleId: string;
    completedAt: string;
  }[];
  xp: number;
  level: number;
  streakDays: number;
  lastActivity: string;
}

interface UserProgressContextType {
  progress: UserProgressState;
  markLessonCompleted: (curriculumId: string, trackId: ApplicationType, lessonId: string, score?: number, timeSpent?: number) => void;
  isLessonCompleted: (curriculumId: string, trackId: ApplicationType, lessonId: string) => boolean;
  isModuleCompleted: (curriculumId: string, trackId: ApplicationType, moduleId: string) => boolean;
  getXP: () => number;
  getLevel: () => number;
  getStreakDays: () => number;
  refreshProgress: () => void;
  isLoading: boolean;
}

const defaultProgress: UserProgressState = {
  completedLessons: [],
  completedModules: [],
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActivity: new Date().toISOString(),
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressState>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        setIsLoading(true);
        const savedProgress = localStorage.getItem('user-progress');
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error('Failed to load user progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
    
    // Set up interval to check for streak updates
    const intervalId = setInterval(() => {
      updateStreak();
      refreshProgress();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user-progress', JSON.stringify(progress));
  }, [progress]);
  
  // Update streak
  const updateStreak = () => {
    const lastActivity = new Date(progress.lastActivity);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day, increment streak
      setProgress(prev => ({
        ...prev,
        streakDays: prev.streakDays + 1,
        lastActivity: now.toISOString(),
      }));
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      setProgress(prev => ({
        ...prev,
        streakDays: 1,
        lastActivity: now.toISOString(),
      }));
    }
  };
  
  // Mark a lesson as completed
  const markLessonCompleted = (
    curriculumId: string, 
    trackId: ApplicationType, 
    lessonId: string, 
    score = 100, 
    timeSpent = 60
  ) => {
    setProgress(prev => {
      // Check if lesson is already completed
      const isAlreadyCompleted = prev.completedLessons.some(
        lesson => lesson.curriculumId === curriculumId && 
                 lesson.trackId === trackId && 
                 lesson.lessonId === lessonId
      );
      
      if (isAlreadyCompleted) {
        return prev;
      }
      
      // Add XP based on score
      const xpGained = Math.floor(score / 10);
      
      return {
        ...prev,
        completedLessons: [
          ...prev.completedLessons,
          {
            curriculumId,
            trackId,
            lessonId,
            completedAt: new Date().toISOString(),
            score,
            timeSpent,
          }
        ],
        xp: prev.xp + xpGained,
        level: calculateLevel(prev.xp + xpGained),
        lastActivity: new Date().toISOString(),
      };
    });
    
    // Also update in the service if it exists
    try {
      userProgressService.completeLesson(trackId, '', lessonId, score, timeSpent);
    } catch (error) {
      console.error('Error updating progress in service:', error);
    }
  };
  
  // Check if a lesson is completed
  const isLessonCompleted = (curriculumId: string, trackId: ApplicationType, lessonId: string): boolean => {
    return progress.completedLessons.some(
      lesson => lesson.curriculumId === curriculumId && 
               lesson.trackId === trackId && 
               lesson.lessonId === lessonId
    );
  };
  
  // Check if a module is completed
  const isModuleCompleted = (curriculumId: string, trackId: ApplicationType, moduleId: string): boolean => {
    return progress.completedModules.some(
      module => module.curriculumId === curriculumId && 
                module.trackId === trackId && 
                module.moduleId === moduleId
    );
  };
  
  // Get current XP
  const getXP = (): number => {
    return progress.xp;
  };
  
  // Get current level
  const getLevel = (): number => {
    return progress.level;
  };
  
  // Get streak days
  const getStreakDays = (): number => {
    return progress.streakDays;
  };
  
  // Refresh progress (e.g., after loading from server)
  const refreshProgress = () => {
    try {
      const savedProgress = localStorage.getItem('user-progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Failed to refresh user progress:', error);
    }
  };
  
  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    // Simple level calculation: level = 1 + floor(xp / 100)
    return 1 + Math.floor(xp / 100);
  };
  
  return (
    <UserProgressContext.Provider
      value={{
        progress,
        markLessonCompleted,
        isLessonCompleted,
        isModuleCompleted,
        getXP,
        getLevel,
        getStreakDays,
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

export const useUserProgress = (): UserProgressContextType => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}; 
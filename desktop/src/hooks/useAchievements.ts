import { useContext } from 'react';
import { AchievementsContext } from '../contexts/AchievementsContext';

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  
  return context;
}; 
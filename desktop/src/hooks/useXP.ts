import { useState, useEffect, useCallback } from 'react';

import { xpService } from '@/services';

import type { XPData } from '@/services';

export const useXP = () => {
  const [xpData, setXPData] = useState<XPData>(xpService.getXPData());
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  useEffect(() => {
    // Update XP data when it changes
    const handleXPChange = () => {
      setXPData(xpService.getXPData());
    };

    // Listen for level up events
    const handleLevelUp = (newLevel: number) => {
      setIsLevelingUp(true);
      // Reset level up state after a delay
      setTimeout(() => {
        setIsLevelingUp(false);
      }, 500); // Short delay to prevent multiple level up notifications
    };

    // Subscribe to XP changes and level up events
    xpService.subscribe(handleXPChange);
    xpService.subscribeToLevelUp(handleLevelUp);

    // Initial data load
    setXPData(xpService.getXPData());

    // Cleanup
    return () => {
      xpService.unsubscribe(handleXPChange);
      xpService.unsubscribeFromLevelUp(handleLevelUp);
    };
  }, []);

  const addXP = useCallback((amount: number, reason: string = 'action') => {
    xpService.addXP(amount, reason);
    setXPData(xpService.getXPData());
  }, []);

  return {
    xpData,
    isLevelingUp,
    addXP,
    level: xpData.level,
    totalXP: xpData.totalXP,
    currentLevelXP: xpData.currentLevelXP,
    nextLevelXP: xpData.nextLevelXP,
    progress: xpData.currentLevelXP / xpData.nextLevelXP,
    levelTitle: xpService.getLevelTitle(xpData.level),
    xpHistory: xpData.xpHistory,
    levelHistory: xpData.levelHistory,
  };
};

export default useXP;

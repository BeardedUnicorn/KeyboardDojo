import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { heartsService } from '../services/heartsService';

// Interface for hearts context
interface HeartsContextType {
  currentHearts: number;
  maxHearts: number;
  nextRegenerationTime: number | null;
  timeUntilNextHeart: string;
  useHeart: () => boolean;
  addHearts: (amount: number) => void;
  refillHearts: () => void;
  isLoading: boolean;
}

// Create context with default values
const HeartsContext = createContext<HeartsContextType>({
  currentHearts: 0,
  maxHearts: 5,
  nextRegenerationTime: null,
  timeUntilNextHeart: '00:00',
  useHeart: () => false,
  addHearts: () => {},
  refillHearts: () => {},
  isLoading: true,
});

// Props for the provider component
interface HeartsProviderProps {
  children: ReactNode;
}

/**
 * Provider component for hearts/lives system
 */
export const HeartsProvider: React.FC<HeartsProviderProps> = ({ children }) => {
  const [heartsState, setHeartsState] = useState({
    currentHearts: 0,
    maxHearts: 5,
    nextRegenerationTime: null as number | null,
    lastUpdated: Date.now(),
  });
  const [timeUntilNextHeart, setTimeUntilNextHeart] = useState('00:00');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize hearts service
  useEffect(() => {
    const initHearts = async () => {
      await heartsService.initialize();
      updateHeartsState();
      setIsLoading(false);
    };

    initHearts();

    // Set up timer to update the display
    const timer = setInterval(() => {
      updateHeartsState();
    }, 1000);

    return () => {
      clearInterval(timer);
      heartsService.cleanup();
    };
  }, []);

  // Update hearts state from service
  const updateHeartsState = () => {
    const state = heartsService.getState();
    setHeartsState(state);
    setTimeUntilNextHeart(heartsService.formatTimeUntilNextHeart());
  };

  // Use a heart
  const useHeart = (): boolean => {
    const result = heartsService.useHeart();
    updateHeartsState();
    return result;
  };

  // Add hearts
  const addHearts = (amount: number): void => {
    heartsService.addHearts(amount);
    updateHeartsState();
  };

  // Refill hearts
  const refillHearts = (): void => {
    heartsService.refillHearts();
    updateHeartsState();
  };

  // Context value
  const value: HeartsContextType = {
    currentHearts: heartsState.currentHearts,
    maxHearts: heartsState.maxHearts,
    nextRegenerationTime: heartsState.nextRegenerationTime,
    timeUntilNextHeart,
    useHeart,
    addHearts,
    refillHearts,
    isLoading,
  };

  return (
    <HeartsContext.Provider value={value}>
      {children}
    </HeartsContext.Provider>
  );
};

/**
 * Hook to use hearts context
 */
export const useHearts = (): HeartsContextType => {
  const context = useContext(HeartsContext);
  
  if (context === undefined) {
    throw new Error('useHearts must be used within a HeartsProvider');
  }
  
  return context;
};

export default HeartsContext; 
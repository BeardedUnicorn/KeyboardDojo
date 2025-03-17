import { useState, useEffect, useCallback } from 'react';
import { isDesktop } from '../../utils/environment';

interface KeyboardEventOptions {
  target?: HTMLElement | Document | null;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  captureGlobal?: boolean; // Only used in desktop environment
  historyMaxLength?: number; // Added missing property
}

interface KeyState {
  pressedKeys: Set<string>;
  lastKey: string | null;
  keyHistory: string[];
  historyMaxLength: number;
}

/**
 * Hook for handling keyboard events in both web and desktop environments
 * In desktop environment, it can capture global keyboard events using Tauri API
 * In web environment, it uses standard DOM events
 */
export const useKeyboardEvents = (
  onKeyDown?: (event: KeyboardEvent, pressedKeys: Set<string>) => void,
  onKeyUp?: (event: KeyboardEvent, pressedKeys: Set<string>) => void,
  options: KeyboardEventOptions = {}
) => {
  const {
    target = typeof document !== 'undefined' ? document : null,
    preventDefault = false,
    stopPropagation = false,
    captureGlobal = false,
    historyMaxLength = 10
  } = options;

  const [keyState, setKeyState] = useState<KeyState>({
    pressedKeys: new Set<string>(),
    lastKey: null,
    keyHistory: [],
    historyMaxLength
  });

  // Handle key down event
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    setKeyState(prevState => {
      const newPressedKeys = new Set(prevState.pressedKeys);
      newPressedKeys.add(event.key);

      const newKeyHistory = [...prevState.keyHistory, event.key];
      if (newKeyHistory.length > historyMaxLength) {
        newKeyHistory.shift();
      }

      return {
        pressedKeys: newPressedKeys,
        lastKey: event.key,
        keyHistory: newKeyHistory,
        historyMaxLength
      };
    });

    if (onKeyDown) {
      onKeyDown(event, keyState.pressedKeys);
    }
  }, [keyState.pressedKeys, onKeyDown, preventDefault, stopPropagation, historyMaxLength]);

  // Handle key up event
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();

    setKeyState(prevState => {
      const newPressedKeys = new Set(prevState.pressedKeys);
      newPressedKeys.delete(event.key);

      return {
        ...prevState,
        pressedKeys: newPressedKeys
      };
    });

    if (onKeyUp) {
      onKeyUp(event, keyState.pressedKeys);
    }
  }, [keyState.pressedKeys, onKeyUp, preventDefault, stopPropagation]);

  // Set up event listeners based on environment
  useEffect(() => {
    // Skip if no target is provided
    if (!target) return;

    // Set up listeners based on environment
    if (isDesktop()) {
      if (captureGlobal) {
        try {
          // In a real implementation, we would import and use Tauri API here
          // For now, we'll just use the web implementation
          // This would be replaced with Tauri's global keyboard event API
          target.addEventListener('keydown', handleKeyDown as EventListener);
          target.addEventListener('keyup', handleKeyUp as EventListener);
        } catch (error) {
          console.error('Failed to set up global keyboard listeners:', error);
          // Fallback to web implementation
          target.addEventListener('keydown', handleKeyDown as EventListener);
          target.addEventListener('keyup', handleKeyUp as EventListener);
        }
      } else {
        // Use standard DOM events if not capturing globally
        target.addEventListener('keydown', handleKeyDown as EventListener);
        target.addEventListener('keyup', handleKeyUp as EventListener);
      }
    } else {
      // Web implementation always uses standard DOM events
      target.addEventListener('keydown', handleKeyDown as EventListener);
      target.addEventListener('keyup', handleKeyUp as EventListener);
    }

    // Cleanup function
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
      target.removeEventListener('keyup', handleKeyUp as EventListener);
    };
  }, [target, handleKeyDown, handleKeyUp, captureGlobal]);

  // Return the current keyboard state and utility functions
  return {
    pressedKeys: keyState.pressedKeys,
    lastKey: keyState.lastKey,
    keyHistory: keyState.keyHistory,
    isKeyPressed: (key: string) => keyState.pressedKeys.has(key),
    clearKeys: () => setKeyState(prev => ({ ...prev, pressedKeys: new Set() })),
    clearHistory: () => setKeyState(prev => ({ ...prev, keyHistory: [] }))
  };
}; 
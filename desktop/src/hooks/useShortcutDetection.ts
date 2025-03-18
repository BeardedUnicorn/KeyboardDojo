import { useState, useEffect, useCallback } from 'react';

import { audioService } from '@/services';

import {
  parseShortcut,
  normalizeKeyName,
  isShortcutMatch,
  getShortcutForCurrentOS,
} from '../utils/shortcutUtils';

import type {
  ShortcutDefinition } from '../utils/shortcutUtils';

interface ShortcutDetectionOptions {
  /**
   * Whether to play sounds on success/failure
   * @default true
   */
  playSounds?: boolean;

  /**
   * Whether to automatically clear pressed keys after a match
   * @default true
   */
  autoClearOnMatch?: boolean;

  /**
   * Whether to automatically clear pressed keys after a failure
   * @default false
   */
  autoClearOnFailure?: boolean;

  /**
   * Callback when a shortcut is successfully matched
   */
  onSuccess?: () => void;

  /**
   * Callback when a shortcut is incorrectly entered
   */
  onFailure?: () => void;
}

/**
 * Custom hook for detecting keyboard shortcuts
 *
 * @param shortcutDefinition The shortcut definition for different OSes
 * @param options Configuration options
 * @returns Object with shortcut detection state and methods
 */
export const useShortcutDetection = (
  shortcutDefinition: ShortcutDefinition,
  options: ShortcutDetectionOptions = {},
) => {
  const {
    playSounds = true,
    autoClearOnMatch = true,
    autoClearOnFailure = false,
    onSuccess,
    onFailure,
  } = options;

  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [lastAttempt, setLastAttempt] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Get the shortcut for the current OS
  const shortcutString = getShortcutForCurrentOS(shortcutDefinition);

  // Parse the shortcut into individual keys
  const expectedKeys = parseShortcut(shortcutString);

  // Handle key down
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only prevent default if the key is part of our expected shortcut
    // or if we already have keys pressed (potential shortcut in progress)
    const keyName = normalizeKeyName(e.key);
    if (expectedKeys.includes(keyName) || pressedKeys.length > 0) {
      e.preventDefault();
    }

    // Add key to pressed keys if not already there
    setPressedKeys((prev) => {
      if (prev.includes(keyName)) {
        return prev;
      }
      return [...prev, keyName];
    });
  }, [expectedKeys, pressedKeys]);

  // Handle key up
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    // Normalize the key name
    const keyName = normalizeKeyName(e.key);

    // Remove key from pressed keys
    setPressedKeys((prev) => prev.filter((k) => k !== keyName));
  }, []);

  // Check if the shortcut is correctly pressed
  useEffect(() => {
    if (pressedKeys.length === 0) {
      return;
    }

    // Check if the pressed keys match the expected shortcut
    const isMatch = isShortcutMatch(pressedKeys, expectedKeys);

    // If all keys are pressed and match the expected shortcut
    if (isMatch && pressedKeys.length === expectedKeys.length) {
      // Play success sound
      if (playSounds) {
        audioService.playSound('correct');
      }

      // Set success state
      setIsSuccess(true);

      // Save the last attempt
      setLastAttempt([...pressedKeys]);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Clear pressed keys if auto-clear is enabled
      if (autoClearOnMatch) {
        setPressedKeys([]);
      }
    }
    // If we have enough keys pressed but they don't match
    else if (pressedKeys.length >= expectedKeys.length) {
      // Play error sound
      if (playSounds) {
        audioService.playSound('incorrect');
      }

      // Set failure state
      setIsSuccess(false);

      // Save the last attempt
      setLastAttempt([...pressedKeys]);

      // Call failure callback
      if (onFailure) {
        onFailure();
      }

      // Clear pressed keys if auto-clear is enabled
      if (autoClearOnFailure) {
        setPressedKeys([]);
      }
    }
  }, [
    pressedKeys,
    expectedKeys,
    playSounds,
    autoClearOnMatch,
    autoClearOnFailure,
    onSuccess,
    onFailure,
  ]);

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clear pressed keys
  const clearPressedKeys = useCallback(() => {
    setPressedKeys([]);
  }, []);

  // Reset the success/failure state
  const resetState = useCallback(() => {
    setIsSuccess(null);
    setPressedKeys([]);
    setLastAttempt([]);
  }, []);

  return {
    pressedKeys,
    lastAttempt,
    isSuccess,
    expectedKeys,
    shortcutString,
    clearPressedKeys,
    resetState,
  };
};

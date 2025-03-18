/**
 * useKeyboardShortcut Hook
 *
 * A custom hook for registering and handling keyboard shortcuts.
 */

import { useEffect, useCallback, useRef } from 'react';

import {
  isShortcutMatch,
  normalizeShortcut,
} from '../utils/keyboardUtils';

import type {
  KeyboardShortcut,
  KeyboardShortcutHandler } from '../utils/keyboardUtils';

interface KeyboardShortcutOptions {
  /**
   * Whether the shortcut is active
   */
  isActive?: boolean;

  /**
   * Whether to prevent default browser behavior
   */
  preventDefault?: boolean;

  /**
   * Whether to stop event propagation
   */
  stopPropagation?: boolean;

  /**
   * Target element to attach the listener to (defaults to window)
   */
  target?: HTMLElement | null;

  /**
   * Event type to listen for (keydown, keyup, keypress)
   */
  eventType?: 'keydown' | 'keyup' | 'keypress';
}

/**
 * Hook for registering and handling keyboard shortcuts
 *
 * @param shortcut The keyboard shortcut to listen for
 * @param handler The handler function to call when the shortcut is triggered
 * @param options Additional options
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut | string,
  handler: KeyboardShortcutHandler,
  options: KeyboardShortcutOptions = {},
): void {
  const {
    isActive = true,
    preventDefault = true,
    stopPropagation = false,
    target = null,
    eventType = 'keydown',
  } = options;

  // Normalize the shortcut
  const normalizedShortcut = useRef(
    typeof shortcut === 'string' ? normalizeShortcut(shortcut) : shortcut,
  );

  // StorePage the handler in a ref to avoid recreating the event listener
  const handlerRef = useRef(handler);

  // Update the handler ref when the handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Create the event handler
  const eventHandler = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    if (isShortcutMatch(event, normalizedShortcut.current)) {
      if (preventDefault) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }

      handlerRef.current(event);
    }
  }, [isActive, preventDefault, stopPropagation]);

  // Attach and detach the event listener
  useEffect(() => {
    const targetElement = target || window;

    targetElement.addEventListener(eventType, eventHandler as EventListener);

    return () => {
      targetElement.removeEventListener(eventType, eventHandler as EventListener);
    };
  }, [target, eventType, eventHandler]);
}

export default useKeyboardShortcut;

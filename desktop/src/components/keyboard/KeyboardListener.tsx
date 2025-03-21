import { useEffect } from 'react';

import type { FC } from 'react';

export interface KeyboardListenerProps {
  /**
   * Callback function that is called when a keyboard event is detected
   */
  onKeyboardEvent: (event: KeyboardEvent) => void;
  /**
   * Optional array of specific keys to listen for
   * If not provided, all keys will trigger the callback
   */
  targetKeys?: string[];
  /**
   * Whether the keyboard listener is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional description for screen readers about what keys are being listened for
   * This can be useful to announce to screen reader users what keyboard interactions are available
   */
  ariaDescription?: string;
}

/**
 * Component that listens for keyboard events and passes them to a callback function.
 * Can be configured to only listen for specific keys.
 * 
 * This is a non-visual component that adds keyboard event listeners to the window.
 * For accessibility purposes, it's recommended to:
 * 
 * 1. Provide clear instructions to users about available keyboard shortcuts
 * 2. Use the ariaDescription prop to help screen reader users understand keyboard interactions
 * 3. Consider adding visible indicators for keyboard focus states in your UI
 * 4. Ensure keyboard interactions have equivalent mouse/touch interactions when possible
 */
const KeyboardListener: FC<KeyboardListenerProps> = ({
  onKeyboardEvent,
  targetKeys,
  disabled = false,
  ariaDescription,
}) => {
  useEffect(() => {
    if (disabled) return;

    // Add a marker to the document to track usage of KeyboardListener
    const marker = document.createElement('div');
    marker.style.display = 'none';
    marker.dataset.usingKeyboardListener = 'true';
    document.body.appendChild(marker);

    const handleKeyDown = (event: KeyboardEvent) => {
      // If targetKeys is provided, only trigger for those keys
      if (targetKeys && targetKeys.length > 0) {
        const key = event.key.toLowerCase();
        if (!targetKeys.includes(key)) {
          return;
        }
      }

      // Only prevent default for specific key combinations that the app handles
      // This ensures we don't interfere with browser shortcuts we're not handling
      const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
      const isModifierKey = event.key === 'Control' || 
                            event.key === 'Alt' || 
                            event.key === 'Meta' || 
                            event.key === 'Shift';
                            
      // Prevent default only if this is a key combination we're explicitly handling
      if ((hasModifier || isModifierKey) && targetKeys && targetKeys.length > 0) {
        // Check if the current key is in our target keys
        const key = event.key.toLowerCase();
        if (targetKeys.includes(key)) {
          event.preventDefault();
        }
      }

      onKeyboardEvent(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    // If ariaDescription is provided and we're not in a test environment,
    // announce to screen readers that keyboard shortcuts are available
    let ariaLiveRegion: HTMLElement | null = null;
    if (ariaDescription && typeof document !== 'undefined') {
      // Create or use an existing aria-live region to announce the keyboard shortcuts
      ariaLiveRegion = document.getElementById('keyboard-listener-live-region');
      
      if (!ariaLiveRegion) {
        ariaLiveRegion = document.createElement('div');
        ariaLiveRegion.id = 'keyboard-listener-live-region';
        ariaLiveRegion.setAttribute('aria-live', 'polite');
        ariaLiveRegion.setAttribute('aria-atomic', 'true');
        ariaLiveRegion.style.position = 'absolute';
        ariaLiveRegion.style.width = '1px';
        ariaLiveRegion.style.height = '1px';
        ariaLiveRegion.style.padding = '0';
        ariaLiveRegion.style.margin = '-1px';
        ariaLiveRegion.style.overflow = 'hidden';
        ariaLiveRegion.style.clip = 'rect(0, 0, 0, 0)';
        ariaLiveRegion.style.whiteSpace = 'nowrap';
        ariaLiveRegion.style.border = '0';
        document.body.appendChild(ariaLiveRegion);
      }
      
      // Announce keyboard shortcuts
      ariaLiveRegion.textContent = ariaDescription;
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      // Remove our usage marker
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
      
      // Clean up the aria-live region if we created it
      if (ariaLiveRegion && ariaLiveRegion.parentNode) {
        // Check if no other KeyboardListener components are using this region
        const otherListeners = document.querySelectorAll('[data-using-keyboard-listener="true"]');
        if (otherListeners.length <= 1) {
          ariaLiveRegion.parentNode.removeChild(ariaLiveRegion);
        }
      }
    };
  }, [onKeyboardEvent, targetKeys, disabled, ariaDescription]);

  // This component doesn't render anything visible,
  // but it's handling keyboard events globally
  return null;
};

export default KeyboardListener;

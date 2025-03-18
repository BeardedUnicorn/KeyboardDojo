import { useEffect } from 'react';

import type { FC } from 'react';

interface KeyboardListenerProps {
  onKeyboardEvent: (event: KeyboardEvent) => void;
  targetKeys?: string[];
  disabled?: boolean;
}

/**
 * Component that listens for keyboard events and passes them to a callback function.
 * Can be configured to only listen for specific keys.
 */
const KeyboardListener: FC<KeyboardListenerProps> = ({
  onKeyboardEvent,
  targetKeys,
  disabled = false,
}) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // If targetKeys is provided, only trigger for those keys
      if (targetKeys && targetKeys.length > 0) {
        const key = event.key.toLowerCase();
        if (!targetKeys.includes(key)) {
          return;
        }
      }

      // Prevent default behavior for modifier keys to avoid browser shortcuts
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.key === 'Control' ||
        event.key === 'Alt' ||
        event.key === 'Meta' ||
        event.key === 'Shift'
      ) {
        event.preventDefault();
      }

      onKeyboardEvent(event);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyboardEvent, targetKeys, disabled]);

  // This component doesn't render anything
  return null;
};

export default KeyboardListener;

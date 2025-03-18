import { useCallback } from 'react';

import useSettingsRedux from '@hooks/useSettingsRedux';

type SoundType = 'click' | 'hover' | 'error' | 'success' | 'unlock' | 'complete';

const soundEffects: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/success.mp3',
  unlock: '/sounds/unlock.mp3',
  complete: '/sounds/complete.mp3',
};

export const useSound = () => {
  const { settings } = useSettingsRedux();

  const playSound = useCallback((type: SoundType) => {
    if (!settings.soundEnabled) return;

    const audio = new Audio(soundEffects[type]);
    audio.volume = settings.soundVolume;
    audio.play().catch(() => {
      // Ignore errors - sound might be blocked by browser
    });
  }, [settings.soundEnabled, settings.soundVolume]);

  return { playSound };
};

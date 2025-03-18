import { useEffect, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSettings,
  updateTheme,
  updateFontSize,
  updateAutoSave,
  updateShowLineNumbers,
  updateShowMinimap,
  updateSoundEnabled,
  updateSoundVolume,
  resetSettings,
  selectSettings,
  selectTheme,
  selectFontSize,
  selectAutoSave,
  selectShowLineNumbers,
  selectShowMinimap,
  selectSoundEnabled,
  selectSoundVolume,
  selectIsSettingsLoading,
} from '@slices/settingsSlice';

/**
 * Custom hook for managing settings state and actions
 */
export const useSettingsRedux = () => {
  const dispatch = useAppDispatch();

  // Select settings state
  const settings = useAppSelector(selectSettings);
  const theme = useAppSelector(selectTheme);
  const fontSize = useAppSelector(selectFontSize);
  const autoSave = useAppSelector(selectAutoSave);
  const showLineNumbers = useAppSelector(selectShowLineNumbers);
  const showMinimap = useAppSelector(selectShowMinimap);
  const soundEnabled = useAppSelector(selectSoundEnabled);
  const soundVolume = useAppSelector(selectSoundVolume);
  const isLoading = useAppSelector(selectIsSettingsLoading);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Settings actions
  const loadSettings = useCallback(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const changeTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    dispatch(updateTheme(newTheme));
  }, [dispatch]);

  const changeFontSize = useCallback((newFontSize: number) => {
    dispatch(updateFontSize(newFontSize));
  }, [dispatch]);

  const toggleAutoSave = useCallback((newAutoSave: boolean) => {
    dispatch(updateAutoSave(newAutoSave));
  }, [dispatch]);

  const toggleShowLineNumbers = useCallback((newShowLineNumbers: boolean) => {
    dispatch(updateShowLineNumbers(newShowLineNumbers));
  }, [dispatch]);

  const toggleShowMinimap = useCallback((newShowMinimap: boolean) => {
    dispatch(updateShowMinimap(newShowMinimap));
  }, [dispatch]);

  const toggleSoundEnabled = useCallback((newSoundEnabled: boolean) => {
    dispatch(updateSoundEnabled(newSoundEnabled));
  }, [dispatch]);

  const changeSoundVolume = useCallback((newSoundVolume: number) => {
    dispatch(updateSoundVolume(newSoundVolume));
  }, [dispatch]);

  const restoreDefaultSettings = useCallback(() => {
    dispatch(resetSettings());
    dispatch(fetchSettings());
  }, [dispatch]);

  // Return state and actions
  return {
    // State
    settings,
    theme,
    fontSize,
    autoSave,
    showLineNumbers,
    showMinimap,
    soundEnabled,
    soundVolume,
    isLoading,

    // Actions
    loadSettings,
    changeTheme,
    changeFontSize,
    toggleAutoSave,
    toggleShowLineNumbers,
    toggleShowMinimap,
    toggleSoundEnabled,
    changeSoundVolume,
    restoreDefaultSettings,
  };
};

export default useSettingsRedux;

/**
 * Audio Service
 * 
 * This service manages sound effects for the application.
 * It handles loading, playing, and controlling audio files.
 */

import { loggerService } from './loggerService';

// Define sound types
type SoundType = 'success' | 'error' | 'hint' | 'levelUp' | 'checkpoint' | 'achievement' | string;

// Map of sound types to their file paths
const soundMap: Record<SoundType, string> = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  hint: '/sounds/hint.mp3',
  levelUp: '/sounds/level-up.mp3',
  checkpoint: '/sounds/checkpoint.mp3',
  achievement: '/sounds/achievement.mp3',
};

class AudioService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.7; // Default volume (0.0 to 1.0)

  constructor() {
    // Try to load user preferences from localStorage
    this.loadPreferences();
    
    // Preload common sounds
    this.preloadSounds(['success', 'error']);
  }

  /**
   * Load user preferences from localStorage
   */
  private loadPreferences(): void {
    try {
      const savedMuted = localStorage.getItem('audio-muted');
      const savedVolume = localStorage.getItem('audio-volume');
      
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }
      
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      loggerService.error('Error loading audio preferences:', { error });
    }
  }
  
  /**
   * Save user preferences to localStorage
   */
  private savePreferences(): void {
    try {
      localStorage.setItem('audio-muted', String(this.isMuted));
      localStorage.setItem('audio-volume', String(this.volume));
    } catch (error) {
      loggerService.error('Error saving audio preferences:', { error });
    }
  }

  /**
   * Preload sounds into cache for faster playback
   */
  preloadSounds(soundTypes: SoundType[]): void {
    soundTypes.forEach((type) => {
      this.getAudio(type);
    });
  }

  /**
   * Get or create an audio element for the specified sound
   */
  private getAudio(soundType: SoundType): HTMLAudioElement {
    // Check if we already have this sound cached
    if (this.audioCache.has(soundType)) {
      const cachedAudio = this.audioCache.get(soundType);
      // This should never be undefined as we just checked with has(), but let's handle it safely
      if (cachedAudio) {
        return cachedAudio;
      }
    }

    // Get the sound file path
    const soundPath = soundMap[soundType] || soundType;
    
    // Create a new audio element
    const audio = new Audio(soundPath);
    audio.volume = this.volume;
    
    // Cache the audio element
    this.audioCache.set(soundType, audio);
    
    return audio;
  }

  /**
   * Play a sound effect
   * @param soundType The type of sound to play
   * @param volume Optional volume override (0.0 to 1.0)
   * @returns Promise that resolves when the sound starts playing
   */
  playSound(soundType: SoundType, volume?: number): Promise<void> {
    // Don't play sounds if muted
    if (this.isMuted) {
      return Promise.resolve();
    }
    
    try {
      const audio = this.getAudio(soundType);
      
      // Set volume (use override if provided, otherwise use service volume)
      audio.volume = volume !== undefined ? volume : this.volume;
      
      // Reset audio to beginning (in case it's already playing)
      audio.currentTime = 0;
      
      // Play the sound
      return audio.play();
    } catch (error) {
      loggerService.error('Error playing sound:', { soundType, error });
      return Promise.resolve();
    }
  }

  /**
   * Set the global volume for all sounds
   * @param volume Volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.savePreferences();
  }

  /**
   * Get the current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Mute or unmute all sounds
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.savePreferences();
  }

  /**
   * Check if audio is currently muted
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Toggle mute state
   * @returns The new mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.savePreferences();
    return this.isMuted;
  }
}

// Create and export a singleton instance
export const audioService = new AudioService(); 

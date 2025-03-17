/**
 * Curriculum Service
 * 
 * This service manages the curriculum data, including application tracks,
 * lessons, and user progress.
 */

import { 
  Curriculum, 
  ApplicationTrack, 
  Module, 
  Lesson, 
  Shortcut,
  ApplicationType,
  UserProgress,
  MasteryChallenge
} from '../types/curriculum';

// Import sample data
import { vscodeTrack } from '../data/vscode-track';
import { intellijTrack } from '../data/intellij-track';
import { cursorTrack } from '../data/cursor-track';

class CurriculumService {
  private curriculum: Curriculum;
  private userProgress: UserProgress | null = null;
  
  constructor() {
    // Initialize with sample data
    this.curriculum = {
      tracks: [vscodeTrack, intellijTrack, cursorTrack],
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
  }
  
  /**
   * Get all application tracks
   * @returns Array of application tracks
   */
  getApplicationTracks(): ApplicationTrack[] {
    return this.curriculum.tracks;
  }
  
  /**
   * Get an application track by ID
   * @param trackId The ID of the track to get
   * @returns The application track, or undefined if not found
   */
  getApplicationTrack(trackId: ApplicationType): ApplicationTrack | undefined {
    return this.curriculum.tracks.find(track => track.id === trackId);
  }
  
  /**
   * Get all modules for an application track
   * @param trackId The ID of the track to get modules for
   * @returns Array of modules, or empty array if track not found
   */
  getModules(trackId: ApplicationType): Module[] {
    const track = this.getApplicationTrack(trackId);
    return track ? track.modules : [];
  }
  
  /**
   * Get a module by ID
   * @param trackId The ID of the track containing the module
   * @param moduleId The ID of the module to get
   * @returns The module, or undefined if not found
   */
  getModule(trackId: ApplicationType, moduleId: string): Module | undefined {
    const track = this.getApplicationTrack(trackId);
    return track?.modules.find(module => module.id === moduleId);
  }
  
  /**
   * Get all lessons for a module
   * @param trackId The ID of the track containing the module
   * @param moduleId The ID of the module to get lessons for
   * @returns Array of lessons, or empty array if module not found
   */
  getLessons(trackId: ApplicationType, moduleId: string): Lesson[] {
    const module = this.getModule(trackId, moduleId);
    return module ? module.lessons : [];
  }
  
  /**
   * Get a lesson by ID
   * @param trackId The ID of the track containing the lesson
   * @param moduleId The ID of the module containing the lesson
   * @param lessonId The ID of the lesson to get
   * @returns The lesson, or undefined if not found
   */
  getLesson(trackId: ApplicationType, moduleId: string, lessonId: string): Lesson | undefined {
    const module = this.getModule(trackId, moduleId);
    return module?.lessons.find(lesson => lesson.id === lessonId);
  }
  
  /**
   * Get all shortcuts for a lesson
   * @param trackId The ID of the track containing the lesson
   * @param moduleId The ID of the module containing the lesson
   * @param lessonId The ID of the lesson to get shortcuts for
   * @returns Array of shortcuts, or empty array if lesson not found
   */
  getShortcuts(trackId: ApplicationType, moduleId: string, lessonId: string): Shortcut[] {
    const lesson = this.getLesson(trackId, moduleId, lessonId);
    return lesson ? lesson.shortcuts : [];
  }
  
  /**
   * Get user progress
   * @returns User progress, or null if not available
   */
  getUserProgress(): UserProgress | null {
    return this.userProgress;
  }
  
  /**
   * Set user progress
   * @param progress User progress to set
   */
  setUserProgress(progress: UserProgress): void {
    this.userProgress = progress;
    
    // In a real app, this would be persisted to local storage or a database
    console.log('User progress updated:', progress);
  }
  
  /**
   * Check if a lesson is unlocked for the user
   * @param trackId The ID of the track containing the lesson
   * @param moduleId The ID of the module containing the lesson
   * @param lessonId The ID of the lesson to check
   * @returns Whether the lesson is unlocked
   */
  isLessonUnlocked(trackId: ApplicationType, moduleId: string, lessonId: string): boolean {
    // If no user progress, only the first lesson of the first module is unlocked
    if (!this.userProgress) {
      const module = this.getModule(trackId, moduleId);
      if (!module || module.order !== 0) return false;
      
      const lesson = this.getLesson(trackId, moduleId, lessonId);
      return lesson?.order === 0;
    }
    
    // Get the lesson
    const lesson = this.getLesson(trackId, moduleId, lessonId);
    if (!lesson) return false;
    
    // If no unlock requirements, the lesson is unlocked
    if (!lesson.unlockRequirements) return true;
    
    // Check XP requirement
    if (lesson.unlockRequirements.xpRequired && 
        this.userProgress.xp < lesson.unlockRequirements.xpRequired) {
      return false;
    }
    
    // Check level requirement
    if (lesson.unlockRequirements.level && 
        this.userProgress.level < lesson.unlockRequirements.level) {
      return false;
    }
    
    // Check previous lessons requirement
    if (lesson.unlockRequirements.previousLessons) {
      const completedLessonIds = this.userProgress.completedLessons.map(cl => cl.lessonId);
      for (const prevLessonId of lesson.unlockRequirements.previousLessons) {
        if (!completedLessonIds.includes(prevLessonId)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Check if a module is unlocked for the user
   * @param trackId The ID of the track containing the module
   * @param moduleId The ID of the module to check
   * @returns Whether the module is unlocked
   */
  isModuleUnlocked(trackId: ApplicationType, moduleId: string): boolean {
    // If no user progress, only the first module is unlocked
    if (!this.userProgress) {
      const module = this.getModule(trackId, moduleId);
      return module?.order === 0;
    }
    
    // Get the module
    const module = this.getModule(trackId, moduleId);
    if (!module) return false;
    
    // If no unlock requirements, the module is unlocked
    if (!module.unlockRequirements) return true;
    
    // Check XP requirement
    if (module.unlockRequirements.xpRequired && 
        this.userProgress.xp < module.unlockRequirements.xpRequired) {
      return false;
    }
    
    // Check level requirement
    if (module.unlockRequirements.level && 
        this.userProgress.level < module.unlockRequirements.level) {
      return false;
    }
    
    // Check previous modules requirement
    if (module.unlockRequirements.previousModules) {
      const completedModuleIds = this.userProgress.completedModules.map(cm => cm.moduleId);
      for (const prevModuleId of module.unlockRequirements.previousModules) {
        if (!completedModuleIds.includes(prevModuleId)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Get all mastery challenges for a track
   * @param trackId The ID of the track to get challenges for
   * @returns Array of mastery challenges
   */
  getMasteryChallenges(trackId: ApplicationType): MasteryChallenge[] {
    // In a real app, this would come from the curriculum data
    // For now, return an empty array
    return [];
  }
  
  /**
   * Check if a mastery challenge is unlocked for the user
   * @param trackId The ID of the track containing the challenge
   * @param challengeId The ID of the challenge to check
   * @returns Whether the challenge is unlocked
   */
  isMasteryChallengeUnlocked(trackId: ApplicationType, challengeId: string): boolean {
    // In a real app, this would check the user's progress against the challenge requirements
    // For now, return false
    return false;
  }
  
  /**
   * Complete a lesson for the user
   * @param trackId The ID of the track containing the lesson
   * @param moduleId The ID of the module containing the lesson
   * @param lessonId The ID of the lesson to complete
   * @param score The score achieved (0-100)
   * @param timeSpent The time spent in seconds
   * @returns Updated user progress
   */
  completeLesson(
    trackId: ApplicationType, 
    moduleId: string, 
    lessonId: string, 
    score: number, 
    timeSpent: number
  ): UserProgress {
    // If no user progress, create a new one
    if (!this.userProgress) {
      this.userProgress = {
        userId: 'user1', // In a real app, this would be the actual user ID
        completedLessons: [],
        completedModules: [],
        currentLessons: [],
        xp: 0,
        level: 1,
        streakDays: 1,
        lastActivity: new Date().toISOString(),
      };
    }
    
    // Get the lesson
    const lesson = this.getLesson(trackId, moduleId, lessonId);
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }
    
    // Check if the lesson is already completed
    const existingCompletionIndex = this.userProgress.completedLessons.findIndex(
      cl => cl.lessonId === lessonId
    );
    
    // Calculate XP earned (based on score and lesson XP reward)
    const xpEarned = Math.round((score / 100) * lesson.xpReward);
    
    if (existingCompletionIndex >= 0) {
      // Update existing completion
      this.userProgress.completedLessons[existingCompletionIndex] = {
        lessonId,
        completedAt: new Date().toISOString(),
        score,
        timeSpent,
      };
    } else {
      // Add new completion
      this.userProgress.completedLessons.push({
        lessonId,
        completedAt: new Date().toISOString(),
        score,
        timeSpent,
      });
      
      // Add XP
      this.userProgress.xp += xpEarned;
      
      // Update level (simple calculation: 1 level per 100 XP)
      this.userProgress.level = Math.floor(this.userProgress.xp / 100) + 1;
    }
    
    // Update current lessons
    const currentLessonIndex = this.userProgress.currentLessons.findIndex(
      cl => cl.trackId === trackId && cl.lessonId === lessonId
    );
    
    if (currentLessonIndex >= 0) {
      // Update existing current lesson
      this.userProgress.currentLessons[currentLessonIndex].progress = 100;
    } else {
      // Add new current lesson
      this.userProgress.currentLessons.push({
        trackId,
        lessonId,
        progress: 100,
      });
    }
    
    // Check if all lessons in the module are completed
    const module = this.getModule(trackId, moduleId);
    if (module) {
      const moduleLessonIds = module.lessons.map(l => l.id);
      const completedLessonIds = this.userProgress.completedLessons.map(cl => cl.lessonId);
      
      const allLessonsCompleted = moduleLessonIds.every(id => completedLessonIds.includes(id));
      
      if (allLessonsCompleted) {
        // Check if the module is already completed
        const moduleCompleted = this.userProgress.completedModules.some(cm => cm.moduleId === moduleId);
        
        if (!moduleCompleted) {
          // Add completed module
          this.userProgress.completedModules.push({
            moduleId,
            completedAt: new Date().toISOString(),
          });
          
          // In a real app, this would trigger a module completion event
          console.log(`Module completed: ${moduleId}`);
        }
      }
    }
    
    // Update last activity
    this.userProgress.lastActivity = new Date().toISOString();
    
    // In a real app, this would be persisted to local storage or a database
    console.log('Lesson completed:', {
      lessonId,
      score,
      timeSpent,
      xpEarned,
    });
    
    return this.userProgress;
  }
  
  /**
   * Update user streak
   * @returns Updated user progress
   */
  updateStreak(): UserProgress | null {
    if (!this.userProgress) {
      return this.userProgress;
    }
    
    const lastActivityDate = new Date(this.userProgress.lastActivity);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the last activity was yesterday
    if (lastActivityDate.toDateString() === yesterday.toDateString()) {
      // Increment streak
      this.userProgress.streakDays += 1;
    } 
    // Check if the last activity was before yesterday
    else if (lastActivityDate < yesterday) {
      // Reset streak
      this.userProgress.streakDays = 1;
    }
    
    // Update last activity
    this.userProgress.lastActivity = today.toISOString();
    
    // In a real app, this would be persisted to local storage or a database
    console.log('Streak updated:', this.userProgress.streakDays);
    
    return this.userProgress;
  }
}

// Export a singleton instance
export const curriculumService = new CurriculumService(); 
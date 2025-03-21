/**
 * Curriculum Service
 *
 * This service manages the curriculum data, including application tracks,
 * lessons, and user progress.
 */

// Import the curriculum registry and loader

import {
  curriculumRegistry,
  initializeCurriculum,
  findLessonById,
  findPathNodeById,
  getAllShortcuts,
  validateCurriculum,
  getNextLesson,
  getNextPathNode,
} from '@data/curriculum';

import { BaseService } from './BaseService';
import { loggerService } from './loggerService';
import { serviceFactory } from './ServiceFactory';

import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type {
  ApplicationType,
  IApplicationTrack,
  ICurriculum,
  ICurriculumMetadata,
  IModule, IPath, PathNode,
} from '@/types/progress/ICurriculum';
import type { IUserProgress } from '@/types/progress/IUserProgress';

class CurriculumService extends BaseService {
  private userProgress: IUserProgress | null = null;

  constructor() {
    super();
  }

  /**
   * Initialize the curriculum service
   */
  async initialize(): Promise<void> {
    await super.initialize();
    
    try {
      // Initialize the curriculum registry
      initializeCurriculum();
      
      loggerService.info('Curriculum service initialized', { 
        component: 'CurriculumService',
      });
      
      this._status.initialized = true;
    } catch (error) {
      loggerService.error('Failed to initialize curriculum service', error, { 
        component: 'CurriculumService',
      });
      
      this._status.error = error instanceof Error ? error : new Error(String(error));
      this._status.initialized = false;
      // Don't throw to allow application to continue with limited functionality
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    try {
      // Perform any cleanup needed
      loggerService.info('Curriculum service cleaned up', { 
        component: 'CurriculumService',
      });
      super.cleanup();
    } catch (error) {
      loggerService.error('Error cleaning up curriculum service', error, { 
        component: 'CurriculumService',
      });
      // Don't throw
    }
  }

  /**
   * Get all available curriculums
   */
  getAllCurriculums(): ICurriculum[] {
    return curriculumRegistry.getAllCurriculums();
  }

  /**
   * Get curriculum metadata for all curriculums
   */
  getCurriculumMetadata(): ICurriculumMetadata[] {
    return this.getAllCurriculums().map((curriculum) => curriculum.metadata);
  }

  /**
   * Get a specific curriculum by ID
   */
  getCurriculumById(curriculumId: string): ICurriculum | undefined {
    return curriculumRegistry.getCurriculumById(curriculumId);
  }

  /**
   * Get the active curriculum
   */
  getActiveCurriculum(): ICurriculum {
    const activeCurriculum = curriculumRegistry.getActiveCurriculum();

    if (!activeCurriculum) {
      throw new Error('No active curriculum found');
    }

    return activeCurriculum;
  }

  /**
   * Set the active curriculum
   */
  setActiveCurriculum(curriculumId: string): boolean {
    return curriculumRegistry.setActiveCurriculum(curriculumId);
  }

  /**
   * Register a new curriculum
   */
  registerCurriculum(curriculum: ICurriculum): boolean {
    // Validate the curriculum before registering
    const validationErrors = validateCurriculum(curriculum);
    if (validationErrors.length > 0) {
      console.error('Curriculum validation failed:', validationErrors);
      return false;
    }

    return curriculumRegistry.registerCurriculum(curriculum);
  }

  /**
   * Update an existing curriculum
   */
  updateCurriculum(curriculum: ICurriculum): boolean {
    // Validate the curriculum before updating
    const validationErrors = validateCurriculum(curriculum);
    if (validationErrors.length > 0) {
      console.error('Curriculum validation failed:', validationErrors);
      return false;
    }

    // Remove the old curriculum and add the new one
    curriculumRegistry.clear();
    return curriculumRegistry.registerCurriculum(curriculum);
  }

  /**
   * Get all application tracks
   */
  getApplicationTracks(): IApplicationTrack[] {
    return curriculumRegistry.getAllTracks();
  }

  /**
   * Get a specific application track
   */
  getApplicationTrack(trackId: ApplicationType): IApplicationTrack | undefined {
    return curriculumRegistry.getTrackById(trackId);
  }

  /**
   * Get all modules for a track
   */
  getModules(trackId: ApplicationType): IModule[] {
    const track = this.getApplicationTrack(trackId);
    return track ? track.modules : [];
  }

  /**
   * Get a specific module
   */
  getModule(trackId: ApplicationType, moduleId: string): IModule | undefined {
    const modules = this.getModules(trackId);
    return modules.find((module) => module.id === moduleId);
  }

  /**
   * Get all lessons for a module
   */
  getLessons(trackId: ApplicationType, moduleId: string): ILesson[] {
    const module = this.getModule(trackId, moduleId);
    return module ? module.lessons : [];
  }

  /**
   * Get a specific lesson
   */
  getLesson(trackId: ApplicationType, moduleId: string, lessonId: string): ILesson | undefined {
    const lessons = this.getLessons(trackId, moduleId);
    return lessons.find((lesson) => lesson.id === lessonId);
  }

  /**
   * Find a lesson by ID across all tracks
   */
  findLessonById(lessonId: string): ILesson | undefined {
    return findLessonById(lessonId);
  }

  /**
   * Get all paths
   */
  getAllPaths(): IPath[] {
    return curriculumRegistry.getAllPaths();
  }

  /**
   * Get paths for a specific track
   */
  getPathsByTrackId(trackId: ApplicationType): IPath[] {
    return curriculumRegistry.getPathsByTrackId(trackId);
  }

  /**
   * Get a specific path
   */
  getPathById(pathId: string): IPath | undefined {
    return curriculumRegistry.getPathById(pathId);
  }

  /**
   * Find a path node by ID
   */
  findPathNodeById(nodeId: string): PathNode | undefined {
    return findPathNodeById(nodeId);
  }

  /**
   * Get user progress
   */
  getUserProgress(): IUserProgress | null {
    return this.userProgress;
  }

  /**
   * Set user progress
   */
  setUserProgress(progress: IUserProgress): void {
    this.userProgress = progress;
  }

  /**
   * Check if a module is unlocked
   */
  isModuleUnlocked(): boolean {
    // For now, just return true
    // In a real implementation, this would check user progress and prerequisites
    return true;
  }

  /**
   * Check if a lesson is unlocked
   */
  isLessonUnlocked(): boolean {
    // For now, just return true
    // In a real implementation, this would check user progress and prerequisites
    return true;
  }

  /**
   * Get all shortcuts
   */
  getAllShortcuts(): IShortcut[] {
    return getAllShortcuts();
  }

  /**
   * Get shortcuts by category
   */
  getShortcutsByCategory(category: string): IShortcut[] {
    return this.getAllShortcuts().filter((shortcut) => shortcut.category === category);
  }

  /**
   * Get the next lesson in a module
   */
  getNextLesson(moduleId: string, currentLessonId: string): ILesson | undefined {
    return getNextLesson(moduleId, currentLessonId);
  }

  /**
   * Get the next node in a path
   */
  getNextPathNode(pathId: string, currentNodeId: string): PathNode | undefined {
    return getNextPathNode(pathId, currentNodeId);
  }
}

// Create and export a singleton instance
const curriculumServiceInstance = new CurriculumService();
export const curriculumService = serviceFactory.register('curriculumService', curriculumServiceInstance);

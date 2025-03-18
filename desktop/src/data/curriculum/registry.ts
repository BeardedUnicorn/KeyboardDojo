/**
 * Curriculum Registry
 *
 * This file contains the registry for curriculum data, including tracks and paths.
 */

import { loggerService } from '@/services';

import type { ApplicationType, IApplicationTrack, ICurriculum, IPath } from '@/types/progress/ICurriculum';

/**
 * CurriculumRegistry class
 *
 * Manages the registration and retrieval of curriculum data.
 */
export class CurriculumRegistry {
  private curriculums: Map<string, ICurriculum> = new Map();
  private tracks: Map<ApplicationType, IApplicationTrack> = new Map();
  private paths: Map<string, IPath> = new Map();
  private activeCurriculumId: string | null = null;

  /**
   * Register a curriculum
   *
   * @param curriculum The curriculum to register
   * @returns True if registration was successful
   */
  registerCurriculum(curriculum: ICurriculum): boolean {
    if (this.curriculums.has(curriculum.id)) {
      loggerService.warn(`Curriculum with ID ${curriculum.id} already exists. Skipping registration.`, {
        component: 'CurriculumRegistry',
        curriculumId: curriculum.id,
      });
      return false;
    }

    this.curriculums.set(curriculum.id, curriculum);

    // If this is the first curriculum, set it as active
    if (this.curriculums.size === 1 || curriculum.metadata.isDefault) {
      this.activeCurriculumId = curriculum.id;
    }

    // Register all tracks and paths from this curriculum
    curriculum.tracks.forEach((track) => this.registerTrack(track));
    curriculum.paths.forEach((path) => this.registerPath(path));

    return true;
  }

  /**
   * Register a track
   *
   * @param track The track to register
   * @returns True if registration was successful
   */
  registerTrack(track: IApplicationTrack): boolean {
    if (this.tracks.has(track.id)) {
      loggerService.warn(`Track with ID ${track.id} already exists. Skipping registration.`, {
        component: 'CurriculumRegistry',
        trackId: track.id,
      });
      return false;
    }

    this.tracks.set(track.id, track);

    // Register the path if it exists
    if (track.path) {
      this.registerPath(track.path);
    }

    return true;
  }

  /**
   * Register a path
   *
   * @param path The path to register
   * @returns True if registration was successful
   */
  registerPath(path: IPath): boolean {
    if (this.paths.has(path.id)) {
      loggerService.warn(`Path with ID ${path.id} already exists. Skipping registration.`, {
        component: 'CurriculumRegistry',
        pathId: path.id,
      });
      return false;
    }

    this.paths.set(path.id, path);
    return true;
  }

  /**
   * Get all curriculums
   *
   * @returns Array of all registered curriculums
   */
  getAllCurriculums(): ICurriculum[] {
    return Array.from(this.curriculums.values());
  }

  /**
   * Get curriculum by ID
   *
   * @param id The curriculum ID
   * @returns The curriculum or undefined if not found
   */
  getCurriculumById(id: string): ICurriculum | undefined {
    return this.curriculums.get(id);
  }

  /**
   * Get the active curriculum
   *
   * @returns The active curriculum or the first one if none is active
   */
  getActiveCurriculum(): ICurriculum | undefined {
    if (this.activeCurriculumId && this.curriculums.has(this.activeCurriculumId)) {
      return this.curriculums.get(this.activeCurriculumId);
    }

    // Fallback to the first curriculum
    const firstCurriculum = this.curriculums.values().next().value;
    return firstCurriculum;
  }

  /**
   * Set the active curriculum
   *
   * @param id The curriculum ID to set as active
   * @returns True if successful
   */
  setActiveCurriculum(id: string): boolean {
    if (!this.curriculums.has(id)) {
      loggerService.warn(`Curriculum with ID ${id} not found. Cannot set as active.`, {
        component: 'CurriculumRegistry',
        curriculumId: id,
      });
      return false;
    }

    this.activeCurriculumId = id;
    return true;
  }

  /**
   * Get all tracks
   *
   * @returns Array of all registered tracks
   */
  getAllTracks(): IApplicationTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Get track by ID
   *
   * @param id The track ID
   * @returns The track or undefined if not found
   */
  getTrackById(id: ApplicationType): IApplicationTrack | undefined {
    return this.tracks.get(id);
  }

  /**
   * Get tracks by curriculum ID
   *
   * @param curriculumId The curriculum ID
   * @returns Array of tracks for the specified curriculum
   */
  getTracksByCurriculumId(curriculumId: string): IApplicationTrack[] {
    const curriculum = this.curriculums.get(curriculumId);
    if (!curriculum) {
      return [];
    }

    return curriculum.tracks;
  }

  /**
   * Get all paths
   *
   * @returns Array of all registered paths
   */
  getAllPaths(): IPath[] {
    return Array.from(this.paths.values());
  }

  /**
   * Get path by ID
   *
   * @param id The path ID
   * @returns The path or undefined if not found
   */
  getPathById(id: string): IPath | undefined {
    return this.paths.get(id);
  }

  /**
   * Get paths by track ID
   *
   * @param trackId The track ID
   * @returns Array of paths for the specified track
   */
  getPathsByTrackId(trackId: ApplicationType): IPath[] {
    return this.getAllPaths().filter((path) => path.trackId === trackId);
  }

  /**
   * Clear all registered data
   */
  clear(): void {
    this.curriculums.clear();
    this.tracks.clear();
    this.paths.clear();
    this.activeCurriculumId = null;
  }
}

// Create and export a singleton instance
export const curriculumRegistry = new CurriculumRegistry();

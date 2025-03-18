/**
 * Curriculum Loader
 *
 * This file contains functions for loading curriculum data from various sources.
 */

import { loggerService } from '@/services';
// Import existing curriculum data
import { CurriculumType } from '@/types/curriculum/CurriculumType';
import { vscodePath , intellijPath , cursorPath } from '@data/paths';

import { cursorTrack } from '../cursor-track';
import { intellijTrack } from '../intellij-track';
import { vscodeTrack } from '../vscode-track';

import { curriculumRegistry } from './registry';

import type { IApplicationTrack, ICurriculum, IPath } from '@/types/progress/ICurriculum';

/**
 * Load default curriculum data
 *
 * This function loads the default curriculum data into the registry.
 * It's a temporary solution until we have a more dynamic way to load data.
 */
export function loadDefaultCurriculum(): void {
  // Create the default IDE shortcuts curriculum
  const ideShortcutsCurriculum: ICurriculum = {
    id: 'ide-shortcuts-2023',
    metadata: {
      id: 'ide-shortcuts-2023',
      name: 'IDE Shortcuts Mastery',
      description: 'Master keyboard shortcuts for popular code editors',
      type: CurriculumType.IDE_SHORTCUTS,
      icon: 'keyboard',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      author: 'Keyboard Dojo Team',
      tags: ['shortcuts', 'productivity', 'ide'],
      isActive: true,
      isDefault: true,
    },
    tracks: [vscodeTrack, intellijTrack, cursorTrack],
    paths: [vscodePath, intellijPath, cursorPath],
    lessons: [],
  };

  // Register the curriculum
  curriculumRegistry.registerCurriculum(ideShortcutsCurriculum);
}

/**
 * Load curriculum from JSON
 *
 * @param jsonData JSON string containing curriculum data
 * @returns True if loading was successful
 */
export function loadCurriculumFromJson(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as ICurriculum;
    return curriculumRegistry.registerCurriculum(data);
  } catch (error) {
    loggerService.error('Failed to load curriculum from JSON:', error, {
      component: 'CurriculumLoader',
    });
    return false;
  }
}

/**
 * Load track from JSON
 *
 * @param jsonData JSON string containing track data
 * @returns True if loading was successful
 */
export function loadTrackFromJson(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as IApplicationTrack;
    return curriculumRegistry.registerTrack(data);
  } catch (error) {
    loggerService.error('Failed to load track from JSON:', error, {
      component: 'CurriculumLoader',
    });
    return false;
  }
}

/**
 * Load path from JSON
 *
 * @param jsonData JSON string containing path data
 * @returns True if loading was successful
 */
export function loadPathFromJson(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as IPath;
    return curriculumRegistry.registerPath(data);
  } catch (error) {
    loggerService.error('Failed to load path from JSON:', error, {
      component: 'CurriculumLoader',
    });
    return false;
  }
}

/**
 * Initialize the curriculum registry
 *
 * This function should be called at application startup to load all curriculum data.
 */
export function initializeCurriculum(): void {
  // Clear any existing data
  curriculumRegistry.clear();

  // Load default curriculum
  loadDefaultCurriculum();

  // TODO: Load additional curriculum data from storage or API
}

// Export the registry for direct access
export { curriculumRegistry };

/**
 * Curriculum Utilities
 *
 * This file contains utility functions for working with curriculum data.
 */

import { curriculumRegistry } from './registry';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { ILesson } from '@/types/curriculum/lesson/ILesson';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { ICurriculum, IModule, PathNode, PathNodeType } from '@/types/progress/ICurriculum';

/**
 * Find a lesson by ID across all tracks
 *
 * @param lessonId The lesson ID to find
 * @returns The lesson or undefined if not found
 */
export function findLessonById(lessonId: string): ILesson | undefined {
  for (const track of curriculumRegistry.getAllTracks()) {
    for (const module of track.modules) {
      const lesson = module.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson) {
        return lesson;
      }
    }
  }
  return undefined;
}

/**
 * Find a module by ID across all tracks
 *
 * @param moduleId The module ID to find
 * @returns The module or undefined if not found
 */
export function findModuleById(moduleId: string): IModule | undefined {
  for (const track of curriculumRegistry.getAllTracks()) {
    const module = track.modules.find((module) => module.id === moduleId);
    if (module) {
      return module;
    }
  }
  return undefined;
}

/**
 * Find a path node by ID across all paths
 *
 * @param nodeId The node ID to find
 * @returns The path node or undefined if not found
 */
export function findPathNodeById(nodeId: string): PathNode | undefined {
  for (const path of curriculumRegistry.getAllPaths()) {
    const node = path.nodes.find((node) => node.id === nodeId);
    if (node) {
      return node;
    }
  }
  return undefined;
}

/**
 * Get all shortcuts across all tracks
 *
 * @returns Array of all shortcuts
 */
export function getAllShortcuts(): IShortcut[] {
  const shortcuts: IShortcut[] = [];
  const shortcutIds = new Set<string>();

  for (const track of curriculumRegistry.getAllTracks()) {
    for (const module of track.modules) {
      for (const lesson of module.lessons) {
        if (lesson.shortcuts) {
          for (const shortcut of lesson.shortcuts) {
            if (!shortcutIds.has(shortcut.id)) {
              shortcuts.push(shortcut);
              shortcutIds.add(shortcut.id);
            }
          }
        }
      }
    }
  }

  return shortcuts;
}

/**
 * Filter shortcuts by category
 *
 * @param category The category to filter by
 * @returns Array of shortcuts in the specified category
 */
export function getShortcutsByCategory(category: ShortcutCategory): IShortcut[] {
  return getAllShortcuts().filter((shortcut) => shortcut.category === category);
}

/**
 * Get lessons by difficulty
 *
 * @param difficulty The difficulty level to filter by
 * @returns Array of lessons with the specified difficulty
 */
export function getLessonsByDifficulty(difficulty: DifficultyLevel): ILesson[] {
  const lessons: ILesson[] = [];

  for (const track of curriculumRegistry.getAllTracks()) {
    for (const module of track.modules) {
      for (const lesson of module.lessons) {
        if (lesson.difficulty === difficulty) {
          lessons.push(lesson);
        }
      }
    }
  }

  return lessons;
}

/**
 * Get modules by category
 *
 * @param category The category to filter by
 * @returns Array of modules in the specified category
 */
export function getModulesByCategory(category: ShortcutCategory): IModule[] {
  const modules: IModule[] = [];

  for (const track of curriculumRegistry.getAllTracks()) {
    for (const module of track.modules) {
      if (module.category === category) {
        modules.push(module);
      }
    }
  }

  return modules;
}

/**
 * Get path nodes by type
 *
 * @param type The node type to filter by
 * @returns Array of path nodes of the specified type
 */
export function getPathNodesByType(type: PathNodeType): PathNode[] {
  const nodes: PathNode[] = [];

  for (const path of curriculumRegistry.getAllPaths()) {
    for (const node of path.nodes) {
      if (node.type === type) {
        nodes.push(node);
      }
    }
  }

  return nodes;
}

/**
 * Validate curriculum data
 *
 * @param curriculum The curriculum to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateCurriculum(curriculum: ICurriculum): string[] {
  const errors: string[] = [];

  // Check required fields
  if (!curriculum.id) {
    errors.push('Curriculum ID is required');
  }
  if (!curriculum.metadata) {
    errors.push('Curriculum metadata is required');
  }
  if (!curriculum.tracks || curriculum.tracks.length === 0) {
    errors.push('Curriculum must have at least one track');
  }

  // Validate metadata
  if (curriculum.metadata) {
    if (!curriculum.metadata.id) {
      errors.push('Metadata ID is required');
    }
    if (!curriculum.metadata.name) {
      errors.push('Metadata name is required');
    }
    if (!curriculum.metadata.type) {
      errors.push('Metadata type is required');
    }
  }

  // Validate tracks
  if (curriculum.tracks) {
    curriculum.tracks.forEach((track, index) => {
      if (!track.id) {
        errors.push(`Track at index ${index} is missing ID`);
      }
      if (!track.name) {
        errors.push(`Track at index ${index} is missing name`);
      }
      if (!track.modules || track.modules.length === 0) {
        errors.push(`Track at index ${index} must have at least one module`);
      }
    });
  }

  return errors;
}

/**
 * Create a deep copy of curriculum data
 *
 * @param data The data to clone
 * @returns A deep copy of the data
 */
export function cloneCurriculumData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Get the next lesson in a module
 *
 * @param moduleId The module ID
 * @param currentLessonId The current lesson ID
 * @returns The next lesson or undefined if at the end
 */
export function getNextLesson(moduleId: string, currentLessonId: string): ILesson | undefined {
  const module = findModuleById(moduleId);
  if (!module) {
    return undefined;
  }

  const currentIndex = module.lessons.findIndex((lesson) => lesson.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === module.lessons.length - 1) {
    return undefined;
  }

  return module.lessons[currentIndex + 1];
}

/**
 * Get the next node in a path
 *
 * @param pathId The path ID
 * @param currentNodeId The current node ID
 * @returns The next node or undefined if at the end
 */
export function getNextPathNode(pathId: string, currentNodeId: string): PathNode | undefined {
  const path = curriculumRegistry.getPathById(pathId);
  if (!path) {
    return undefined;
  }

  const currentNode = path.nodes.find((node) => node.id === currentNodeId);
  if (!currentNode || !currentNode.connections || currentNode.connections.length === 0) {
    return undefined;
  }

  // Return the first connected node
  const nextNodeId = currentNode.connections[0];
  return path.nodes.find((node) => node.id === nextNodeId);
}

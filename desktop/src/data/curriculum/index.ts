/**
 * Curriculum Registry
 * 
 * This file exports the curriculum registry and related utilities.
 */

// Export registry
export { CurriculumRegistry, curriculumRegistry } from './registry';

// Export loader functions
export {
  loadDefaultCurriculum,
  loadCurriculumFromJson,
  loadTrackFromJson,
  loadPathFromJson,
  initializeCurriculum,
} from './loader';

// Export utility functions
export {
  findLessonById,
  findModuleById,
  findPathNodeById,
  getAllShortcuts,
  getShortcutsByCategory,
  getLessonsByDifficulty,
  getModulesByCategory,
  getPathNodesByType,
  validateCurriculum,
  getNextLesson,
  getNextPathNode,
  cloneCurriculumData,
} from './utils'; 

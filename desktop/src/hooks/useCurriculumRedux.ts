import { useEffect, useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchCurriculumData,
  setActiveCurriculum,
  setActiveTrack,
  fetchLessonById,
  fetchModuleById,
  fetchPathNodeById,
  selectCurriculum,
  selectCurriculums,
  selectActiveCurriculumId,
  selectTracks,
  selectActiveTrackId,
  selectModules,
  selectLessons,
  selectPaths,
  selectPathNodes,
  selectIsCurriculumLoading,
  selectModulesByTrack,
  selectLessonsByModule,
  selectLessonsByDifficulty,
  selectModulesByCategory,
  selectPathsByTrack,
  selectPathNodesByPath,
} from '@slices/curriculumSlice';

import type { RootState } from '@/store';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { ShortcutCategory } from '@/types/curriculum/ShortcutCategory';
import type { ApplicationType } from '@/types/progress/ICurriculum';

/**
 * Custom hook for managing curriculum state and actions
 */
export const useCurriculumRedux = () => {
  const dispatch = useAppDispatch();

  // Select curriculum state
  const curriculum = useAppSelector(selectCurriculum);
  const curriculums = useAppSelector(selectCurriculums);
  const activeCurriculumId = useAppSelector(selectActiveCurriculumId);
  const tracks = useAppSelector(selectTracks);
  const activeTrackId = useAppSelector(selectActiveTrackId);
  const modules = useAppSelector(selectModules);
  const lessons = useAppSelector(selectLessons);
  const paths = useAppSelector(selectPaths);
  const pathNodes = useAppSelector(selectPathNodes);
  const isLoading = useAppSelector(selectIsCurriculumLoading);
  
  // Get the current state for use in our selector functions
  const state = useAppSelector((state) => state);

  // Fetch curriculum data on component mount
  useEffect(() => {
    dispatch(fetchCurriculumData());
  }, [dispatch]);

  // Curriculum actions
  const loadCurriculumData = useCallback(() => {
    dispatch(fetchCurriculumData());
  }, [dispatch]);

  const changeActiveCurriculum = useCallback((curriculumId: string) => {
    dispatch(setActiveCurriculum(curriculumId));
  }, [dispatch]);

  const changeActiveTrack = useCallback((trackId: ApplicationType) => {
    dispatch(setActiveTrack(trackId));
  }, [dispatch]);

  const getLesson = useCallback((lessonId: string) => {
    return dispatch(fetchLessonById(lessonId)).unwrap();
  }, [dispatch]);

  const getModule = useCallback((moduleId: string) => {
    return dispatch(fetchModuleById(moduleId)).unwrap();
  }, [dispatch]);

  const getPathNode = useCallback((nodeId: string) => {
    return dispatch(fetchPathNodeById(nodeId)).unwrap();
  }, [dispatch]);

  // Memoized selector functions
  const selectorFunctions = useMemo(() => {
    return {
      // Pre-bound selector functions that use the current state
      getModulesByTrack: (trackId: ApplicationType) => 
        selectModulesByTrack(state, trackId),
        
      getLessonsByModule: (moduleId: string) => 
        selectLessonsByModule(state, moduleId),
        
      getLessonsByDifficulty: (difficulty: DifficultyLevel) => 
        selectLessonsByDifficulty(state, difficulty),
        
      getModulesByCategory: (category: ShortcutCategory) => 
        selectModulesByCategory(state, category),
        
      getPathsByTrack: (trackId: ApplicationType) => 
        selectPathsByTrack(state, trackId),
        
      getPathNodesByPath: (pathId: string) => 
        selectPathNodesByPath(state, pathId),
    };
  }, [state]);

  // Return state and actions
  return {
    // State
    curriculum,
    curriculums,
    activeCurriculumId,
    tracks,
    activeTrackId,
    modules,
    lessons,
    paths,
    pathNodes,
    isLoading,

    // Actions
    loadCurriculumData,
    changeActiveCurriculum,
    changeActiveTrack,
    getLesson,
    getModule,
    getPathNode,

    // Filtered selectors
    ...selectorFunctions,
  };
};

export default useCurriculumRedux;

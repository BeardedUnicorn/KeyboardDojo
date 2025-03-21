import { renderHook } from '@testing-library/react';

import { PathNodeType } from '@/types/progress/ICurriculum';

import { usePathNodeOptimization } from '../usePathNodeOptimization';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { PathNode } from '@/types/progress/ICurriculum';

describe('usePathNodeOptimization', () => {
  const mockNodes: PathNode[] = [
    {
      id: '1',
      type: PathNodeType.LESSON,
      title: 'Test Lesson 1',
      description: 'Test Description',
      difficulty: 'beginner' as DifficultyLevel,
      position: { x: 0, y: 0 },
      unlockRequirements: {
        previousNodes: [],
        xpRequired: 0,
        levelRequired: 0,
      },
    },
    {
      id: '2',
      type: PathNodeType.LESSON,
      title: 'Test Lesson 2',
      description: 'Test Description',
      difficulty: 'beginner' as DifficultyLevel,
      position: { x: 100, y: 100 },
      unlockRequirements: {
        previousNodes: [],
        xpRequired: 0,
        levelRequired: 0,
      },
    },
  ];

  const boundaryNodes: PathNode[] = [
    {
      id: 'boundary1',
      type: PathNodeType.LESSON,
      title: 'Boundary Lesson 1',
      description: 'Test Description',
      difficulty: 'beginner' as DifficultyLevel,
      position: { x: -10, y: -10 },
      unlockRequirements: {
        previousNodes: [],
        xpRequired: 0,
        levelRequired: 0,
      },
    },
    {
      id: 'boundary2',
      type: PathNodeType.LESSON,
      title: 'Boundary Lesson 2',
      description: 'Test Description',
      difficulty: 'beginner' as DifficultyLevel,
      position: { x: 110, y: 110 },
      unlockRequirements: {
        previousNodes: [],
        xpRequired: 0,
        levelRequired: 0,
      },
    },
  ];

  const bounds = {
    minX: -50,
    maxX: 150,
    minY: -50,
    maxY: 150,
  };

  it('should return visible nodes within viewport', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const visibleNodes = result.current.getVisibleNodes(bounds);
    expect(visibleNodes).toHaveLength(2);
  });

  it('should find node by ID', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const node = result.current.getNodeById('2');
    expect(node).toBeDefined();
    expect(node?.id).toBe('2');
    expect(node?.position.x).toBe(100);
    expect(node?.position.y).toBe(100);
  });

  it('should find nearest node within maxDistance', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const point = { x: 90, y: 90 };
    const nearest = result.current.findNearestNode(point, 50);
    expect(nearest?.id).toBe('2');
  });

  it('should return null when no node is within maxDistance', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const point = { x: 150, y: 150 };
    const nearest = result.current.findNearestNode(point, 10);
    expect(nearest).toBeNull();
  });

  it('should handle empty nodes array', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization([]),
    );

    const viewport = {
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
    };

    expect(result.current.getVisibleNodes(viewport)).toHaveLength(0);
    expect(result.current.getNodeById('1')).toBeUndefined();
    expect(result.current.findNearestNode({ x: 0, y: 0 })).toBeNull();
  });

  it('should handle nodes at quadtree boundaries', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(boundaryNodes),
    );

    const visibleNodes = result.current.getVisibleNodes(bounds);
    expect(visibleNodes).toHaveLength(2);
  });

  it('should handle viewport larger than bounds', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const largeViewport = {
      minX: -100,
      maxX: 200,
      minY: -100,
      maxY: 200,
    };

    const visibleNodes = result.current.getVisibleNodes(largeViewport);
    expect(visibleNodes).toHaveLength(2);
  });

  it('should memoize results for same viewport', () => {
    const { result } = renderHook(() =>
      usePathNodeOptimization(mockNodes),
    );

    const viewport = {
      minX: 0,
      maxX: 150,
      minY: 0,
      maxY: 150,
    };
    const firstResult = result.current.getVisibleNodes(viewport);
    const secondResult = result.current.getVisibleNodes(viewport);
    expect(firstResult).toStrictEqual(secondResult);
  });
}); 

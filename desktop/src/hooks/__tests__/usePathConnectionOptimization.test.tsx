import { renderHook } from '@testing-library/react';

import { usePathConnectionOptimization } from '../usePathConnectionOptimization';

import type { PathConnection } from '@/types/progress/ICurriculum';

const mockConnections: PathConnection[] = [
  {
    id: '1',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 100 },
    isCompleted: false,
  },
  {
    id: '2',
    start: { x: 50, y: 50 },
    end: { x: 150, y: 150 },
    isCompleted: false,
  },
];

const complexConnection: PathConnection = {
  id: 'complex',
  start: { x: 0, y: 0 },
  end: { x: 200, y: 200 },
  isCompleted: false,
};

const boundaryConnections: PathConnection[] = [
  {
    id: 'boundary1',
    start: { x: -10, y: -10 },
    end: { x: 10, y: 10 },
    isCompleted: false,
  },
  {
    id: 'boundary2',
    start: { x: 90, y: 90 },
    end: { x: 110, y: 110 },
    isCompleted: false,
  },
];

const singlePointConnection: PathConnection = {
  id: 'single',
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
  isCompleted: false,
};

describe('usePathConnectionOptimization', () => {
  it('should return visible connections within viewport', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization(mockConnections),
    );

    const viewport = {
      minX: -10,
      maxX: 110,
      minY: -10,
      maxY: 110,
    };

    const visibleConnections = result.current.getVisibleConnections(viewport);
    expect(visibleConnections).toHaveLength(1);
    expect(visibleConnections[0].id).toBe('1');
  });

  it('should find connection by ID', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization(mockConnections),
    );

    const connection = result.current.getConnectionById('2');
    expect(connection).toStrictEqual(mockConnections[1]);
  });

  it('should simplify connection points', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization([complexConnection]),
    );

    const simplified = result.current.getSimplifiedPoints(complexConnection.id);
    expect(simplified).toHaveLength(2);
    expect(simplified[0]).toEqual({ x: 0, y: 0 });
    expect(simplified[1]).toEqual({ x: 200, y: 200 });
  });

  it('should handle empty connections array', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization([]),
    );

    const viewport = {
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
    };

    expect(result.current.getVisibleConnections(viewport)).toHaveLength(0);
    expect(result.current.getConnectionById('1')).toBeUndefined();
    expect(result.current.getSimplifiedPoints('1')).toHaveLength(0);
  });

  it('should handle connections at viewport boundaries', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization(mockConnections),
    );

    const viewport = {
      minX: -10,
      maxX: 110,
      minY: -10,
      maxY: 110,
    };

    const visibleConnections = result.current.getVisibleConnections(viewport);
    expect(visibleConnections).toHaveLength(1);
  });

  it('should memoize simplified points', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization(mockConnections),
    );

    const firstResult = result.current.getSimplifiedPoints('1');
    const secondResult = result.current.getSimplifiedPoints('1');
    
    expect(firstResult).toStrictEqual(secondResult);
  });

  it('should handle viewport queries with no intersecting connections', () => {
    const { result } = renderHook(() =>
      usePathConnectionOptimization(mockConnections),
    );

    const viewport = {
      minX: 1000,
      maxX: 2000,
      minY: 1000,
      maxY: 2000,
    };

    const visibleConnections = result.current.getVisibleConnections(viewport);
    expect(visibleConnections).toHaveLength(0);
  });

  it('should handle single-point connections', () => {
    const singlePointConn = {
      id: 'single',
      source: '1',
      target: '2',
      points: [{ x: 0, y: 0 }],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      isCompleted: false
    };

    const { result } = renderHook(() =>
      usePathConnectionOptimization([singlePointConn]),
    );

    const simplified = result.current.getSimplifiedPoints('single');
    expect(simplified).toHaveLength(2);
    expect(simplified[0]).toEqual({ x: 0, y: 0 });
    expect(simplified[1]).toEqual({ x: 0, y: 0 });
  });
}); 

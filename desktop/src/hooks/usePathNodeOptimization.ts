import { useMemo } from 'react';

import type { PathNode, Point } from '@/types/progress/ICurriculum';

interface ViewportBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const usePathNodeOptimization = (nodes: PathNode[]) => {
  const optimizedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      position: { ...node.position },
    }));
  }, [nodes]);

  const getVisibleNodes = (viewport: ViewportBounds) => {
    return optimizedNodes.filter((node) => {
      const { x, y } = node.position;
      return (
        x >= viewport.minX && x <= viewport.maxX &&
        y >= viewport.minY && y <= viewport.maxY
      );
    });
  };

  const getNodeById = (id: string) => {
    return optimizedNodes.find((node) => node.id === id);
  };

  const findNearestNode = (point: Point, maxDistance = Infinity) => {
    let nearestNode = null;
    let minDistance = maxDistance;

    for (const node of optimizedNodes) {
      const dx = node.position.x - point.x;
      const dy = node.position.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = node;
      }
    }

    return nearestNode;
  };

  return {
    optimizedNodes,
    getVisibleNodes,
    getNodeById,
    findNearestNode,
  };
}; 

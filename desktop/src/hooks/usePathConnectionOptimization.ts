import { useMemo } from 'react';

import type { PathConnection, Point } from '@/types/progress/ICurriculum';

interface ViewportBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Simplifies a polyline using the Ramer-Douglas-Peucker algorithm
 */
function simplifyLine(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points;

  // Find the point with the maximum distance
  let maxDistance = 0;
  let maxIndex = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const firstHalf = simplifyLine(points.slice(0, maxIndex + 1), epsilon);
    const secondHalf = simplifyLine(points.slice(maxIndex), epsilon);
    return [...firstHalf.slice(0, -1), ...secondHalf];
  }

  return [start, end];
}

/**
 * Calculates the perpendicular distance from a point to a line segment
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  if (dx === 0 && dy === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2),
    );
  }

  const t = (
    (point.x - lineStart.x) * dx +
    (point.y - lineStart.y) * dy
  ) / (dx * dx + dy * dy);

  if (t < 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2),
    );
  }
  if (t > 1) {
    return Math.sqrt(
      Math.pow(point.x - lineEnd.x, 2) + Math.pow(point.y - lineEnd.y, 2),
    );
  }

  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;

  return Math.sqrt(
    Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2),
  );
}

/**
 * Checks if a line segment intersects with a viewport
 */
function lineIntersectsViewport(
  start: Point,
  end: Point,
  viewport: ViewportBounds,
): boolean {
  // Cohen-Sutherland line clipping algorithm
  const INSIDE = 0;
  const LEFT = 1;
  const RIGHT = 2;
  const BOTTOM = 4;
  const TOP = 8;

  function computeCode(x: number, y: number): number {
    let code = INSIDE;
    if (x < viewport.minX) code |= LEFT;
    else if (x > viewport.maxX) code |= RIGHT;
    if (y < viewport.minY) code |= BOTTOM;
    else if (y > viewport.maxY) code |= TOP;
    return code;
  }

  let code1 = computeCode(start.x, start.y);
  let code2 = computeCode(end.x, end.y);

  while (true) {
    if (!(code1 | code2)) return true; // Both points inside
    if (code1 & code2) return false; // Both points on same side

    // Some segment is visible
    const code = code1 || code2;
    let x: number;
    let y: number;

    if (code & TOP) {
      x = start.x + (end.x - start.x) * (viewport.maxY - start.y) / (end.y - start.y);
      y = viewport.maxY;
    } else if (code & BOTTOM) {
      x = start.x + (end.x - start.x) * (viewport.minY - start.y) / (end.y - start.y);
      y = viewport.minY;
    } else if (code & RIGHT) {
      y = start.y + (end.y - start.y) * (viewport.maxX - start.x) / (end.x - start.x);
      x = viewport.maxX;
    } else if (code & LEFT) {
      y = start.y + (end.y - start.y) * (viewport.minX - start.x) / (end.x - start.x);
      x = viewport.minX;
    }

    if (code === code1) {
      start.x = x;
      start.y = y;
      code1 = computeCode(x, y);
    } else {
      end.x = x;
      end.y = y;
      code2 = computeCode(x, y);
    }
  }
}

/**
 * Hook for optimizing path connection rendering
 * @param connections Array of path connections
 * @param simplificationEpsilon Epsilon value for line simplification (default: 1)
 * @returns Optimized functions for connection operations
 */
export const usePathConnectionOptimization = (connections: PathConnection[]) => {
  const optimizedConnections = useMemo(() => {
    return connections.map((connection) => ({
      ...connection,
      start: { ...connection.start },
      end: { ...connection.end },
    }));
  }, [connections]);

  const getVisibleConnections = (viewport: ViewportBounds) => {
    return optimizedConnections.filter((connection) => {
      const { start, end } = connection;
      return (
        start.x >= viewport.minX && start.x <= viewport.maxX &&
        start.y >= viewport.minY && start.y <= viewport.maxY &&
        end.x >= viewport.minX && end.x <= viewport.maxX &&
        end.y >= viewport.minY && end.y <= viewport.maxY
      );
    });
  };

  const getConnectionById = (id: string) => {
    return optimizedConnections.find((connection) => connection.id === id);
  };

  const getSimplifiedPoints = (connectionId: string): Point[] => {
    const connection = getConnectionById(connectionId);
    if (!connection) return [];
    return [connection.start, connection.end];
  };

  return {
    optimizedConnections,
    getVisibleConnections,
    getConnectionById,
    getSimplifiedPoints,
  };
}; 

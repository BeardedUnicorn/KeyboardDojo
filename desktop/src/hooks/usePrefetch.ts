import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loggerService } from '@/services';

// Map of routes to their chunk dependencies
const routeChunks: Record<string, () => Promise<any>[]> = {
  '/curriculum': () => [
    import('@pages/CurriculumPage.tsx'),
    import('@components/PathView'),
    import('@data/paths/vscode-path'),
    import('@data/paths/intellij-path'),
    import('@data/paths/cursor-path'),
  ],
  '/lesson': () => [
    import('@pages/LessonPage.tsx'),
    import('@components/PathView'),
  ],
  '/checkpoint': () => [
    import('@pages/CheckpointPage.tsx'),
    import('@components/PathView'),
  ],
};

/**
 * Hook for prefetching route chunks based on user navigation
 * @param prefetchDistance - How many links ahead to prefetch (default: 2)
 */
export const usePrefetch = (prefetchDistance = 2) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get potential next routes based on current location
  const getNextRoutes = useCallback(() => {
    const currentPath = location.pathname;
    const routes = Object.keys(routeChunks);

    // Find current route index
    const currentIndex = routes.findIndex((route) => currentPath.startsWith(route));
    if (currentIndex === -1) return [];

    // Get next routes within prefetch distance
    return routes
      .slice(currentIndex + 1, currentIndex + 1 + prefetchDistance)
      .filter((route) => route !== currentPath);
  }, [location.pathname, prefetchDistance]);

  // Prefetch chunks for a route
  const prefetchRoute = useCallback(async (route: string) => {
    const chunks = routeChunks[route];
    if (!chunks) return;

    try {
      // Load chunks in parallel
      await Promise.all(chunks());
      loggerService.info(`Prefetched chunks for route: ${route}`);
    } catch (error) {
      loggerService.error(`Failed to prefetch chunks for route: ${route}`, error);
    }
  }, []);

  // Prefetch next routes on location change
  useEffect(() => {
    const nextRoutes = getNextRoutes();
    nextRoutes.forEach((route) => {
      // Use requestIdleCallback if available, otherwise setTimeout
      const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      schedule(() => prefetchRoute(route));
    });
  }, [location.pathname, getNextRoutes, prefetchRoute]);

  // Navigate to route, ensuring chunks are loaded
  const navigateWithPrefetch = useCallback(async (to: string) => {
    const matchingRoute = Object.keys(routeChunks).find((route) => to.startsWith(route));
    if (matchingRoute) {
      await prefetchRoute(matchingRoute);
    }
    navigate(to);
  }, [navigate, prefetchRoute]);

  return { navigateWithPrefetch };
};

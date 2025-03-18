import { Box } from '@mui/material';
import React, { useRef, useState, useCallback } from 'react';

import { useMemoizedValue } from '@/hooks/useMemoizedValue';

import type { ReactNode, CSSProperties } from 'react';

interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the container in pixels */
  height: number;
  /** Width of the container (default: 100%) */
  width?: string | number;
  /** Number of items to render beyond visible area */
  overscan?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional inline style */
  style?: CSSProperties;
  /** Optional key extractor function */
  getKey?: (item: T, index: number) => string | number;
}

/**
 * A virtualized list component that efficiently renders large lists
 * by only rendering items that are visible in the viewport.
 *
 * @template T The type of items in the list
 *
 * @example
 * ```tsx
 * <VirtualList
 *   items={items}
 *   renderItem={(item, index) => (
 *     <ListItem key={index}>{item.name}</ListItem>
 *   )}
 *   itemHeight={50}
 *   height={400}
 * />
 * ```
 */
export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  width = '100%',
  overscan = 3,
  className,
  style,
  getKey = (_, index) => index,
}: VirtualListProps<T>) {
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range with memoization
  const rangeCalculator = useMemoizedValue(
    (scrollPosition: number, containerHeight: number, itemCount: number) => {
      const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan);
      const visibleItems = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
      const endIndex = Math.min(itemCount - 1, startIndex + visibleItems);

      return {
        startIndex,
        endIndex,
        offsetY: startIndex * itemHeight,
      };
    },
    { maxCacheSize: 50 },
  );

  // Handle scroll events
  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Calculate visible range
  const { startIndex, endIndex } = rangeCalculator.calculate(
    scrollTop,
    height,
    items.length,
  );

  // Generate visible items
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => {
    const actualIndex = startIndex + index;
    return (
      <Box
        key={getKey(item, actualIndex)}
        sx={{
          position: 'absolute',
          top: actualIndex * itemHeight,
          left: 0,
          width: '100%',
          height: itemHeight,
        }}
      >
        {renderItem(item, actualIndex)}
      </Box>
    );
  });

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        position: 'relative',
        height,
        width,
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <Box
        sx={{
          position: 'relative',
          height: items.length * itemHeight,
          width: '100%',
        }}
      >
        {visibleItems}
      </Box>
    </Box>
  );
}

export default VirtualList;

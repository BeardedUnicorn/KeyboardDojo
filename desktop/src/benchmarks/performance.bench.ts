import { performance } from 'perf_hooks';

import { renderHook } from '@testing-library/react';

import { usePathConnectionOptimization } from '../hooks/usePathConnectionOptimization';
import { usePathNodeOptimization } from '../hooks/usePathNodeOptimization';

// Generate test data
const generateNodes = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  }));
};

const generateConnections = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `connection-${i}`,
    points: Array.from({ length: 10 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    })),
  }));
};

describe('Performance Benchmarks', () => {
  const measurePerformance = (fn: () => void, iterations = 100) => {
    const times: number[] = [];
    const memoryUsage: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startMemory = process.memoryUsage().heapUsed;
      const startTime = performance.now();
      
      fn();
      
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      times.push(endTime - startTime);
      memoryUsage.push(endMemory - startMemory);
    }

    return {
      avgTime: times.reduce((a, b) => a + b) / times.length,
      maxTime: Math.max(...times),
      avgMemory: memoryUsage.reduce((a, b) => a + b) / memoryUsage.length / 1024 / 1024, // Convert to MB
      maxMemory: Math.max(...memoryUsage) / 1024 / 1024, // Convert to MB
    };
  };

  describe('Path Node Optimization', () => {
    it('should handle large datasets efficiently', () => {
      const datasets = [100, 500, 1000, 5000];
      const bounds = { x: 0, y: 0, width: 1000, height: 1000 };
      const viewport = { minX: 0, maxX: 500, minY: 0, maxY: 500 };

      datasets.forEach((size) => {
        const nodes = generateNodes(size);
        const { result } = renderHook(() => usePathNodeOptimization(nodes, bounds));

        const stats = measurePerformance(() => {
          result.current.getVisibleNodes(viewport);
        }, 50);

        console.info(`Dataset Size: ${size} - Performance Stats:
  • Avg Time: ${stats.avgTime.toFixed(2)} ms
  • Max Time: ${stats.maxTime.toFixed(2)} ms
  • Avg Memory: ${stats.avgMemory.toFixed(2)} MB
  • Max Memory: ${stats.maxMemory.toFixed(2)} MB`);

        // Performance thresholds
        expect(stats.avgTime).toBeLessThan(16.67); // 60fps threshold
        expect(stats.maxMemory).toBeLessThan(100); // 100MB threshold
      });
    });
  });

  describe('Path Connection Optimization', () => {
    it('should efficiently simplify and cull connections', () => {
      const datasets = [100, 500, 1000];
      const viewport = { minX: 0, maxX: 500, minY: 0, maxY: 500 };

      datasets.forEach((size) => {
        const connections = generateConnections(size);
        const { result } = renderHook(() => usePathConnectionOptimization(connections));

        const stats = measurePerformance(() => {
          result.current.getVisibleConnections(viewport);
        }, 50);

        console.info(`Dataset Size: ${size} - Performance Stats:
  • Avg Time: ${stats.avgTime.toFixed(2)} ms
  • Max Time: ${stats.maxTime.toFixed(2)} ms
  • Avg Memory: ${stats.avgMemory.toFixed(2)} MB
  • Max Memory: ${stats.maxMemory.toFixed(2)} MB`);

        // Performance thresholds
        expect(stats.avgTime).toBeLessThan(16.67); // 60fps threshold
        expect(stats.maxMemory).toBeLessThan(100); // 100MB threshold
      });
    });
  });

  describe('Virtualization Performance', () => {
    it('should maintain performance with large lists', () => {
      const listSizes = [100, 1000, 10000];
      const viewportHeight = 800;
      const itemHeight = 50;

      listSizes.forEach((size) => {
        const items = Array.from({ length: size }, (_, i) => ({
          id: `item-${i}`,
          content: `Item ${i}`,
        }));

        const stats = measurePerformance(() => {
          const visibleCount = Math.ceil(viewportHeight / itemHeight);
          const startIndex = Math.floor(Math.random() * (size - visibleCount));
          const visibleItems = items.slice(startIndex, startIndex + visibleCount);
          return visibleItems;
        }, 100);

        console.info(`List Size: ${size} - Performance Stats:
  • Avg Time: ${stats.avgTime.toFixed(2)} ms
  • Max Time: ${stats.maxTime.toFixed(2)} ms
  • Avg Memory: ${stats.avgMemory.toFixed(2)} MB
  • Max Memory: ${stats.maxMemory.toFixed(2)} MB`);

        // Performance thresholds
        expect(stats.avgTime).toBeLessThan(16.67); // 60fps threshold
        expect(stats.maxMemory).toBeLessThan(50); // 50MB threshold
      });
    });
  });
}); 

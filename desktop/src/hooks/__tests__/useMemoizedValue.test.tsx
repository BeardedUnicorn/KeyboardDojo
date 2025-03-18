import { renderHook, act } from '@testing-library/react';

import { useMemoizedValue } from '../useMemoizedValue';

describe('useMemoizedValue', () => {
  it('should memoize calculated values', () => {
    let calculationCount = 0;
    const calculation = (x: number) => {
      calculationCount++;
      return x * 2;
    };

    const { result } = renderHook(() =>
      useMemoizedValue(calculation, { maxCacheSize: 2 }),
    );

    // First calculation
    let value = result.current.calculate(5);
    expect(value).toBe(10);
    expect(calculationCount).toBe(1);

    // Should use cached value
    value = result.current.calculate(5);
    expect(value).toBe(10);
    expect(calculationCount).toBe(1);

    // New calculation
    value = result.current.calculate(10);
    expect(value).toBe(20);
    expect(calculationCount).toBe(2);
  });

  it('should respect maxCacheSize', () => {
    const calculation = jest.fn((x: number) => x * 2);
    const { result } = renderHook(() =>
      useMemoizedValue(calculation, { maxCacheSize: 2 }),
    );

    // Fill cache
    result.current.calculate(1);
    result.current.calculate(2);
    expect(calculation).toHaveBeenCalledTimes(2);

    // Add third value, should trigger cleanup
    result.current.calculate(3);
    expect(calculation).toHaveBeenCalledTimes(3);

    // First value should be recalculated
    result.current.calculate(1);
    expect(calculation).toHaveBeenCalledTimes(4);
  });

  it('should use custom keyGenerator', () => {
    const calculation = jest.fn((obj: { id: number }) => obj.id * 2);
    const keyGenerator = (obj: { id: number }) => obj.id.toString();

    const { result } = renderHook(() =>
      useMemoizedValue(calculation, { keyGenerator }),
    );

    const obj1 = { id: 1 };
    const obj2 = { id: 1 };

    // First calculation
    result.current.calculate(obj1);
    expect(calculation).toHaveBeenCalledTimes(1);

    // Should use cached value despite different object reference
    result.current.calculate(obj2);
    expect(calculation).toHaveBeenCalledTimes(1);
  });

  it('should handle debug mode', () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    const calculation = (x: number) => x * 2;

    const { result } = renderHook(() =>
      useMemoizedValue(calculation, { debug: true }),
    );

    result.current.calculate(5);
    expect(consoleSpy).toHaveBeenCalledWith('Cache miss:', '[5]');

    result.current.calculate(5);
    expect(consoleSpy).toHaveBeenCalledWith('Cache hit:', '[5]');

    consoleSpy.mockRestore();
  });

  it('should clear cache', () => {
    const calculation = jest.fn((x: number) => x * 2);
    const { result } = renderHook(() => useMemoizedValue(calculation));

    // Fill cache
    result.current.calculate(1);
    expect(calculation).toHaveBeenCalledTimes(1);

    // Clear cache
    act(() => {
      result.current.clearCache();
    });

    // Should recalculate
    result.current.calculate(1);
    expect(calculation).toHaveBeenCalledTimes(2);
  });

  it('should use custom equality function', () => {
    const calculation = jest.fn((obj: { value: number }) => obj.value * 2);
    const isEqual = (a: number, b: number) => Math.abs(a - b) < 0.1;

    const { result } = renderHook(() =>
      useMemoizedValue(calculation, { isEqual }),
    );

    result.current.calculate({ value: 1.01 });
    expect(calculation).toHaveBeenCalledTimes(1);

    // Should use cached value due to custom equality
    result.current.calculate({ value: 1.02 });
    expect(calculation).toHaveBeenCalledTimes(1);

    // Should calculate new value
    result.current.calculate({ value: 1.2 });
    expect(calculation).toHaveBeenCalledTimes(2);
  });
}); 

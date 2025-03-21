import { vi, describe, test, expect } from 'vitest';
import * as componentUtils from '../componentUtils';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock theme for testing
const mockTheme = createTheme();

describe('componentUtils', () => {
  describe('getIconSize', () => {
    test('returns correct size for small variant', () => {
      const result = componentUtils.getIconSize('small');
      expect(result).toBe(16);
    });

    test('returns correct size for medium variant', () => {
      const result = componentUtils.getIconSize('medium');
      expect(result).toBe(24);
    });

    test('returns correct size for large variant', () => {
      const result = componentUtils.getIconSize('large');
      expect(result).toBe(32);
    });

    test('returns default size when variant is not specified', () => {
      const result = componentUtils.getIconSize();
      expect(result).toBe(24); // Default should be medium
    });
  });

  describe('getFontSize', () => {
    test('returns correct typography for small variant', () => {
      const result = componentUtils.getFontSize('small');
      expect(result).toBe('caption');
    });

    test('returns correct typography for medium variant', () => {
      const result = componentUtils.getFontSize('medium');
      expect(result).toBe('body2');
    });

    test('returns correct typography for large variant', () => {
      const result = componentUtils.getFontSize('large');
      expect(result).toBe('h6');
    });

    test('returns default typography when variant is not specified', () => {
      const result = componentUtils.getFontSize();
      expect(result).toBe('body2'); // Default should be medium
    });
  });

  describe('getComponentDimensions', () => {
    test('returns correct dimensions for default variant', () => {
      const result = componentUtils.getComponentDimensions('default');
      expect(result).toEqual({
        height: 40,
        padding: 1.5,
        gap: 1,
      });
    });

    test('returns correct dimensions for compact variant', () => {
      const result = componentUtils.getComponentDimensions('compact');
      expect(result).toEqual({
        height: 32,
        padding: 1,
        gap: 0.5,
      });
    });

    test('returns correct dimensions for large variant', () => {
      const result = componentUtils.getComponentDimensions('large');
      expect(result).toEqual({
        height: 56,
        padding: 2,
        gap: 1.5,
      });
    });

    test('returns default dimensions when variant is not specified', () => {
      const result = componentUtils.getComponentDimensions();
      expect(result).toEqual({
        height: 40,
        padding: 1.5,
        gap: 1,
      });
    });
  });

  describe('getColorByValue', () => {
    test('returns error color for values <= 25% of max', () => {
      const result = componentUtils.getColorByValue(25, 100, mockTheme);
      expect(result).toBe(mockTheme.palette.error.main);
    });

    test('returns warning color for values between 25% and 50% of max', () => {
      const result = componentUtils.getColorByValue(40, 100, mockTheme);
      expect(result).toBe(mockTheme.palette.warning.main);
    });

    test('returns info color for values between 50% and 75% of max', () => {
      const result = componentUtils.getColorByValue(70, 100, mockTheme);
      expect(result).toBe(mockTheme.palette.info.main);
    });

    test('returns success color for values > 75% of max', () => {
      const result = componentUtils.getColorByValue(80, 100, mockTheme);
      expect(result).toBe(mockTheme.palette.success.main);
    });

    test('handles edge cases correctly', () => {
      expect(componentUtils.getColorByValue(25, 100, mockTheme)).toBe(mockTheme.palette.error.main);
      expect(componentUtils.getColorByValue(50, 100, mockTheme)).toBe(mockTheme.palette.warning.main);
      expect(componentUtils.getColorByValue(75, 100, mockTheme)).toBe(mockTheme.palette.info.main);
    });
  });

  describe('formatTimeRemaining', () => {
    test('formats minutes and seconds correctly', () => {
      const result = componentUtils.formatTimeRemaining(90000); // 1.5 minutes
      expect(result).toBe('1m 30s');
    });

    test('handles zero or negative values', () => {
      expect(componentUtils.formatTimeRemaining(0)).toBe('0m 0s');
      expect(componentUtils.formatTimeRemaining(-1000)).toBe('0m 0s');
    });

    test('handles null value', () => {
      expect(componentUtils.formatTimeRemaining(null)).toBe('0m 0s');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('formats just now for times less than a minute ago', () => {
      const date = new Date('2023-01-01T11:59:30Z'); // 30 seconds ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('just now');
    });

    test('formats minutes ago correctly', () => {
      const date = new Date('2023-01-01T11:58:00Z'); // 2 minutes ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('2 minutes ago');
    });

    test('formats 1 minute ago correctly', () => {
      const date = new Date('2023-01-01T11:59:00Z'); // 1 minute ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('1 minute ago');
    });

    test('formats hours ago correctly', () => {
      const date = new Date('2023-01-01T10:00:00Z'); // 2 hours ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('2 hours ago');
    });

    test('formats 1 hour ago correctly', () => {
      const date = new Date('2023-01-01T11:00:00Z'); // 1 hour ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('1 hour ago');
    });

    test('formats days ago correctly', () => {
      const date = new Date('2022-12-30T12:00:00Z'); // 2 days ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('2 days ago');
    });

    test('formats 1 day ago correctly', () => {
      const date = new Date('2022-12-31T12:00:00Z'); // 1 day ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('1 day ago');
    });

    test('formats months ago correctly', () => {
      const date = new Date('2022-11-01T12:00:00Z'); // 2 months ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('2 months ago');
    });

    test('formats years ago correctly', () => {
      const date = new Date('2021-01-01T12:00:00Z'); // 2 years ago
      const result = componentUtils.formatRelativeTime(date);
      expect(result).toBe('2 years ago');
    });

    test('handles string dates', () => {
      const result = componentUtils.formatRelativeTime('2022-12-31T12:00:00Z');
      expect(result).toBe('1 day ago');
    });
  });
}); 
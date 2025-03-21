import {
  formatNumber,
  formatCurrency,
  formatCompactNumber,
  formatPercentage,
  formatTime,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatFileSize
} from '../formatUtils';

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    test('formats number with commas as thousands separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-1000)).toBe('-1,000');
    });
  });

  describe('formatCurrency', () => {
    test('formats currency with default USD', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });

    test('formats currency with specified currency code', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
    });
  });

  describe('formatCompactNumber', () => {
    test('formats numbers in compact notation', () => {
      expect(formatCompactNumber(1000)).toBe('1K');
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(1000000)).toBe('1M');
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(1000000000)).toBe('1B');
      expect(formatCompactNumber(0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    test('formats decimal as percentage with default 0 decimals', () => {
      expect(formatPercentage(0.1)).toBe('10%');
      expect(formatPercentage(0.25)).toBe('25%');
      expect(formatPercentage(1)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
    });

    test('formats decimal as percentage with specified decimals', () => {
      expect(formatPercentage(0.125, 1)).toBe('12.5%');
      expect(formatPercentage(0.333, 2)).toBe('33.30%');
      expect(formatPercentage(0.5, 3)).toBe('50.000%');
    });
  });

  describe('formatTime', () => {
    test('formats milliseconds as MM:SS', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(1000)).toBe('00:01');
      expect(formatTime(60000)).toBe('01:00');
      expect(formatTime(61000)).toBe('01:01');
      expect(formatTime(3600000)).toBe('60:00');
      expect(formatTime(3661000)).toBe('61:01');
    });

    test('handles negative values', () => {
      expect(formatTime(-1000)).toBe('00:00');
    });
  });

  describe('formatDate', () => {
    test('formats date with default medium format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      expect(formatDate(date)).toBe('May 15, 2023');
    });

    test('formats date with short format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      expect(formatDate(date, 'short')).toBe('5/15/2023');
    });

    test('formats date with long format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      expect(formatDate(date, 'long')).toBe('May 15, 2023');
    });

    test('formats date with full format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      // Note: The result may vary based on the day of the week
      const result = formatDate(date, 'full');
      expect(result).toContain('Monday');
      expect(result).toContain('May 15, 2023');
    });

    test('handles string date input', () => {
      expect(formatDate('2023-05-15T12:00:00Z')).toBe('May 15, 2023');
    });
  });

  describe('formatDateTime', () => {
    test('formats date and time with default medium format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('May 15, 2023');
      expect(/\d{1,2}:\d{2}\s[AP]M/.test(result)).toBe(true);
    });

    test('formats date and time with short format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      const result = formatDateTime(date, 'short');
      expect(/\d{1,2}\/\d{1,2}\/\d{4}/.test(result)).toBe(true);
      expect(/\d{1,2}:\d{2}\s[AP]M/.test(result)).toBe(true);
    });

    test('formats date and time with long format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      const result = formatDateTime(date, 'long');
      expect(result).toContain('May 15, 2023');
      expect(/\d{1,2}:\d{2}:\d{2}\s[AP]M/.test(result)).toBe(true);
    });

    test('handles string date input', () => {
      const result = formatDateTime('2023-05-15T12:00:00Z');
      expect(result).toContain('May 15, 2023');
    });
  });

  describe('formatRelativeTime', () => {
    test('formats relative time for seconds', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-01-01T12:00:10Z');
      expect(formatRelativeTime(date, now)).toContain('second');
    });

    test('formats relative time for minutes', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-01-01T12:10:00Z');
      expect(formatRelativeTime(date, now)).toContain('minute');
    });

    test('formats relative time for hours', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-01-01T15:00:00Z');
      expect(formatRelativeTime(date, now)).toContain('hour');
    });

    test('formats relative time for days', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-01-05T12:00:00Z');
      expect(formatRelativeTime(date, now)).toContain('day');
    });

    test('uses standard date format for long periods', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-03-01T12:00:00Z');
      // For dates more than 30 days apart, it falls back to standard date format
      expect(formatRelativeTime(date, now)).toBe('Mar 1, 2023');
    });

    test('handles past dates', () => {
      const now = new Date('2023-01-05T12:00:00Z');
      const date = new Date('2023-01-01T12:00:00Z');
      expect(formatRelativeTime(date, now)).toContain('ago');
    });

    test('handles future dates', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const date = new Date('2023-01-05T12:00:00Z');
      expect(formatRelativeTime(date, now)).toContain('in');
    });
  });

  describe('formatDuration', () => {
    test('formats duration with default includeSeconds=true', () => {
      expect(formatDuration(0)).toBe('0 seconds');
      expect(formatDuration(1000)).toBe('1 second');
      expect(formatDuration(60000)).toBe('1 minute');
      expect(formatDuration(61000)).toBe('1 minute, 1 second');
      expect(formatDuration(3600000)).toBe('1 hour');
      expect(formatDuration(3661000)).toBe('1 hour, 1 minute, 1 second');
      expect(formatDuration(86400000)).toBe('1 day');
      expect(formatDuration(86401000)).toBe('1 day, 1 second');
      expect(formatDuration(90061000)).toBe('1 day, 1 hour, 1 minute, 1 second');
    });

    test('formats duration with includeSeconds=false', () => {
      expect(formatDuration(0, false)).toBe('0 minutes');
      expect(formatDuration(1000, false)).toBe('0 minutes');
      expect(formatDuration(60000, false)).toBe('1 minute');
      expect(formatDuration(61000, false)).toBe('1 minute');
      expect(formatDuration(3600000, false)).toBe('1 hour');
      expect(formatDuration(3661000, false)).toBe('1 hour, 1 minute');
    });

    test('handles plural forms correctly', () => {
      expect(formatDuration(2000)).toBe('2 seconds');
      expect(formatDuration(120000)).toBe('2 minutes');
      expect(formatDuration(7200000)).toBe('2 hours');
      expect(formatDuration(172800000)).toBe('2 days');
    });
  });

  describe('formatFileSize', () => {
    test('formats file size with default 2 decimals', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(100)).toBe('100 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1500)).toBe('1.46 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    test('formats file size with specified decimals', () => {
      expect(formatFileSize(1500, 0)).toBe('1 KB');
      expect(formatFileSize(1500, 1)).toBe('1.5 KB');
      expect(formatFileSize(1500, 3)).toBe('1.465 KB');
    });
  });
}); 
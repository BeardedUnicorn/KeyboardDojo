import {
  formatDuration,
  formatTimeRemaining,
  formatSecondsToTime,
  formatDate,
  formatDateTime,
  getDayName,
  getMonthName,
  isToday,
  isYesterday,
  getDaysBetween,
  getTimeDifference,
  getRelativeTimeString,
  formatRelativeTime,
} from '../dateTimeUtils';

describe('DateTime Utilities', () => {
  describe('formatDuration', () => {
    test('formatDuration outputs correct format', () => {
      expect(formatDuration(30)).toBe('30s');
      expect(formatDuration(90)).toBe('1m');
      expect(formatDuration(3600)).toBe('1h '); // Note the trailing space
      expect(formatDuration(3660)).toBe('1h 1m');
      expect(formatDuration(7200)).toBe('2h ');
    });
  });

  describe('formatTimeRemaining', () => {
    test('formatTimeRemaining handles different time units correctly', () => {
      expect(formatTimeRemaining(0)).toBe('0s');
      expect(formatTimeRemaining(1000)).toBe('1s');
      expect(formatTimeRemaining(60 * 1000)).toBe('1m');
      expect(formatTimeRemaining(90 * 1000)).toBe('1m 30s');
      expect(formatTimeRemaining(3600 * 1000)).toBe('1h 0m');
      expect(formatTimeRemaining(3660 * 1000)).toBe('1h 1m');
      expect(formatTimeRemaining(7230 * 1000)).toBe('2h 0m');
    });

    test('formatTimeRemaining handles negative values', () => {
      expect(formatTimeRemaining(-1000)).toBe('0s');
    });
  });

  describe('formatSecondsToTime', () => {
    test('formatSecondsToTime converts seconds to MM:SS format', () => {
      expect(formatSecondsToTime(0)).toBe('00:00');
      expect(formatSecondsToTime(30)).toBe('00:30');
      expect(formatSecondsToTime(60)).toBe('01:00');
      expect(formatSecondsToTime(90)).toBe('01:30');
      expect(formatSecondsToTime(3600)).toBe('60:00');
      expect(formatSecondsToTime(3661)).toBe('61:01');
    });
  });

  describe('formatDate', () => {
    test('formatDate outputs dates in correct format', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      expect(formatDate(date)).toBe('May 15, 2023');
      
      // Test with string date
      expect(formatDate('2023-05-15T12:00:00Z')).toBe('May 15, 2023');
      
      // Test with timestamp
      expect(formatDate(date.getTime())).toBe('May 15, 2023');
      
      // Test with custom options
      expect(formatDate(date, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })).toBe('May 15, 2023');
      
      expect(formatDate(date, { 
        year: '2-digit', 
        month: 'numeric', 
        day: 'numeric' 
      })).toBe('5/15/23');
    });
  });

  describe('formatDateTime', () => {
    test('formatDateTime outputs date and time correctly', () => {
      const date = new Date('2023-05-15T12:00:00Z');
      
      // Note: The exact output depends on the timezone of where the test is run
      const result = formatDateTime(date);
      expect(result).toContain('May 15, 2023');
      expect(/\d{1,2}:\d{2}\s[AP]M/.test(result)).toBe(true);
    });
  });

  describe('getDayName', () => {
    test('getDayName returns valid day names', () => {
      // Create a reference date - avoiding specific day testing
      const anyDate = new Date();
      const result = getDayName(anyDate);
      
      // Test it returns a string
      expect(typeof result).toBe('string');
      
      // Test it's a valid day name (one of the 7 days)
      const validDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      expect(validDayNames).toContain(result);
      
      // Test short form works
      const shortResult = getDayName(anyDate, true);
      expect(shortResult.length).toBeLessThan(result.length);
      
      // Test with string date
      const stringDate = anyDate.toISOString();
      expect(typeof getDayName(stringDate)).toBe('string');
    });
  });

  describe('getMonthName', () => {
    test('getMonthName returns valid month names', () => {
      // Create a reference date - avoiding specific month testing
      const anyDate = new Date();
      const result = getMonthName(anyDate);
      
      // Test it returns a string
      expect(typeof result).toBe('string');
      
      // Test it's a valid month name
      const validMonthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      expect(validMonthNames).toContain(result);
      
      // Test short form works
      const shortResult = getMonthName(anyDate, true);
      expect(shortResult.length).toBeLessThan(result.length);
      
      // Test with string date
      const stringDate = anyDate.toISOString();
      expect(typeof getMonthName(stringDate)).toBe('string');
    });
  });

  describe('isToday', () => {
    test('isToday identifies today correctly', () => {
      // Today should return true
      const today = new Date();
      expect(isToday(today)).toBe(true);
      
      // A date from the past should not be today
      const pastDate = new Date('2000-01-01');
      expect(isToday(pastDate)).toBe(false);
      
      // A date in the future should not be today
      const futureDate = new Date('2050-01-01');
      expect(isToday(futureDate)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    test('isYesterday works correctly', () => {
      // Today should not be yesterday
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
      
      // A date far in the past should not be yesterday
      const pastDate = new Date('2000-01-01');
      expect(isYesterday(pastDate)).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    test('getDaysBetween calculates differences correctly', () => {
      // Same day should be 0 days
      const today = new Date();
      const todayCopy = new Date(today);
      expect(getDaysBetween(today, todayCopy)).toBe(0);
      
      // Fixed dates with known differences
      const date1 = new Date('2023-01-01T12:00:00Z');
      const date2 = new Date('2023-01-05T12:00:00Z');
      expect(getDaysBetween(date1, date2)).toBe(4);
      
      // Order shouldn't matter
      expect(getDaysBetween(date2, date1)).toBe(4);
    });
  });

  describe('getTimeDifference', () => {
    test('getTimeDifference returns correct format for different time spans', () => {
      // Test with a fixed time difference
      const baseDate = new Date();
      const futureDate = new Date(baseDate.getTime() + 30 * 1000); // 30 seconds later
      
      const result = getTimeDifference(baseDate, futureDate);
      expect(result).toContain('second');
      
      // Minutes difference
      const twoMinutesLater = new Date(baseDate.getTime() + 2 * 60 * 1000);
      const minutesResult = getTimeDifference(baseDate, twoMinutesLater);
      expect(minutesResult).toContain('minute');
      
      // Hours difference
      const twoHoursLater = new Date(baseDate.getTime() + 2 * 60 * 60 * 1000);
      const hoursResult = getTimeDifference(baseDate, twoHoursLater);
      expect(hoursResult).toContain('hour');
    });
  });

  describe('getRelativeTimeString', () => {
    test('getRelativeTimeString formats time correctly', () => {
      // Test that the function returns a string
      const now = new Date();
      const result = getRelativeTimeString(now);
      expect(typeof result).toBe('string');
      expect(result).toBe('just now');
      
      // Test that a past date returns a string with "ago"
      const pastDate = new Date('2000-01-01');
      const pastResult = getRelativeTimeString(pastDate);
      expect(pastResult).toContain('ago');
    });
  });

  describe('formatRelativeTime', () => {
    test('formatRelativeTime formats correctly', () => {
      // Present or very recent time should not contain a direction indicator
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(typeof result).toBe('string');
      
      // Future time should start with "in"
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day in future
      const futureResult = formatRelativeTime(futureDate);
      expect(futureResult.startsWith('in ')).toBe(true);
      
      // Past time should end with "ago"
      const pastDate = new Date('2000-01-01');
      const pastResult = formatRelativeTime(pastDate);
      expect(pastResult.endsWith('ago')).toBe(true);
    });
  });
}); 
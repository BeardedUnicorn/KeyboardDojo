/**
 * Date and Time Utilities
 *
 * Provides a comprehensive set of utilities for working with dates and times.
 */

// ===== Duration Formatting =====

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "2h 30m" or "45m")
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  }

  return `${minutes}m`;
};

/**
 * Format milliseconds into a human-readable time string (e.g., "2h 30m" or "5m 30s")
 * @param milliseconds Time in milliseconds
 * @returns Formatted time string
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) {
    return '0s';
  }

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 && hours === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
};

/**
 * Formats seconds to a time string (MM:SS)
 * @param seconds Total seconds
 * @returns Formatted time string (e.g., "02:45")
 */
export const formatSecondsToTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ===== Date Formatting =====

/**
 * Formats a date to a human-readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format a date to include time
 * @param date Date to format
 * @returns Formatted date and time string (e.g., "Jan 1, 2023, 3:45 PM")
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Returns the day name for a given date
 * @param date - Date object or date string
 * @param short - Whether to return the short day name
 * @returns Day name (e.g., "Monday" or "Mon")
 */
export const getDayName = (
  date: Date | string | number,
  short: boolean = false,
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return dateObj.toLocaleDateString('en-US', {
    weekday: short ? 'short' : 'long',
  });
};

/**
 * Returns the month name for a given date
 * @param date - Date object or date string
 * @param short - Whether to return the short month name
 * @returns Month name (e.g., "January" or "Jan")
 */
export const getMonthName = (
  date: Date | string | number,
  short: boolean = false,
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return dateObj.toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
  });
};

// ===== Date Comparison =====

/**
 * Check if a date is today
 * @param date Date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param date Date to check
 * @returns Whether the date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

// ===== Time Differences =====

/**
 * Get the difference in days between two dates
 * @param date1 First date
 * @param date2 Second date (defaults to current date)
 * @returns Number of days between the dates
 */
export const getDaysBetween = (
  date1: Date | string | number,
  date2: Date | string | number = new Date(),
): number => {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;

  // Reset time part for accurate day calculation
  const date1UTC = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2UTC = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  // Calculate day difference
  return Math.abs(Math.floor((date2UTC - date1UTC) / (1000 * 60 * 60 * 24)));
};

/**
 * Calculate time difference between two dates in a human-readable format
 * @param date1 First date
 * @param date2 Second date (defaults to now)
 * @returns Human-readable time difference
 */
export const getTimeDifference = (
  date1: Date | string | number,
  date2: Date | string | number = new Date(),
): string => {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;

  const diffInSeconds = Math.abs(Math.floor((d2.getTime() - d1.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''}`;
};

/**
 * Calculates the time difference between two dates in milliseconds
 * @param startDate Start date
 * @param endDate End date
 * @returns Time difference in milliseconds
 */
export const getTimeDifferenceMs = (
  startDate: Date | string | number,
  endDate: Date | string | number,
): number => {
  const start = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  const end = typeof endDate === 'string' || typeof endDate === 'number'
    ? new Date(endDate)
    : endDate;

  return end.getTime() - start.getTime();
};

// ===== Relative Time =====

/**
 * Returns a relative time string (e.g., "2 days ago", "just now")
 * @param date - Date to format
 * @returns Relative time string
 */
export const getRelativeTimeString = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format a date relative to now (e.g. "2 days ago", "in 3 hours")
 * @param date Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const isFuture = diffInMs > 0;

  const diffString = getTimeDifference(dateObj, now);

  return isFuture ? `in ${diffString}` : `${diffString} ago`;
};

/**
 * Format Utilities
 * 
 * This module provides utility functions for formatting various types of data
 * consistently across the application.
 */

/**
 * Format a number with commas as thousands separators
 * 
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Format a number as currency
 * 
 * @param value The number to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a number as a compact representation (e.g., 1.2K, 5.3M)
 * 
 * @param value The number to format
 * @returns Compact number representation
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a percentage value
 * 
 * @param value The decimal value (0-1)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format milliseconds as a time string (MM:SS)
 * 
 * @param milliseconds The time in milliseconds
 * @returns Formatted time string
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds <= 0) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format a date as a string
 * 
 * @param date The date to format
 * @param format The format to use ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
  };
  
  if (format === 'full') {
    options.weekday = 'long';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format a date and time as a string
 * 
 * @param date The date to format
 * @param format The format to use ('short', 'medium', 'long', 'full')
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  
  if (format === 'full' || format === 'long') {
    options.second = 'numeric';
  }
  
  if (format === 'full') {
    options.weekday = 'long';
  }
  
  return dateObj.toLocaleString('en-US', options);
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 * 
 * @param date The date to format
 * @param relativeTo The date to compare to (default: now)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string, relativeTo: Date = new Date()): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffInMs = dateObj.getTime() - relativeTo.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  
  if (Math.abs(diffInSecs) < 60) {
    return rtf.format(diffInSecs, 'second');
  } else if (Math.abs(diffInMins) < 60) {
    return rtf.format(diffInMins, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else {
    // For longer periods, use a standard date format
    return formatDate(dateObj);
  }
}

/**
 * Format a time duration in a human-readable way
 * 
 * @param milliseconds The duration in milliseconds
 * @param includeSeconds Whether to include seconds
 * @returns Formatted duration string
 */
export function formatDuration(milliseconds: number, includeSeconds: boolean = true): string {
  if (milliseconds <= 0) return includeSeconds ? '0 seconds' : '0 minutes';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  if (remainingHours > 0) {
    parts.push(`${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`);
  }
  
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`);
  }
  
  if (includeSeconds && remainingSeconds > 0) {
    parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`);
  }
  
  if (parts.length === 0) {
    return includeSeconds ? '0 seconds' : '0 minutes';
  }
  
  return parts.join(', ');
}

/**
 * Format a file size in a human-readable way
 * 
 * @param bytes The file size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
} 

import { format, parseISO, isValid } from 'date-fns';

/**
 * Format currency amount with proper locale and currency symbol
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if currency is not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format date to readable string
 */
export const formatDate = (
  date: Date | string,
  dateFormat: string = 'MMM dd, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    return format(dateObj, dateFormat);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: Date | string,
  dateFormat: string = 'MMM dd, yyyy HH:mm'
): string => {
  return formatDate(date, dateFormat);
};

/**
 * Format relative date (e.g., "2 days ago")
 */
export const formatRelativeDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (
  num: number,
  locale: string = 'en-US',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  } catch (error) {
    return num.toString();
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  locale: string = 'en-US',
  minimumFractionDigits: number = 1,
  maximumFractionDigits: number = 2
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value / 100);
  } catch (error) {
    return `${value.toFixed(2)}%`;
  }
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(2)} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format status with proper capitalization
 */
export const formatStatus = (status: string): string => {
  return capitalizeWords(status.replace(/[_-]/g, ' '));
};
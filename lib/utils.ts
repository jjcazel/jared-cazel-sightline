import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into YYYY-MM-DD format
 */
export const formatDateWithoutTime = (date: Date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Creates a Date object without time components (set to midnight in local time)
 */
export const createDateWithoutTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Formats a date range with preset label
 */
export const formatDateRangeWithPreset = (
  startDate: Date,
  endDate: Date,
  presetLabel?: string | null
): string => {
  const formattedStartDate = format(startDate, 'MMM d, yyyy');
  const formattedEndDate = format(endDate, 'MMM d, yyyy');

  const isSingleDate =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  let result: string;

  if (isSingleDate) {
    result = formattedStartDate;
  } else {
    result = `${formattedStartDate} - ${formattedEndDate}`;
  }

  if (presetLabel) {
    result += ` (${presetLabel})`;
  }

  return result;
};


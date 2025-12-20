// Date Utilities
import { format, formatDistance, formatRelative, isToday, isYesterday, isPast, isFuture, addDays, subDays, startOfDay, endOfDay } from 'date-fns';

export const dateUtils = {
    /**
     * Format date to readable string
     */
    format(date: Date | string, formatStr: string = 'PPP'): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, formatStr);
    },

    /**
     * Format date to relative time (e.g., "2 hours ago")
     */
    formatRelative(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatDistance(dateObj, new Date(), { addSuffix: true });
    },

    /**
     * Format date relative to now (e.g., "today at 3:00 PM")
     */
    formatRelativeToNow(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatRelative(dateObj, new Date());
    },

    /**
     * Check if date is today
     */
    isToday(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return isToday(dateObj);
    },

    /**
     * Check if date is yesterday
     */
    isYesterday(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return isYesterday(dateObj);
    },

    /**
     * Check if date is in the past
     */
    isPast(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return isPast(dateObj);
    },

    /**
     * Check if date is in the future
     */
    isFuture(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return isFuture(dateObj);
    },

    /**
     * Add days to date
     */
    addDays(date: Date | string, days: number): Date {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return addDays(dateObj, days);
    },

    /**
     * Subtract days from date
     */
    subDays(date: Date | string, days: number): Date {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return subDays(dateObj, days);
    },

    /**
     * Get start of day
     */
    startOfDay(date: Date | string): Date {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return startOfDay(dateObj);
    },

    /**
     * Get end of day
     */
    endOfDay(date: Date | string): Date {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return endOfDay(dateObj);
    },

    /**
     * Format date for input field (YYYY-MM-DD)
     */
    formatForInput(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'yyyy-MM-dd');
    },

    /**
     * Format time (HH:mm)
     */
    formatTime(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'HH:mm');
    },

    /**
     * Format date and time
     */
    formatDateTime(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'PPP p');
    },
};

export default dateUtils;

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

    /**
     * Convert datetime-local format (YYYY-MM-DDTHH:mm) to ISO datetime string
     * Handles both datetime-local format and full ISO strings
     */
    convertToISODatetime(dateTimeString: string | null | undefined): string | null {
        if (!dateTimeString || dateTimeString.trim() === '') {
            return null;
        }

        // If it's already a valid ISO datetime string, return as is
        if (dateTimeString.includes('Z') || dateTimeString.includes('+') || dateTimeString.includes('-', 10)) {
            // Check if it's a valid ISO string (has timezone info or is already ISO format)
            try {
                const date = new Date(dateTimeString);
                if (!isNaN(date.getTime())) {
                    return date.toISOString();
                }
            } catch {
                // Fall through to datetime-local conversion
            }
        }

        // Handle datetime-local format (YYYY-MM-DDTHH:mm)
        // This format doesn't include timezone, so we treat it as local time
        const localDate = new Date(dateTimeString);
        
        if (isNaN(localDate.getTime())) {
            throw new Error(`Invalid datetime format: ${dateTimeString}`);
        }

        // Convert to ISO string (UTC)
        return localDate.toISOString();
    },

    /**
     * Format ISO datetime or Date object to datetime-local format (YYYY-MM-DDTHH:mm) for input fields
     */
    formatForDateTimeLocal(dateInput: string | Date | null | undefined): string {
        if (!dateInput) return '';
        
        try {
            const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
            if (isNaN(date.getTime())) return '';
            
            // Get local date/time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
            return '';
        }
    },
};

export default dateUtils;

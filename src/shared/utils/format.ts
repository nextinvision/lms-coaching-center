// Format Utilities
export const formatUtils = {
    /**
     * Format file size
     */
    fileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Format number with commas
     */
    number(num: number): string {
        return num.toLocaleString();
    },

    /**
     * Format percentage
     */
    percentage(value: number, total: number, decimals: number = 1): string {
        if (total === 0) return '0%';
        const percentage = (value / total) * 100;
        return percentage.toFixed(decimals) + '%';
    },

    /**
     * Format phone number
     */
    phone(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },

    /**
     * Truncate text
     */
    truncate(text: string, length: number): string {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    /**
     * Capitalize first letter
     */
    capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    /**
     * Title case
     */
    titleCase(text: string): string {
        return text
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Format currency
     */
    currency(amount: number, currency: string = 'INR'): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
        }).format(amount);
    },

    /**
     * Format duration (minutes to HH:MM)
     */
    duration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    },

    /**
     * Pluralize word
     */
    pluralize(count: number, singular: string, plural?: string): string {
        if (count === 1) return `${count} ${singular}`;
        return `${count} ${plural || singular + 's'}`;
    },
};

export default formatUtils;

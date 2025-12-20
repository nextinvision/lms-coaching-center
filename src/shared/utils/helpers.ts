// Helper Utilities
export const helpers = {
    /**
     * Sleep/delay function
     */
    sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /**
     * Generate random ID
     */
    generateId(length: number = 8): string {
        return Math.random().toString(36).substring(2, 2 + length);
    },

    /**
     * Deep clone object
     */
    deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if object is empty
     */
    isEmpty(obj: any): boolean {
        if (obj === null || obj === undefined) return true;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    },

    /**
     * Remove duplicates from array
     */
    unique<T>(array: T[]): T[] {
        return [...new Set(array)];
    },

    /**
     * Group array by key
     */
    groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
        return array.reduce((result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {} as Record<string, T[]>);
    },

    /**
     * Sort array by key
     */
    sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },

    /**
     * Debounce function
     */
    debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    /**
     * Throttle function
     */
    throttle<T extends (...args: any[]) => any>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Copy to clipboard
     */
    async copyToClipboard(text: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    },

    /**
     * Download file
     */
    downloadFile(url: string, filename: string): void {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Get initials from name
     */
    getInitials(name: string): string {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    /**
     * Generate random color
     */
    randomColor(): string {
        const colors = [
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // yellow
            '#EF4444', // red
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#06B6D4', // cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Check if mobile device
     */
    isMobile(): boolean {
        if (typeof window === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    },
};

export default helpers;

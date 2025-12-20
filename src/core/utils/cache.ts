// Caching Utilities
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private maxSize: number = 1000;

    set<T>(key: string, data: T, ttl: number = 60000): void {
        // Clean up if cache is too large
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    private cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        this.cache.forEach((entry, key) => {
            if (now - entry.timestamp > entry.ttl) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach((key) => this.cache.delete(key));

        // If still too large, remove oldest entries
        if (this.cache.size >= this.maxSize) {
            const sortedEntries = Array.from(this.cache.entries()).sort(
                (a, b) => a[1].timestamp - b[1].timestamp
            );
            const toRemove = sortedEntries.slice(0, Math.floor(this.maxSize * 0.1));
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
    }

    size(): number {
        return this.cache.size;
    }
}

export const memoryCache = new MemoryCache();

/**
 * Cache decorator for functions
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: {
        ttl?: number;
        keyGenerator?: (...args: Parameters<T>) => string;
    } = {}
): T {
    const { ttl = 60000, keyGenerator } = options;

    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        const key = keyGenerator
            ? keyGenerator(...args)
            : `cache:${fn.name}:${JSON.stringify(args)}`;

        const cached = memoryCache.get<ReturnType<T>>(key);
        if (cached !== null) {
            return cached;
        }

        const result = await fn(...args);
        memoryCache.set(key, result, ttl);

        return result;
    }) as T;
}

/**
 * Generate cache key
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
}


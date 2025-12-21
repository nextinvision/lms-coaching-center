// Request-level caching for authentication
// Uses in-memory cache with very short TTL to cache auth verification within the same request cycle

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

// Simple in-memory cache with automatic cleanup
class AuthCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private readonly TTL = 2000; // 2 seconds - very short to cache within same request cycle

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }
        
        // Check if expired
        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.data as T;
    }

    set<T>(key: string, value: T): void {
        // Limit cache size to prevent memory leaks
        if (this.cache.size > 100) {
            // Remove oldest entries
            const entries = Array.from(this.cache.entries()).sort(
                (a, b) => a[1].timestamp - b[1].timestamp
            );
            entries.slice(0, 20).forEach(([key]) => this.cache.delete(key));
        }
        
        this.cache.set(key, {
            data: value,
            timestamp: Date.now(),
        });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

// Global auth cache instance
const authCache = new AuthCache();

/**
 * Get cached auth user
 */
export function getRequestCache<T>(key: string): T | null {
    return authCache.get<T>(key);
}

/**
 * Set cached auth user
 */
export function setRequestCache<T>(key: string, value: T): void {
    authCache.set(key, value);
}

/**
 * Clear auth cache (useful for logout)
 */
export function clearRequestCache(): void {
    authCache.clear();
}

/**
 * Delete specific cache entry
 */
export function deleteRequestCache(key: string): void {
    authCache.delete(key);
}


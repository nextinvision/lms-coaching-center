// Global Request Deduplication System
// Prevents multiple identical API calls from being made simultaneously

interface PendingRequest<T> {
    promise: Promise<T>;
    timestamp: number;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class RequestDeduplication {
    private pendingRequests = new Map<string, PendingRequest<unknown>>();
    private cache = new Map<string, CacheEntry<unknown>>();
    private readonly DEFAULT_TTL = 30000; // 30 seconds default cache

    /**
     * Execute a request with deduplication and caching
     * If the same request is already pending, returns the existing promise
     * If the request is cached and still valid, returns cached data immediately
     */
    async execute<T>(
        key: string,
        requestFn: () => Promise<T>,
        options?: { ttl?: number; skipCache?: boolean }
    ): Promise<T> {
        const { ttl = this.DEFAULT_TTL, skipCache = false } = options || {};

        // Check cache first (unless skipCache is true)
        if (!skipCache) {
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < cached.ttl) {
                return cached.data as T;
            }
        }

        // Check if request is already pending
        const pending = this.pendingRequests.get(key);
        if (pending) {
            // Return existing promise if it's recent (within 5 seconds)
            if (Date.now() - pending.timestamp < 5000) {
                return pending.promise as Promise<T>;
            }
            // Otherwise, remove stale pending request
            this.pendingRequests.delete(key);
        }

        // Create new request
        const promise = requestFn()
            .then((data) => {
                // Cache the result
                this.cache.set(key, {
                    data,
                    timestamp: Date.now(),
                    ttl,
                });

                // Remove from pending
                this.pendingRequests.delete(key);

                return data;
            })
            .catch((error) => {
                // Remove from pending on error
                this.pendingRequests.delete(key);
                throw error;
            });

        // Store pending request
        this.pendingRequests.set(key, {
            promise,
            timestamp: Date.now(),
        });

        return promise;
    }

    /**
     * Invalidate cache for a specific key or pattern
     */
    invalidate(keyOrPattern: string | RegExp): void {
        if (typeof keyOrPattern === 'string') {
            this.cache.delete(keyOrPattern);
            this.pendingRequests.delete(keyOrPattern);
        } else {
            // Pattern matching
            for (const key of this.cache.keys()) {
                if (keyOrPattern.test(key)) {
                    this.cache.delete(key);
                    this.pendingRequests.delete(key);
                }
            }
        }
    }

    /**
     * Clear all cache and pending requests
     */
    clear(): void {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            cached: this.cache.size,
            pending: this.pendingRequests.size,
        };
    }
}

// Singleton instance
export const requestDeduplication = new RequestDeduplication();

/**
 * Create a deduplicated fetch function
 */
export async function deduplicatedFetch<T>(
    url: string,
    options?: RequestInit & { ttl?: number; skipCache?: boolean }
): Promise<T> {
    const { ttl, skipCache, ...fetchOptions } = options || {};

    // Create a stable key from URL and options
    const key = `${url}::${JSON.stringify(fetchOptions)}`;

    return requestDeduplication.execute(
        key,
        async () => {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json() as Promise<T>;
        },
        { ttl, skipCache }
    );
}


// Cache Utilities Tests
import { memoryCache, cached, generateCacheKey } from '@/core/utils/cache';

describe('Cache Utilities', () => {
    beforeEach(() => {
        memoryCache.clear();
    });

    describe('memoryCache', () => {
        it('should set and get values', () => {
            memoryCache.set('test-key', 'test-value', 60000);
            const value = memoryCache.get('test-key');

            expect(value).toBe('test-value');
        });

        it('should return null for non-existent key', () => {
            const value = memoryCache.get('non-existent');

            expect(value).toBeNull();
        });

        it('should expire values after TTL', async () => {
            memoryCache.set('test-key', 'test-value', 100); // 100ms TTL

            await new Promise((resolve) => setTimeout(resolve, 150));

            const value = memoryCache.get('test-key');
            expect(value).toBeNull();
        });

        it('should check if key exists', () => {
            memoryCache.set('test-key', 'test-value', 60000);

            expect(memoryCache.has('test-key')).toBe(true);
            expect(memoryCache.has('non-existent')).toBe(false);
        });

        it('should delete values', () => {
            memoryCache.set('test-key', 'test-value', 60000);
            memoryCache.delete('test-key');

            expect(memoryCache.has('test-key')).toBe(false);
        });

        it('should clear all values', () => {
            memoryCache.set('key1', 'value1', 60000);
            memoryCache.set('key2', 'value2', 60000);
            memoryCache.clear();

            expect(memoryCache.size()).toBe(0);
        });
    });

    describe('cached decorator', () => {
        it('should cache function results', async () => {
            const mockFn = jest.fn(async () => 'result');
            const cachedFn = cached(mockFn, { ttl: 60000 });

            const result1 = await cachedFn('arg1');
            const result2 = await cachedFn('arg1');

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(result1).toBe('result');
            expect(result2).toBe('result');
        });

        it('should call function again for different arguments', async () => {
            const mockFn = jest.fn(async (arg) => `result-${arg}`);
            const cachedFn = cached(mockFn, { ttl: 60000 });

            await cachedFn('arg1');
            await cachedFn('arg2');

            expect(mockFn).toHaveBeenCalledTimes(2);
        });
    });

    describe('generateCacheKey', () => {
        it('should generate cache key from prefix and parts', () => {
            const key = generateCacheKey('user', '123', 'profile');

            expect(key).toBe('user:123:profile');
        });
    });
});


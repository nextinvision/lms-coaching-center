// Rate Limiter Tests
import { RateLimiter, apiRateLimiter } from '@/core/middleware/rateLimiter';

// Mock NextRequest
class MockNextRequest {
    url: string;
    headers: Map<string, string>;

    constructor(url: string) {
        this.url = url;
        this.headers = new Map();
        this.headers.set('x-forwarded-for', '127.0.0.1');
    }
    getHeader(name: string) {
        return this.headers.get(name) || null;
    }
}

describe('RateLimiter', () => {
    let limiter: any;

    beforeEach(() => {
        // Create a new instance for each test
        limiter = Object.create(Object.getPrototypeOf(apiRateLimiter));
        Object.assign(limiter, {
            store: {},
            options: {
                windowMs: 1000,
                maxRequests: 5,
                message: 'Too many requests',
            },
        });
        
        // Copy methods
        limiter.getKey = apiRateLimiter['getKey'].bind(limiter);
        limiter.check = apiRateLimiter['check'].bind(limiter);
    });

    it('should allow requests within limit', () => {
        const request = new MockNextRequest('http://localhost:3000/api/test') as any;

        for (let i = 0; i < 5; i++) {
            const result = limiter.check(request);
            expect(result.allowed).toBe(true);
        }
    });

    it('should block requests exceeding limit', () => {
        const request = new MockNextRequest('http://localhost:3000/api/test') as any;

        // Make 5 requests (limit)
        for (let i = 0; i < 5; i++) {
            limiter.check(request);
        }

        // 6th request should be blocked
        const result = limiter.check(request);
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
        const request = new MockNextRequest('http://localhost:3000/api/test') as any;

        // Exceed limit
        for (let i = 0; i < 6; i++) {
            limiter.check(request);
        }

        // Wait for window to expire
        await new Promise((resolve) => setTimeout(resolve, 1100));

        // Should allow again
        const result = limiter.check(request);
        expect(result.allowed).toBe(true);
    });
});


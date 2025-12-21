// Rate Limiting Middleware
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

class RateLimiter {
    private store: RateLimitStore = {};
    private options: Required<RateLimitOptions>;

    constructor(options: RateLimitOptions) {
        this.options = {
            windowMs: options.windowMs,
            maxRequests: options.maxRequests,
            message: options.message || 'Too many requests, please try again later.',
            skipSuccessfulRequests: options.skipSuccessfulRequests || false,
            skipFailedRequests: options.skipFailedRequests || false,
        };

        // Clean up expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    private getKey(request: NextRequest): string {
        // Use IP address as the key
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
        return ip;
    }

    private cleanup() {
        const now = Date.now();
        Object.keys(this.store).forEach((key) => {
            if (this.store[key].resetTime < now) {
                delete this.store[key];
            }
        });
    }

    check(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
        const key = this.getKey(request);
        const now = Date.now();

        if (!this.store[key] || this.store[key].resetTime < now) {
            // Create new entry
            this.store[key] = {
                count: 1,
                resetTime: now + this.options.windowMs,
            };
            return {
                allowed: true,
                remaining: this.options.maxRequests - 1,
                resetTime: this.store[key].resetTime,
            };
        }

        // Increment count
        this.store[key].count++;

        if (this.store[key].count > this.options.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: this.store[key].resetTime,
            };
        }

        return {
            allowed: true,
            remaining: this.options.maxRequests - this.store[key].count,
            resetTime: this.store[key].resetTime,
        };
    }
}

// Create rate limiters for different endpoints
export const authRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
    message: 'Too many login attempts. Please try again later.',
});

export const apiRateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many API requests. Please slow down.',
});

export const uploadRateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    message: 'Too many file uploads. Please try again later.',
});

/**
 * Rate limiting middleware function
 */
export function rateLimit(
    limiter: RateLimiter,
    request: NextRequest
): NextResponse | null {
    const result = limiter.check(request);

    if (!result.allowed) {
        const response = NextResponse.json(
            {
                success: false,
                error: limiter['options'].message || 'Too many requests',
            },
            { status: 429 }
        );

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', String(limiter['options'].maxRequests));
        response.headers.set('X-RateLimit-Remaining', String(result.remaining));
        response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

        return response;
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(limiter['options'].maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

    return null; // Continue with request
}


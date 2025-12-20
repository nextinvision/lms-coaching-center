// API Route Wrapper with Security
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, authRateLimiter, apiRateLimiter, uploadRateLimiter } from '@/core/middleware/rateLimiter';
import { csrfProtection, setCsrfToken } from '@/core/middleware/csrf';
import { errorLogger } from '@/core/utils/errorLogger';
import { ApiError, handleApiError, createErrorResponse } from './errorHandler';
import { sanitizeObject } from '@/core/utils/sanitize';

export interface ApiHandlerOptions {
    requireAuth?: boolean;
    requireCsrf?: boolean;
    rateLimiter?: typeof apiRateLimiter;
    methods?: string[];
    sanitizeInput?: boolean;
}

export type ApiHandler = (
    request: NextRequest,
    context?: { params?: Promise<any> }
) => Promise<NextResponse<unknown>>;

/**
 * Wrapper for API routes with security features
 */
export function createApiHandler(
    handler: ApiHandler,
    options: ApiHandlerOptions = {}
): (request: NextRequest, context?: { params?: Promise<any> }) => Promise<NextResponse<unknown>> {
    const {
        requireAuth = true,
        requireCsrf = true,
        rateLimiter = apiRateLimiter,
        methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        sanitizeInput = true,
    } = options;

    return async (request: NextRequest, context?: { params?: Promise<any> }) => {
        try {
            // Check HTTP method
            if (!methods.includes(request.method)) {
                return NextResponse.json(
                    { success: false, error: `Method ${request.method} not allowed` },
                    { status: 405 }
                );
            }

            // Apply rate limiting
            const rateLimitResponse = rateLimit(rateLimiter, request);
            if (rateLimitResponse) {
                return rateLimitResponse;
            }

            // CSRF protection for state-changing methods
            if (requireCsrf && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
                const csrfResponse = csrfProtection(request);
                if (csrfResponse) {
                    errorLogger.warn('CSRF protection failed', { url: request.url }, request);
                    return csrfResponse;
                }
            }

            // Set CSRF token in response for GET requests
            if (request.method === 'GET') {
                const response = await handler(request, context);
                return setCsrfToken(response);
            }

            // Sanitize request body if needed
            if (sanitizeInput && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
                try {
                    const body = await request.json();
                    const sanitized = sanitizeObject(body);
                    // Create new request with sanitized body
                    const sanitizedRequest = new NextRequest(request.url, {
                        method: request.method,
                        headers: request.headers,
                        body: JSON.stringify(sanitized),
                    });
                    return await handler(sanitizedRequest, context);
                } catch {
                    // If body parsing fails, continue with original request
                    return await handler(request, context);
                }
            }

            return await handler(request, context);
        } catch (error) {
            const apiError = handleApiError(error);
            
            // Log error
            errorLogger.error(
                `API Error: ${apiError.message}`,
                error instanceof Error ? error : undefined,
                {
                    url: request.url,
                    method: request.method,
                    statusCode: apiError.statusCode,
                },
                request
            );

            return createErrorResponse(apiError);
        }
    };
}

/**
 * Helper for auth endpoints (with stricter rate limiting)
 */
export function createAuthHandler(handler: ApiHandler): ApiHandler {
    return createApiHandler(handler, {
        requireAuth: false, // Auth endpoints don't require auth
        requireCsrf: false, // Auth endpoints might not need CSRF
        rateLimiter: authRateLimiter,
    });
}

/**
 * Helper for upload endpoints
 */
export function createUploadHandler(handler: ApiHandler): ApiHandler {
    return createApiHandler(handler, {
        requireCsrf: true,
        rateLimiter: uploadRateLimiter,
        sanitizeInput: false, // Don't sanitize file uploads
    });
}


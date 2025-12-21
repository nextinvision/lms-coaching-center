// CSRF Protection Middleware
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

// CSRF_SECRET uses JWT_SECRET as fallback, but JWT_SECRET is required
// Get secrets lazily to avoid errors on public routes
function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file and restart the server.');
    }
    return secret;
}

function getCsrfSecret(): string {
    return process.env.CSRF_SECRET || getJwtSecret();
}
const CSRF_TOKEN_HEADER = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Create CSRF token hash
 */
export function createCsrfTokenHash(token: string): string {
    return createHmac('sha256', getCsrfSecret()).update(token).digest('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, hash: string): boolean {
    const expectedHash = createCsrfTokenHash(token);
    return hash === expectedHash;
}

/**
 * CSRF protection middleware
 * Only applies to state-changing methods (POST, PUT, PATCH, DELETE)
 */
export function csrfProtection(request: NextRequest): NextResponse | null {
    const method = request.method;
    
    // Only protect state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return null; // Continue
    }

    // Skip CSRF for certain endpoints (like webhooks)
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/webhooks/')) {
        return null; // Continue
    }

    // Get token from header
    const tokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER);
    
    // Get token from cookie
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const cookieHash = request.cookies.get(`${CSRF_COOKIE_NAME}-hash`)?.value;

    if (!tokenFromHeader || !cookieToken || !cookieHash) {
        return NextResponse.json(
            {
                success: false,
                error: 'CSRF token missing',
            },
            { status: 403 }
        );
    }

    // Verify token matches cookie
    if (tokenFromHeader !== cookieToken) {
        return NextResponse.json(
            {
                success: false,
                error: 'CSRF token mismatch',
            },
            { status: 403 }
        );
    }

    // Verify hash
    if (!verifyCsrfToken(cookieToken, cookieHash)) {
        return NextResponse.json(
            {
                success: false,
                error: 'Invalid CSRF token',
            },
            { status: 403 }
        );
    }

    return null; // Continue
}

/**
 * Set CSRF token in response cookies
 */
export function setCsrfToken(response: NextResponse): NextResponse {
    const token = generateCsrfToken();
    const hash = createCsrfTokenHash(token);

    // Set cookies
    response.cookies.set(CSRF_COOKIE_NAME, token, {
        httpOnly: false, // Must be accessible to JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    response.cookies.set(`${CSRF_COOKIE_NAME}-hash`, hash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return response;
}

/**
 * Get CSRF token for client-side use
 */
export function getCsrfToken(request: NextRequest): string | null {
    return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}


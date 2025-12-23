import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define role-based dashboard routes
const DASHBOARD_ROUTES: Record<string, string> = {
    STUDENT: '/student/dashboard',
    TEACHER: '/teacher/dashboard',
    ADMIN: '/admin/dashboard',
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/language-select'];

// Auth routes that authenticated users shouldn't access
const AUTH_ROUTES = ['/login', '/language-select'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Skip middleware for API routes, static files, and Next.js internals
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // If no token, allow access to public routes, redirect others to login
    if (!token) {
        if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/(auth)')) {
            return NextResponse.next();
        }

        // Redirect to login for protected routes
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Verify and decode token
    let userRole: string | null = null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
        const { payload } = await jwtVerify(token, secret);
        userRole = payload.role as string;
    } catch (error) {
        // Invalid token, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }

    // If authenticated user tries to access auth routes (login, etc), redirect to dashboard
    if (AUTH_ROUTES.includes(pathname) && userRole) {
        const dashboardUrl = new URL(DASHBOARD_ROUTES[userRole] || '/student/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // If authenticated user visits homepage, redirect to dashboard
    if (pathname === '/' && userRole) {
        const dashboardUrl = new URL(DASHBOARD_ROUTES[userRole] || '/student/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // Allow access to all other routes
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};

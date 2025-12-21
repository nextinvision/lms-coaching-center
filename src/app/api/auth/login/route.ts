// Login API Route
import { NextResponse } from 'next/server';
import { authService, loginSchema } from '@/modules/auth';
import { z } from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const credentials = loginSchema.parse(body);

        const result = await authService.login(credentials);

        // Determine redirect URL based on user role
        let redirectUrl = '/';
        switch (result.user.role) {
            case 'STUDENT':
                redirectUrl = '/student/dashboard';
                break;
            case 'TEACHER':
                redirectUrl = '/teacher/dashboard';
                break;
            case 'ADMIN':
                redirectUrl = '/admin/dashboard';
                break;
            default:
                redirectUrl = '/';
        }

        // Get the origin from request to build absolute URL for redirect
        const origin = request.headers.get('origin') || 
                      request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
                      `https://${request.headers.get('host') || 'localhost:3000'}`;
        
        const absoluteRedirectUrl = redirectUrl.startsWith('http') 
            ? redirectUrl 
            : `${origin}${redirectUrl}`;

        // Detect if we're in production by checking for HTTPS or production URL
        const isProduction = 
            process.env.NODE_ENV === 'production' || 
            process.env.VERCEL_ENV === 'production' ||
            (typeof request.headers.get('host') === 'string' && 
             !request.headers.get('host')?.includes('localhost'));

        // Create redirect response with cookie set
        const response = NextResponse.redirect(new URL(absoluteRedirectUrl), {
            status: 307, // Temporary redirect - preserves POST method if needed
        });

        // Set HTTP-only cookie with environment-agnostic configuration
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: isProduction, // Use HTTPS in production
            sameSite: 'lax', // Allows cookies to be sent on top-level navigations
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            // Don't set domain - let browser handle it automatically for cross-platform compatibility
        });

        return response;
    } catch (error) {
        // For errors, return JSON response (don't redirect)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0]?.message || 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 401 }
        );
    }
}

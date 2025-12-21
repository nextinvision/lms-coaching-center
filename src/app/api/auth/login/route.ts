// Login API Route
import { NextResponse } from 'next/server';
import { authService, loginSchema } from '@/modules/auth';
import { z } from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const credentials = loginSchema.parse(body);

        const result = await authService.login(credentials);

        const response = NextResponse.json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
                expiresAt: result.expiresAt,
            },
        });

        // Set HTTP-only cookie with environment-agnostic configuration
        // Detect if we're in production by checking for HTTPS or production URL
        const isProduction = 
            process.env.NODE_ENV === 'production' || 
            process.env.VERCEL_ENV === 'production' ||
            (typeof request.headers.get('host') === 'string' && 
             !request.headers.get('host')?.includes('localhost'));

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

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

        // Set HTTP-only cookie
        response.cookies.set('auth_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
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

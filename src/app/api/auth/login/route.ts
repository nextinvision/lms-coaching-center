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

                response.cookies.set('auth_token', result.token, {
                httpOnly: true,
                // Only set secure if in production AND effectively required, 
                // or simply rely on NODE_ENV if you ensure it is 'development' locally.
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
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

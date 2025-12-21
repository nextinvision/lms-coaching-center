// Logout API Route
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/modules/auth';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (token) {
            try {
                await authService.logout(token);
            } catch (error) {
                // If session doesn't exist, that's okay - just clear the cookie
                // This handles cases where session was already deleted or doesn't exist
                console.warn('Session not found during logout:', (error as Error).message);
            }
        }

        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });

        // Clear cookie with same configuration as login
        const isProduction = 
            process.env.NODE_ENV === 'production' || 
            process.env.VERCEL_ENV === 'production' ||
            (typeof request.headers.get('host') === 'string' && 
             !request.headers.get('host')?.includes('localhost'));

        response.cookies.set('auth_token', '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

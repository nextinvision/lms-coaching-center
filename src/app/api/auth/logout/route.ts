// Logout API Route
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/modules/auth';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (token) {
            await authService.logout(token);
        }

        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });

        // Clear cookie
        response.cookies.delete('auth_token');

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

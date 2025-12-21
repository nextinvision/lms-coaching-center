// Profile Settings API Route
import { NextResponse } from 'next/server';
import { authService } from '@/modules/auth';
import { settingsService } from '@/modules/settings';
import { updateProfileSchema } from '@/modules/settings';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { deleteRequestCache } from '@/core/utils/requestCache';

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = updateProfileSchema.parse(body);

        await settingsService.updateProfile(user.id, data);

        // Invalidate auth cache to force refresh on next request
        deleteRequestCache(`auth:user:${token}`);

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0]?.message || 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


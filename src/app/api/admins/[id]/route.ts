// Admin by ID API Route
import { NextResponse } from 'next/server';
import { adminService, updateAdminSchema } from '@/modules/admins';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const admin = await adminService.getById(id);

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: admin,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = updateAdminSchema.parse(body);

        const admin = await adminService.update(id, data);

        return NextResponse.json({
            success: true,
            data: admin,
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Prevent deleting yourself
        const admin = await adminService.getById(id);
        if (admin && admin.userId === user.id) {
            return NextResponse.json(
                { success: false, error: 'You cannot delete your own account' },
                { status: 400 }
            );
        }

        await adminService.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


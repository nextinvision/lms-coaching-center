// Remove Teacher from Batch API Route
import { NextResponse } from 'next/server';
import { batchService } from '@/modules/batches';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; teacherId: string }> }
) {
    try {
        const { id: batchId, teacherId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await batchService.removeTeacher(batchId, teacherId);

        return NextResponse.json({
            success: true,
            message: 'Teacher removed successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


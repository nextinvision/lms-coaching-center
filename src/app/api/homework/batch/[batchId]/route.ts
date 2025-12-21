// Homework by Batch API Route
import { NextResponse } from 'next/server';
import { homeworkService } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const assignments = await homeworkService.getByBatch(batchId);

        return NextResponse.json({
            success: true,
            data: assignments,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


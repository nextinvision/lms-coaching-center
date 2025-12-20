// Batch Attendance API Route
import { NextResponse } from 'next/server';
import { attendanceService } from '@/modules/attendance';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json(
                { success: false, error: 'Date parameter is required' },
                { status: 400 }
            );
        }

        const date = new Date(dateParam);
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const attendances = await attendanceService.getBatchAttendance(batchId, date);

        return NextResponse.json({
            success: true,
            data: attendances,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


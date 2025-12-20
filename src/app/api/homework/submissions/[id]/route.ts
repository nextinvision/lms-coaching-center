// Submission by ID API Route
import { NextResponse } from 'next/server';
import { submissionService } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

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
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const submission = await submissionService.getById(id);

        if (!submission) {
            return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
        }

        // Students can only view their own submissions
        if (user.role === 'STUDENT' && submission.student.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            data: submission,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


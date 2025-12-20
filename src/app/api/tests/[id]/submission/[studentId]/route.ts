// Get Test Submission API Route
import { NextResponse } from 'next/server';
import { testService } from '@/modules/tests';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; studentId: string }> }
) {
    try {
        const { id: testId, studentId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Students can only view their own submissions
        if (user.role === 'STUDENT') {
            const student = await prisma.student.findUnique({
                where: { userId: user.id },
            });

            if (student?.id !== studentId) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
            }
        }

        const submission = await testService.getSubmission(testId, studentId);

        if (!submission) {
            return NextResponse.json(
                { success: false, error: 'Submission not found' },
                { status: 404 }
            );
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


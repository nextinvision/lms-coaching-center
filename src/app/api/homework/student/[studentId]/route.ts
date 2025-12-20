// Student Submissions API Route
import { NextResponse } from 'next/server';
import { submissionService } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ studentId: string }> }
) {
    try {
        const { studentId } = await params;
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

        const submissions = await submissionService.getByStudent(studentId);

        return NextResponse.json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


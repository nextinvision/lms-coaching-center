// Check Submission API Route
import { NextResponse } from 'next/server';
import { submissionService, checkSubmissionSchema } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import prisma from '@/core/database/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'TEACHER') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Get teacher ID
        const teacher = await prisma.teacher.findUnique({
            where: { userId: user.id },
        });

        if (!teacher) {
            return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const data = checkSubmissionSchema.parse(body);

        const submission = await submissionService.checkSubmission(submissionId, teacher.id, data);

        return NextResponse.json({
            success: true,
            data: submission,
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


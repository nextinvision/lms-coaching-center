// Submit Test API Route
import { NextResponse } from 'next/server';
import { testService, submitTestSchema } from '@/modules/tests';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';
import { z } from 'zod';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: testId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user || user.role !== 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const student = await prisma.student.findUnique({
            where: { userId: user.id },
        });

        if (!student) {
            return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const data = submitTestSchema.parse(body);

        const submission = await testService.submitTest(testId, student.id, data);

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


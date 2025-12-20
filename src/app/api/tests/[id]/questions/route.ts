// Test Questions API Route
import { NextResponse } from 'next/server';
import { testService, createQuestionSchema } from '@/modules/tests';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
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
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = createQuestionSchema.parse(body);

        const question = await testService.addQuestion(testId, data);

        return NextResponse.json({
            success: true,
            data: question,
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


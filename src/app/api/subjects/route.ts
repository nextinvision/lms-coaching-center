// Subjects API Route
import { NextResponse } from 'next/server';
import { subjectService, createSubjectSchema } from '@/modules/subjects';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const batchId = searchParams.get('batchId') || undefined;
        const search = searchParams.get('search') || undefined;

        const subjects = await subjectService.getAll({ batchId, search });

        return NextResponse.json({
            success: true,
            data: subjects,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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
        const data = createSubjectSchema.parse(body);

        const subject = await subjectService.create(data);

        return NextResponse.json({
            success: true,
            data: subject,
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


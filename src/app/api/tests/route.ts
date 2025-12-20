// Tests API Route
import { NextResponse } from 'next/server';
import { testService, createTestSchema } from '@/modules/tests';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';
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
        const subjectId = searchParams.get('subjectId') || undefined;
        const type = searchParams.get('type') as 'PRACTICE' | 'WEEKLY' | 'MONTHLY' | undefined;
        const isActive = searchParams.get('isActive')
            ? searchParams.get('isActive') === 'true'
            : undefined;
        const search = searchParams.get('search') || undefined;

        const tests = await testService.getAll({ batchId, subjectId, type, isActive, search });

        return NextResponse.json({
            success: true,
            data: tests,
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
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const teacher = await prisma.teacher.findUnique({
            where: { userId: user.id },
        });

        if (!teacher) {
            return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const data = createTestSchema.parse(body);

        const test = await testService.create(
            {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
            teacher.id
        );

        return NextResponse.json({
            success: true,
            data: test,
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


// Homework API Route
import { NextResponse } from 'next/server';
import { homeworkService, createAssignmentSchema } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { parsePaginationQuery } from '@/shared/utils/pagination';

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
        const search = searchParams.get('search') || undefined;

        // Parse pagination
        const pagination = parsePaginationQuery({
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        const result = await homeworkService.getAll(
            {
                batchId,
                subjectId,
                search,
            },
            pagination
        );

        return NextResponse.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
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
        if (!user || user.role !== 'TEACHER') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = createAssignmentSchema.parse(body);

        // Get teacher ID from user profile
        const prisma = (await import('@/core/database/prisma')).default;
        const teacher = await prisma.teacher.findUnique({
            where: { userId: user.id },
        });

        if (!teacher) {
            return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
        }

        const assignment = await homeworkService.create(data, teacher.id);

        return NextResponse.json({
            success: true,
            data: assignment,
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


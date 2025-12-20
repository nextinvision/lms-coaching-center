// Content API Route
import { NextResponse } from 'next/server';
import { contentService, createContentSchema } from '@/modules/content';
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
        const chapterName = searchParams.get('chapterName') || undefined;
        const type = searchParams.get('type') as any;
        const language = searchParams.get('language') as any;
        const search = searchParams.get('search') || undefined;

        const content = await contentService.getAll({
            batchId,
            subjectId,
            chapterName,
            type,
            language,
            search,
        });

        return NextResponse.json({
            success: true,
            data: content,
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

        // Get teacher ID
        const teacher = await prisma.teacher.findUnique({
            where: { userId: user.id },
        });

        if (!teacher) {
            return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const data = createContentSchema.parse(body);

        const content = await contentService.create(data, teacher.id);

        return NextResponse.json({
            success: true,
            data: content,
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


// Test by ID API Route
import { NextResponse } from 'next/server';
import { testService, updateTestSchema } from '@/modules/tests';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const includeQuestions = searchParams.get('includeQuestions') !== 'false';

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const user = await authService.getCurrentUser(token);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const test = await testService.getById(id, includeQuestions);

        if (!test) {
            return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: test,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PATCH(
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
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = updateTestSchema.parse(body);

        const test = await testService.update(id, {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        });

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

export async function DELETE(
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
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await testService.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Test deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


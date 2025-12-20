// Homework by ID API Route
import { NextResponse } from 'next/server';
import { homeworkService, updateAssignmentSchema } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import prisma from '@/core/database/prisma';

export async function GET(
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
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const assignment = await homeworkService.getById(id);

        if (!assignment) {
            return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: assignment,
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
        if (!user || user.role !== 'TEACHER') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Verify teacher owns this assignment
        const assignment = await homeworkService.getById(id);
        if (!assignment || assignment.createdBy.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const data = updateAssignmentSchema.parse(body);

        const updatedAssignment = await homeworkService.update(id, data);

        return NextResponse.json({
            success: true,
            data: updatedAssignment,
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
        if (!user || user.role !== 'TEACHER') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Verify teacher owns this assignment
        const assignment = await homeworkService.getById(id);
        if (!assignment || assignment.createdBy.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await homeworkService.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


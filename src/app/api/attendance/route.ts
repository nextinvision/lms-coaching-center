// Attendance API Route
import { NextResponse } from 'next/server';
import { attendanceService, markAttendanceSchema } from '@/modules/attendance';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';
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
        const studentId = searchParams.get('studentId') || undefined;
        const startDate = searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : undefined;
        const endDate = searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : undefined;

        // Parse pagination
        const pagination = parsePaginationQuery({
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        const result = await attendanceService.getAll(
            { batchId, studentId, startDate, endDate },
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
        if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const teacher = await prisma.teacher.findUnique({
            where: { userId: user.id },
        });

        if (!teacher && user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const data = markAttendanceSchema.parse(body);

        const attendances = await attendanceService.markAttendance(
            {
                ...data,
                date: new Date(data.date),
            },
            teacher?.id || user.id
        );

        return NextResponse.json({
            success: true,
            data: attendances,
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


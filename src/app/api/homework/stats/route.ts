// Homework Stats API Route
import { NextResponse } from 'next/server';
import { homeworkService } from '@/modules/homework';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';
import prisma from '@/core/database/prisma';

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
        const teacherId = searchParams.get('teacherId') || undefined;

        // If teacherId is provided, verify it's the current user or admin
        if (teacherId) {
            if (user.role === 'TEACHER') {
                const teacher = await prisma.teacher.findUnique({
                    where: { userId: user.id },
                });
                if (teacher?.id !== teacherId) {
                    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
                }
            } else if (user.role !== 'ADMIN') {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
            }
        } else if (user.role === 'TEACHER') {
            // If no teacherId provided and user is teacher, get their stats
            const teacher = await prisma.teacher.findUnique({
                where: { userId: user.id },
            });
            if (teacher) {
                const stats = await homeworkService.getStats(teacher.id);
                return NextResponse.json({
                    success: true,
                    data: stats,
                });
            }
        }

        const stats = await homeworkService.getStats(teacherId);

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}


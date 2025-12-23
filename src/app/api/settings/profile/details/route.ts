// Profile Details API Route
import { NextResponse } from 'next/server';
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

        let profileData: any = {};

        // Student: Get batch and academic year info
        if (user.role === 'STUDENT') {
            const student = await prisma.student.findUnique({
                where: { userId: user.id },
                include: {
                    batch: {
                        include: {
                            academicYear: true,
                        },
                    },
                },
            });

            if (student) {
                profileData = {
                    batch: student.batch ? {
                        id: student.batch.id,
                        name: student.batch.name,
                        academicYear: student.batch.academicYear ? {
                            year: student.batch.academicYear.year,
                        } : null,
                    } : null,
                    createdAt: student.createdAt.toISOString(),
                };
            }
        }

        // Teacher: Get subjects teaching
        if (user.role === 'TEACHER') {
            const teacher = await prisma.teacher.findUnique({
                where: { userId: user.id },
                include: {
                    batchAssignments: {
                        include: {
                            batch: {
                                include: {
                                    subjects: true,
                                },
                            },
                        },
                    },
                },
            });

            if (teacher) {
                // Extract unique subjects from all assigned batches
                const subjectsMap = new Map();
                teacher.batchAssignments.forEach((assignment) => {
                    assignment.batch.subjects.forEach((subject) => {
                        if (!subjectsMap.has(subject.id)) {
                            subjectsMap.set(subject.id, {
                                id: subject.id,
                                name: subject.name,
                            });
                        }
                    });
                });

                const subjects = Array.from(subjectsMap.values());

                profileData = {
                    subjects,
                    createdAt: teacher.createdAt.toISOString(),
                };
            }
        }

        // Admin: Get creation date
        if (user.role === 'ADMIN') {
            const admin = await prisma.admin.findUnique({
                where: { userId: user.id },
            });

            if (admin) {
                profileData = {
                    createdAt: admin.createdAt.toISOString(),
                };
            }
        }

        return NextResponse.json({
            success: true,
            data: profileData,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

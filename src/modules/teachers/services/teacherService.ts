// Teacher Service
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';
import type {
    Teacher,
    TeacherWithDetails,
    CreateTeacherInput,
    UpdateTeacherInput,
    TeacherFilters,
    TeacherStats,
} from '../types/teacher.types';
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

export const teacherService = {
    /**
     * Create a new teacher (admin only)
     */
    async create(data: CreateTeacherInput): Promise<Teacher> {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user and teacher profile
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                phone: data.phone || null,
                role: 'TEACHER',
            },
        });

        const teacher = await prisma.teacher.create({
            data: {
                userId: user.id,
                name: data.name,
            },
            include: {
                user: true,
            },
        });

        return teacher as Teacher;
    },

    /**
     * Get teacher by ID
     */
    async getById(id: string): Promise<TeacherWithDetails | null> {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                user: true,
                batchAssignments: {
                    include: {
                        batch: true,
                    },
                },
            },
        });

        if (!teacher) return null;

        // Get statistics
        const assignedBatches = teacher.batchAssignments?.map((ba) => ba.batch).filter(Boolean) || [];

        // Count students in assigned batches
        const batchIds = assignedBatches.map((b) => b.id);
        const totalStudents = await prisma.student.count({
            where: {
                batchId: {
                    in: batchIds,
                },
            },
        });

        // Count content created by teacher
        const totalContent = await prisma.content.count({
            where: {
                uploadedById: teacher.id,
            },
        });

        // Count tests created by teacher
        const totalTests = await prisma.test.count({
            where: {
                createdById: teacher.id,
            },
        });

        return {
            ...teacher,
            assignedBatches,
            totalStudents,
            totalContent,
            totalTests,
        } as TeacherWithDetails;
    },

    /**
     * Get all teachers with filters and pagination
     */
    async getAll(
        filters?: TeacherFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Teacher>> {
        const where: any = {};

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { user: { email: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }

        if (filters?.batchId) {
            where.batchAssignments = {
                some: {
                    batchId: filters.batchId,
                },
            };
        }

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, teachers] = await Promise.all([
            prisma.teacher.count({ where }),
            prisma.teacher.findMany({
                where,
                include: {
                    user: true,
                    batchAssignments: {
                        include: {
                            batch: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
        ]);

        return {
            data: teachers as Teacher[],
            pagination: {
                page,
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
                hasNext: page * take < total,
                hasPrev: page > 1,
            },
        };
    },

    /**
     * Update teacher
     */
    async update(id: string, data: UpdateTeacherInput): Promise<Teacher> {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!teacher) {
            throw new Error('Teacher not found');
        }

        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
            // Also update user name
            await prisma.user.update({
                where: { id: teacher.userId },
                data: { name: data.name },
            });
        }

        if (data.email !== undefined) {
            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== teacher.userId) {
                throw new Error('Email already exists');
            }

            await prisma.user.update({
                where: { id: teacher.userId },
                data: { email: data.email },
            });
        }

        if (data.phone !== undefined) {
            await prisma.user.update({
                where: { id: teacher.userId },
                data: { phone: data.phone },
            });
        }

        if (data.password !== undefined) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await prisma.user.update({
                where: { id: teacher.userId },
                data: { password: hashedPassword },
            });
        }

        const updatedTeacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        return updatedTeacher as Teacher;
    },

    /**
     * Delete teacher
     */
    async delete(id: string): Promise<void> {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
        });

        if (!teacher) {
            throw new Error('Teacher not found');
        }

        // Delete teacher (user will be cascade deleted)
        await prisma.teacher.delete({
            where: { id },
        });
    },

    /**
     * Get teacher statistics
     */
    async getStats(): Promise<TeacherStats> {
        const teachers = await prisma.teacher.findMany({
            include: {
                user: true,
                batchAssignments: {
                    include: {
                        batch: true,
                    },
                },
            },
            take: 1000, // Enforce maximum limit
        });

        const totalTeachers = teachers.length;
        const activeTeachers = teachers.filter((t) => t.user.isActive).length;

        const batchMap = new Map<string, { name: string; count: number }>();
        teachers.forEach((teacher) => {
            teacher.batchAssignments?.forEach((ba) => {
                const batchId = ba.batch.id;
                const batchName = ba.batch.name;
                const current = batchMap.get(batchId) || { name: batchName, count: 0 };
                batchMap.set(batchId, { name: current.name, count: current.count + 1 });
            });
        });

        const teachersByBatch = Array.from(batchMap.entries()).map(([batchId, data]) => ({
            batchId,
            batchName: data.name,
            count: data.count,
        }));

        return {
            totalTeachers,
            activeTeachers,
            teachersByBatch,
        };
    },
};


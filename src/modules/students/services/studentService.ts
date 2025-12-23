// Student Service
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';
import type {
    Student,
    StudentWithStats,
    CreateStudentInput,
    UpdateStudentInput,
    StudentFilters,
    StudentStats,
} from '../types/student.types';
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

export const studentService = {
    /**
     * Create a new student (admin only)
     */
    async create(data: CreateStudentInput): Promise<Student> {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user and student profile
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                role: 'STUDENT',
            },
            include: {
                studentProfile: {
                    include: {
                        batch: true,
                    },
                },
            },
        });

        const student = await prisma.student.create({
            data: {
                userId: user.id,
                name: data.name,
                phone: data.phone,
                batchId: data.batchId || null,
            },
            include: {
                user: true,
                batch: true,
            },
        });

        return student as Student;
    },

    /**
     * Get student by ID
     */
    async getById(id: string): Promise<Student | null> {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: true,
                batch: true,
            },
        });

        return student as Student | null;
    },

    /**
     * Get student by user ID
     */
    async getByUserId(userId: string): Promise<Student | null> {
        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                user: true,
                batch: true,
            },
        });

        return student as Student | null;
    },

    /**
     * Get all students with filters and pagination
     */
    async getAll(
        filters?: StudentFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Student>> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { user: { email: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }

        if (filters?.isActive !== undefined) {
            where.user = { isActive: filters.isActive };
        }

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, students] = await Promise.all([
            prisma.student.count({ where }),
            prisma.student.findMany({
                where,
                include: {
                    user: true,
                    batch: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
        ]);

        return {
            data: students as Student[],
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
     * Get students by batch
     */
    async getByBatch(batchId: string): Promise<Student[]> {
        const students = await prisma.student.findMany({
            where: { batchId },
            include: {
                user: true,
                batch: true,
            },
            orderBy: { name: 'asc' },
            take: 1000, // Enforce maximum limit
        });

        return students as Student[];
    },

    /**
     * Update student
     */
    async update(id: string, data: UpdateStudentInput): Promise<Student> {
        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.phone !== undefined) {
            updateData.phone = data.phone;
        }

        if (data.batchId !== undefined) {
            updateData.batchId = data.batchId;
        }

        // Update user if needed
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (student && data.isActive !== undefined) {
            await prisma.user.update({
                where: { id: student.userId },
                data: { isActive: data.isActive },
            });
        }

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                batch: true,
            },
        });

        return updatedStudent as Student;
    },

    /**
     * Delete student (soft delete by deactivating)
     */
    async delete(id: string): Promise<void> {
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            throw new Error('Student not found');
        }

        // Soft delete by deactivating user
        await prisma.user.update({
            where: { id: student.userId },
            data: { isActive: false },
        });
    },

    /**
     * Get student with stats
     */
    async getWithStats(id: string): Promise<StudentWithStats | null> {
        const student = await this.getById(id);
        if (!student) return null;

        // Calculate attendance percentage
        const totalAttendance = await prisma.attendance.count({
            where: { studentId: id },
        });

        const presentAttendance = await prisma.attendance.count({
            where: { studentId: id, present: true },
        });

        const attendancePercentage =
            totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

        // Get test stats
        const totalTests = await prisma.test.count({
            where: { batchId: student.batchId || undefined, isActive: true },
        });

        const completedTests = await prisma.testSubmission.count({
            where: { studentId: id },
        });

        // Get pending assignments
        const pendingAssignments = await prisma.assignmentSubmission.count({
            where: {
                studentId: id,
                isChecked: false,
            },
        });

        return {
            ...student,
            attendancePercentage: Math.round(attendancePercentage * 100) / 100,
            totalTests,
            completedTests,
            pendingAssignments,
        };
    },

    /**
     * Get student statistics
     */
    async getStats(): Promise<StudentStats> {
        const totalStudents = await prisma.student.count();
        const activeStudents = await prisma.student.count({
            where: { user: { isActive: true } },
        });

        // Get students by batch
        const studentsByBatch = await prisma.student.groupBy({
            by: ['batchId'],
            _count: true,
            where: { user: { isActive: true } },
        });

        const batchDetails = await Promise.all(
            studentsByBatch.map(async (item) => {
                const batch = item.batchId
                    ? await prisma.batch.findUnique({
                          where: { id: item.batchId },
                      })
                    : null;

                return {
                    batchId: item.batchId || 'unassigned',
                    batchName: batch?.name || 'Unassigned',
                    count: item._count,
                };
            })
        );

        return {
            totalStudents,
            activeStudents,
            studentsByBatch: batchDetails,
        };
    },
};


// Attendance Service
import prisma from '@/core/database/prisma';
import { Prisma } from '@prisma/client';
import type {
    Attendance,
    MarkAttendanceInput,
    AttendanceFilters,
    AttendanceStats,
    BatchAttendanceSummary,
} from '../types/attendance.types';
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

export const attendanceService = {
    /**
     * Mark attendance for a batch (optimized with bulk operations)
     */
    async markAttendance(data: MarkAttendanceInput, markedById: string): Promise<Attendance[]> {
        // Fetch all existing attendance records in one query
        const studentIds = data.attendance.map((att) => att.studentId);
        const existingAttendances = await prisma.attendance.findMany({
            where: {
                batchId: data.batchId,
                date: data.date,
                studentId: { in: studentIds },
            },
            take: 1000, // Safety limit (should cover all students in a batch)
        });

        // Create a map for quick lookup
        const existingMap = new Map(
            existingAttendances.map((att) => [att.studentId, att])
        );

        // Separate into create and update operations
        const toCreate = data.attendance.filter(
            (att) => !existingMap.has(att.studentId)
        );
        const toUpdate = data.attendance.filter((att) =>
            existingMap.has(att.studentId)
        );

        // Use transaction for atomicity
        return prisma.$transaction(async (tx) => {
            // Bulk create new records
            if (toCreate.length > 0) {
                await tx.attendance.createMany({
                    data: toCreate.map((att) => ({
                        studentId: att.studentId,
                        batchId: data.batchId,
                        date: data.date,
                        present: att.present,
                        remarks: att.remarks || null,
                        markedById,
                    })),
                });
            }

            // Bulk update existing records
            if (toUpdate.length > 0) {
                await Promise.all(
                    toUpdate.map((att) => {
                        const existing = existingMap.get(att.studentId)!;
                        return tx.attendance.update({
                            where: { id: existing.id },
                            data: {
                                present: att.present,
                                remarks: att.remarks || null,
                                markedById,
                            },
                        });
                    })
                );
            }

            // Return all updated records with relations
            return tx.attendance.findMany({
                where: {
                    batchId: data.batchId,
                    date: data.date,
                    studentId: { in: studentIds },
                },
                include: {
                    student: {
                        include: { user: true },
                    },
                    batch: {
                        include: {
                            academicYear: true,
                        },
                    },
                },
                take: 1000, // Safety limit (should cover all students in a batch)
            }) as Promise<Attendance[]>;
        });
    },

    /**
     * Get attendance by ID
     */
    async getById(id: string): Promise<Attendance | null> {
        const attendance = await prisma.attendance.findUnique({
            where: { id },
            include: {
                student: {
                    include: { user: true },
                },
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
        });

        return attendance as Attendance | null;
    },

    /**
     * Get all attendance with filters and pagination
     */
    async getAll(
        filters?: AttendanceFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Attendance>> {
        const where: Prisma.AttendanceWhereInput = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.studentId) {
            where.studentId = filters.studentId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.date.lte = filters.endDate;
            }
        }

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, attendances] = await Promise.all([
            prisma.attendance.count({ where }),
            prisma.attendance.findMany({
                where,
                include: {
                    student: {
                        include: { user: true },
                    },
                    batch: {
                        include: {
                            academicYear: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
                skip,
                take,
            }),
        ]);

        return {
            data: attendances as Attendance[],
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
     * Get attendance for a batch on a specific date
     */
    async getBatchAttendance(batchId: string, date: Date): Promise<Attendance[]> {
        const attendances = await prisma.attendance.findMany({
            where: {
                batchId,
                date,
            },
            include: {
                student: {
                    include: { user: true },
                },
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
            orderBy: {
                student: {
                    name: 'asc',
                },
            },
            take: 1000, // Enforce maximum limit (should cover all students in a batch)
        });

        return attendances as Attendance[];
    },

    /**
     * Get student attendance statistics
     */
    async getStudentStats(studentId: string, batchId?: string): Promise<AttendanceStats> {
        const where: Prisma.AttendanceWhereInput = { studentId };
        if (batchId) {
            where.batchId = batchId;
        }

        const totalDays = await prisma.attendance.count({ where });
        const presentDays = await prisma.attendance.count({
            where: { ...where, present: true },
        });
        const absentDays = totalDays - presentDays;

        const attendancePercentage =
            totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        return {
            totalDays,
            presentDays,
            absentDays,
            attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        };
    },

    /**
     * Get batch attendance summary for a date
     */
    async getBatchSummary(batchId: string, date: Date): Promise<BatchAttendanceSummary> {
        const batch = await prisma.batch.findUnique({
            where: { id: batchId },
        });

        if (!batch) {
            throw new Error('Batch not found');
        }

        const totalStudents = await prisma.student.count({
            where: { batchId },
        });

        const attendances = await this.getBatchAttendance(batchId, date);
        const presentCount = attendances.filter((a) => a.present).length;
        const absentCount = attendances.filter((a) => !a.present).length;

        const attendancePercentage =
            totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

        return {
            batchId,
            batchName: batch.name,
            date,
            totalStudents,
            presentCount,
            absentCount,
            attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        };
    },

    /**
     * Get monthly attendance report
     */
    async getMonthlyReport(
        batchId: string,
        year: number,
        month: number
    ): Promise<BatchAttendanceSummary[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendances = await prisma.attendance.findMany({
            where: {
                batchId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                batch: true,
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            take: 1000, // Enforce maximum limit for monthly reports
            orderBy: { date: 'desc' },
        });

        // Group by date
        const byDate = new Map<string, Attendance[]>();
        attendances.forEach((att) => {
            const dateKey = att.date.toISOString().split('T')[0];
            if (!byDate.has(dateKey)) {
                byDate.set(dateKey, []);
            }
            byDate.get(dateKey)!.push(att);
        });

        const batch = await prisma.batch.findUnique({
            where: { id: batchId },
        });

        if (!batch) {
            throw new Error('Batch not found');
        }

        const totalStudents = await prisma.student.count({
            where: { batchId },
        });

        const summaries: BatchAttendanceSummary[] = [];

        for (const [dateKey, dayAttendances] of byDate.entries()) {
            const date = new Date(dateKey);
            const presentCount = dayAttendances.filter((a) => a.present).length;
            const absentCount = dayAttendances.filter((a) => !a.present).length;

            summaries.push({
                batchId,
                batchName: batch.name,
                date,
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage:
                    totalStudents > 0
                        ? Math.round((presentCount / totalStudents) * 100 * 100) / 100
                        : 0,
            });
        }

        return summaries.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
};


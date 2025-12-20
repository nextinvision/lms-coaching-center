// Attendance Service
import prisma from '@/core/database/prisma';
import type {
    Attendance,
    MarkAttendanceInput,
    AttendanceFilters,
    AttendanceStats,
    BatchAttendanceSummary,
} from '../types/attendance.types';

export const attendanceService = {
    /**
     * Mark attendance for a batch
     */
    async markAttendance(data: MarkAttendanceInput, markedById: string): Promise<Attendance[]> {
        const attendances: Attendance[] = [];

        for (const att of data.attendance) {
            // Check if attendance already exists
            const existing = await prisma.attendance.findUnique({
                where: {
                    studentId_batchId_date: {
                        studentId: att.studentId,
                        batchId: data.batchId,
                        date: data.date,
                    },
                },
            });

            if (existing) {
                // Update existing attendance
                const updated = await prisma.attendance.update({
                    where: { id: existing.id },
                    data: {
                        present: att.present,
                        remarks: att.remarks || null,
                        markedById,
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
                });
                attendances.push(updated as Attendance);
            } else {
                // Create new attendance
                const created = await prisma.attendance.create({
                    data: {
                        studentId: att.studentId,
                        batchId: data.batchId,
                        date: data.date,
                        present: att.present,
                        remarks: att.remarks || null,
                        markedById,
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
                });
                attendances.push(created as Attendance);
            }
        }

        return attendances;
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
     * Get all attendance with filters
     */
    async getAll(filters?: AttendanceFilters): Promise<Attendance[]> {
        const where: any = {};

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

        const attendances = await prisma.attendance.findMany({
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
        });

        return attendances as Attendance[];
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
        });

        return attendances as Attendance[];
    },

    /**
     * Get student attendance statistics
     */
    async getStudentStats(studentId: string, batchId?: string): Promise<AttendanceStats> {
        const where: any = { studentId };
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


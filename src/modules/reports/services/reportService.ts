// Report Service
import prisma from '@/core/database/prisma';
import { Prisma } from '@prisma/client';
import type {
    AttendanceReportFilters,
    AttendanceReportData,
    BatchAttendanceReport,
    PerformanceReportFilters,
    StudentPerformanceData,
    BatchPerformanceReport,
    ReportStats,
} from '../types/report.types';

export const reportService = {
    /**
     * Get attendance report
     */
    async getAttendanceReport(filters: AttendanceReportFilters): Promise<BatchAttendanceReport[]> {
        const where: Prisma.AttendanceWhereInput = {};

        if (filters.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters.studentId) {
            where.studentId = filters.studentId;
        }

        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.date.lte = new Date(filters.endDate);
            }
        }

        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: true,
                        batch: true,
                    },
                },
                batch: true,
            },
            take: 1000, // Enforce maximum limit for reports
            orderBy: { date: 'desc' },
        });

        // Group by batch
        const batchMap = new Map<string, AttendanceReportData[]>();

        attendances.forEach((attendance) => {
            const batchId = attendance.batchId;
            const studentId = attendance.studentId;
            const studentName = attendance.student.user.name;
            const batchName = attendance.batch.name;

            if (!batchMap.has(batchId)) {
                batchMap.set(batchId, []);
            }

            let studentData = batchMap.get(batchId)!.find((s) => s.studentId === studentId);

            if (!studentData) {
                studentData = {
                    studentId,
                    studentName,
                    batchName,
                    totalDays: 0,
                    presentDays: 0,
                    absentDays: 0,
                    attendancePercentage: 0,
                };
                batchMap.get(batchId)!.push(studentData);
            }

            studentData.totalDays++;
            if (attendance.present) {
                studentData.presentDays++;
            } else {
                studentData.absentDays++;
            }
        });

        // Calculate percentages
        batchMap.forEach((students) => {
            students.forEach((student) => {
                student.attendancePercentage =
                    student.totalDays > 0 ? (student.presentDays / student.totalDays) * 100 : 0;
            });
        });

        // Convert to report format
        const reports: BatchAttendanceReport[] = [];

        for (const [batchId, students] of batchMap.entries()) {
            const batch = attendances.find((a) => a.batchId === batchId)?.batch;
            if (!batch) continue;

            const averageAttendance =
                students.length > 0
                    ? students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length
                    : 0;

            reports.push({
                batchId,
                batchName: batch.name,
                totalStudents: students.length,
                averageAttendance,
                students,
            });
        }

        return reports;
    },

    /**
     * Get performance report
     */
    async getPerformanceReport(filters: PerformanceReportFilters): Promise<BatchPerformanceReport[]> {
        const where: Prisma.TestSubmissionWhereInput = {};

        if (filters.batchId || filters.subjectId) {
            where.test = {};
            if (filters.batchId) {
                where.test.batchId = filters.batchId;
            }
            if (filters.subjectId) {
                where.test.subjectId = filters.subjectId;
            }
        }

        if (filters.testId) {
            where.testId = filters.testId;
        }

        if (filters.startDate || filters.endDate) {
            where.submittedAt = {};
            if (filters.startDate) {
                where.submittedAt.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.submittedAt.lte = new Date(filters.endDate);
            }
        }

        const submissions = await prisma.testSubmission.findMany({
            where,
            include: {
                test: {
                    include: {
                        batch: true,
                        subject: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                        batch: true,
                    },
                },
            },
            take: 1000, // Enforce maximum limit for reports
            orderBy: { submittedAt: 'desc' },
        });

        // Group by batch
        const batchMap = new Map<string, Map<string, StudentPerformanceData>>();

        submissions.forEach((submission) => {
            const batchId = submission.test.batchId;
            const studentId = submission.studentId;
            const studentName = submission.student.user.name;
            const batchName = submission.test.batch.name;
            const subjectId = submission.test.subjectId || 'no-subject';
            const subjectName = submission.test.subject?.name || 'No Subject';

            if (!batchMap.has(batchId)) {
                batchMap.set(batchId, new Map());
            }

            const studentMap = batchMap.get(batchId)!;

            if (!studentMap.has(studentId)) {
                studentMap.set(studentId, {
                    studentId,
                    studentName,
                    batchName,
                    totalTests: 0,
                    averageMarks: 0,
                    highestMarks: 0,
                    lowestMarks: 100,
                    subjectPerformance: [],
                });
            }

            const studentData = studentMap.get(studentId)!;
            const marks = submission.obtainedMarks;
            const totalMarks = submission.totalMarks;
            const percentage = (marks / totalMarks) * 100;

            studentData.totalTests++;
            studentData.averageMarks = (studentData.averageMarks * (studentData.totalTests - 1) + percentage) / studentData.totalTests;
            studentData.highestMarks = Math.max(studentData.highestMarks, percentage);
            studentData.lowestMarks = Math.min(studentData.lowestMarks, percentage);

            // Subject performance
            let subjectData = studentData.subjectPerformance.find((s) => s.subjectId === subjectId);
            if (!subjectData) {
                subjectData = {
                    subjectId,
                    subjectName,
                    averageMarks: 0,
                    testsCount: 0,
                };
                studentData.subjectPerformance.push(subjectData);
            }

            subjectData.testsCount++;
            subjectData.averageMarks = (subjectData.averageMarks * (subjectData.testsCount - 1) + percentage) / subjectData.testsCount;
        });

        // Convert to report format
        const reports: BatchPerformanceReport[] = [];

        for (const [batchId, studentMap] of batchMap.entries()) {
            const batch = submissions.find((s) => s.test.batchId === batchId)?.test.batch;
            if (!batch) continue;

            const students = Array.from(studentMap.values());
            const averagePerformance =
                students.length > 0
                    ? students.reduce((sum, s) => sum + s.averageMarks, 0) / students.length
                    : 0;

            reports.push({
                batchId,
                batchName: batch.name,
                totalStudents: students.length,
                averagePerformance,
                students,
            });
        }

        return reports;
    },

    /**
     * Get report statistics
     */
    async getStats(): Promise<ReportStats> {
        // Use aggregations instead of fetching all records for stats
        const [totalStudents, totalBatches, totalTests, attendanceStats, submissionStats] = await Promise.all([
            prisma.student.count(),
            prisma.batch.count(),
            prisma.test.count(),
            // Use aggregation instead of fetching all records
            prisma.attendance.groupBy({
                by: ['studentId', 'present'],
                _count: true,
            }),
            // Use aggregation for submission stats
            prisma.testSubmission.aggregate({
                _avg: {
                    obtainedMarks: true,
                    totalMarks: true,
                },
                _count: true,
            }),
        ]);

        // Calculate attendance from aggregated data
        const attendanceMap = new Map<string, { total: number; present: number }>();
        attendanceStats.forEach((stat) => {
            const current = attendanceMap.get(stat.studentId) || { total: 0, present: 0 };
            current.total += stat._count;
            if (stat.present) current.present += stat._count;
            attendanceMap.set(stat.studentId, current);
        });

        // Calculate average attendance from aggregated data
        const attendancePercentages = Array.from(attendanceMap.values()).map(
            (a) => (a.present / a.total) * 100
        );
        const averageAttendance =
            attendancePercentages.length > 0
                ? attendancePercentages.reduce((sum, p) => sum + p, 0) / attendancePercentages.length
                : 0;

        // Calculate average performance from aggregated data
        const averagePerformance =
            submissionStats._avg.obtainedMarks && submissionStats._avg.totalMarks
                ? (submissionStats._avg.obtainedMarks / submissionStats._avg.totalMarks) * 100
                : 0;

        return {
            totalStudents,
            totalBatches,
            totalTests,
            averageAttendance,
            averagePerformance,
        };
    },
};


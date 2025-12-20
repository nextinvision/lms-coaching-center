// Attendance Types
import type { Attendance as PrismaAttendance, Student, Batch } from '@prisma/client';

export interface Attendance extends PrismaAttendance {
    student: Student & { user: { name: string; email: string } };
    batch: Batch;
}

export interface MarkAttendanceInput {
    batchId: string;
    date: Date;
    attendance: Array<{
        studentId: string;
        present: boolean;
        remarks?: string | null;
    }>;
}

export interface AttendanceFilters {
    batchId?: string;
    studentId?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface AttendanceStats {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
}

export interface BatchAttendanceSummary {
    batchId: string;
    batchName: string;
    date: Date;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    attendancePercentage: number;
}


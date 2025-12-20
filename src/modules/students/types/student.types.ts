// Student Types
import type { Student as PrismaStudent, User, Batch } from '@prisma/client';

export interface Student extends PrismaStudent {
    user: User;
    batch?: Batch | null;
}

export interface StudentWithStats extends Student {
    attendancePercentage?: number;
    totalTests?: number;
    completedTests?: number;
    pendingAssignments?: number;
}

export interface CreateStudentInput {
    name: string;
    email: string;
    phone: string;
    password: string;
    batchId?: string | null;
}

export interface UpdateStudentInput {
    name?: string;
    phone?: string;
    batchId?: string | null;
    isActive?: boolean;
}

export interface StudentFilters {
    batchId?: string;
    search?: string;
    isActive?: boolean;
}

export interface StudentStats {
    totalStudents: number;
    activeStudents: number;
    studentsByBatch: Array<{
        batchId: string;
        batchName: string;
        count: number;
    }>;
}


// Teacher Types
import type { Teacher as PrismaTeacher, User, Batch } from '@prisma/client';

export interface Teacher extends PrismaTeacher {
    user: User;
    batchAssignments?: Array<{
        batch: Batch;
    }>;
}

export interface TeacherWithDetails extends Teacher {
    assignedBatches: Batch[];
    totalStudents: number;
    totalContent: number;
    totalTests: number;
}

export interface CreateTeacherInput {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
}

export interface UpdateTeacherInput {
    name?: string;
    email?: string;
    phone?: string | null;
    password?: string;
}

export interface TeacherFilters {
    search?: string;
    batchId?: string;
}

export interface TeacherStats {
    totalTeachers: number;
    activeTeachers: number;
    teachersByBatch: Array<{
        batchId: string;
        batchName: string;
        count: number;
    }>;
}


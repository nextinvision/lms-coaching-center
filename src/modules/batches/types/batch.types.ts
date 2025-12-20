// Batch Types
import type { Batch as PrismaBatch, AcademicYear, Subject, Student, Teacher, User } from '@prisma/client';

export interface Batch extends PrismaBatch {
    academicYear: AcademicYear;
    students?: Array<Student & { user: User }>;
    subjects?: Subject[];
    teachers?: Array<{
        id: string;
        teacher: Teacher;
    }>;
}

export interface BatchWithDetails extends Batch {
    studentCount: number;
    subjectCount: number;
    teacherCount: number;
}

export interface CreateBatchInput {
    name: string;
    academicYearId: string;
}

export interface UpdateBatchInput {
    name?: string;
    academicYearId?: string;
}

export interface BatchFilters {
    academicYearId?: string;
    search?: string;
}

export interface BatchStats {
    totalBatches: number;
    batchesByYear: Array<{
        year: string;
        count: number;
    }>;
}


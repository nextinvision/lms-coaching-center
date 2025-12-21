// Academic Year Types
import type { AcademicYear as PrismaAcademicYear, Batch } from '@prisma/client';

export interface AcademicYear extends PrismaAcademicYear {
    batches?: Batch[];
}

export interface CreateAcademicYearInput {
    year: string; // e.g., "2024-2025"
    startDate: string; // ISO string from date input
    endDate: string; // ISO string from date input
    isActive?: boolean;
}

export interface UpdateAcademicYearInput {
    year?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export interface AcademicYearFilters {
    isActive?: boolean;
    search?: string;
}

export interface AcademicYearStats {
    totalAcademicYears: number;
    activeAcademicYear: AcademicYear | null;
    batchesCount: number;
    studentsCount: number;
}


// Subject Types
import type { Subject as PrismaSubject, Batch } from '@prisma/client';

export interface Subject extends PrismaSubject {
    batch: Batch;
}

export interface CreateSubjectInput {
    name: string;
    batchId: string;
}

export interface UpdateSubjectInput {
    name?: string;
    batchId?: string;
}

export interface SubjectFilters {
    batchId?: string;
    search?: string;
}


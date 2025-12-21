// Homework/Assignment Types
import type { Assignment as PrismaAssignment, AssignmentSubmission as PrismaAssignmentSubmission, Batch, Subject, Student, Teacher, User } from '@prisma/client';

export interface Assignment extends PrismaAssignment {
    batch: Batch;
    subject?: Subject | null;
    createdBy: Teacher & { user: User };
    submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission extends PrismaAssignmentSubmission {
    assignment: Assignment;
    student: Student & { user: User };
}

export interface AssignmentWithDetails extends Assignment {
    submissionCount: number;
    checkedCount: number;
    pendingCount: number;
}

export interface CreateAssignmentInput {
    title: string;
    description?: string | null;
    batchId: string;
    subjectId?: string | null;
    fileUrl?: string | null;
    dueDate?: string | null; // ISO string from datetime-local input
}

export interface UpdateAssignmentInput {
    title?: string;
    description?: string | null;
    subjectId?: string | null;
    fileUrl?: string | null;
    dueDate?: string | null;
}

export interface SubmitAssignmentInput {
    fileUrl: string;
}

export interface CheckSubmissionInput {
    isChecked: boolean;
    marks?: number | null;
    remarks?: string | null;
}

export interface AssignmentFilters {
    batchId?: string;
    subjectId?: string;
    search?: string;
}

export interface AssignmentStats {
    totalAssignments: number;
    pendingSubmissions: number;
    checkedSubmissions: number;
    assignmentsByBatch: Array<{
        batchId: string;
        batchName: string;
        count: number;
    }>;
}


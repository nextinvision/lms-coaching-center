// Homework Validation Schemas
import { z } from 'zod';

export const createAssignmentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    batchId: z.string().min(1, 'Batch ID is required'),
    subjectId: z.string().optional().nullable(),
    fileUrl: z.string().url().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});

export const updateAssignmentSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    subjectId: z.string().optional().nullable(),
    fileUrl: z.string().url().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});

export const submitAssignmentSchema = z.object({
    fileUrl: z.string().url('Valid file URL is required'),
});

export const checkSubmissionSchema = z.object({
    isChecked: z.boolean(),
    marks: z.number().int().min(0).max(100).optional().nullable(),
    remarks: z.string().optional().nullable(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
export type CheckSubmissionInput = z.infer<typeof checkSubmissionSchema>;


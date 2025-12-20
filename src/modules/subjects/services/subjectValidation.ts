// Subject Validation Schemas
import { z } from 'zod';

export const createSubjectSchema = z.object({
    name: z.string().min(1, 'Subject name is required'),
    batchId: z.string().min(1, 'Batch ID is required'),
});

export const updateSubjectSchema = z.object({
    name: z.string().min(1).optional(),
    batchId: z.string().min(1).optional(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;


// Batch Validation Schemas
import { z } from 'zod';

export const createBatchSchema = z.object({
    name: z.string().min(1, 'Batch name is required'),
    academicYearId: z.string().min(1, 'Academic year is required'),
});

export const updateBatchSchema = z.object({
    name: z.string().min(1).optional(),
    academicYearId: z.string().min(1).optional(),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;


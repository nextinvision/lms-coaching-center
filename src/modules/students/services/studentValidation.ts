// Student Validation Schemas
import { z } from 'zod';

export const createStudentSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    batchId: z.string().optional().nullable(),
});

export const updateStudentSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    batchId: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;


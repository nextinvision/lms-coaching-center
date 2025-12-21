// Teacher Validation Schemas
import { z } from 'zod';

export const createTeacherSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().nullable(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateTeacherSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional().nullable(),
    password: z.string().min(6).optional(),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;


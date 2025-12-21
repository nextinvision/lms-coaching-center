// Settings Validation Schemas
import { z } from 'zod';
import { Language } from '@prisma/client';

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().nullable().optional(),
    imageUrl: z.string().url('Invalid image URL').nullable().optional(),
    preferredLanguage: z.nativeEnum(Language).optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });


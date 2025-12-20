// Shared Validation Utilities
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number');

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters');

export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters');

export const urlSchema = z.string().url('Invalid URL');

export const fileSizeSchema = (maxSizeMB: number) =>
    z
        .any()
        .refine((file) => !file || file.size <= maxSizeMB * 1024 * 1024, {
            message: `File size must be less than ${maxSizeMB}MB`,
        });

export const fileTypeSchema = (allowedTypes: string[]) =>
    z.any().refine(
        (file) => !file || allowedTypes.includes(file.type),
        {
            message: `File type must be one of: ${allowedTypes.join(', ')}`,
        }
    );

// Helper function to validate form data
export function validateFormData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: z.ZodError;
} {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}

export default {
    emailSchema,
    phoneSchema,
    passwordSchema,
    nameSchema,
    urlSchema,
    fileSizeSchema,
    fileTypeSchema,
    validateFormData,
};


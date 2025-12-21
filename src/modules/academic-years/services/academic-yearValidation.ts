// Academic Year Validation Schemas
import { z } from 'zod';

export const createAcademicYearSchema = z.object({
    year: z.string().min(1, 'Year is required').regex(/^\d{4}-\d{4}$/, 'Year must be in format YYYY-YYYY'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isActive: z.boolean().optional().default(false),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: 'End date must be after start date',
    path: ['endDate'],
});

export const updateAcademicYearSchema = z.object({
    year: z.string().min(1).regex(/^\d{4}-\d{4}$/, 'Year must be in format YYYY-YYYY').optional(),
    startDate: z.string().min(1).optional(),
    endDate: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
    }
    return true;
}, {
    message: 'End date must be after start date',
    path: ['endDate'],
});

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;
export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;


// Notice Validation Schemas
import { z } from 'zod';
import { flexibleDatetimeSchema } from '@/shared/utils/datetimeSchema';

export const noticeTypeSchema = z.enum(['GENERAL', 'EXAM_DATE', 'HOLIDAY', 'IMPORTANT']);

export const createNoticeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    contentAssamese: z.string().optional().nullable(),
    type: noticeTypeSchema,
    batchId: z.string().optional().nullable(),
    priority: z.number().int().min(0).max(10).optional().default(0),
    expiresAt: flexibleDatetimeSchema,
});

export const updateNoticeSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    contentAssamese: z.string().optional().nullable(),
    type: noticeTypeSchema.optional(),
    batchId: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    priority: z.number().int().min(0).max(10).optional(),
    expiresAt: flexibleDatetimeSchema,
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;


// Content Validation Schemas
import { z } from 'zod';

export const createContentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['PDF', 'IMAGE', 'VIDEO']),
    fileUrl: z.string().url('Invalid file URL'),
    fileSize: z.number().optional(),
    fileName: z.string().optional(),
    batchId: z.string().min(1, 'Batch ID is required'),
    subjectId: z.string().optional().nullable(),
    chapterName: z.string().optional().nullable(),
    language: z.enum(['EN', 'AS']),
    isDownloadable: z.boolean().optional(),
});

export const updateContentSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    chapterName: z.string().optional().nullable(),
    language: z.enum(['EN', 'AS']).optional(),
    isDownloadable: z.boolean().optional(),
});

export type CreateContentInput = z.infer<typeof createContentSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;


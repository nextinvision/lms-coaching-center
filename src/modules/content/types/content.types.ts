// Content Types
import type { Content as PrismaContent, Batch, Subject, Teacher } from '@prisma/client';

export type ContentType = 'PDF' | 'IMAGE' | 'VIDEO';
export type Language = 'EN' | 'AS';

export interface Content extends PrismaContent {
    batch: Batch;
    subject?: Subject | null;
    uploadedBy: Teacher & { user: { name: string; email: string } };
}

export interface CreateContentInput {
    title: string;
    description?: string;
    type: ContentType;
    fileUrl: string;
    fileSize?: number;
    fileName?: string;
    batchId: string;
    subjectId?: string | null;
    chapterName?: string | null;
    language: Language;
    isDownloadable?: boolean;
}

export interface UpdateContentInput {
    title?: string;
    description?: string;
    chapterName?: string | null;
    language?: Language;
    isDownloadable?: boolean;
}

export interface ContentFilters {
    batchId?: string;
    subjectId?: string;
    chapterName?: string;
    type?: ContentType;
    language?: Language;
    search?: string;
}

export interface ContentStats {
    totalContent: number;
    contentByType: Array<{
        type: ContentType;
        count: number;
    }>;
    contentByLanguage: Array<{
        language: Language;
        count: number;
    }>;
}


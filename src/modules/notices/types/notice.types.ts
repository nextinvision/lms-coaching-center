// Notice Types
import type { Notice as PrismaNotice, Batch } from '@prisma/client';

export enum NoticeType {
    GENERAL = 'GENERAL',
    EXAM_DATE = 'EXAM_DATE',
    HOLIDAY = 'HOLIDAY',
    IMPORTANT = 'IMPORTANT',
}

export interface Notice extends PrismaNotice {
    batch?: Batch | null;
}

export interface CreateNoticeInput {
    title: string;
    content: string;
    contentAssamese?: string | null;
    type: NoticeType;
    batchId?: string | null;
    priority?: number;
    expiresAt?: string | null; // ISO string from datetime-local input
}

export interface UpdateNoticeInput {
    title?: string;
    content?: string;
    contentAssamese?: string | null;
    type?: NoticeType;
    batchId?: string | null;
    isActive?: boolean;
    priority?: number;
    expiresAt?: string | null;
}

export interface NoticeFilters {
    batchId?: string;
    type?: NoticeType;
    isActive?: boolean;
    search?: string;
}

export interface NoticeStats {
    totalNotices: number;
    activeNotices: number;
    noticesByType: Array<{
        type: NoticeType;
        count: number;
    }>;
}


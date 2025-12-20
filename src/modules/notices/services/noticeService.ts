// Notice Service
import prisma from '@/core/database/prisma';
import type {
    Notice,
    CreateNoticeInput,
    UpdateNoticeInput,
    NoticeFilters,
    NoticeStats,
    NoticeType,
} from '../types/notice.types';

export const noticeService = {
    /**
     * Create a new notice
     */
    async create(data: CreateNoticeInput): Promise<Notice> {
        const notice = await prisma.notice.create({
            data: {
                title: data.title,
                content: data.content,
                contentAssamese: data.contentAssamese || null,
                type: data.type,
                batchId: data.batchId || null,
                priority: data.priority || 0,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
            include: {
                batch: true,
            },
        });

        return notice as Notice;
    },

    /**
     * Get notice by ID
     */
    async getById(id: string): Promise<Notice | null> {
        const notice = await prisma.notice.findUnique({
            where: { id },
            include: {
                batch: true,
            },
        });

        return notice as Notice;
    },

    /**
     * Get all notices with filters
     */
    async getAll(filters?: NoticeFilters): Promise<Notice[]> {
        const where: any = {};

        if (filters?.batchId !== undefined) {
            where.batchId = filters.batchId || null;
        }

        if (filters?.type) {
            where.type = filters.type;
        }

        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        } else {
            // By default, only show active notices
            where.isActive = true;
        }

        // Filter out expired notices
        where.OR = [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
        ];

        if (filters?.search) {
            where.AND = [
                {
                    OR: [
                        { title: { contains: filters.search, mode: 'insensitive' } },
                        { content: { contains: filters.search, mode: 'insensitive' } },
                    ],
                },
            ];
        }

        const notices = await prisma.notice.findMany({
            where,
            include: {
                batch: true,
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return notices as Notice[];
    },

    /**
     * Get notices by batch
     */
    async getByBatch(batchId: string | null): Promise<Notice[]> {
        return this.getAll({ batchId, isActive: true });
    },

    /**
     * Update notice
     */
    async update(id: string, data: UpdateNoticeInput): Promise<Notice> {
        const updateData: any = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.contentAssamese !== undefined) updateData.contentAssamese = data.contentAssamese;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.batchId !== undefined) updateData.batchId = data.batchId;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.priority !== undefined) updateData.priority = data.priority;
        if (data.expiresAt !== undefined) {
            updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
        }

        const notice = await prisma.notice.update({
            where: { id },
            data: updateData,
            include: {
                batch: true,
            },
        });

        return notice as Notice;
    },

    /**
     * Delete notice
     */
    async delete(id: string): Promise<void> {
        await prisma.notice.delete({
            where: { id },
        });
    },

    /**
     * Get notice statistics
     */
    async getStats(): Promise<NoticeStats> {
        const notices = await prisma.notice.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
        });

        const totalNotices = notices.length;
        const activeNotices = notices.filter((n) => n.isActive).length;

        const typeMap = new Map<NoticeType, number>();
        notices.forEach((notice) => {
            const count = typeMap.get(notice.type as NoticeType) || 0;
            typeMap.set(notice.type as NoticeType, count + 1);
        });

        const noticesByType = Array.from(typeMap.entries()).map(([type, count]) => ({
            type,
            count,
        }));

        return {
            totalNotices,
            activeNotices,
            noticesByType,
        };
    },
};


// Content Service
import prisma from '@/core/database/prisma';
import type {
    Content,
    CreateContentInput,
    UpdateContentInput,
    ContentFilters,
    ContentStats,
} from '../types/content.types';

export const contentService = {
    /**
     * Create new content
     */
    async create(data: CreateContentInput, uploadedById: string): Promise<Content> {
        const content = await prisma.content.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                fileUrl: data.fileUrl,
                fileSize: data.fileSize,
                fileName: data.fileName,
                batchId: data.batchId,
                subjectId: data.subjectId || null,
                chapterName: data.chapterName || null,
                language: data.language,
                isDownloadable: data.isDownloadable ?? true,
                uploadedById,
            },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                uploadedBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return content as Content;
    },

    /**
     * Get content by ID
     */
    async getById(id: string): Promise<Content | null> {
        const content = await prisma.content.findUnique({
            where: { id },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                uploadedBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return content as Content | null;
    },

    /**
     * Get all content with filters
     */
    async getAll(filters?: ContentFilters): Promise<Content[]> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.subjectId) {
            where.subjectId = filters.subjectId;
        }

        if (filters?.chapterName) {
            where.chapterName = filters.chapterName;
        }

        if (filters?.type) {
            where.type = filters.type;
        }

        if (filters?.language) {
            where.language = filters.language;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { chapterName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const content = await prisma.content.findMany({
            where,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                uploadedBy: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return content as Content[];
    },

    /**
     * Get content by batch
     */
    async getByBatch(batchId: string): Promise<Content[]> {
        return this.getAll({ batchId });
    },

    /**
     * Update content
     */
    async update(id: string, data: UpdateContentInput): Promise<Content> {
        const updateData: any = {};

        if (data.title !== undefined) {
            updateData.title = data.title;
        }

        if (data.description !== undefined) {
            updateData.description = data.description;
        }

        if (data.chapterName !== undefined) {
            updateData.chapterName = data.chapterName;
        }

        if (data.language !== undefined) {
            updateData.language = data.language;
        }

        if (data.isDownloadable !== undefined) {
            updateData.isDownloadable = data.isDownloadable;
        }

        const content = await prisma.content.update({
            where: { id },
            data: updateData,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                uploadedBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return content as Content;
    },

    /**
     * Delete content
     */
    async delete(id: string): Promise<void> {
        await prisma.content.delete({
            where: { id },
        });
    },

    /**
     * Get content statistics
     */
    async getStats(batchId?: string): Promise<ContentStats> {
        const where: any = {};
        if (batchId) {
            where.batchId = batchId;
        }

        const totalContent = await prisma.content.count({ where });

        const contentByType = await prisma.content.groupBy({
            by: ['type'],
            where,
            _count: true,
        });

        const contentByLanguage = await prisma.content.groupBy({
            by: ['language'],
            where,
            _count: true,
        });

        return {
            totalContent,
            contentByType: contentByType.map((item) => ({
                type: item.type as any,
                count: item._count,
            })),
            contentByLanguage: contentByLanguage.map((item) => ({
                language: item.language as any,
                count: item._count,
            })),
        };
    },
};


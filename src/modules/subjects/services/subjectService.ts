// Subject Service
import prisma from '@/core/database/prisma';
import type { Subject, CreateSubjectInput, UpdateSubjectInput, SubjectFilters } from '../types/subject.types';
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

export const subjectService = {
    /**
     * Create a new subject
     */
    async create(data: CreateSubjectInput): Promise<Subject> {
        // Check if subject with same name exists in batch
        const existing = await prisma.subject.findUnique({
            where: {
                name_batchId: {
                    name: data.name,
                    batchId: data.batchId,
                },
            },
        });

        if (existing) {
            throw new Error('Subject with this name already exists in the batch');
        }

        const subject = await prisma.subject.create({
            data: {
                name: data.name,
                batchId: data.batchId,
            },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
        });

        return subject as Subject;
    },

    /**
     * Get subject by ID
     */
    async getById(id: string): Promise<Subject | null> {
        const subject = await prisma.subject.findUnique({
            where: { id },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
        });

        return subject as Subject | null;
    },

    /**
     * Get all subjects with filters and pagination
     */
    async getAll(
        filters?: SubjectFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Subject>> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, subjects] = await Promise.all([
            prisma.subject.count({ where }),
            prisma.subject.findMany({
                where,
                include: {
                    batch: {
                        include: {
                            academicYear: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
                skip,
                take,
            }),
        ]);

        return {
            data: subjects as Subject[],
            pagination: {
                page,
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
                hasNext: page * take < total,
                hasPrev: page > 1,
            },
        };
    },

    /**
     * Get subjects by batch
     */
    async getByBatch(batchId: string): Promise<Subject[]> {
        const subjects = await prisma.subject.findMany({
            where: { batchId },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
            take: 1000, // Enforce maximum limit (should cover all subjects in a batch)
        });

        return subjects as Subject[];
    },

    /**
     * Update subject
     */
    async update(id: string, data: UpdateSubjectInput): Promise<Subject> {
        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.batchId !== undefined) {
            updateData.batchId = data.batchId;
        }

        const subject = await prisma.subject.update({
            where: { id },
            data: updateData,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
        });

        return subject as Subject;
    },

    /**
     * Delete subject
     */
    async delete(id: string): Promise<void> {
        await prisma.subject.delete({
            where: { id },
        });
    },
};


// Batch Service
import prisma from '@/core/database/prisma';
import type {
    Batch,
    BatchWithDetails,
    CreateBatchInput,
    UpdateBatchInput,
    BatchFilters,
    BatchStats,
} from '../types/batch.types';
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

export const batchService = {
    /**
     * Create a new batch
     */
    async create(data: CreateBatchInput): Promise<Batch> {
        // Check if batch with same name exists in academic year
        const existing = await prisma.batch.findUnique({
            where: {
                name_academicYearId: {
                    name: data.name,
                    academicYearId: data.academicYearId,
                },
            },
        });

        if (existing) {
            throw new Error('Batch with this name already exists in the academic year');
        }

        const batch = await prisma.batch.create({
            data: {
                name: data.name,
                academicYearId: data.academicYearId,
            },
            include: {
                academicYear: true,
                students: {
                    include: { user: true },
                },
                subjects: true,
                teachers: {
                    include: { teacher: { include: { user: true } } },
                },
            },
        });

        return batch as Batch;
    },

    /**
     * Get batch by ID
     */
    async getById(id: string): Promise<BatchWithDetails | null> {
        const batch = await prisma.batch.findUnique({
            where: { id },
            include: {
                academicYear: true,
                students: {
                    include: { user: true },
                },
                subjects: true,
                teachers: {
                    include: { teacher: { include: { user: true } } },
                },
            },
        });

        if (!batch) return null;

        return {
            ...batch,
            studentCount: batch.students.length,
            subjectCount: batch.subjects.length,
            teacherCount: batch.teachers.length,
        } as BatchWithDetails;
    },

    /**
     * Get all batches with filters and pagination
     */
    async getAll(
        filters?: BatchFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Batch>> {
        const where: any = {};

        if (filters?.academicYearId) {
            where.academicYearId = filters.academicYearId;
        }

        if (filters?.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, batches] = await Promise.all([
            prisma.batch.count({ where }),
            prisma.batch.findMany({
                where,
                include: {
                    academicYear: true,
                    students: {
                        include: { user: true },
                    },
                    subjects: true,
                    teachers: {
                        include: { teacher: { include: { user: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
        ]);

        return {
            data: batches as Batch[],
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
     * Update batch
     */
    async update(id: string, data: UpdateBatchInput): Promise<Batch> {
        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.academicYearId !== undefined) {
            updateData.academicYearId = data.academicYearId;
        }

        const batch = await prisma.batch.update({
            where: { id },
            data: updateData,
            include: {
                academicYear: true,
                students: {
                    include: { user: true },
                },
                subjects: true,
                teachers: {
                    include: { teacher: { include: { user: true } } },
                },
            },
        });

        return batch as Batch;
    },

    /**
     * Delete batch
     */
    async delete(id: string): Promise<void> {
        await prisma.batch.delete({
            where: { id },
        });
    },

    /**
     * Assign teacher to batch
     */
    async assignTeacher(batchId: string, teacherId: string): Promise<void> {
        // Check if already assigned
        const existing = await prisma.batchTeacher.findUnique({
            where: {
                batchId_teacherId: {
                    batchId,
                    teacherId,
                },
            },
        });

        if (existing) {
            throw new Error('Teacher is already assigned to this batch');
        }

        await prisma.batchTeacher.create({
            data: {
                batchId,
                teacherId,
            },
        });
    },

    /**
     * Remove teacher from batch
     */
    async removeTeacher(batchId: string, teacherId: string): Promise<void> {
        await prisma.batchTeacher.delete({
            where: {
                batchId_teacherId: {
                    batchId,
                    teacherId,
                },
            },
        });
    },

    /**
     * Get batch statistics
     */
    async getStats(): Promise<BatchStats> {
        const totalBatches = await prisma.batch.count();

        const batchesByYear = await prisma.batch.groupBy({
            by: ['academicYearId'],
            _count: true,
        });

        const yearDetails = await Promise.all(
            batchesByYear.map(async (item) => {
                const year = await prisma.academicYear.findUnique({
                    where: { id: item.academicYearId },
                });

                return {
                    year: year?.year || 'Unknown',
                    count: item._count,
                };
            })
        );

        return {
            totalBatches,
            batchesByYear: yearDetails,
        };
    },
};


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
     * Get all batches with filters
     */
    async getAll(filters?: BatchFilters): Promise<Batch[]> {
        const where: any = {};

        if (filters?.academicYearId) {
            where.academicYearId = filters.academicYearId;
        }

        if (filters?.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        const batches = await prisma.batch.findMany({
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
        });

        return batches as Batch[];
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


// Subject Service
import prisma from '@/core/database/prisma';
import type { Subject, CreateSubjectInput, UpdateSubjectInput, SubjectFilters } from '../types/subject.types';

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
     * Get all subjects with filters
     */
    async getAll(filters?: SubjectFilters): Promise<Subject[]> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        const subjects = await prisma.subject.findMany({
            where,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });

        return subjects as Subject[];
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


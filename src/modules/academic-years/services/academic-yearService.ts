// Academic Year Service
import prisma from '@/core/database/prisma';
import type {
    AcademicYear,
    CreateAcademicYearInput,
    UpdateAcademicYearInput,
    AcademicYearFilters,
    AcademicYearStats,
} from '../types/academic-year.types';

export const academicYearService = {
    /**
     * Create a new academic year
     */
    async create(data: CreateAcademicYearInput): Promise<AcademicYear> {
        // Check if year already exists
        const existing = await prisma.academicYear.findUnique({
            where: { year: data.year },
        });

        if (existing) {
            throw new Error('Academic year already exists');
        }

        // If setting as active, deactivate all other academic years
        if (data.isActive) {
            await prisma.academicYear.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }

        const academicYear = await prisma.academicYear.create({
            data: {
                year: data.year,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isActive: data.isActive || false,
            },
            include: {
                batches: true,
            },
        });

        return academicYear as AcademicYear;
    },

    /**
     * Get academic year by ID
     */
    async getById(id: string): Promise<AcademicYear | null> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id },
            include: {
                batches: true,
            },
        });

        return academicYear as AcademicYear;
    },

    /**
     * Get all academic years with filters
     */
    async getAll(filters?: AcademicYearFilters): Promise<AcademicYear[]> {
        const where: any = {};

        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        if (filters?.search) {
            where.year = {
                contains: filters.search,
                mode: 'insensitive',
            };
        }

        const academicYears = await prisma.academicYear.findMany({
            where,
            include: {
                batches: true,
            },
            orderBy: {
                year: 'desc',
            },
        });

        return academicYears as AcademicYear[];
    },

    /**
     * Get active academic year
     */
    async getActive(): Promise<AcademicYear | null> {
        const academicYear = await prisma.academicYear.findFirst({
            where: { isActive: true },
            include: {
                batches: true,
            },
        });

        return academicYear as AcademicYear;
    },

    /**
     * Update academic year
     */
    async update(id: string, data: UpdateAcademicYearInput): Promise<AcademicYear> {
        const updateData: any = {};

        if (data.year !== undefined) {
            // Check if year already exists (excluding current)
            const existing = await prisma.academicYear.findUnique({
                where: { year: data.year },
            });

            if (existing && existing.id !== id) {
                throw new Error('Academic year already exists');
            }

            updateData.year = data.year;
        }

        if (data.startDate !== undefined) {
            updateData.startDate = new Date(data.startDate);
        }

        if (data.endDate !== undefined) {
            updateData.endDate = new Date(data.endDate);
        }

        if (data.isActive !== undefined) {
            // If setting as active, deactivate all other academic years
            if (data.isActive) {
                await prisma.academicYear.updateMany({
                    where: {
                        isActive: true,
                        id: { not: id },
                    },
                    data: { isActive: false },
                });
            }
            updateData.isActive = data.isActive;
        }

        const academicYear = await prisma.academicYear.update({
            where: { id },
            data: updateData,
            include: {
                batches: true,
            },
        });

        return academicYear as AcademicYear;
    },

    /**
     * Delete academic year
     */
    async delete(id: string): Promise<void> {
        // Check if academic year has batches
        const academicYear = await prisma.academicYear.findUnique({
            where: { id },
            include: {
                batches: true,
            },
        });

        if (!academicYear) {
            throw new Error('Academic year not found');
        }

        if (academicYear.batches && academicYear.batches.length > 0) {
            throw new Error('Cannot delete academic year with existing batches');
        }

        await prisma.academicYear.delete({
            where: { id },
        });
    },

    /**
     * Get academic year statistics
     */
    async getStats(): Promise<AcademicYearStats> {
        const academicYears = await prisma.academicYear.findMany({
            include: {
                batches: {
                    include: {
                        students: true,
                    },
                },
            },
        });

        const totalAcademicYears = academicYears.length;
        const activeAcademicYear = academicYears.find((ay) => ay.isActive) || null;

        let batchesCount = 0;
        let studentsCount = 0;

        academicYears.forEach((ay) => {
            batchesCount += ay.batches?.length || 0;
            ay.batches?.forEach((batch) => {
                studentsCount += batch.students?.length || 0;
            });
        });

        return {
            totalAcademicYears,
            activeAcademicYear: activeAcademicYear as AcademicYear | null,
            batchesCount,
            studentsCount,
        };
    },
};


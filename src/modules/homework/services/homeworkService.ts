// Homework Service
import prisma from '@/core/database/prisma';
import type {
    Assignment,
    AssignmentWithDetails,
    CreateAssignmentInput,
    UpdateAssignmentInput,
    AssignmentFilters,
    AssignmentStats,
} from '../types/homework.types';

export const homeworkService = {
    /**
     * Create a new assignment
     */
    async create(data: CreateAssignmentInput, createdById: string): Promise<Assignment> {
        const assignment = await prisma.assignment.create({
            data: {
                title: data.title,
                description: data.description,
                batchId: data.batchId,
                subjectId: data.subjectId || null,
                fileUrl: data.fileUrl || null,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                createdById,
            },
            include: {
                batch: true,
                subject: true,
                createdBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return assignment as Assignment;
    },

    /**
     * Get assignment by ID
     */
    async getById(id: string): Promise<AssignmentWithDetails | null> {
        const assignment = await prisma.assignment.findUnique({
            where: { id },
            include: {
                batch: true,
                subject: true,
                createdBy: {
                    include: {
                        user: true,
                    },
                },
                submissions: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!assignment) return null;

        const submissionCount = assignment.submissions?.length || 0;
        const checkedCount = assignment.submissions?.filter((s) => s.isChecked).length || 0;
        const pendingCount = submissionCount - checkedCount;

        return {
            ...assignment,
            submissionCount,
            checkedCount,
            pendingCount,
        } as AssignmentWithDetails;
    },

    /**
     * Get all assignments with filters
     */
    async getAll(filters?: AssignmentFilters): Promise<Assignment[]> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.subjectId) {
            where.subjectId = filters.subjectId;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                batch: true,
                subject: true,
                createdBy: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return assignments as Assignment[];
    },

    /**
     * Get assignments by batch
     */
    async getByBatch(batchId: string): Promise<Assignment[]> {
        return this.getAll({ batchId });
    },

    /**
     * Update assignment
     */
    async update(id: string, data: UpdateAssignmentInput): Promise<Assignment> {
        const updateData: any = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.subjectId !== undefined) updateData.subjectId = data.subjectId;
        if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
        if (data.dueDate !== undefined) {
            updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        }

        const assignment = await prisma.assignment.update({
            where: { id },
            data: updateData,
            include: {
                batch: true,
                subject: true,
                createdBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return assignment as Assignment;
    },

    /**
     * Delete assignment
     */
    async delete(id: string): Promise<void> {
        await prisma.assignment.delete({
            where: { id },
        });
    },

    /**
     * Get assignment statistics
     */
    async getStats(teacherId?: string): Promise<AssignmentStats> {
        const where: any = {};
        if (teacherId) {
            where.createdById = teacherId;
        }

        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                batch: true,
                submissions: true,
            },
        });

        const totalAssignments = assignments.length;
        let pendingSubmissions = 0;
        let checkedSubmissions = 0;
        const batchMap = new Map<string, { name: string; count: number }>();

        assignments.forEach((assignment) => {
            const submissions = assignment.submissions || [];
            const checked = submissions.filter((s) => s.isChecked).length;
            const pending = submissions.length - checked;

            pendingSubmissions += pending;
            checkedSubmissions += checked;

            const batchId = assignment.batchId;
            const batchName = assignment.batch.name;
            const current = batchMap.get(batchId) || { name: batchName, count: 0 };
            batchMap.set(batchId, { name: current.name, count: current.count + 1 });
        });

        const assignmentsByBatch = Array.from(batchMap.entries()).map(([batchId, data]) => ({
            batchId,
            batchName: data.name,
            count: data.count,
        }));

        return {
            totalAssignments,
            pendingSubmissions,
            checkedSubmissions,
            assignmentsByBatch,
        };
    },
};


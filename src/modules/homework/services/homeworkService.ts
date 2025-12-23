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
import type { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

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
     * Get all assignments with filters and pagination
     */
    async getAll(
        filters?: AssignmentFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<Assignment>> {
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

        // Pagination parameters
        const { page = 1, limit = 10, skip = 0 } = pagination || {};
        const take = Math.min(limit, 1000); // Enforce max limit

        // Get total count and paginated results in parallel
        const [total, assignments] = await Promise.all([
            prisma.assignment.count({ where }),
            prisma.assignment.findMany({
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
                skip,
                take,
            }),
        ]);

        return {
            data: assignments as Assignment[],
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
     * Get assignments by batch (with default pagination)
     */
    async getByBatch(batchId: string): Promise<Assignment[]> {
        // Use getAll with default pagination to ensure limits
        const result = await this.getAll({ batchId }, { page: 1, limit: 100, skip: 0 });
        return result.data;
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
            take: 1000, // Enforce maximum limit
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


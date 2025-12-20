// Assignment Submission Service
import prisma from '@/core/database/prisma';
import type {
    AssignmentSubmission,
    SubmitAssignmentInput,
    CheckSubmissionInput,
} from '../types/homework.types';

export const submissionService = {
    /**
     * Submit assignment (student)
     */
    async submit(
        assignmentId: string,
        studentId: string,
        data: SubmitAssignmentInput
    ): Promise<AssignmentSubmission> {
        // Check if submission already exists
        const existing = await prisma.assignmentSubmission.findUnique({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId,
                },
            },
        });

        if (existing) {
            // Update existing submission
            const submission = await prisma.assignmentSubmission.update({
                where: {
                    assignmentId_studentId: {
                        assignmentId,
                        studentId,
                    },
                },
                data: {
                    fileUrl: data.fileUrl,
                    submittedAt: new Date(),
                    isChecked: false, // Reset checked status if resubmitting
                },
                include: {
                    assignment: {
                        include: {
                            batch: true,
                            subject: true,
                        },
                    },
                    student: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return submission as AssignmentSubmission;
        }

        // Create new submission
        const submission = await prisma.assignmentSubmission.create({
            data: {
                assignmentId,
                studentId,
                fileUrl: data.fileUrl,
            },
            include: {
                assignment: {
                    include: {
                        batch: true,
                        subject: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return submission as AssignmentSubmission;
    },

    /**
     * Get submission by ID
     */
    async getById(id: string): Promise<AssignmentSubmission | null> {
        const submission = await prisma.assignmentSubmission.findUnique({
            where: { id },
            include: {
                assignment: {
                    include: {
                        batch: true,
                        subject: true,
                        createdBy: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return submission as AssignmentSubmission;
    },

    /**
     * Get submissions for an assignment
     */
    async getByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
        const submissions = await prisma.assignmentSubmission.findMany({
            where: { assignmentId },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        return submissions as AssignmentSubmission[];
    },

    /**
     * Get submissions by student
     */
    async getByStudent(studentId: string): Promise<AssignmentSubmission[]> {
        const submissions = await prisma.assignmentSubmission.findMany({
            where: { studentId },
            include: {
                assignment: {
                    include: {
                        batch: true,
                        subject: true,
                        createdBy: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        return submissions as AssignmentSubmission[];
    },

    /**
     * Check submission (teacher)
     */
    async checkSubmission(
        submissionId: string,
        teacherId: string,
        data: CheckSubmissionInput
    ): Promise<AssignmentSubmission> {
        const submission = await prisma.assignmentSubmission.update({
            where: { id: submissionId },
            data: {
                isChecked: data.isChecked,
                marks: data.marks || null,
                remarks: data.remarks || null,
                checkedById: teacherId,
                checkedAt: new Date(),
            },
            include: {
                assignment: {
                    include: {
                        batch: true,
                        subject: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return submission as AssignmentSubmission;
    },

    /**
     * Delete submission
     */
    async delete(id: string): Promise<void> {
        await prisma.assignmentSubmission.delete({
            where: { id },
        });
    },
};


// Test Service
import prisma from '@/core/database/prisma';
import type {
    Test,
    Question,
    TestSubmission,
    CreateTestInput,
    CreateQuestionInput,
    UpdateTestInput,
    SubmitTestInput,
    TestFilters,
    TestStats,
    MCQOptions,
} from '../types/test.types';

export const testService = {
    /**
     * Create a new test
     */
    async create(data: CreateTestInput, createdById: string): Promise<Test> {
        const test = await prisma.test.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                batchId: data.batchId,
                subjectId: data.subjectId || null,
                durationMinutes: data.durationMinutes || null,
                totalMarks: data.totalMarks,
                startDate: data.startDate || null,
                endDate: data.endDate || null,
                createdById,
            },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });

        return test as Test;
    },

    /**
     * Add question to test
     */
    async addQuestion(testId: string, data: CreateQuestionInput): Promise<Question> {
        const question = await prisma.question.create({
            data: {
                testId,
                questionText: data.questionText,
                questionTextAssamese: data.questionTextAssamese || null,
                type: data.type,
                options: data.options ? (data.options as any) : null,
                correctAnswer: data.correctAnswer || null,
                marks: data.marks,
                order: data.order,
            },
            include: {
                test: true,
            },
        });

        return question as Question;
    },

    /**
     * Get test by ID
     */
    async getById(id: string, includeQuestions: boolean = true): Promise<Test | null> {
        const test = await prisma.test.findUnique({
            where: { id },
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                questions: includeQuestions
                    ? {
                          orderBy: { order: 'asc' },
                      }
                    : false,
            },
        });

        return test as Test | null;
    },

    /**
     * Get all tests with filters
     */
    async getAll(filters?: TestFilters): Promise<Test[]> {
        const where: any = {};

        if (filters?.batchId) {
            where.batchId = filters.batchId;
        }

        if (filters?.subjectId) {
            where.subjectId = filters.subjectId;
        }

        if (filters?.type) {
            where.type = filters.type;
        }

        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const tests = await prisma.test.findMany({
            where,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return tests as Test[];
    },

    /**
     * Update test
     */
    async update(id: string, data: UpdateTestInput): Promise<Test> {
        const updateData: any = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;
        if (data.totalMarks !== undefined) updateData.totalMarks = data.totalMarks;
        if (data.startDate !== undefined) updateData.startDate = data.startDate;
        if (data.endDate !== undefined) updateData.endDate = data.endDate;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        const test = await prisma.test.update({
            where: { id },
            data: updateData,
            include: {
                batch: {
                    include: {
                        academicYear: true,
                    },
                },
                subject: true,
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        return test as Test;
    },

    /**
     * Delete test
     */
    async delete(id: string): Promise<void> {
        await prisma.test.delete({
            where: { id },
        });
    },

    /**
     * Submit test
     */
    async submitTest(
        testId: string,
        studentId: string,
        data: SubmitTestInput
    ): Promise<TestSubmission> {
        // Check if already submitted
        const existing = await prisma.testSubmission.findUnique({
            where: {
                testId_studentId: {
                    testId,
                    studentId,
                },
            },
        });

        if (existing) {
            throw new Error('Test already submitted');
        }

        // Get test with questions
        const test = await this.getById(testId, true);
        if (!test) {
            throw new Error('Test not found');
        }

        // Calculate marks
        let obtainedMarks = 0;

        // Create submission
        const submission = await prisma.testSubmission.create({
            data: {
                testId,
                studentId,
                totalMarks: test.totalMarks,
                obtainedMarks: 0,
                timeSpent: data.timeSpent,
            },
        });

        // Create answers and calculate marks
        for (const answerData of data.answers) {
            const question = test.questions.find((q) => q.id === answerData.questionId);
            if (!question) continue;

            let isCorrect = false;
            let marksObtained = 0;

            if (question.type === 'MCQ') {
                const options = question.options as MCQOptions | null;
                if (options && answerData.selectedOption === options.correct) {
                    isCorrect = true;
                    marksObtained = question.marks;
                }
            } else if (question.type === 'SHORT_ANSWER') {
                // Short answers need manual grading, so marksObtained = 0 initially
                // Teacher will update this later
                marksObtained = 0;
            }

            obtainedMarks += marksObtained;

            await prisma.answer.create({
                data: {
                    submissionId: submission.id,
                    questionId: answerData.questionId,
                    answerText: answerData.answerText || null,
                    selectedOption: answerData.selectedOption || null,
                    isCorrect,
                    marksObtained,
                },
            });
        }

        // Update submission with calculated marks
        const updatedSubmission = await prisma.testSubmission.update({
            where: { id: submission.id },
            data: { obtainedMarks },
            include: {
                test: true,
                student: {
                    include: { user: true },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        return updatedSubmission as TestSubmission;
    },

    /**
     * Get test submission
     */
    async getSubmission(testId: string, studentId: string): Promise<TestSubmission | null> {
        const submission = await prisma.testSubmission.findUnique({
            where: {
                testId_studentId: {
                    testId,
                    studentId,
                },
            },
            include: {
                test: {
                    include: {
                        batch: true,
                        subject: true,
                        questions: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                student: {
                    include: { user: true },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        return submission as TestSubmission | null;
    },

    /**
     * Get all submissions for a test
     */
    async getTestSubmissions(testId: string): Promise<TestSubmission[]> {
        const submissions = await prisma.testSubmission.findMany({
            where: { testId },
            include: {
                test: true,
                student: {
                    include: { user: true },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
            orderBy: { submittedAt: 'desc' },
        });

        return submissions as TestSubmission[];
    },

    /**
     * Update short answer marks
     */
    async updateAnswerMarks(
        submissionId: string,
        questionId: string,
        marksObtained: number
    ): Promise<void> {
        const answer = await prisma.answer.findUnique({
            where: {
                submissionId_questionId: {
                    submissionId,
                    questionId,
                },
            },
        });

        if (!answer) {
            throw new Error('Answer not found');
        }

        await prisma.answer.update({
            where: {
                submissionId_questionId: {
                    submissionId,
                    questionId,
                },
            },
            data: { marksObtained },
        });

        // Recalculate total marks
        const submission = await prisma.testSubmission.findUnique({
            where: { id: submissionId },
            include: { answers: true },
        });

        if (submission) {
            const totalObtained = submission.answers.reduce(
                (sum, ans) => sum + ans.marksObtained,
                0
            );

            await prisma.testSubmission.update({
                where: { id: submissionId },
                data: { obtainedMarks: totalObtained },
            });
        }
    },

    /**
     * Get test statistics
     */
    async getStats(batchId?: string): Promise<TestStats> {
        const where: any = {};
        if (batchId) {
            where.batchId = batchId;
        }

        const totalTests = await prisma.test.count({ where });
        const activeTests = await prisma.test.count({ where: { ...where, isActive: true } });

        const completedSubmissions = await prisma.testSubmission.findMany({
            where: batchId
                ? {
                      test: { batchId },
                  }
                : {},
            include: { test: true },
        });

        const completedTests = new Set(completedSubmissions.map((s) => s.testId)).size;

        const averageScore =
            completedSubmissions.length > 0
                ? completedSubmissions.reduce(
                      (sum, s) => sum + (s.obtainedMarks / s.totalMarks) * 100,
                      0
                  ) / completedSubmissions.length
                : 0;

        return {
            totalTests,
            activeTests,
            completedTests,
            averageScore: Math.round(averageScore * 100) / 100,
        };
    },
};


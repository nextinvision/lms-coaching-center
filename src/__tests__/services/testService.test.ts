// Test Service Tests
import { testService } from '@/modules/tests/services/testService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        test: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        question: {
            create: jest.fn(),
        },
        testSubmission: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        answer: {
            create: jest.fn(),
        },
    },
}));

describe('TestService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create test successfully', async () => {
            const mockTest = {
                id: 'test-1',
                title: 'Math Test',
                duration: 60,
            };

            (prisma.test.create as jest.Mock).mockResolvedValue(mockTest);

            const result = await testService.create({
                title: 'Math Test',
                batchId: 'batch-1',
                subjectId: 'subject-1',
                duration: 60,
                totalMarks: 100,
            });

            expect(result).toBeDefined();
            expect(result.title).toBe('Math Test');
        });
    });

    describe('submitTest', () => {
        it('should submit test and calculate score', async () => {
            const mockSubmission = {
                id: 'submission-1',
                testId: 'test-1',
                studentId: 'student-1',
                score: 80,
            };

            (prisma.test.findUnique as jest.Mock).mockResolvedValue({
                id: 'test-1',
                questions: [
                    {
                        id: 'q1',
                        type: 'MCQ',
                        correctAnswer: 'A',
                        marks: 10,
                    },
                ],
            });

            (prisma.testSubmission.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.testSubmission.create as jest.Mock).mockResolvedValue({
                ...mockSubmission,
                id: 'submission-1',
            });
            (prisma.testSubmission.update as jest.Mock).mockResolvedValue({
                ...mockSubmission,
                obtainedMarks: 10,
            });
            (prisma.answer.create as jest.Mock).mockResolvedValue({
                id: 'answer-1',
                submissionId: 'submission-1',
                questionId: 'q1',
                answer: 'A',
                marksObtained: 10,
            });

            const result = await testService.submitTest('test-1', 'student-1', {
                answers: [{ questionId: 'q1', answer: 'A' }],
            });

            expect(result).toBeDefined();
            expect(prisma.testSubmission.create).toHaveBeenCalled();
            expect(prisma.testSubmission.update).toHaveBeenCalled();
        });
    });
});


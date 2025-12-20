// Homework Service Tests
import { homeworkService } from '@/modules/homework/services/homeworkService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        assignment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        assignmentSubmission: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    },
}));

describe('HomeworkService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create homework assignment', async () => {
            const mockAssignment = {
                id: 'assignment-1',
                title: 'Math Homework',
                dueDate: new Date(),
            };

            (prisma.assignment.create as jest.Mock).mockResolvedValue(mockAssignment);

            const result = await homeworkService.create({
                title: 'Math Homework',
                batchId: 'batch-1',
                subjectId: 'subject-1',
                dueDate: new Date().toISOString(),
            });

            expect(result).toBeDefined();
            expect(result.title).toBe('Math Homework');
        });
    });

    describe('getAll', () => {
        it('should return all assignments', async () => {
            const mockAssignments = [
                { id: 'assignment-1', title: 'Homework 1' },
                { id: 'assignment-2', title: 'Homework 2' },
            ];

            (prisma.assignment.findMany as jest.Mock).mockResolvedValue(mockAssignments);

            const result = await homeworkService.getAll();

            expect(result).toHaveLength(2);
        });
    });
});


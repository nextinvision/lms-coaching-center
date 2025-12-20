// Student Service Tests
import { studentService } from '@/modules/students/services/studentService';
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        student: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

describe('StudentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new student successfully', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'student@test.com',
                name: 'Test Student',
            };

            const mockStudent = {
                id: 'student-1',
                userId: 'user-1',
                batchId: 'batch-1',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue({
                ...mockUser,
                studentProfile: null,
            });
            (prisma.student.create as jest.Mock).mockResolvedValue(mockStudent);

            const result = await studentService.create({
                name: 'Test Student',
                email: 'student@test.com',
                phone: '1234567890',
                password: 'password123',
                batchId: 'batch-1',
            });

            expect(result).toBeDefined();
            expect(prisma.user.create).toHaveBeenCalled();
            expect(prisma.student.create).toHaveBeenCalled();
        });

        it('should throw error if email already exists', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'existing-user',
                email: 'student@test.com',
            });

            await expect(
                studentService.create({
                    name: 'Test Student',
                    email: 'student@test.com',
                    phone: '1234567890',
                    password: 'password123',
                    batchId: 'batch-1',
                })
            ).rejects.toThrow('Email already exists');
        });
    });

    describe('getAll', () => {
        it('should return all students', async () => {
            const mockStudents = [
                {
                    id: 'student-1',
                    name: 'Student 1',
                    user: { email: 'student1@test.com' },
                },
                {
                    id: 'student-2',
                    name: 'Student 2',
                    user: { email: 'student2@test.com' },
                },
            ];

            (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

            const result = await studentService.getAll();

            expect(result).toHaveLength(2);
            expect(prisma.student.findMany).toHaveBeenCalled();
        });

        it('should filter by batchId', async () => {
            (prisma.student.findMany as jest.Mock).mockResolvedValue([]);

            await studentService.getAll({ batchId: 'batch-1' });

            expect(prisma.student.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        batchId: 'batch-1',
                    }),
                })
            );
        });
    });

    describe('getById', () => {
        it('should return student by id', async () => {
            const mockStudent = {
                id: 'student-1',
                name: 'Test Student',
                user: { email: 'student@test.com' },
            };

            (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);

            const result = await studentService.getById('student-1');

            expect(result).toBeDefined();
            expect(result?.id).toBe('student-1');
        });

        it('should return null if student not found', async () => {
            (prisma.student.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await studentService.getById('non-existent');

            expect(result).toBeNull();
        });
    });
});


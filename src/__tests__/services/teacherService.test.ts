// Teacher Service Tests
import { teacherService } from '@/modules/teachers/services/teacherService';
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        teacher: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

describe('TeacherService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create teacher successfully', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'teacher@test.com',
            };

            const mockTeacher = {
                id: 'teacher-1',
                userId: 'user-1',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
            (prisma.teacher.create as jest.Mock).mockResolvedValue(mockTeacher);

            const result = await teacherService.create({
                name: 'Test Teacher',
                email: 'teacher@test.com',
                phone: '1234567890',
                password: 'password123',
            });

            expect(result).toBeDefined();
            expect(prisma.user.create).toHaveBeenCalled();
            expect(prisma.teacher.create).toHaveBeenCalled();
        });
    });

    describe('getAll', () => {
        it('should return all teachers', async () => {
            const mockTeachers = [
                { id: 'teacher-1', name: 'Teacher 1' },
                { id: 'teacher-2', name: 'Teacher 2' },
            ];

            (prisma.teacher.findMany as jest.Mock).mockResolvedValue(mockTeachers);

            const result = await teacherService.getAll();

            expect(result).toHaveLength(2);
        });
    });
});

